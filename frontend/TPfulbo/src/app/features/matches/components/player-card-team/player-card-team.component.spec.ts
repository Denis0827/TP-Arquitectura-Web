import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerCardTeamComponent } from './player-card-team.component';

describe('PlayerCardTeamComponent', () => {
  let component: PlayerCardTeamComponent;
  let fixture: ComponentFixture<PlayerCardTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerCardTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerCardTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
