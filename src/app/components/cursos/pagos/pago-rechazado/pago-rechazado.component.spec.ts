import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoRechazadoComponent } from './pago-rechazado.component';

describe('PagoRechazadoComponent', () => {
  let component: PagoRechazadoComponent;
  let fixture: ComponentFixture<PagoRechazadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagoRechazadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagoRechazadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
