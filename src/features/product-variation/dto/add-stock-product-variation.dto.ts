import { ApiProperty } from '@nestjs/swagger';

export class AddStockProductVariationDto {
  @ApiProperty({ example: '123' })
  id: string;

  @ApiProperty({ example: 100 })
  quantity: number;

  @ApiProperty({ example: 10 })
  buyValuePerUnit: number;
}
