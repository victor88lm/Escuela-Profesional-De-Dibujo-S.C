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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Nosotros', component: NosotrosComponent },
  { path: 'Cursos', component: OfertaEducativaComponent },
  { path: 'Galeria', component: GaleriaComponent },
  { path: 'Planteles', component: PlantelesComponent },
  { path: 'Contactanos', component: ContactoComponent },
  { path: 'Cursos/DibujoPublicitario', component: DibujoPublicitarioComponent },
  { path: 'Cursos/DibujoInfantil', component: DibujoInfantilComponent },
  { path: 'Cursos/DiseñoGrafico', component: DisenoGraficoComponent },
  {
    path: 'Cursos/TalleresEspecializados',
    component: TalleresEspecializadosComponent,
  },
  { path: 'Cursos', component: OfertaEducativaComponent },
  { path: 'Preguntas Frecuentes', component: FAQComponent},
  { path: 'Contactanos', component: ContactoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
