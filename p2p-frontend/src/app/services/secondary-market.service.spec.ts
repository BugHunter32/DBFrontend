import { TestBed } from '@angular/core/testing';

import { SecondaryMarketService } from './secondary-market.service';

describe('SecondaryMarketService', () => {
  let service: SecondaryMarketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecondaryMarketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
