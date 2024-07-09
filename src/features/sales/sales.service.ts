import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto) {
    for (const saleProduct of createSaleDto.saleProducts) {
      const hasStockQuantity = await this.validateStock(
        saleProduct.productVariationId,
        saleProduct.quantity,
      );

      if (!hasStockQuantity) {
        throw new Error('Não há itens suficiente em estoque!');
      }
    }

    await this.prisma.$transaction(async (prismaIsntance) => {
      await prismaIsntance.sale.create({
        data: {
          clientName: createSaleDto.clientName,
          SaleProductVariation: {
            createMany: {
              data: createSaleDto.saleProducts.map((saleProduct) => {
                return {
                  quantity: saleProduct.quantity,
                  unitPrice: saleProduct.unitPrice,
                  productVariationId: saleProduct.productVariationId,
                };
              }),
            },
          },
        },
      });

      await prismaIsntance.stockMovement.createMany({
        data: createSaleDto.saleProducts.map((saleProduct) => {
          return {
            type: 'OUTBOUND',
            productVariationId: saleProduct.productVariationId,
            quantity: saleProduct.quantity,
          };
        }),
      });
    });
  }

  findAll() {
    return this.prisma.sale.findMany({
      include: {
        SaleProductVariation: {
          include: {
            ProductVariation: {
              include: {
                Product: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.sale.findUnique({
      where: {
        id,
      },
      include: {
        SaleProductVariation: {
          include: {
            ProductVariation: {
              include: {
                Product: true,
              },
            },
          },
        },
      },
    });
  }

  async validateStock(variationId: string, buyQuantity: number) {
    const result = await this.prisma.stockMovement.groupBy({
      by: ['type'],
      where: {
        productVariationId: variationId,
      },
      _sum: {
        quantity: true,
      },
    });

    let inboundQuantity = 0;
    let outboundQuantity = 0;

    result.forEach((group) => {
      if (group.type === 'INBOUND') {
        inboundQuantity = group._sum.quantity || 0;
      } else if (group.type === 'OUTBOUND') {
        outboundQuantity = group._sum.quantity || 0;
      }
    });

    const currentStock = inboundQuantity - outboundQuantity;

    return currentStock >= buyQuantity;
  }

  async getProfit(startDate: Date, endDate: Date) {
    // Calcula o faturamento total
    const sales = await this.prisma.saleProductVariation.findMany({
      where: {
        Sale: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      select: {
        quantity: true,
        unitPrice: true,
      },
    });

    const totalRevenue = sales.reduce(
      (sum, sale) => sum + sale.quantity * Number(sale.unitPrice),
      0,
    );

    // Calcula as despesas totais com base nos movimentos de estoque INBOUND
    const stockMovements = await this.prisma.stockMovement.findMany({
      where: {
        type: 'INBOUND',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        quantity: true,
        ProductVariation: {
          select: {
            buyValue: true,
          },
        },
      },
    });

    const totalExpenses = stockMovements.reduce(
      (sum, movement) =>
        sum + movement.quantity * Number(movement.ProductVariation.buyValue),
      0,
    );

    const profit = totalRevenue - totalExpenses;

    return profit;
  }
}
