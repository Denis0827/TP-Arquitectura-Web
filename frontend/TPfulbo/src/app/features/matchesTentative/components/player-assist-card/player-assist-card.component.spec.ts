import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerAssistCardComponent } from './player-assist-card.component';

describe('PlayerAssistCardComponent', () => {
  let component: PlayerAssistCardComponent;
  let fixture: ComponentFixture<PlayerAssistCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerAssistCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerAssistCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
