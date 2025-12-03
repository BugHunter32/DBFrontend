import { TestBed } from '@angular/core/testing';

import { ServicesAdvisorService } from './services-advisor.service';

describe('ServicesAdvisorService', () => {
  let service: ServicesAdvisorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesAdvisorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
