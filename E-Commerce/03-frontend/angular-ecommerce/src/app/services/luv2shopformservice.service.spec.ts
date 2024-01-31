import { TestBed } from '@angular/core/testing';

import { Luv2shopformserviceService } from './luv2shopformservice.service';

describe('Luv2shopformserviceService', () => {
  let service: Luv2shopformserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Luv2shopformserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
