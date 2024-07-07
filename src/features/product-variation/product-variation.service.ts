import { Injectable } from '@nestjs/common';
import { CreateProductVariationDto } from './dto/create-product-variation.dto';
import { UpdateProductVariationDto } from './dto/update-product-variation.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { AddStockProductVariationDto } from './dto/add-stock-product-variation.dto';

@Injectable()
export class ProductVariationService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductVariationDto: CreateProductVariationDto) {
    return this.prisma.productVariation.create({
      data: {
        description: createProductVariationDto.description,
        buyValue: createProductVariationDto.buyValuePerUnit,
        validUntil: createProductVariationDto.validUntil,
        price: createProductVariationDto.pricePerUnit,
        productId: createProductVariationDto.productId,
      },
    });
  }

  async addStock(addStockProductVariationDto: AddStockProductVariationDto) {
    await this.prisma.$transaction(async (prismaInstance) => {
      await prismaInstance.stockMovement.create({
        data: {
          quantity: addStockProductVariationDto.quantity,
          type: 'INBOUND',
          createdAt: new Date(),
          productVariationId: addStockProductVariationDto.id,
        },
      });

      await prismaInstance.productVariation.update({
        data: {
          buyValue: addStockProductVariationDto.buyValuePerUnit,
        },
        where: {
          id: addStockProductVariationDto.id,
        },
      });
    });
  }

  findAll() {
    return this.prisma.productVariation.findMany();
  }

  findOne(id: string) {
    return this.prisma.productVariation.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, updateProductVariationDto: UpdateProductVariationDto) {
    return this.prisma.productVariation.update({
      data: {
        description: updateProductVariationDto.description,
        buyValue: updateProductVariationDto.buyValuePerUnit,
        validUntil: updateProductVariationDto.validUntil,
        price: updateProductVariationDto.pricePerUnit,
      },
      where: {
        id,
      },
    });
  }

  remove(id: string) {
    return this.prisma.productVariation.delete({ where: { id } });
  }
}
