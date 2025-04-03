import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisenoGraficoComponent } from './diseno-grafico.component';

describe('DisenoGraficoComponent', () => {
  let component: DisenoGraficoComponent;
  let fixture: ComponentFixture<DisenoGraficoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisenoGraficoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisenoGraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
