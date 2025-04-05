import { Component, OnInit, ElementRef, ViewChild, HostListener, Renderer2, NgZone, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-terms-conditions-modal',
  templateUrl: './terms-conditions-modal.component.html',
  styleUrls: ['./terms-conditions-modal.component.scss']
})
export class TermsConditionsModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('termsModal') modalElement!: ElementRef;
  isVisible = false;
  isAnimating = false;
  private scrollHandler: (() => void) | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private touchStartHandler: (() => void) | null = null;

  constructor(
    private renderer: Renderer2,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    // Inicializar el observer de redimensionamiento una sola vez
    this.initializeResizeObserver();
    this.setupPassiveTouchListener();
  }

  /**
   * Inicializa el observer de redimensionamiento
   */
  initializeResizeObserver(): void {
    this.ngZone.runOutsideAngular(() => {
      if (!this.resizeObserver) {
        this.resizeObserver = new ResizeObserver(() => {
          if (this.isVisible) {
            this.adjustModalHeight();
          }
        });
      }
    });
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

  /**
   * Observa el modal cuando se muestra
   */
  observeModal(): void {
    if (!this.resizeObserver || !this.modalElement?.nativeElement) return;
    
    const modalContent = this.modalElement.nativeElement.querySelector('.bg-white');
    if (modalContent) {
      // Asegurar que solo observamos una vez
      this.resizeObserver.disconnect();
      this.resizeObserver.observe(modalContent);
    }
  }

  /**
   * Ajusta dinámicamente la altura del modal para evitar problemas de scroll
   */
  adjustModalHeight(): void {
    if (!this.modalElement?.nativeElement) return;
    
    const modalContent = this.modalElement.nativeElement.querySelector('.bg-white');
    const scrollContent = modalContent?.querySelector('.overflow-y-auto');
    const header = modalContent?.querySelector('.border-b');
    const footer = modalContent?.querySelector('.border-t');
    
    if (modalContent && scrollContent && header && footer) {
      const viewportHeight = window.innerHeight;
      const maxHeight = viewportHeight * 0.9; // 90vh
      const headerHeight = header.offsetHeight;
      const footerHeight = footer.offsetHeight;
      
      // Calcular espacio disponible para el área de scroll
      const scrollHeight = maxHeight - headerHeight - footerHeight;
      
      // Aplicar altura máxima al contenido scrollable
      this.renderer.setStyle(scrollContent, 'max-height', `${scrollHeight}px`);
    }
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
      const modalContent = this.modalElement?.nativeElement?.querySelector('.bg-white');
      if (modalContent) {
        this.renderer.removeClass(modalContent, 'animate-scale-down');
        this.renderer.addClass(modalContent, 'animate-scale-up');
      }
      
      // Configurar el modal después de un breve tiempo
      setTimeout(() => {
        this.observeModal();
        this.adjustModalHeight();
        this.setupScrollHandler();
        
        // Marcar como no animando después de la transición
        setTimeout(() => {
          this.isAnimating = false;
          this.cdr.detectChanges();
        }, 350);
      }, 50);
    });
  }

  setupScrollHandler(): void {
    // Remover handlers previos
    if (this.scrollHandler) {
      this.scrollHandler();
      this.scrollHandler = null;
    }
    
    const scrollContent = this.modalElement?.nativeElement?.querySelector('.overflow-y-auto');
    if (scrollContent) {
      // Limpiar posición de scroll al abrir
      scrollContent.scrollTop = 0;
      
      this.scrollHandler = this.renderer.listen(scrollContent, 'scroll', (event) => {
        // Manejo pasivo para mejor rendimiento
        event.stopPropagation();
      });
    }
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
      const modalContent = this.modalElement?.nativeElement?.querySelector('.bg-white');
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

  onBackdropClick(event: MouseEvent): void {
    // Solo cerrar si el click fue directamente en el backdrop
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
    // Limpieza de listeners y observers
    if (this.scrollHandler) {
      this.scrollHandler();
      this.scrollHandler = null;
    }
    
    if (this.touchStartHandler) {
      this.touchStartHandler();
      this.touchStartHandler = null;
    }
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    // Asegurar que el body vuelve a estado normal
    if (this.isVisible) {
      this.renderer.removeStyle(document.body, 'overflow');
      this.renderer.removeClass(document.body, 'modal-open');
    }
  }
}