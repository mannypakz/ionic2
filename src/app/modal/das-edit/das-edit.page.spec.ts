import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DasEditPage } from './das-edit.page';

describe('DasEditPage', () => {
  let component: DasEditPage;
  let fixture: ComponentFixture<DasEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DasEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DasEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
