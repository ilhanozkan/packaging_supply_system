import { Test, TestingModule } from '@nestjs/testing';

import { SupplierInterestController } from './supplier-interest.controller';

describe('SupplierInterestController', () => {
  let controller: SupplierInterestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplierInterestController],
    }).compile();

    controller = module.get<SupplierInterestController>(
      SupplierInterestController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
