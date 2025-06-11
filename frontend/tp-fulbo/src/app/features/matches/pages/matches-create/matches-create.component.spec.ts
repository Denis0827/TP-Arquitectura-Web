import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesCreateComponent } from './matches-create.component';

describe('MatchesCreateComponent', () => {
  let component: MatchesCreateComponent;
  let fixture: ComponentFixture<MatchesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchesCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
