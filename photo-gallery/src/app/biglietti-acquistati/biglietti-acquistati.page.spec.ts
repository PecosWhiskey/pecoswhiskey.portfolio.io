import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BigliettiAcquistatiPage } from './biglietti-acquistati.page';

describe('BigliettiAcquistatiPage', () => {
  let component: BigliettiAcquistatiPage;
  let fixture: ComponentFixture<BigliettiAcquistatiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BigliettiAcquistatiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
