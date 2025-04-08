import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CursosRoutingModule } from './cursos-routing.module';
import { DetalleCursoComponent } from './detalle-curso/detalle-curso.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, CursosRoutingModule, DetalleCursoComponent],
})
export class CursosModule {}
