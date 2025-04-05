import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalleresEspecializadosComponent } from './talleres-especializados.component';

describe('TalleresEspecializadosComponent', () => {
  let component: TalleresEspecializadosComponent;
  let fixture: ComponentFixture<TalleresEspecializadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TalleresEspecializadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalleresEspecializadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
