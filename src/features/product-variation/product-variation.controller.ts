import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductVariationService } from './product-variation.service';
import { CreateProductVariationDto } from './dto/create-product-variation.dto';
import { UpdateProductVariationDto } from './dto/update-product-variation.dto';
import { AddStockProductVariationDto } from './dto/add-stock-product-variation.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Variação de Produto')
@Controller('product-variation')
export class ProductVariationController {
  constructor(
    private readonly productVariationService: ProductVariationService,
  ) {}

  @ApiOperation({ summary: 'Criar variação' })
  @Post()
  create(@Body() createProductVariationDto: CreateProductVariationDto) {
    return this.productVariationService.create(createProductVariationDto);
  }

  @ApiOperation({ summary: 'Adicionar estoque / Entrada de estoque' })
  @Post('/add-stock')
  addStock(@Body() addStockProductVariationDto: AddStockProductVariationDto) {
    return this.productVariationService.addStock(addStockProductVariationDto);
  }

  @ApiOperation({ summary: 'Buscar variações' })
  @Get()
  findAll() {
    return this.productVariationService.findAll();
  }

  @ApiOperation({ summary: 'Buscar variação por Id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productVariationService.findOne(id);
  }

  @ApiOperation({ summary: 'Atualizar variação' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductVariationDto: UpdateProductVariationDto,
  ) {
    return this.productVariationService.update(id, updateProductVariationDto);
  }

  @ApiOperation({ summary: 'Deletar variação' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productVariationService.remove(id);
  }
}
