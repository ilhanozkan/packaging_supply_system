import { RolesGuard } from './role.guard';

describe('RolesGuard', () => {
  it('should be defined', () => {
    expect(new RolesGuard()).toBeDefined();
  });
});
