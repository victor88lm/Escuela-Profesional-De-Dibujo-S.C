// pago-exitoso.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  templateUrl: './pago-exitoso.component.html',
  imports: [CommonModule],
})
export class PagoExitosoComponent implements OnInit {
  pagoInfo: any = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // Stripe redirige aquí con un parameter payment_intent
      const paymentIntent = params['payment_intent'];
      if (paymentIntent) {
        this.cargarDetallesPago(paymentIntent);
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  cargarDetallesPago(paymentIntent: string): void {
    // Llamar a tu backend para obtener los detalles del pago
    this.http
      .get(
        `https://epd.edu.mx/Pagina_Principal/Cursos/store-payment.php?payment_intent=${paymentIntent}`
      )
      .subscribe({
        next: (response: any) => {
          if (response && response.success && response.pago) {
            this.pagoInfo = response.pago;
          } else {
            console.error('Respuesta inválida:', response);
            this.error = true;
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar detalles de pago', err);
          this.error = true;
          this.loading = false;
        },
      });
  }

  imprimirComprobante(): void {
    window.print();
  }

  compartirWhatsApp(): void {
    const mensaje = `¡Hola! He realizado mi pago para ${this.pagoInfo.producto_nombre}. Mi comprobante de pago: Monto ${this.pagoInfo.monto} ${this.pagoInfo.moneda}, Email: ${this.pagoInfo.email_cliente}, Referencia: ${this.pagoInfo.pago_id}`;

    // Número de WhatsApp de la escuela (reemplazar con el número real)
    const whatsappUrl = `https://wa.me/5215564709939?text=${encodeURIComponent(
      mensaje
    )}`;
    window.open(whatsappUrl, '_blank');
  }
}
