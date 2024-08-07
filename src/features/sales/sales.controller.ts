import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Vendas')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @ApiOperation({ summary: 'Criar venda' })
  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @ApiOperation({ summary: 'Buscar vendas' })
  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @ApiOperation({ summary: 'Buscar lucro em determinado período' })
  @Get('/profit')
  getProfit(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.salesService.getProfit(new Date(startDate), new Date(endDate));
  }

  @ApiOperation({ summary: 'Buscar detalhes da venda' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }
}
