import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageTitleComponent } from './message-title.component';

describe('MessageTitleComponent', () => {
  let component: MessageTitleComponent;
  let fixture: ComponentFixture<MessageTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
