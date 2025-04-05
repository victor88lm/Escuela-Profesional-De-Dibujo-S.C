import { Component, Input, OnInit, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-whatsapp-button',
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.css'],
  animations: [
    trigger('expandButton', [
      state('circle', style({
        width: '65px',
        height: '65px',
        borderRadius: '50%',
        backgroundColor: '#25D366'
      })),
      state('expanded', style({
        width: '320px',
        height: 'auto',
        borderRadius: '20px',
        backgroundColor: '#4881ff' // bg-blue-600 - Azul claro
      })),
      transition('circle => expanded', [
        animate('0.4s cubic-bezier(0.25, 0.1, 0.25, 1.0)') // Curva de aceleración más suave
      ]),
      transition('expanded => circle', [
        animate('0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)') // Curva de desaceleración más fluida
      ])
    ]),
    trigger('iconTransform', [
      state('default', style({
        opacity: 1,
        transform: 'scale(1) rotate(0deg)'
      })),
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0.5) rotate(90deg)' // Rotación menos agresiva
      })),
      transition('default <=> hidden', [
        animate('0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)') // Animación más suave
      ])
    ]),
    trigger('contentFade', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(5px)' // Menor desplazamiento
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => visible', [
        animate('0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)') // Sincronizado con la expansión
      ]),
      transition('visible => hidden', [
        animate('0.2s cubic-bezier(0.25, 0.1, 0.25, 1.0)')
      ])
    ]),
    trigger('rippleEffect', [
      transition(':enter', [
        style({ opacity: 0.7, transform: 'scale(0.1)' }),
        animate('0.6s cubic-bezier(0, 0, 0.2, 1)', 
          style({ opacity: 0, transform: 'scale(2.5)' }))
      ])
    ])
  ]
})
export class WhatsappButtonComponent implements OnInit {
  @Input() phoneNumber: string = '5649104506';
  @Input() message: string = 'Hola, me gustaría conocer el proceso de admisión para los próximos cursos';
  @Input() subtitle: string = 'Consulta nuestros cursos';
  @Input() logoUrl: string = 'assets/images/logo-escuela.png'; // Logo personalizable
  
  buttonState: string = 'circle';
  iconState: string = 'default';
  contentState: string = 'hidden';
  isMobile: boolean = false;
  isPulsing: boolean = false;
  showRipple: boolean = false;
  isAnimating: boolean = false; // Flag para prevenir animaciones simultáneas

  // Mensajes predefinidos específicos para la escuela
  quickReplies: Array<{text: string, message: string, icon: string}> = [
    {
      text: 'Información sobre inscripciones', 
      message: 'Hola, me gustaría recibir más información sobre las inscripciones',
      icon: '📝'
    },
    {
      text: 'Horarios y costos de cursos', 
      message: 'Hola, quisiera conocer los horarios y costos de los cursos disponibles',
      icon: '🕒'
    },
    {
      text: 'Proceso de admisión', 
      message: 'Hola, me gustaría recibir más información sobre su proceso de admisión',
      icon: '✅'
    }
  ];

  ngOnInit() {
    // Detectar si es un dispositivo móvil
    this.checkIfMobile();
    
    // Iniciar animación de pulso
    this.startPulseAnimation();
  }

  // Iniciar animación de pulso para llamar la atención
  startPulseAnimation(): void {
    if (this.buttonState === 'circle') {
      this.isPulsing = true;
      setTimeout(() => {
        this.isPulsing = false;
      }, 1000);
      
      // Repetir cada 8 segundos
      setTimeout(() => {
        if (this.buttonState === 'circle') {
          this.startPulseAnimation();
        }
      }, 8000);
    }
  }

  // Efecto de ripple al hacer click
  triggerRipple(): void {
    this.showRipple = true;
    setTimeout(() => {
      this.showRipple = false;
    }, 600);
  }

  // Detectar cambios en el tamaño de la ventana
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkIfMobile();
  }

  // Verificar si estamos en un dispositivo móvil
  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  // Expandir el botón (activado por hover en desktop, click en móvil)
  expandButton(): void {
    if (this.isAnimating) return; // Prevenir múltiples animaciones
    
    this.isAnimating = true;
    this.buttonState = 'expanded';
    this.iconState = 'hidden';
    
    // Mostrar el contenido ligeramente después para sincronizar animaciones
    setTimeout(() => {
      this.contentState = 'visible';
      this.isAnimating = false;
    }, 50);
  }

  // Colapsar el botón
  collapseButton(): void {
    if (this.isAnimating) return; // Prevenir múltiples animaciones
    
    this.isAnimating = true;
    this.contentState = 'hidden';
    
    // Esperar a que termine la animación de ocultación de contenido
    setTimeout(() => {
      this.buttonState = 'circle';
      this.iconState = 'default';
      
      setTimeout(() => {
        this.isAnimating = false;
      }, 300);
    }, 150);
  }

  // Manejar hover (para desktop)
  onMouseEnter(): void {
    if (!this.isMobile && this.buttonState === 'circle') {
      this.expandButton();
    }
  }

  // Manejar cuando el mouse sale
  onMouseLeave(): void {
    if (!this.isMobile && this.buttonState === 'expanded') {
      this.collapseButton();
    }
  }

  // Manejar click (principalmente para móviles)
  onButtonClick(event: Event): void {
    event.stopPropagation();
    this.triggerRipple();
    
    if (this.isMobile) {
      if (this.buttonState === 'circle') {
        this.expandButton();
      } else {
        // En móvil, si ya está expandido, enviar mensaje por defecto
        this.openWhatsapp();
      }
    } else {
      // En desktop, si está en círculo, abrir WhatsApp directamente
      if (this.buttonState === 'circle') {
        this.openWhatsapp();
      }
    }
  }

  // Click en el documento para cerrar en móviles
  @HostListener('document:click')
  documentClick(): void {
    if (this.isMobile && this.buttonState === 'expanded') {
      this.collapseButton();
    }
  }

  // Abrir WhatsApp con mensaje específico
  openWhatsapp(customMessage?: string): void {
    const messageToSend = customMessage || this.message;
    const encodedMessage = encodeURIComponent(messageToSend);
    window.open(`https://wa.me/${this.phoneNumber}?text=${encodedMessage}`, '_blank');
  }

  // Prevenir que el click se propague al documento
  preventPropagation(event: Event): void {
    event.stopPropagation();
  }
}