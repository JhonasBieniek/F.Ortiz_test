import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSendNotaComponent } from './dialog-send-nota.component';

describe('DialogSendNotaComponent', () => {
  let component: DialogSendNotaComponent;
  let fixture: ComponentFixture<DialogSendNotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSendNotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSendNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
