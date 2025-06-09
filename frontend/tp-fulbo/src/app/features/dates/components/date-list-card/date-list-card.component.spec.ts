import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateListCardComponent } from './date-list-card.component';

describe('DateListCardComponent', () => {
  let component: DateListCardComponent;
  let fixture: ComponentFixture<DateListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateListCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
