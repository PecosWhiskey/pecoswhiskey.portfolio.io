import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestioneVoliPage } from './gestione-voli.page';

describe('GestioneVoliPage', () => {
  let component: GestioneVoliPage;
  let fixture: ComponentFixture<GestioneVoliPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestioneVoliPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
