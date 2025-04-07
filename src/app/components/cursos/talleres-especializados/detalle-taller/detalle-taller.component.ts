import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TALLERES } from '../../talleres';

@Component({
  selector: 'app-detalle-taller',
  templateUrl: './detalle-taller.component.html',
  styleUrl: './detalle-taller.component.css',
})
export class DetalleTallerComponent implements OnInit {
  taller: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.taller = TALLERES.find((t) => t.id === id);
  }

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
