import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecondFactorPage } from './second-factor.page';

describe('SecondFactorPage', () => {
  let component: SecondFactorPage;
  let fixture: ComponentFixture<SecondFactorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondFactorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
