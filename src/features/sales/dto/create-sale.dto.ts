import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleDto {
  @ApiProperty({ example: 'João' })
  clientName: string;

  saleProducts: Array<{
    productVariationId: string;
    quantity: number;
    unitPrice: number;
  }>;
}
