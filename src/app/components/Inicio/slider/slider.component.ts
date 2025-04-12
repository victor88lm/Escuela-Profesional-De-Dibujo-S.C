import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, NgZone, Renderer2, HostListener, ViewChild, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class sliderComponent implements OnInit, OnDestroy, AfterViewInit {
  // Main slider properties
  currentSlide = 0;
  totalSlides = 3;
  autoSlideInterval: any = null;
  isVisible = true;
  observer: IntersectionObserver | null = null;
  
  // ViewChild references
  @ViewChild('sliderWrapper') sliderWrapperRef!: ElementRef<HTMLElement>;
  @ViewChild('sliderContainer') sliderContainerRef!: ElementRef<HTMLElement>;
  @ViewChild('navPrev') navPrevRef!: ElementRef<HTMLElement>;
  @ViewChild('navNext') navNextRef!: ElementRef<HTMLElement>;
  @ViewChildren('sliderDot') sliderDots!: QueryList<ElementRef<HTMLElement>>;
  
  // Mini slider references
  @ViewChild('miniSliderContainer') miniSliderContainerRef!: ElementRef<HTMLElement>;
  @ViewChild('miniSliderTrack') miniSliderTrackRef!: ElementRef<HTMLElement>;
  @ViewChild('miniPrev') miniPrevRef!: ElementRef<HTMLElement>;
  @ViewChild('miniNext') miniNextRef!: ElementRef<HTMLElement>;
  @ViewChildren('miniSliderIndicator') miniSliderIndicators!: QueryList<ElementRef<HTMLElement>>;
  
  // Cached DOM elements
  private sliderWrapper: HTMLElement | null = null;
  private sliderContainer: HTMLElement | null = null;
  private miniSliderTrack: HTMLElement | null = null;
  
  // Touch handling variables
  isSwiping = false;
  touchStartX = 0;
  touchStartY = 0;
  minSwipeDistance = 30;
  touchDelta = 0;
  containerWidth = 0;
  
  // Mini slider properties
  currentMiniSlide = 0;
  totalMiniSlides = 3;
  miniSliderInterval: any = null;
  
  // Event listener cleanup functions
  private cleanupFunctions: (() => void)[] = [];
  
  constructor(
    private ngZone: NgZone,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.setupVisibilityObserver();
  }
  
  ngAfterViewInit(): void {
    this.cacheElements();
    
    this.ngZone.runOutsideAngular(() => {
      this.setupSlider();
      this.setupMiniSlider();
      this.setupAllEventListeners();
      
      if (this.isVisible) {
        this.startAutoSlide();
        this.startMiniSliderAutoSlide();
      }
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateContainerWidth();
  }
  
  ngOnDestroy(): void {
    this.stopAutoSlide();
    this.stopMiniSliderAutoSlide();
    this.cleanupAllEventListeners();
    
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
  
  private cacheElements(): void {
    this.sliderWrapper = this.sliderWrapperRef?.nativeElement || null;
    this.sliderContainer = this.sliderContainerRef?.nativeElement || null;
    this.miniSliderTrack = this.miniSliderTrackRef?.nativeElement || null;
    this.updateContainerWidth();
  }
  
  private updateContainerWidth(): void {
    if (this.sliderContainer) {
      this.containerWidth = this.sliderContainer.clientWidth || 0;
    }
  }
  
  private cleanupAllEventListeners(): void {
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];
  }
  
  setupVisibilityObserver(): void {
    if (!this.sliderContainerRef?.nativeElement) return;
    
    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      this.isVisible = entry.isIntersecting;
      
      this.ngZone.run(() => {
        if (this.isVisible) {
          this.startAutoSlide();
          this.startMiniSliderAutoSlide();
        } else {
          this.stopAutoSlide();
          this.stopMiniSliderAutoSlide();
        }
      });
    }, { threshold: 0.2 });
    
    this.observer.observe(this.sliderContainerRef.nativeElement);
  }
  
  setupSlider(): void {
    if (!this.sliderWrapper) return;
    this.updateSliderPosition();
  }
  
  setupAllEventListeners(): void {
    this.setupDotControls();
    this.setupNavArrows();
    this.setupTouchEvents();
    this.setupMiniSliderControls();
  }
  
  setupDotControls(): void {
    if (!this.sliderDots) return;

    this.sliderDots.forEach((dotRef, index) => {
      const dot = dotRef.nativeElement;
      const listener = (event: Event) => {
        event.preventDefault();
        
        this.ngZone.run(() => {
          this.goToSlide(index);
        });
      };
      
      dot.addEventListener('click', listener);
      this.cleanupFunctions.push(() => {
        dot.removeEventListener('click', listener);
      });
    });
  }
  
  setupNavArrows(): void {
    if (this.navPrevRef?.nativeElement) {
      const prevButton = this.navPrevRef.nativeElement;
      const prevListener = (event: Event) => {
        event.preventDefault();
        
        this.ngZone.run(() => {
          this.prevSlide();
        });
      };
      
      prevButton.addEventListener('click', prevListener);
      this.cleanupFunctions.push(() => {
        prevButton.removeEventListener('click', prevListener);
      });
    }
    
    if (this.navNextRef?.nativeElement) {
      const nextButton = this.navNextRef.nativeElement;
      const nextListener = (event: Event) => {
        event.preventDefault();
        
        this.ngZone.run(() => {
          this.nextSlide();
        });
      };
      
      nextButton.addEventListener('click', nextListener);
      this.cleanupFunctions.push(() => {
        nextButton.removeEventListener('click', nextListener);
      });
    }
  }
  
  setupTouchEvents(): void {
    if (!this.sliderContainer) return;
    
    const touchStartListener = this.handleTouchStart.bind(this);
    this.sliderContainer.addEventListener('touchstart', touchStartListener, { passive: true });
    
    const touchMoveListener = this.handleTouchMove.bind(this);
    this.sliderContainer.addEventListener('touchmove', touchMoveListener, { passive: false });
    
    const touchEndListener = this.handleTouchEnd.bind(this);
    this.sliderContainer.addEventListener('touchend', touchEndListener, { passive: true });
    
    const scrollListener = () => {
      if (this.isSwiping) {
        this.isSwiping = false;
        this.resetSliderPosition();
      }
    };
    
    document.addEventListener('scroll', scrollListener, { passive: true });
    
    this.cleanupFunctions.push(() => {
      if (this.sliderContainer) {
        this.sliderContainer.removeEventListener('touchstart', touchStartListener);
        this.sliderContainer.removeEventListener('touchmove', touchMoveListener);
        this.sliderContainer.removeEventListener('touchend', touchEndListener);
      }
      document.removeEventListener('scroll', scrollListener);
    });
  }
  
  handleTouchStart(e: TouchEvent): void {
    if (!this.isVisible) return;
    
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.touchDelta = 0;
    this.isSwiping = true;
    
    this.ngZone.run(() => {
      this.stopAutoSlide();
    });
  }
  
  handleTouchMove(e: TouchEvent): void {
    if (!this.isSwiping || !this.isVisible || !this.sliderWrapper) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    const diffX = currentX - this.touchStartX;
    const diffY = currentY - this.touchStartY;
    
    if (Math.abs(diffY) > Math.abs(diffX) * 1.5) {
      this.isSwiping = false;
      this.resetSliderPosition();
      return;
    }
    
    e.preventDefault();
    this.touchDelta = diffX;
    
    const slideOffset = -this.currentSlide * 100;
    const dragOffset = (this.touchDelta / this.containerWidth) * 100;
    
    let finalOffset = slideOffset + dragOffset;
    if ((this.currentSlide === 0 && dragOffset > 0) || 
        (this.currentSlide === this.totalSlides - 1 && dragOffset < 0)) {
      finalOffset = slideOffset + (dragOffset * 0.3);
    }
    
    this.renderer.setStyle(
      this.sliderWrapper, 
      'transform', 
      `translate3d(${finalOffset}%, 0, 0)`
    );
  }
  
  handleTouchEnd(e: TouchEvent): void {
    if (!this.isSwiping || !this.isVisible) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchEndX - this.touchStartX;
    
    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      if (Math.abs(swipeDistance) > this.containerWidth * 0.15) {
        this.ngZone.run(() => {
          if (swipeDistance > 0) {
            this.prevSlide();
          } else {
            this.nextSlide();
          }
        });
      } else {
        this.resetSliderPosition();
      }
    } else {
      this.resetSliderPosition();
    }
    
    this.isSwiping = false;
    this.touchDelta = 0;
    
    if (this.isVisible) {
      this.ngZone.run(() => {
        this.startAutoSlide();
      });
    }
  }
  
  resetSliderPosition(): void {
    if (!this.sliderWrapper) return;
    
    this.renderer.setStyle(this.sliderWrapper, 'transition', 'transform 300ms ease-out');
    this.renderer.setStyle(
      this.sliderWrapper, 
      'transform', 
      `translate3d(-${this.currentSlide * 100}%, 0, 0)`
    );
    
    setTimeout(() => {
      if (this.sliderWrapper) {
        this.renderer.setStyle(this.sliderWrapper, 'transition', 'transform 500ms ease-in-out');
      }
    }, 300);
  }
  
  startAutoSlide(): void {
    if (this.isVisible && !this.autoSlideInterval) {
      this.autoSlideInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.nextSlide();
        });
      }, 15000);
    }
  }
  
  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
  
  updateSliderPosition(): void {
    if (!this.sliderWrapper) return;
    
    this.renderer.setStyle(
      this.sliderWrapper, 
      'transform', 
      `translate3d(-${this.currentSlide * 100}%, 0, 0)`
    );
    
    this.updateActiveDot();
  }
  
  updateActiveDot(): void {
    if (!this.sliderDots) return;
    
    this.sliderDots.forEach((dotRef, index) => {
      const dot = dotRef.nativeElement;
      
      if (index === this.currentSlide) {
        this.renderer.addClass(dot, 'active');
        this.renderer.removeClass(dot, 'bg-white/50');
        this.renderer.addClass(dot, 'bg-white');
      } else {
        this.renderer.removeClass(dot, 'active');
        this.renderer.removeClass(dot, 'bg-white');
        this.renderer.addClass(dot, 'bg-white/50');
      }
    });
  }
  
  goToSlide(index: number): void {
    if (!this.isVisible) return;
    
    this.stopAutoSlide();
    this.currentSlide = index;
    this.updateSliderPosition();
    
    if (this.isVisible) {
      this.startAutoSlide();
    }
  }
  
  prevSlide(): void {
    if (!this.isVisible) return;
    
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateSliderPosition();
  }
  
  nextSlide(): void {
    if (!this.isVisible) return;
    
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSliderPosition();
  }

  // Mini-slider functionality
  setupMiniSlider(): void {
    if (!this.miniSliderTrack) return;
    this.updateMiniSliderPosition();
  }
  
  setupMiniSliderControls(): void {
    if (this.miniPrevRef?.nativeElement) {
      const miniPrevButton = this.miniPrevRef.nativeElement;
      const miniPrevListener = (event: Event) => {
        event.preventDefault();
        
        this.ngZone.run(() => {
          this.prevMiniSlide();
        });
      };
      
      miniPrevButton.addEventListener('click', miniPrevListener);
      this.cleanupFunctions.push(() => {
        miniPrevButton.removeEventListener('click', miniPrevListener);
      });
    }
    
    if (this.miniNextRef?.nativeElement) {
      const miniNextButton = this.miniNextRef.nativeElement;
      const miniNextListener = (event: Event) => {
        event.preventDefault();
        
        this.ngZone.run(() => {
          this.nextMiniSlide();
        });
      };
      
      miniNextButton.addEventListener('click', miniNextListener);
      this.cleanupFunctions.push(() => {
        miniNextButton.removeEventListener('click', miniNextListener);
      });
    }
    
    if (this.miniSliderIndicators) {
      this.miniSliderIndicators.forEach((indicatorRef, index) => {
        const indicator = indicatorRef.nativeElement;
        const indicatorListener = (event: Event) => {
          event.preventDefault();
          
          this.ngZone.run(() => {
            this.goToMiniSlide(index);
          });
        };
        
        indicator.addEventListener('click', indicatorListener);
        this.cleanupFunctions.push(() => {
          indicator.removeEventListener('click', indicatorListener);
        });
      });
    }
    
    if (this.miniSliderContainerRef?.nativeElement) {
      const miniContainer = this.miniSliderContainerRef.nativeElement;
      
      const mouseEnterListener = () => {
        this.stopMiniSliderAutoSlide();
      };
      miniContainer.addEventListener('mouseenter', mouseEnterListener);
      
      const mouseLeaveListener = () => {
        this.startMiniSliderAutoSlide();
      };
      miniContainer.addEventListener('mouseleave', mouseLeaveListener);
      
      const touchStartListener = () => {
        this.stopMiniSliderAutoSlide();
      };
      miniContainer.addEventListener('touchstart', touchStartListener, { passive: true });
      
      const touchEndListener = () => {
        this.startMiniSliderAutoSlide();
      };
      miniContainer.addEventListener('touchend', touchEndListener, { passive: true });
      
      this.cleanupFunctions.push(() => {
        miniContainer.removeEventListener('mouseenter', mouseEnterListener);
        miniContainer.removeEventListener('mouseleave', mouseLeaveListener);
        miniContainer.removeEventListener('touchstart', touchStartListener);
        miniContainer.removeEventListener('touchend', touchEndListener);
      });
    }
  }
  
  startMiniSliderAutoSlide(): void {
    if (!this.miniSliderInterval) {
      this.miniSliderInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.nextMiniSlide();
        });
      }, 5000);
    }
  }
  
  stopMiniSliderAutoSlide(): void {
    if (this.miniSliderInterval) {
      clearInterval(this.miniSliderInterval);
      this.miniSliderInterval = null;
    }
  }
  
  goToMiniSlide(index: number): void {
    this.stopMiniSliderAutoSlide();
    this.currentMiniSlide = index;
    this.updateMiniSliderPosition();
    this.startMiniSliderAutoSlide();
  }
  
  prevMiniSlide(): void {
    this.currentMiniSlide = (this.currentMiniSlide - 1 + this.totalMiniSlides) % this.totalMiniSlides;
    this.updateMiniSliderPosition();
  }
  
  nextMiniSlide(): void {
    this.currentMiniSlide = (this.currentMiniSlide + 1) % this.totalMiniSlides;
    this.updateMiniSliderPosition();
  }
  
  updateMiniSliderPosition(): void {
    if (!this.miniSliderTrack) return;
    
    this.renderer.setStyle(
      this.miniSliderTrack, 
      'transform', 
      `translate3d(-${this.currentMiniSlide * 100}%, 0, 0)`
    );
    
    this.updateMiniSliderIndicators();
  }
  
  updateMiniSliderIndicators(): void {
    if (!this.miniSliderIndicators) return;
    
    this.miniSliderIndicators.forEach((indicatorRef, index) => {
      const indicator = indicatorRef.nativeElement;
      
      if (index === this.currentMiniSlide) {
        this.renderer.addClass(indicator, 'active');
        this.renderer.addClass(indicator, 'bg-white');
        this.renderer.removeClass(indicator, 'bg-white/50');
      } else {
        this.renderer.removeClass(indicator, 'active');
        this.renderer.removeClass(indicator, 'bg-white');
        this.renderer.addClass(indicator, 'bg-white/50');
      }
    });
  }
}