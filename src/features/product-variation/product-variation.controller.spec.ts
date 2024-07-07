import { Test, TestingModule } from '@nestjs/testing';
import { ProductVariationController } from './product-variation.controller';
import { ProductVariationService } from './product-variation.service';

describe('ProductVariationController', () => {
  let controller: ProductVariationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductVariationController],
      providers: [ProductVariationService],
    }).compile();

    controller = module.get<ProductVariationController>(ProductVariationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
