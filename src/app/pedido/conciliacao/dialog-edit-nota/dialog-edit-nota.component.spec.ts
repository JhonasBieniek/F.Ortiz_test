import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditNotaComponent } from './dialog-edit-nota.component';

describe('DialogEditNotaComponent', () => {
  let component: DialogEditNotaComponent;
  let fixture: ComponentFixture<DialogEditNotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditNotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
