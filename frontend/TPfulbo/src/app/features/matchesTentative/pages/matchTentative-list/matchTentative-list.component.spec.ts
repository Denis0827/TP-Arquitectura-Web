import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatesListComponent } from './matchTentative-list.component';

describe('DatesListComponent', () => {
  let component: DatesListComponent;
  let fixture: ComponentFixture<DatesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
