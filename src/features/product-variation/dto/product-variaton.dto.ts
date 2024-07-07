import { ApiProperty } from '@nestjs/swagger';

export class ProductVariationDto {
  @ApiProperty({ example: 'Quazar Vermelhor Lote Julho' })
  description: string;

  @ApiProperty({ example: new Date() })
  validUntil: Date;

  @ApiProperty({ example: 10 })
  buyValuePerUnit: number;

  @ApiProperty({ example: 25 })
  pricePerUnit: number;
}
