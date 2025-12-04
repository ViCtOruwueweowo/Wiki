import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WikisPage } from './wikis.page';

describe('WikisPage', () => {
  let component: WikisPage;
  let fixture: ComponentFixture<WikisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WikisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
