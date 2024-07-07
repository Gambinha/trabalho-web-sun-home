import { ApiProperty } from '@nestjs/swagger';
import { ProductVariationDto } from './product-variaton.dto';

export class CreateProductVariationDto extends ProductVariationDto {
  @ApiProperty({ example: '101' })
  productId: string;
}
