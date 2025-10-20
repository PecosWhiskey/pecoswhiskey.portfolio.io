import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreaBigliettoPage } from './crea-biglietto.page';

describe('CreaBigliettoPage', () => {
  let component: CreaBigliettoPage;
  let fixture: ComponentFixture<CreaBigliettoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreaBigliettoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
