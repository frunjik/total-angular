import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeWorkComponent } from './three-work.component';

describe('ThreeWorkComponent', () => {
  let component: ThreeWorkComponent;
  let fixture: ComponentFixture<ThreeWorkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeWorkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
