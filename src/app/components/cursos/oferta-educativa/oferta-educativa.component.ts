import { Component, OnInit } from '@angular/core';
import { CURSOS, Curso } from '../cursos';

@Component({
  selector: 'app-oferta-educativa',
  templateUrl: './oferta-educativa.component.html',
  styleUrl: './oferta-educativa.component.css',
})
export class OfertaEducativaComponent implements OnInit {
  cursos: Curso[] = [];

  constructor() {}

  ngOnInit(): void {
    // Obtener todos los cursos desde el archivo centralizado
    this.cursos = CURSOS;
  }
}
