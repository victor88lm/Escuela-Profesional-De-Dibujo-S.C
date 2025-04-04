import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { HomeComponent } from './components/Inicio/home/home.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { OfertaEducativaComponent } from './components/cursos/oferta-educativa/oferta-educativa.component';
import { NosotrosComponent } from './components/Inicio/nosotros/nosotros.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DibujoPublicitarioComponent } from './components/cursos/dibujo-publicitario/dibujo-publicitario.component';
import { DisenoGraficoComponent } from './components/cursos/diseno-grafico/diseno-grafico.component';
import { DibujoInfantilComponent } from './components/cursos/dibujo-infantil/dibujo-infantil.component';
import { GaleriaComponent } from './components/Inicio/galeria/galeria.component';
import { PlantelesComponent } from './components/Inicio/planteles/planteles.component';
import { ContactoComponent } from './components/Inicio/contacto/contacto.component';
import { PrivacyModalComponent } from './components/shared/privacy-modal/privacy-modal.component';
import { PrivacyPolicyModalComponent } from './components/shared/privacy-policy-modal/privacy-policy-modal.component';
import { TermsConditionsModalComponent } from './components/shared/terms-conditions-modal/terms-conditions-modal.component';
import { LegalNoticeModalComponent } from './components/shared/legal-notice-modal/legal-notice-modal.component';
import { SliderComponent } from './components/inicio/slider/slider.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    OfertaEducativaComponent,
    NosotrosComponent,
    DibujoPublicitarioComponent,
    DisenoGraficoComponent,
    DibujoInfantilComponent,
    GaleriaComponent,
    PlantelesComponent,
    ContactoComponent,
    PrivacyModalComponent,
    PrivacyPolicyModalComponent,
    TermsConditionsModalComponent,
    LegalNoticeModalComponent,
    SliderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
