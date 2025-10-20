import { TestBed } from '@angular/core/testing';

import { GestioneVoliService } from './gestione-voli.service';

describe('GestioneVoliService', () => {
  let service: GestioneVoliService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestioneVoliService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
