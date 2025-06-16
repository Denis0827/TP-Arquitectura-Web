import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchTentativeListCoachCardComponent } from './matchTentative-list-coach-card.component';

describe('MatchTentativeListCoachCardComponent', () => {
  let component: MatchTentativeListCoachCardComponent;
  let fixture: ComponentFixture<MatchTentativeListCoachCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchTentativeListCoachCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchTentativeListCoachCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
