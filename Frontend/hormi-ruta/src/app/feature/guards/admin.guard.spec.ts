import { TestBed } from '@angular/core/testing';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  const executeGuard = () => 
      TestBed.runInInjectionContext(() => adminGuard());

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
