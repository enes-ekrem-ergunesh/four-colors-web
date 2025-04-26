import { TestBed } from '@angular/core/testing';

import { CommonTsService } from './common-ts.service';

describe('CommonTsService', () => {
  let service: CommonTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
