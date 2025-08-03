import { Test, TestingModule } from '@nestjs/testing';

import { SupplierInterestService } from './supplier-interest.service';

describe('SupplierInterestService', () => {
  let service: SupplierInterestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplierInterestService],
    }).compile();

    service = module.get<SupplierInterestService>(SupplierInterestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
