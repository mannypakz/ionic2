import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocketsPage } from './dockets.page';

describe('DocketsPage', () => {
  let component: DocketsPage;
  let fixture: ComponentFixture<DocketsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocketsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocketsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
