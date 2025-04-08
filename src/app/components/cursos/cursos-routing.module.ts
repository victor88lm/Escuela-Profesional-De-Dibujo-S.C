import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleCursoComponent } from './detalle-curso/detalle-curso.component';

// Rutas para los cursos
const routes: Routes = [
  // Ruta dinámica para cualquier curso usando su slug
  { path: 'test', component: DetalleCursoComponent },
  { path: ':slug', component: DetalleCursoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CursosRoutingModule {}
