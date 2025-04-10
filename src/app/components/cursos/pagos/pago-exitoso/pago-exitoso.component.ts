// pago-exitoso.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pago-exitoso',
  standalone: true,
  templateUrl: './pago-exitoso.component.html',
  imports: [CommonModule, RouterModule],
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
      // Stripe puede enviar un parámetro session_id
      const sessionId = params['session_id'];
      if (sessionId) {
        this.cargarDetallesPago(sessionId);
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  cargarDetallesPago(sessionId: string): void {
    // Llamar a tu backend para obtener los detalles del pago
    this.http
      .get(
        `https://epd.edu.mx/Pagina_Principal/Cursos/store-payment.php?session_id=${sessionId}`
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

  imprimirComprobanteOptimizado(): void {
    // Crear un iframe oculto
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Contenido del iframe
    const contenido = `
      <html>
      <head>
        <title>Comprobante de Pago - Escuela de Arte EPD</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
          th { background-color: #f2f2f2; }
          .footer { text-align: center; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; }
          @media print {
            body { padding: 0; margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Escuela de Arte EPD</h1>
          <h2>Comprobante de Pago</h2>
        </div>
        
        <table>
          <tr>
            <th colspan="2">Detalles del Pago</th>
          </tr>
          <tr>
            <td><strong>Referencia:</strong></td>
            <td>${this.pagoInfo.pago_id}</td>
          </tr>
          <tr>
            <td><strong>Fecha:</strong></td>
            <td>${new Date(this.pagoInfo.fecha_pago).toLocaleString()}</td>
          </tr>
          <tr>
            <td><strong>Cliente:</strong></td>
            <td>${this.pagoInfo.nombre_cliente || 'No especificado'}</td>
          </tr>
          <tr>
            <td><strong>Correo:</strong></td>
            <td>${this.pagoInfo.email_cliente}</td>
          </tr>
          <tr>
            <td><strong>Curso/Taller:</strong></td>
            <td>${this.pagoInfo.producto_nombre}</td>
          </tr>
          <tr>
            <td><strong>Monto:</strong></td>
            <td>$${this.pagoInfo.monto} ${this.pagoInfo.moneda}</td>
          </tr>
        </table>
        
        <div class="footer">
          <p>Este documento es un comprobante de pago válido.</p>
          <p>Plantel Centro: 55-7987-2332 | Plantel Ecatepec: 55-7321-2343</p>
          <p>© Escuela de Arte EPD ${new Date().getFullYear()}</p>
        </div>
      </body>
      </html>
    `;

    // Escribir el contenido al iframe
    const iframeDocument =
      iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDocument) {
      iframeDocument.open();
      iframeDocument.write(contenido);
      iframeDocument.close();

      // Imprimir después de que se cargue el contenido
      setTimeout(() => {
        try {
          iframe.contentWindow?.print();

          // Eliminar el iframe después de imprimir
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        } catch (error) {
          console.error('Error al imprimir:', error);
          alert(
            'Hubo un error al intentar imprimir. Por favor, inténtalo de nuevo.'
          );
          document.body.removeChild(iframe);
        }
      }, 500);
    }
  }

  compartirWhatsApp(): void {
    // Crear un mensaje más completo y estructurado
    const mensaje =
      `*¡Pago realizado con éxito!* 💯\n\n` +
      `Hola, he realizado mi pago para *${this.pagoInfo.producto_nombre}*\n\n` +
      `*📋 Detalles del comprobante:*\n` +
      `• Referencia: ${this.pagoInfo.pago_id}\n` +
      `• Monto: $${this.pagoInfo.monto} ${this.pagoInfo.moneda}\n` +
      `• Fecha: ${new Date(this.pagoInfo.fecha_pago).toLocaleDateString()}\n` +
      `• Nombre: ${this.pagoInfo.nombre_cliente || 'No especificado'}\n` +
      `• Email: ${this.pagoInfo.email_cliente}\n\n` +
      `Por favor, confirmar mi inscripción. ¡Gracias!`;

    // Número de WhatsApp de la escuela
    const whatsappUrl = `https://wa.me/5215564709939?text=${encodeURIComponent(
      mensaje
    )}`;
    window.open(whatsappUrl, '_blank');
  }
}
