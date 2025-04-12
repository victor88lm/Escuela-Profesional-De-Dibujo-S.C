import { Component, ViewChild, ElementRef, HostListener, Renderer2, NgZone, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-privacy-policy-modal',
  templateUrl: './privacy-policy-modal.component.html'
})
export class PrivacyPolicyModalComponent implements AfterViewInit, OnDestroy {
  @ViewChild('policyModal') modalElement!: ElementRef;
  isVisible = false;
  isAnimating = false;
  
  private resizeObserver: ResizeObserver | null = null;
  private cleanupFunctions: (() => void)[] = [];

  constructor(
    private renderer: Renderer2,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.initializeResizeObserver();
    this.setupTouchListener();
  }

  private initializeResizeObserver(): void {
    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.isVisible) {
          this.adjustModalHeight();
        }
      });
    });
  }

  private setupTouchListener(): void {
    this.ngZone.runOutsideAngular(() => {
      if (!this.modalElement?.nativeElement) return;
      
      const element = this.modalElement.nativeElement;
      const handleTouchStart = (event: TouchEvent) => {
        if (!this.isVisible) return;
        
        const scrollContent = element.querySelector('.overflow-y-auto');
        const closeButton = element.querySelector('button[type="button"]');
      
        if (
          scrollContent && 
          !scrollContent.contains(event.target as Node) && 
          !(closeButton && closeButton.contains(event.target as Node))
        ) {
          this.ngZone.run(() => { event.preventDefault(); });
        }
      };

      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      this.cleanupFunctions.push(() => {
        element.removeEventListener('touchstart', handleTouchStart, { passive: false });
      });
    });
  }

  private observeModal(): void {
    if (!this.resizeObserver || !this.modalElement?.nativeElement) return;
    
    const modalContent = this.modalElement.nativeElement.querySelector('.bg-white');
    if (modalContent) {
      this.resizeObserver.disconnect();
      this.resizeObserver.observe(modalContent);
    }
  }

  private adjustModalHeight(): void {
    if (!this.modalElement?.nativeElement) return;
    
    const modalContent = this.modalElement.nativeElement.querySelector('.bg-white');
    const scrollContent = modalContent?.querySelector('.overflow-y-auto');
    const header = modalContent?.querySelector('.border-b');
    
    if (!modalContent || !scrollContent || !header) return;
    
    const viewportHeight = window.innerHeight;
    const maxHeight = viewportHeight * 0.9;
    const headerHeight = header.offsetHeight;
    
    const scrollHeight = maxHeight - headerHeight - 10; // Pequeño margen extra
    this.renderer.setStyle(scrollContent, 'max-height', `${scrollHeight}px`);
  }

  open(): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.isVisible = true;
    this.cdr.detectChanges();
    
    this.ngZone.runOutsideAngular(() => {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
      
      const modalContent = this.modalElement?.nativeElement?.querySelector('.bg-white');
      if (modalContent) {
        this.renderer.removeClass(modalContent, 'animate-scale-down');
        this.renderer.addClass(modalContent, 'animate-scale-up');
      }
      
      setTimeout(() => {
        this.observeModal();
        this.adjustModalHeight();
        this.setupScrollHandler();
        
        setTimeout(() => {
          this.isAnimating = false;
          this.cdr.detectChanges();
        }, 300);
      }, 50);
    });
  }

  private setupScrollHandler(): void {
    const scrollContent = this.modalElement?.nativeElement?.querySelector('.overflow-y-auto');
    if (!scrollContent) return;
    
    scrollContent.scrollTop = 0;
    
    const removeListener = this.renderer.listen(scrollContent, 'scroll', (event) => {
      event.stopPropagation();
    });
    
    this.cleanupFunctions.push(removeListener);
  }

  close(event?: MouseEvent): void {
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
            this.isAnimating = false;
            this.cdr.detectChanges();
          });
        }, 300);
      } else {
        this.ngZone.run(() => {
          this.isVisible = false;
          this.renderer.removeStyle(document.body, 'overflow');
          this.isAnimating = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  onBackdropClick(event: MouseEvent): void {
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
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    if (this.isVisible) {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }
}