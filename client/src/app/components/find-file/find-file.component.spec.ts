import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindFileComponent } from './find-file.component';

describe('FindFileComponent', () => {
  let component: FindFileComponent;
  let fixture: ComponentFixture<FindFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
