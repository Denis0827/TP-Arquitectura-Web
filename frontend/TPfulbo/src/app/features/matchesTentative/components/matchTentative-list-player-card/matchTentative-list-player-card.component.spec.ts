import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchTentativeListPlayerCardComponent } from './matchTentative-list-player-card.component';

describe('MatchTentativeListPlayerCardComponent', () => {
  let component: MatchTentativeListPlayerCardComponent;
  let fixture: ComponentFixture<MatchTentativeListPlayerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchTentativeListPlayerCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchTentativeListPlayerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
