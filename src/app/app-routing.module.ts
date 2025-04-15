import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/Inicio/home/home.component';
import { OfertaEducativaComponent } from './components/cursos/oferta-educativa/oferta-educativa.component';
import { NosotrosComponent } from './components/Inicio/nosotros/nosotros.component';
import { GaleriaComponent } from './components/Inicio/galeria/galeria.component';
import { ContactoComponent } from './components/Inicio/contacto/contacto.component';
import { PlantelesComponent } from './components/Inicio/planteles/planteles.component';
import { DibujoPublicitarioComponent } from './components/cursos/dibujo-publicitario/dibujo-publicitario.component';
import { DibujoInfantilComponent } from './components/cursos/dibujo-infantil/dibujo-infantil.component';
import { DisenoGraficoComponent } from './components/cursos/diseno-grafico/diseno-grafico.component';
import { TalleresEspecializadosComponent } from './components/cursos/talleres-especializados/talleres-especializados.component';
import { FAQComponent } from './components/Inicio/faq/faq.component';
import { DetalleTallerComponent } from './components/cursos/talleres-especializados/detalle-taller/detalle-taller.component';
import { DetalleCursoComponent } from './components/cursos/detalle-curso/detalle-curso.component';
import { PagoExitosoComponent } from './components/cursos/pagos/pago-exitoso/pago-exitoso.component';
import { PagoRechazadoComponent } from './components/cursos/pagos/pago-rechazado/pago-rechazado.component';
import { RegistroComponent } from './components/shared/registro/registro.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Nosotros', component: NosotrosComponent },
  { path: 'Galeria', component: GaleriaComponent },
  { path: 'Planteles', component: PlantelesComponent },
  { path: 'Contactanos', component: ContactoComponent },
  { path: 'Cursos', component: OfertaEducativaComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'pago-exitoso', component: PagoExitosoComponent },
  { path: 'pago-cancelado', component: PagoRechazadoComponent },

  { path: 'Cursos/DibujoPublicitario', component: DibujoPublicitarioComponent },
  { path: 'Cursos/DibujoInfantil', component: DibujoInfantilComponent },
  { path: 'Cursos/DiseñoGrafico', component: DisenoGraficoComponent },
  {
    path: 'Cursos/TalleresEspecializados',
    component: TalleresEspecializadosComponent,
  },
  {
    path: 'Cursos/TalleresEspecializados/:id',
    component: DetalleTallerComponent,
  },
  { path: 'Cursos/:slug', component: DetalleCursoComponent },
  { path: 'PreguntasFrecuentes', component: FAQComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirigir a Home si la ruta no existe
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
