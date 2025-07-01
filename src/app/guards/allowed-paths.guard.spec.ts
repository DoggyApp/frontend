import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { allowedPathsGuard } from './allowed-paths.guard';

describe('allowedPathsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => allowedPathsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
