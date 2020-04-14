import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRepresentadaComponent } from './dialog-representada.component';

describe('DialogRepresentadaComponent', () => {
  let component: DialogRepresentadaComponent;
  let fixture: ComponentFixture<DialogRepresentadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogRepresentadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRepresentadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
