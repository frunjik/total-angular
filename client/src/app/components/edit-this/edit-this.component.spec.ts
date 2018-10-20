import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditThisComponent } from './edit-this.component';

describe('EditThisComponent', () => {
  let component: EditThisComponent;
  let fixture: ComponentFixture<EditThisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditThisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditThisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
