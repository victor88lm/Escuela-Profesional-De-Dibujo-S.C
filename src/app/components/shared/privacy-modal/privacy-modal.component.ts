import { Component, OnInit, ElementRef, ViewChild, HostListener, Renderer2, NgZone, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-privacy-modal',
  templateUrl: './privacy-modal.component.html',
  styleUrls: ['./privacy-modal.component.scss']
})
export class PrivacyModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('privacyModal') modalElement!: ElementRef;
  isVisible = false;
  isAnimating = false;
  private touchStartHandler: (() => void) | null = null;

  constructor(
    private renderer: Renderer2,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.setupPassiveTouchListener();
  }

  /**
   * Setup a passive touch start listener to prevent performance warnings
   */
  setupPassiveTouchListener(): void {
    this.ngZone.runOutsideAngular(() => {
      if (this.modalElement?.nativeElement) {
        const element = this.modalElement.nativeElement;
        
        // Remove any existing listener first
        if (this.touchStartHandler) {
          this.touchStartHandler();
        }

        // Create a touch start handler
        const handleTouchStart = (event: TouchEvent) => {
          if (this.isVisible) {
            const scrollContent = element.querySelector('.overflow-y-auto');
            const closeIcon = element.querySelector('button[type="button"] svg');
            const closeButton = element.querySelector('button[type="button"]');
          
            // Check if the touch is outside of scroll content and close elements
            if (
              scrollContent &&
              !scrollContent.contains(event.target as Node) &&
              !(closeButton && closeButton.contains(event.target as Node)) &&
              !(closeIcon && closeIcon.contains(event.target as Node))
            ) {
              // If not in allowed elements, prevent default
              this.ngZone.run(() => {
                event.preventDefault();
              });
            }
          }
        };

        // Add event listener directly with passive option
        element.addEventListener('touchstart', handleTouchStart, { passive: false });

        // Store a cleanup function
        this.touchStartHandler = () => {
          element.removeEventListener('touchstart', handleTouchStart, { passive: false });
        };
      }
    });
  }

  open(): void {
    // Evitar abrir el modal si ya está en proceso de animación
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.isVisible = true;
    this.cdr.detectChanges(); // Forzar detección de cambios
    
    // Asegurar que el modal es visible antes de configurar
    this.ngZone.runOutsideAngular(() => {
      // Bloquear scroll del body
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
      this.renderer.addClass(document.body, 'modal-open');
      
      // Restaurar la clase de animación si fue removida previamente
      const modalContent = this.modalElement?.nativeElement?.querySelector('div[class*="bg-white"]');
      if (modalContent) {
        this.renderer.removeClass(modalContent, 'animate-scale-down');
        this.renderer.addClass(modalContent, 'animate-scale-up');
      }
      
      // Configurar el modal después de un breve tiempo
      setTimeout(() => {
        // Marcar como no animando después de la transición
        setTimeout(() => {
          this.isAnimating = false;
          this.cdr.detectChanges();
        }, 350);
      }, 50);
    });
  }

  close(event?: MouseEvent): void {
    // Evitar cerrar el modal si ya está en proceso de animación
    if (this.isAnimating) return;
    
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    this.isAnimating = true;
    
    this.ngZone.runOutsideAngular(() => {
      const modalContent = this.modalElement?.nativeElement?.querySelector('div[class*="bg-white"]');
      if (modalContent) {
        this.renderer.removeClass(modalContent, 'animate-scale-up');
        this.renderer.addClass(modalContent, 'animate-scale-down');
        
        setTimeout(() => {
          this.ngZone.run(() => {
            this.isVisible = false;
            this.renderer.removeStyle(document.body, 'overflow');
            this.renderer.removeClass(document.body, 'modal-open');
            this.isAnimating = false;
            this.cdr.detectChanges();
          });
        }, 300);
      } else {
        this.ngZone.run(() => {
          this.isVisible = false;
          this.renderer.removeStyle(document.body, 'overflow');
          this.renderer.removeClass(document.body, 'modal-open');
          this.isAnimating = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  acceptAndClose(event: MouseEvent): void {
    // Prevenir comportamiento por defecto y propagación
    event.preventDefault();
    event.stopPropagation();
    
    // Buscar el checkbox de privacidad y marcarlo
    const privacyCheckbox = document.getElementById('privacidad') as HTMLInputElement;
    if (privacyCheckbox) {
      privacyCheckbox.checked = true;
    }
    
    // Opcional: Mostrar una animación o efecto visual de confirmación
    const acceptButton = event.currentTarget as HTMLElement;
    if (acceptButton) {
      // Añadir clase temporal para mostrar efecto de confirmación
      acceptButton.classList.add('accepted');
      
      // Esperar un momento para mostrar la animación de confirmación antes de cerrar
      setTimeout(() => {
        this.close();
      }, 400);
    } else {
      this.close();
    }
  }

  // Cerrar modal al hacer clic fuera del contenido
  onBackdropClick(event: MouseEvent): void {
    event.preventDefault();
    if (event.target === this.modalElement.nativeElement && !this.isAnimating) {
      this.close();
    }
  }
  
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    if (this.isVisible && !this.isAnimating) {
      this.close();
    }
  }

  ngOnDestroy(): void {
    // Limpieza de listeners
    if (this.touchStartHandler) {
      this.touchStartHandler();
      this.touchStartHandler = null;
    }
    
    // Asegurar que el body vuelve a estado normal
    if (this.isVisible) {
      this.renderer.removeStyle(document.body, 'overflow');
      this.renderer.removeClass(document.body, 'modal-open');
    }
  }
}