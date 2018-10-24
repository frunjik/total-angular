import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShaderBuilderComponent } from './shader-builder.component';

describe('ShaderBuilderComponent', () => {
  let component: ShaderBuilderComponent;
  let fixture: ComponentFixture<ShaderBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShaderBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShaderBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
