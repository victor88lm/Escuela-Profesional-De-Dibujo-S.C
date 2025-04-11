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
      <!DOCTYPE html>
<html>
<head>
  <title>Comprobante de Pago - ESCUELA PROFESIONAL DE DIBUJO S.C</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Montserrat', sans-serif;
      line-height: 1.6;
      background-color: #f5f7fa;
      color: #2d3748;
      padding: 20px;
    }
    
    .container {
      max-width: 750px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    /* Marca de agua con background-image en lugar de img */
    .container::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      height: 400px;
      background-image: url('img/Logo_icon.avif');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      opacity: 0.07;
      z-index: 0;
      pointer-events: none; /* Permite interactuar con elementos debajo */
    }
    
    .document-header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: white;
      padding: 25px 30px;
      position: relative;
      z-index: 1;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo-area {
      display: flex;
      align-items: center;
    }
    
    .logo {
      height: 65px;
      width: auto;
    }
    
    .document-info {
      text-align: right;
    }
    
    .document-type {
      font-weight: 700;
      font-size: 22px;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .document-number {
      font-size: 16px;
      opacity: 0.9;
    }
    
    .content {
      padding: 30px;
      position: relative;
      z-index: 1;
    }
    
    .section {
      margin-bottom: 25px;
    }
    
    .section-title {
      color: #1e40af;
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
      position: relative;
    }
    
    .section-title::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 50px;
      height: 2px;
      background-color: #3b82f6;
    }
    
    .row {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 6px;
    }
    
    .col-6 {
      width: 50%;
      padding: 5px 10px;
    }
    
    @media (max-width: 600px) {
      .col-6 {
        width: 100%;
      }
    }
    
    .info-group {
      margin-bottom: 8px;
    }
    
    .label {
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
      margin-bottom: 3px;
    }
    
    .value {
      font-size: 15px;
      font-weight: 600;
    }
    
    .highlight {
      color: #1e40af;
    }
    
    .card {
      background-color: #f8fafc;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 25px;
      border-left: 4px solid #3b82f6;
    }
    
    .amount-card {
      background-color: #f0f9ff;
      padding: 16px 20px;
      border-radius: 8px;
      text-align: right;
      border: 1px solid #bfdbfe;
      margin-top: 30px;
    }
    
    .amount-label {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 5px;
    }
    
    .amount-value {
      font-size: 24px;
      color: #1e40af;
      font-weight: 700;
    }
    
    .divider {
      height: 1px;
      background-color: #e2e8f0;
      margin: 30px 0;
    }
    
    .footer {
      background-color: #f8fafc;
      padding: 20px 30px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      position: relative;
      z-index: 1;
    }
    
    .validation-badge {
      display: inline-block;
      padding: 8px 16px;
      background-color: #dbeafe;
      color: #1e40af;
      border-radius: 30px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 15px;
    }
    
    .contact-info {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin: 15px 0;
      font-size: 14px;
    }
    
    .contact-item strong {
      color: #1e40af;
    }
    
    .copyright {
      font-size: 12px;
      color: #64748b;
      margin-top: 10px;
    }
    
    @media print {
      body {
        background-color: white;
        padding: 0;
      }
      
      .container {
        box-shadow: none;
        max-width: 100%;
      }
      
      .document-header {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .footer {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="document-header">
      <div class="header-content">
        <div class="logo-area">
          <img src="img/Logo.avif" alt="Logo ESCUELA PROFESIONAL DE DIBUJO S.C" class="logo">
        </div>
        <div class="document-info">
          <div class="document-type">Comprobante de Pago</div>
          <div class="document-number">No. ${this.pagoInfo.pago_id}</div>
        </div>
      </div>
    </div>
    
    <div class="content">
      <div class="row">
        <div class="col-6">
          <div class="section">
            <div class="section-title">Datos del Cliente</div>
            <div class="info-group">
              <div class="label">Nombre:</div>
              <div class="value highlight">${this.pagoInfo.nombre_cliente || 'No especificado'}</div>
            </div>
            <div class="info-group">
              <div class="label">Correo:</div>
              <div class="value">${this.pagoInfo.email_cliente}</div>
            </div>
          </div>
        </div>
        
        <div class="col-6">
          <div class="section">
            <div class="section-title">Información del Pago</div>
            <div class="info-group">
              <div class="label">Referencia:</div>
              <div class="value">${this.pagoInfo.pago_id}</div>
            </div>
            <div class="info-group">
              <div class="label">Fecha y Hora:</div>
              <div class="value">${new Date(this.pagoInfo.fecha_pago).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="section-title">Servicio Contratado</div>
        <div class="info-group">
          <div class="label">Curso/Taller:</div>
          <div class="value highlight">${this.pagoInfo.producto_nombre}</div>
        </div>
      </div>
      
      <div class="amount-card">
        <div class="amount-label">MONTO TOTAL</div>
        <div class="amount-value">$${this.pagoInfo.monto} ${this.pagoInfo.moneda}</div>
      </div>
    </div>
    
    <div class="footer">
      <div class="validation-badge">
        Comprobante de pago válido
      </div>
      
      <div class="contact-info">
        <div class="contact-item">
          Plantel Centro: <strong>55-7987-2334</strong>
        </div>
        <div class="contact-item">
          Plantel Ecatepec: <strong>55-7321-2343</strong>
        </div>
      </div>
      
      <div class="copyright">
        © ESCUELA PROFESIONAL DE DIBUJO S.C ${new Date().getFullYear()} - Todos los derechos reservados
      </div>
    </div>
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
