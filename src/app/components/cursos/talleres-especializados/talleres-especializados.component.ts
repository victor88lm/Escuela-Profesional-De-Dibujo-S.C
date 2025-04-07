import { Component } from '@angular/core';
import { TALLERES } from '../talleres';

@Component({
  selector: 'app-talleres-especializados',
  templateUrl: './talleres-especializados.component.html',
  styleUrl: './talleres-especializados.component.css',
})
export class TalleresEspecializadosComponent {
  talleres = TALLERES;

  // Función para asignar color según la categoría
  getCategoriaColor(categoria: string): string {
    switch (categoria) {
      case 'Pintura':
        return 'red';
      case 'Dibujo':
        return 'green';
      case 'Digital':
        return 'blue';
      default:
        return 'gray';
    }
  }
}
