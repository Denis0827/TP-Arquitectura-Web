import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateListPlayerCardComponent } from './date-list-player-card.component';

describe('DateListPlayerCardComponent', () => {
  let component: DateListPlayerCardComponent;
  let fixture: ComponentFixture<DateListPlayerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateListPlayerCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateListPlayerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
