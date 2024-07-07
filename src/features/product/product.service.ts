import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { AuthDto } from '../auth/dto/auth.dto';
import { ProductVariation } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateProductDto, userInfos: AuthDto) {
    return this.prisma.product.create({
      data: {
        price: createProductDto.price,
        description: createProductDto.description,
        userId: userInfos.id,
        createdAt: new Date(),
        ProductVariation: {
          createMany: {
            data: createProductDto.variations.map((variation) => {
              return {
                description: variation.description,
                price: variation.pricePerUnit,
                buyValue: variation.buyValuePerUnit,
                validUntil: variation.validUntil,
              };
            }),
          },
        },
      },
    });
  }

  findAll(userInfos: AuthDto) {
    return this.prisma.product.findMany({
      select: {
        description: true,
        price: true,
      },
      where: {
        userId: userInfos.id,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.product.findUnique({
      include: {
        ProductVariation: true,
      },
      where: {
        id: id,
      },
    });
  }

  async findVariationsByProductId(id: string) {
    const [variations] = await this.prisma.$transaction(
      async (prismaInstance) => {
        const productVariations =
          await prismaInstance.productVariation.findMany({
            select: {
              id: true,
              description: true,
              buyValue: true,
              price: true,
              validUntil: true,
            },
            where: {
              productId: id,
            },
          });

        const variationsWithStock: Array<{
          id: string;
          description: string;
          price: Decimal;
          validUntil: Date;
          buyValue: Decimal;
          stock: number;
        }> = [];

        for (const variation of productVariations) {
          const result = await prismaInstance.stockMovement.groupBy({
            by: ['type'],
            where: {
              productVariationId: variation.id,
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

          variationsWithStock.push({
            ...variation,
            stock: currentStock,
          });
        }

        return variationsWithStock;
      },
    );

    return variations;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      data: {
        price: updateProductDto.price,
        description: updateProductDto.description,
        updatedAt: new Date(),
      },
      where: {
        id,
      },
    });
  }

  remove(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
