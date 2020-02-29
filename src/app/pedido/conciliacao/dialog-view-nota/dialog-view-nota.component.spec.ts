import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogViewNotaComponent } from './dialog-view-nota.component';

describe('DialogViewNotaComponent', () => {
  let component: DialogViewNotaComponent;
  let fixture: ComponentFixture<DialogViewNotaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogViewNotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogViewNotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
