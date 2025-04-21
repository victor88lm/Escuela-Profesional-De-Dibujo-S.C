import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Curso, getCursoBySlug } from '../cursos';
import { CommonModule, NgIf } from '@angular/common';
import { StripeService } from '../../../services/stripe.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-detalle-curso',
  templateUrl: './detalle-curso.component.html',
  styleUrls: ['./detalle-curso.component.css'],
  standalone: true,
  imports: [CommonModule, NgIf, HttpClientModule, FormsModule],
  providers: [StripeService], // Importante: Proveemos el servicio aquí para componentes standalone
})
export class DetalleCursoComponent implements OnInit {
  curso: Curso | undefined;
  currentSlideIndex = 0;
  procesandoPago = false;
  errorPago: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stripeService: StripeService
  ) {}

  ngOnInit(): void {
    // Obtener el slug del curso desde la URL
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        // Buscar el curso por su slug
        this.curso = getCursoBySlug(slug);
        if (!this.curso) {
          // Si no se encuentra el curso, redirigir a la página principal de cursos
          this.router.navigate(['/OfertaEducativa']);
        }
      }
    });

    // Inicializar el slider después de cargar la vista
    setTimeout(() => {
      this.initSlider();
    }, 500);
  }

  // Método para inicializar el slider
  ngAfterViewInit(): void {
    // Configurar evento de redimensionamiento para mantener el slider responsive
    window.addEventListener('resize', () => {
      this.setupSlides();
    });
  }

  // Método para inicializar el slider
  private initSlider(): void {
    // Configura los listeners para botones prev/next si existen en el DOM
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');

    if (prevButton) {
      prevButton.addEventListener('click', () => this.prevSlide());
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => this.nextSlide());
    }

    // Configurar las dimensiones de los slides
    this.setupSlides();

    // Inicializar los indicadores (opcional)
    this.setupIndicators();
  }

  // Configurar dimensiones precisas de los slides
  private setupSlides(): void {
    const slider = document.getElementById('gallerySlider');
    if (!slider || !this.curso?.imagenes?.length) return;

    const containerWidth = slider.parentElement?.offsetWidth || 0;
    const slides = slider.querySelectorAll('img');

    // Asegurar que cada imagen tenga exactamente el ancho del contenedor
    slides.forEach((slide) => {
      (slide as HTMLElement).style.width = `${containerWidth}px`;
    });

    // Ajustar el ancho total del slider para acomodar todas las imágenes
    slider.style.width = `${containerWidth * this.curso.imagenes.length}px`;

    // Actualizar la posición actual
    this.updateSlider();
  }

  // Configurar indicadores de posición (opcional)
  private setupIndicators(): void {
    const indicatorsContainer = document.querySelector('.slider-indicators');
    if (!indicatorsContainer || !this.curso?.imagenes?.length) return;

    // Limpiar indicadores existentes
    indicatorsContainer.innerHTML = '';

    // Crear indicadores para cada imagen
    this.curso.imagenes.forEach((_, index) => {
      const indicator = document.createElement('span');
      indicator.classList.add(
        'w-2',
        'h-2',
        'bg-white',
        'bg-opacity-50',
        'rounded-full',
        'cursor-pointer',
        'transition-all',
        'mx-1'
      );

      if (index === this.currentSlideIndex) {
        indicator.classList.add('bg-opacity-100');
      }

      indicator.addEventListener('click', () => {
        this.goToSlide(index);
      });

      indicatorsContainer.appendChild(indicator);
    });
  }

  // Métodos para controlar el slider de imágenes
  nextSlide(): void {
    if (this.curso?.imagenes) {
      this.currentSlideIndex =
        (this.currentSlideIndex + 1) % this.curso.imagenes.length;
      this.updateSlider();
      this.updateIndicators();
    }
  }

  prevSlide(): void {
    if (this.curso?.imagenes) {
      this.currentSlideIndex =
        (this.currentSlideIndex - 1 + this.curso.imagenes.length) %
        this.curso.imagenes.length;
      this.updateSlider();
      this.updateIndicators();
    }
  }

  // Ir a un slide específico (para los indicadores)
  goToSlide(index: number): void {
    if (
      this.curso?.imagenes &&
      index >= 0 &&
      index < this.curso.imagenes.length
    ) {
      this.currentSlideIndex = index;
      this.updateSlider();
      this.updateIndicators();
    }
  }

  private updateSlider(): void {
    const slider = document.getElementById('gallerySlider');
    if (slider && this.curso?.imagenes) {
      // Usar pixeles exactos en lugar de porcentajes
      const containerWidth = slider.parentElement?.offsetWidth || 0;
      const translateValue = -this.currentSlideIndex * containerWidth;
      slider.style.transform = `translateX(${translateValue}px)`;
    }
  }

  // Actualizar el estado visual de los indicadores (opcional)
  private updateIndicators(): void {
    const indicators = document.querySelectorAll('.slider-indicators span');
    indicators.forEach((indicator, index) => {
      if (index === this.currentSlideIndex) {
        indicator.classList.add('bg-opacity-100');
      } else {
        indicator.classList.remove('bg-opacity-100');
      }
    });
  }

  // Método para abrir modal de inscripción (implementación pendiente)
  abrirModalInscripcion(): void {
    // Aquí iría la lógica para abrir el modal de inscripción
    console.log('Abrir modal de inscripción para:', this.curso?.titulo);
    // Por ejemplo, podrías disparar un evento o cambiar una variable para mostrar un modal
  }

  // Función para extraer el valor numérico del precio
  private extraerValorNumerico(precio: string): number {
    return parseInt(precio.replace(/[^0-9]/g, ''));
  }

  // Calcular monto total para el pago (sin formato para procesar)
  calcularTotalPago(): number {
    if (!this.curso) return 0;

    //Se regresa solo el valor de la colegiatura porque en linea hay descuentor de inscripcion
    const inscripcion = this.extraerValorNumerico(this.curso.costoInscripcion);
    const colegiatura = this.extraerValorNumerico(this.curso.colegiatura);

    return colegiatura;
  }

  // Calcular monto total para mostrar al usuario (con formato)
  calcularTotalPagoFormateado(): string {
    const total = this.calcularTotalPago();
    return `$${total} MXN`;
  }

  emailCliente: string = '';
  mostrarFormularioEmail: boolean = false;

  // Reemplazar la función pagarConStripe() con esta versión
  pagarConStripe(): void {
    if (!this.curso) return;

    // Si aún no tenemos el email, mostrar formulario primero
    if (!this.emailCliente) {
      this.mostrarFormularioEmail = true;
      return;
    }

    this.procesandoPago = true;
    this.errorPago = null;

    // Cuando creas el objeto paymentData
    const paymentData = {
      amount: this.calcularTotalPago(),
      currency: 'mxn',
      name: `Inscripción: ${this.curso.titulo}`,
      description: `Inscripción y primera mensualidad para ${
        this.curso.categoria === 'infantil' ? 'el taller' : 'el curso'
      } ${this.curso.titulo}`,
      success_url:
        window.location.origin +
        '/pago-exitoso?session_id={CHECKOUT_SESSION_ID}', // ESTA ES LA LÍNEA CLAVE
      cancel_url: window.location.origin + '/pago-cancelado',
      client_reference_id: `curso_${this.curso.id}`,
      customer_email: this.emailCliente,
      producto_tipo: 'curso',
      producto_id: this.curso.id.toString(),
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
