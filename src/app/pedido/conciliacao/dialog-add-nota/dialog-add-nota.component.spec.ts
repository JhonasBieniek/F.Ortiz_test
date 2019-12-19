import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddNotaComponent } from './dialog-add-nota.component';

describe('DialogAddNotaComponent', () => {
  let component: DialogAddNotaComponent;
  let fixture: ComponentFixture<DialogAddNotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddNotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
