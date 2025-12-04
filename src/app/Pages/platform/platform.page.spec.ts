import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlatformPage } from './platform.page';

describe('PlatformPage', () => {
  let component: PlatformPage;
  let fixture: ComponentFixture<PlatformPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
