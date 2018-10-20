import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WoodpusherComponent } from './woodpusher.component';

describe('WoodpusherComponent', () => {
  let component: WoodpusherComponent;
  let fixture: ComponentFixture<WoodpusherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WoodpusherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WoodpusherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
