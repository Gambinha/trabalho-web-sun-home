import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProductVariationDto } from 'src/features/product-variation/dto/create-product-variation.dto';
import { ProductVariationDto } from 'src/features/product-variation/dto/product-variaton.dto';

export class CreateProductDto {
  @ApiPropertyOptional({ example: 'base64' })
  image?: string;

  @ApiProperty({ example: 'Perfume Quazar' })
  description: string;

  @ApiProperty({ example: 159.99 })
  price: number;

  @ApiProperty({ example: [] })
  variations: Array<ProductVariationDto>;
}
