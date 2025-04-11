import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pago-rechazado',
  templateUrl: './pago-rechazado.component.html',
  standalone: true,
  imports: [RouterModule],
})
export class PagoRechazadoComponent {
  // Obtener el año actual para el pie de página
  currentYear: number = new Date().getFullYear();
}
