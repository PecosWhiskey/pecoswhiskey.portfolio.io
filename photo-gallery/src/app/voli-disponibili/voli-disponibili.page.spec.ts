import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoliDisponibiliPage } from './voli-disponibili.page';

describe('VoliDisponibiliPage', () => {
  let component: VoliDisponibiliPage;
  let fixture: ComponentFixture<VoliDisponibiliPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VoliDisponibiliPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
