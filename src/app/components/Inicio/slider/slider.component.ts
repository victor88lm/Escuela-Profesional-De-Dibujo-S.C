import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, NgZone, Renderer2, HostListener, ViewChild, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class sliderComponent implements OnInit, OnDestroy, AfterViewInit {
  
  // Main slider properties
  currentSlide: number = 0;
  totalSlides: number = 3;
  autoSlideInterval: any = null;
  isVisible: boolean = true;
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
  isSwiping: boolean = false;
  touchStartX: number = 0;
  touchEndX: number = 0;
  touchStartY: number = 0;
  touchEndY: number = 0;
  minSwipeDistance: number = 30; 
  swipeThreshold: number = 0.3;
  swipeProgress: number = 0;
  touchDelta: number = 0;
  containerWidth: number = 0;
  
  // Mini slider properties
  currentMiniSlide: number = 0;
  totalMiniSlides: number = 3;
  miniSliderInterval: any = null;
  
  // Event listener cleanup functions
  private cleanupFunctions: (() => void)[] = [];
  
  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Set up the visibility observer
    this.setupVisibilityObserver();
  }
  
  ngAfterViewInit(): void {
    // Cache DOM elements after view is initialized
    this.cacheElements();
    
    // Run outside Angular zone for better performance
    this.ngZone.runOutsideAngular(() => {
      // Set up the sliders
      this.setupSlider();
      this.setupMiniSlider();
      
      // Add all event listeners
      this.setupAllEventListeners();
      
      // Start auto-slides if visible
      if (this.isVisible) {
        this.startAutoSlide();
        this.startMiniSliderAutoSlide();
      }
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    // Update container width on resize
    this.updateContainerWidth();
    this.updateSwipeThreshold();
  }
  
  ngOnDestroy(): void {
    // Clean up all resources
    this.stopAutoSlide();
    this.stopMiniSliderAutoSlide();
    
    // Clean up all event listeners
    this.cleanupAllEventListeners();
    
    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
  
  private cacheElements(): void {
    // Cache main slider elements
    this.sliderWrapper = this.sliderWrapperRef?.nativeElement || null;
    this.sliderContainer = this.sliderContainerRef?.nativeElement || null;
    
    // Cache mini slider elements
    this.miniSliderTrack = this.miniSliderTrackRef?.nativeElement || null;
    
    // Get container width for calculations
    this.updateContainerWidth();
  }
  
  private updateContainerWidth(): void {
    if (this.sliderContainer) {
      this.containerWidth = this.sliderContainer.clientWidth || 0;
    }
  }
  
  private updateSwipeThreshold(): void {
    // Adjust swipe threshold based on container width
    this.swipeThreshold = this.containerWidth * 0.3; // 30% of container width
  }
  
  private cleanupAllEventListeners(): void {
    // Execute all cleanup functions
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];
  }
  
  setupVisibilityObserver(): void {
    if (!this.sliderContainerRef?.nativeElement) return;
    
    // Create new IntersectionObserver
    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      
      // Update visibility status
      this.isVisible = entry.isIntersecting;
      
      // Run these operations inside Angular zone to ensure change detection
      this.ngZone.run(() => {
        // Start or stop auto-slide based on visibility
        if (this.isVisible) {
          this.startAutoSlide();
          this.startMiniSliderAutoSlide();
        } else {
          this.stopAutoSlide();
          this.stopMiniSliderAutoSlide();
        }
      });
    }, {
      // Consider element visible when at least 20% is in viewport
      threshold: 0.2
    });
    
    // Start observing the slider container
    this.observer.observe(this.sliderContainerRef.nativeElement);
  }
  
  setupSlider(): void {
    if (!this.sliderWrapper) return;
    
    // Set initial position
    this.updateSliderPosition();
    
    // Initialize swipe threshold
    this.updateSwipeThreshold();
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
        
        // Run inside Angular zone to ensure change detection
        this.ngZone.run(() => {
          this.goToSlide(index);
        });
      };
      
      dot.addEventListener('click', listener);
      
      // Store cleanup function
      this.cleanupFunctions.push(() => {
        dot.removeEventListener('click', listener);
      });
    });
  }
  
  setupNavArrows(): void {
    // Setup previous button
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
    
    // Setup next button
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
    
    // Touch start event
    const touchStartListener = this.handleTouchStart.bind(this);
    this.sliderContainer.addEventListener('touchstart', touchStartListener, { passive: true });
    
    // Touch move event
    const touchMoveListener = this.handleTouchMove.bind(this);
    this.sliderContainer.addEventListener('touchmove', touchMoveListener, { passive: false });
    
    // Touch end event
    const touchEndListener = this.handleTouchEnd.bind(this);
    this.sliderContainer.addEventListener('touchend', touchEndListener, { passive: true });
    
    // Scroll event
    const scrollListener = () => {
      if (this.isSwiping) {
        this.isSwiping = false;
        this.resetSliderPosition();
      }
    };
    
    document.addEventListener('scroll', scrollListener, { passive: true });
    
    // Store cleanup functions
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
    // Only handle if slider is visible
    if (!this.isVisible) return;
    
    // Capture initial touch position
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
    this.touchDelta = 0;
    
    // Start swipe state
    this.isSwiping = true;
    
    // Stop auto-rotation during manual interaction
    this.ngZone.run(() => {
      this.stopAutoSlide();
    });
  }
  
  handleTouchMove(e: TouchEvent): void {
    if (!this.isSwiping || !this.isVisible || !this.sliderWrapper) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    // Calculate differences in X and Y
    const diffX = currentX - this.touchStartX;
    const diffY = currentY - this.touchStartY;
    
    // If vertical movement is greater than horizontal, it's probably a scroll
    if (Math.abs(diffY) > Math.abs(diffX) * 1.5) {
      this.isSwiping = false;
      this.resetSliderPosition();
      return;
    }
    
    // Prevent scroll during horizontal swipe
    e.preventDefault();
    
    // Update delta for tracking
    this.touchDelta = diffX;
    
    // Calculate swipe progress (0 to 1)
    this.swipeProgress = this.touchDelta / this.containerWidth;
    
    // Base percentage of current position
    const slideOffset = -this.currentSlide * 100;
    // Drag offset in percentage
    const dragOffset = (this.touchDelta / this.containerWidth) * 100;
    
    // Apply resistance at edges
    let finalOffset = slideOffset + dragOffset;
    if ((this.currentSlide === 0 && dragOffset > 0) || 
        (this.currentSlide === this.totalSlides - 1 && dragOffset < 0)) {
      finalOffset = slideOffset + (dragOffset * 0.3); // 30% resistance
    }
    
    // Apply transform with hardware acceleration
    this.renderer.setStyle(
      this.sliderWrapper, 
      'transform', 
      `translate3d(${finalOffset}%, 0, 0)`
    );
  }
  
  handleTouchEnd(e: TouchEvent): void {
    if (!this.isSwiping || !this.isVisible) return;
    
    this.touchEndX = e.changedTouches[0].clientX;
    this.touchEndY = e.changedTouches[0].clientY;
    
    // Calculate final swipe distance
    const swipeDistance = this.touchEndX - this.touchStartX;
    
    // Decide whether to change slide or return to original position
    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      // If swipe is greater than 15% of width, or is fast (minimum distance), change slide
      if (Math.abs(swipeDistance) > this.containerWidth * 0.15) {
        this.ngZone.run(() => {
          if (swipeDistance > 0) {
            this.prevSlide();
          } else {
            this.nextSlide();
          }
        });
      } else {
        // Return to original position with animation
        this.resetSliderPosition();
      }
    } else {
      // Insufficient swipe, return to original position
      this.resetSliderPosition();
    }
    
    // End swipe state
    this.isSwiping = false;
    this.touchDelta = 0;
    
    // Restart auto-rotation if slider is visible
    if (this.isVisible) {
      this.ngZone.run(() => {
        this.startAutoSlide();
      });
    }
  }
  
  resetSliderPosition(): void {
    if (!this.sliderWrapper) return;
    
    // Apply animation back to original position
    this.renderer.setStyle(this.sliderWrapper, 'transition', 'transform 300ms ease-out');
    this.renderer.setStyle(
      this.sliderWrapper, 
      'transform', 
      `translate3d(-${this.currentSlide * 100}%, 0, 0)`
    );
    
    // Restore original transition after animation
    setTimeout(() => {
      if (this.sliderWrapper) {
        this.renderer.setStyle(this.sliderWrapper, 'transition', 'transform 500ms ease-in-out');
      }
    }, 300);
  }
  
  startAutoSlide(): void {
    // Only start auto-slide if slider is visible and no interval is already running
    if (this.isVisible && !this.autoSlideInterval) {
      // Auto-slide every 15 seconds
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
    
    // Use translate3d for hardware acceleration
    this.renderer.setStyle(
      this.sliderWrapper, 
      'transform', 
      `translate3d(-${this.currentSlide * 100}%, 0, 0)`
    );
    
    // Update the active dot
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
    // Only change slides if the slider is visible
    if (!this.isVisible) return;
    
    // Reset auto-slide timer when manually changing slides
    this.stopAutoSlide();
    
    this.currentSlide = index;
    this.updateSliderPosition();
    
    // Restart auto-slide if slider is visible
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
    
    // Set initial position
    this.updateMiniSliderPosition();
  }
  
  setupMiniSliderControls(): void {
    // Setup previous button for mini-slider
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
    
    // Setup next button for mini-slider
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
    
    // Setup indicators for mini-slider
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
    
    // Setup mouse/touch events on mini-slider container
    if (this.miniSliderContainerRef?.nativeElement) {
      const miniContainer = this.miniSliderContainerRef.nativeElement;
      
      // Mouse enter - stop auto-rotation
      const mouseEnterListener = () => {
        this.stopMiniSliderAutoSlide();
      };
      miniContainer.addEventListener('mouseenter', mouseEnterListener);
      
      // Mouse leave - resume auto-rotation
      const mouseLeaveListener = () => {
        this.startMiniSliderAutoSlide();
      };
      miniContainer.addEventListener('mouseleave', mouseLeaveListener);
      
      // Touch start - stop auto-rotation
      const touchStartListener = () => {
        this.stopMiniSliderAutoSlide();
      };
      miniContainer.addEventListener('touchstart', touchStartListener, { passive: true });
      
      // Touch end - resume auto-rotation
      const touchEndListener = () => {
        this.startMiniSliderAutoSlide();
      };
      miniContainer.addEventListener('touchend', touchEndListener, { passive: true });
      
      // Store cleanup functions
      this.cleanupFunctions.push(() => {
        miniContainer.removeEventListener('mouseenter', mouseEnterListener);
        miniContainer.removeEventListener('mouseleave', mouseLeaveListener);
        miniContainer.removeEventListener('touchstart', touchStartListener);
        miniContainer.removeEventListener('touchend', touchEndListener);
      });
    }
  }
  
  startMiniSliderAutoSlide(): void {
    // Only start auto-rotation if no interval is already running
    if (!this.miniSliderInterval) {
      this.miniSliderInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.nextMiniSlide();
        });
      }, 5000); // Rotate every 5 seconds
    }
  }
  
  stopMiniSliderAutoSlide(): void {
    if (this.miniSliderInterval) {
      clearInterval(this.miniSliderInterval);
      this.miniSliderInterval = null;
    }
  }
  
  goToMiniSlide(index: number): void {
    // Reset interval when clicked manually
    this.stopMiniSliderAutoSlide();
    
    this.currentMiniSlide = index;
    this.updateMiniSliderPosition();
    
    // Restart auto-rotation
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
    
    // Use translate3d for hardware acceleration
    this.renderer.setStyle(
      this.miniSliderTrack, 
      'transform', 
      `translate3d(-${this.currentMiniSlide * 100}%, 0, 0)`
    );
    
    // Update indicators
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