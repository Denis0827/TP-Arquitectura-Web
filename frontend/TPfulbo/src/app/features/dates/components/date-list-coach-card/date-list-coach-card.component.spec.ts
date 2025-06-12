import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateListCoachCardComponent } from './date-list-coach-card.component';

describe('DateListCoachCardComponent', () => {
  let component: DateListCoachCardComponent;
  let fixture: ComponentFixture<DateListCoachCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateListCoachCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateListCoachCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
