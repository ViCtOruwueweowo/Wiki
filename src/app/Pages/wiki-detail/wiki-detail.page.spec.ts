import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WikiDetailPage } from './wiki-detail.page';

describe('WikiDetailPage', () => {
  let component: WikiDetailPage;
  let fixture: ComponentFixture<WikiDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
