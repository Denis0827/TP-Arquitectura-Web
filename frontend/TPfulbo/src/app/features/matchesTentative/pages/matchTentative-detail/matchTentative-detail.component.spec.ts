import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchTentativeDetailComponent } from './matchTentative-detail.component';

describe('DateDetailComponent', () => {
  let component: MatchTentativeDetailComponent;
  let fixture: ComponentFixture<MatchTentativeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchTentativeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchTentativeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
