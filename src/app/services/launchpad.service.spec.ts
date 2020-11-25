import { TestBed } from '@angular/core/testing';

import { LaunchpadService } from './launchpad.service';

describe('LaunchpadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LaunchpadService = TestBed.get(LaunchpadService);
    expect(service).toBeTruthy();
  });
});
