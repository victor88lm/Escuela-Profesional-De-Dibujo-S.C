import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantelesComponent } from './planteles.component';

describe('PlantelesComponent', () => {
  let component: PlantelesComponent;
  let fixture: ComponentFixture<PlantelesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlantelesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
