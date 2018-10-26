import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Wp3Component } from './wp3.component';

describe('Wp3Component', () => {
  let component: Wp3Component;
  let fixture: ComponentFixture<Wp3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Wp3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Wp3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
