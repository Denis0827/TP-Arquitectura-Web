import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchTentativeNewComponent } from './matchTentative-new.component';

describe('DateNewComponent', () => {
  let component: MatchTentativeNewComponent;
  let fixture: ComponentFixture<MatchTentativeNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchTentativeNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchTentativeNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
