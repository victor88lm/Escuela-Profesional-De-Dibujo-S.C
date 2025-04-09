import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CursosRoutingModule } from './cursos-routing.module';
import { DetalleCursoComponent } from './detalle-curso/detalle-curso.component';
import { PagoExitosoComponent } from './pagos/pago-exitoso/pago-exitoso.component';
import { PagoRechazadoComponent } from './pagos/pago-rechazado/pago-rechazado.component';

@NgModule({
  declarations: [
    PagoExitosoComponent,
    PagoRechazadoComponent
  ],
  imports: [CommonModule, CursosRoutingModule, DetalleCursoComponent],
})
export class CursosModule {}
