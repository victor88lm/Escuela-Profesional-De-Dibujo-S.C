import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TALLERES } from '../../talleres';
import { FormsModule } from '@angular/forms';
import { StripeService } from '../../../../services/stripe.service'; // Importa el servicio
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-taller',
  templateUrl: './detalle-taller.component.html',
  styleUrl: './detalle-taller.component.css',
})
export class DetalleTallerComponent implements OnInit {
  taller: any;
  mostrarModal = false;
  metodoPagoSeleccionado = 'paypal'; // Por defecto

  // Nuevo estado para manejar el pago con Stripe
  procesandoPago = false;
  errorPago: string | null = null;

  @ViewChild('modalContenido') modalContenido!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private stripeService: StripeService // Inyecta el servicio
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id']; // Convierte a número
      this.taller = TALLERES.find((t) => t.id === id);
    });
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

  calcularTotalPago(): string {
    // Extraer los valores numéricos
    //Solo se regresa el valor de la colegiatura porque en linea hay descuento de insripcion
    const inscripcion = parseInt(
      this.taller.costoInscripcion.replace(/[^0-9]/g, '')
    );
    const colegiatura = parseInt(
      this.taller.colegiatura.replace(/[^0-9]/g, '')
    );

    // Calcular el total
    const total = colegiatura;

    // Formatear el total como moneda
    return `${total} MXN`;
  }

  // Esta función devuelve solo el valor numérico para usar con Stripe
  calcularTotalPagoNumerico(): number {
    //Solo se regresa el valor de la colegiatura porque en linea hay descuentor de inscripcion
    const inscripcion = parseInt(
      this.taller.costoInscripcion.replace(/[^0-9]/g, '')
    );
    const colegiatura = parseInt(
      this.taller.colegiatura.replace(/[^0-9]/g, '')
    );

    return colegiatura;
  }

  abrirModalInscripcion(): void {
    this.mostrarModal = true;
    document.body.classList.add('overflow-hidden'); // Evita scroll en el fondo
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    document.body.classList.remove('overflow-hidden');
  }

  cerrarModalSiClickFuera(event: MouseEvent): void {
    if (
      this.modalContenido &&
      !this.modalContenido.nativeElement.contains(event.target)
    ) {
      this.cerrarModal();
    }
  }

  seleccionarMetodoPago(metodo: string): void {
    this.metodoPagoSeleccionado = metodo;

    // Reset de estados de error cuando se cambia de método
    this.errorPago = null;
    this.procesandoPago = false;
  }

  copiarInfoBancaria(): void {
    const infoBancaria = `
      Banco: BBVA
      Beneficiario: Escuela de Arte, S.A. de C.V.
      Cuenta: 0123456789
      CLABE: 012345678901234567
      
      Banco: Santander
      Beneficiario: Escuela de Arte, S.A. de C.V.
      Cuenta: 9876543210
      CLABE: 012345678909876543
      
      Banco: Banorte
      Beneficiario: Escuela de Arte, S.A. de C.V.
      Cuenta: 5678901234
      CLABE: 012345678905678901
    `;

    navigator.clipboard
      .writeText(infoBancaria)
      .then(() => {
        // Mostrar SweetAlert de éxito
        Swal.fire({
          icon: 'success',
          title: '¡Copiado!',
          text: 'La información bancaria ha sido copiada al portapapeles',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      })
      .catch((err) => {
        console.error('Error al copiar la información: ', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo copiar la información. Inténtalo de nuevo.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      });
  }

  completarProcesoTransferencia(): void {
    // Registrar la inscripción y mostrar mensaje con SweetAlert
    Swal.fire({
      icon: 'success',
      title: '¡Inscripción Registrada!',
      html: `<p>Tu inscripción al taller <b>${this.taller.titulo}</b> ha sido registrada.</p>
             <p class="mt-2">Por favor envía el comprobante de pago por WhatsApp incluyendo:</p>
             <ul class="text-left mt-2 mb-3">
               <li>• Nombre del taller</li>
               <li>• Tu nombre completo</li>
             </ul>
             <p><b>PLANTEL CENTRO:</b> 55-7987-2332<br>
                <b>PLANTEL ECATEPEC:</b> 55-7321-2343</p>`,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cerrarModal();
      }
    });
  }

  emailCliente: string = '';
  mostrarFormularioEmail: boolean = false;

  // Nueva función para iniciar el pago con Stripe
  // Reemplazar la función pagarConStripe() con esta versión
  // Modificar el método pagarConStripe() en DetalleTallerComponent
  pagarConStripe(): void {
    if (!this.taller) return;

    // Si aún no tenemos el email, mostrar formulario primero
    if (!this.emailCliente) {
      this.mostrarFormularioEmail = true;
      return;
    }

    this.procesandoPago = true;
    this.errorPago = null;

    // Preparar los datos para la sesión de Stripe
    const paymentData = {
      amount: this.calcularTotalPago(),
      currency: 'mxn',
      name: `Inscripción: ${this.taller.titulo}`,
      description: `Inscripción y primera mensualidad para ${
        this.taller.categoria === 'infantil' ? 'el taller' : 'el curso'
      } ${this.taller.titulo}`,
      success_url:
        window.location.origin +
        '/pago-exitoso?payment_intent={PAYMENT_INTENT}',
      cancel_url: window.location.origin + '/pago-cancelado',
      client_reference_id: `curso_${this.taller.id}`,
      customer_email: this.emailCliente,
      producto_tipo: 'curso',
      producto_id: this.taller.id.toString(),
    };

    // Llamar al servicio para crear la sesión de Checkout
    this.stripeService.createCheckoutSession(paymentData).subscribe({
      next: (response) => {
        this.procesandoPago = false;
        if (response && response.id) {
          // Redirigir a la página de pago de Stripe
          this.stripeService.redirectToCheckout(response.id);
        } else {
          this.errorPago = 'No se pudo crear la sesión de pago';
        }
      },
      error: (err) => {
        this.procesandoPago = false;
        this.errorPago =
          'Error al procesar el pago: ' +
          (err.error?.error || err.message || 'Error desconocido');
        console.error('Error de pago:', err);
      },
    });
  }

  // Nueva función para confirmar el email y proceder con el pago
  confirmarEmail(): void {
    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.emailCliente)) {
      this.errorPago = 'Por favor ingresa un correo electrónico válido';
      return;
    }

    this.mostrarFormularioEmail = false;
    this.pagarConStripe();
  }
}
