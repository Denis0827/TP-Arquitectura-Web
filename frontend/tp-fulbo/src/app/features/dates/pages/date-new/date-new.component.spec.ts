import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateNewComponent } from './date-new.component';

describe('DateNewComponent', () => {
  let component: DateNewComponent;
  let fixture: ComponentFixture<DateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
