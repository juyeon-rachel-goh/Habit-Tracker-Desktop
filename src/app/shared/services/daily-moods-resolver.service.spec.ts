import { TestBed } from '@angular/core/testing';

import { DailyMoodsResolverService } from './daily-moods-resolver.service';

describe('DailyMoodsResolverService', () => {
  let service: DailyMoodsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyMoodsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
