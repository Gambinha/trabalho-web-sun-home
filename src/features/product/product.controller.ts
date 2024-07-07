import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthInfos } from 'src/core/decorators/auth-infos.decorator';
import { AuthDto } from '../auth/dto/auth.dto';

@ApiBearerAuth()
@ApiTags('Produtos')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Criar novo produto' })
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @AuthInfos() userInfos: AuthDto,
  ) {
    return this.productService.create(createProductDto, userInfos);
  }

  @ApiOperation({ summary: 'Buscar todos produtos' })
  @Get()
  findAll(@AuthInfos() userInfos: AuthDto) {
    return this.productService.findAll(userInfos);
  }

  @ApiOperation({ summary: 'Buscar produto por Id' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: 'Buscar variações de um produto' })
  @Get(':id/variations')
  findVariationsByProductId(@Param('id') id: string) {
    return this.productService.findVariationsByProductId(id);
  }

  @ApiOperation({ summary: 'Atualizar produto' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Deletar produto' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
