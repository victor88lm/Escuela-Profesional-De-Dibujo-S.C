import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-whatsapp-button',
  templateUrl: './whatsapp-button.component.html',
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
        backgroundColor: '#4881ff'
      })),
      transition('circle => expanded', animate('0.3s cubic-bezier(0.25, 0.1, 0.25, 1.0)')),
      transition('expanded => circle', animate('0.25s cubic-bezier(0.25, 0.1, 0.25, 1.0)'))
    ]),
    trigger('iconTransform', [
      state('default', style({
        opacity: 1,
        transform: 'scale(1) rotate(0deg)'
      })),
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0.5) rotate(90deg)'
      })),
      transition('default <=> hidden', animate('0.25s ease-out'))
    ]),
    trigger('contentFade', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(5px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => visible', animate('0.25s ease-out')),
      transition('visible => hidden', animate('0.2s ease-in'))
    ])
  ]
})
export class WhatsappButtonComponent implements OnInit, OnDestroy {
  @Input() phoneNumber = '5516555577';
  @Input() message = 'Hola, me gustaría conocer el proceso de admisión para los próximos cursos';
  @Input() subtitle = 'Consulta nuestros cursos';
  @Input() logoUrl = 'assets/images/logo-escuela.png';
  
  buttonState = 'circle';
  iconState = 'default';
  contentState = 'hidden';
  isMobile = false;
  isPulsing = false;
  
  private pulseTimer: any;
  private isAnimating = false;

  quickReplies = [
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
    this.checkIfMobile();
    this.startPulseAnimation();
  }

  ngOnDestroy() {
    if (this.pulseTimer) {
      clearTimeout(this.pulseTimer);
    }
  }

  startPulseAnimation(): void {
    if (this.buttonState === 'circle') {
      this.isPulsing = true;
      
      this.pulseTimer = setTimeout(() => {
        this.isPulsing = false;
        
        if (this.buttonState === 'circle') {
          this.pulseTimer = setTimeout(() => {
            this.startPulseAnimation();
          }, 8000);
        }
      }, 1000);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.checkIfMobile();
  }

  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  expandButton(): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.buttonState = 'expanded';
    this.iconState = 'hidden';
    
    setTimeout(() => {
      this.contentState = 'visible';
      this.isAnimating = false;
    }, 50);
  }

  collapseButton(): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.contentState = 'hidden';
    
    setTimeout(() => {
      this.buttonState = 'circle';
      this.iconState = 'default';
      
      setTimeout(() => {
        this.isAnimating = false;
      }, 250);
    }, 100);
  }

  onMouseEnter(): void {
    if (!this.isMobile && this.buttonState === 'circle') {
      this.expandButton();
    }
  }

  onMouseLeave(): void {
    if (!this.isMobile && this.buttonState === 'expanded') {
      this.collapseButton();
    }
  }

  onButtonClick(event: Event): void {
    event.stopPropagation();
    
    if (this.isMobile) {
      if (this.buttonState === 'circle') {
        this.expandButton();
      } else {
        this.openWhatsapp();
      }
    } else {
      if (this.buttonState === 'circle') {
        this.openWhatsapp();
      }
    }
  }

  @HostListener('document:click')
  documentClick(): void {
    if (this.isMobile && this.buttonState === 'expanded') {
      this.collapseButton();
    }
  }

  openWhatsapp(customMessage?: string): void {
    const messageToSend = customMessage || this.message;
    const encodedMessage = encodeURIComponent(messageToSend);
    window.open(`https://wa.me/${this.phoneNumber}?text=${encodedMessage}`, '_blank');
  }

  preventPropagation(event: Event): void {
    event.stopPropagation();
  }
}