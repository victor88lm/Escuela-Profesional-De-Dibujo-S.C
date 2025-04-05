import { Component, OnInit, ElementRef, ViewChild, HostListener, Renderer2, NgZone, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-legal-notice-modal',
  templateUrl: './legal-notice-modal.component.html',
  styleUrls: ['./legal-notice-modal.component.scss']
})
export class LegalNoticeModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('legalModal') modalElement!: ElementRef;
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
    this.initializeResizeObserver();
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
            const closeElements = element.querySelectorAll('button[type="button"], button[type="button"] svg');
          
            for (let i = 0; i < closeElements.length; i++) {
              if (closeElements[i].contains(event.target as Node)) {
                return; // Do nothing if in close elements
              }
            }

            if (scrollContent && scrollContent.contains(event.target as Node)) {
              return; // Do nothing if in scroll content
            }

            // If not in close or scroll elements, prevent default
            this.ngZone.run(() => {
              event.preventDefault();
            });
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
   * Inicializa el observer de redimensionamiento una sola vez
   */
  initializeResizeObserver(): void {
    // Usar ResizeObserver para mejor rendimiento en lugar de window resize
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
   * Observa el modal cuando se muestra
   */
  observeModal(): void {
    if (!this.resizeObserver || !this.modalElement?.nativeElement) return;
    
    const modalContent = this.modalElement.nativeElement.querySelector('.bg-white');
    if (modalContent) {
      // Asegurar que solo observamos una vez, eliminando observadores previos
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
    this.cdr.detectChanges(); // Forzar detección de cambios para asegurar que el DOM se actualiza
    
    // Asegurar que el modal es visible antes de configurar los listeners
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
      
      // Pequeño tiempo para permitir que DOM se actualice antes de ajustar alturas
      setTimeout(() => {
        this.observeModal();
        this.adjustModalHeight();
        
        // Configurar el scrolling optimizado
        this.setupScrollHandler();
        
        // Marcar como no animando después de la transición
        setTimeout(() => {
          this.isAnimating = false;
          this.cdr.detectChanges();
        }, 350); // Un poco más que la duración de la animación
      }, 50); // Pequeño retraso para asegurar que el DOM está listo
    });
  }

  setupScrollHandler(): void {
    // Remover handlers previos para evitar duplicados
    if (this.scrollHandler) {
      this.scrollHandler();
      this.scrollHandler = null;
    }
    
    // Aplicar optimizaciones de scroll pasivo
    const scrollContent = this.modalElement?.nativeElement?.querySelector('.overflow-y-auto');
    if (scrollContent) {
      // Limpiar posición de scroll al abrir
      scrollContent.scrollTop = 0;
      
      this.scrollHandler = this.renderer.listen(scrollContent, 'scroll', (event) => {
        // El evento de scroll se maneja pasivamente para mejor rendimiento
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
    // Solo cerrar si el click fue directamente en el backdrop y no en algún elemento hijo
    if (event.target === this.modalElement.nativeElement && !this.isAnimating) {
      this.close();
    }
  }
  
  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    if (this.isVisible && !this.isAnimating) {
      this.close();
    }
  }

  ngOnDestroy(): void {
    // Limpieza de listeners para evitar memory leaks
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
    
    // Asegurar que el body vuelve a estado normal si el componente se destruye mientras el modal está abierto
    if (this.isVisible) {
      this.renderer.removeStyle(document.body, 'overflow');
      this.renderer.removeClass(document.body, 'modal-open');
    }
  }
}