import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class sliderComponent implements OnInit, OnDestroy, AfterViewInit {
  currentSlide: number = 0;
  totalSlides: number = 3;
  autoSlideInterval: any;
  isVisible: boolean = true;
  observer: IntersectionObserver | null = null;
  
  // Touch handling variables
  touchStartX: number = 0;
  touchEndX: number = 0;
  minSwipeDistance: number = 50;
  
  ngOnInit(): void {
    // Set up the slider
    this.setupSlider();
    
    // Setup visibility observer
    this.setupVisibilityObserver();
    
    // Add event listeners for the dots
    this.setupDotControls();
  }
  
  ngAfterViewInit(): void {
    // Set up navigation arrows
    this.setupNavArrows();
    
    // Set up play button functionality
    this.setupPlayButton();
    
    // Set up touch events for mobile swipe
    this.setupTouchEvents();
  }
  
  ngOnDestroy(): void {
    // Clean up the interval when component is destroyed
    this.stopAutoSlide();
    
    // Remove touch event listeners
    this.removeTouchEvents();
    
    // Disconnect the observer when component is destroyed
    if (this.observer) {
      this.observer.disconnect();
    }
  }
  
  setupVisibilityObserver(): void {
    const sliderContainer = document.querySelector('.slider-container');
    
    if (!sliderContainer) return;
    
    // Create new IntersectionObserver
    this.observer = new IntersectionObserver((entries) => {
      // We're only observing one element, so we can use entries[0]
      const entry = entries[0];
      
      // Update visibility status
      this.isVisible = entry.isIntersecting;
      
      // Start or stop auto-slide based on visibility
      if (this.isVisible) {
        this.startAutoSlide();
      } else {
        this.stopAutoSlide();
      }
    }, {
      // Consider element visible when at least 20% is in viewport
      threshold: 0.2
    });
    
    // Start observing the slider container
    this.observer.observe(sliderContainer);
  }
  
  setupSlider(): void {
    // Get slider wrapper
    const sliderWrapper = document.querySelector('.slider-wrapper') as HTMLElement;
    
    // Set initial position
    this.updateSliderPosition();
  }
  
  setupDotControls(): void {
    const dots = document.querySelectorAll('.slider-dot');
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.goToSlide(index);
      });
    });
  }
  
  setupNavArrows(): void {
    const prevButton = document.querySelector('.nav-prev');
    const nextButton = document.querySelector('.nav-next');
    
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        this.prevSlide();
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        this.nextSlide();
      });
    }
  }
  
  setupPlayButton(): void {
    const playButton = document.querySelector('.play-button');
    
    if (playButton) {
      playButton.addEventListener('click', () => {
        const videoThumbnail = playButton.parentElement;
        const videoElement = videoThumbnail?.querySelector('.video-element') as HTMLVideoElement;
        
        if (videoElement) {
          // Hide thumbnail and play button, show video
          playButton.classList.add('hidden');
          videoElement.classList.remove('hidden');
          
          // Start playing the video
          videoElement.play();
        }
      });
    }
  }
  
  setupTouchEvents(): void {
    const sliderElement = document.querySelector('.slider-container');
    
    if (sliderElement) {
      // Touch start event
      sliderElement.addEventListener('touchstart', (e: Event) => {
        const touchEvent = e as TouchEvent;
        this.touchStartX = touchEvent.changedTouches[0].screenX;
      }, { passive: true });
      
      // Touch end event
      sliderElement.addEventListener('touchend', (e) => {
        const touchEvent = e as TouchEvent;
        this.touchEndX = touchEvent.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });
    }
  }
  
  removeTouchEvents(): void {
    const sliderElement = document.querySelector('.slider-container');
    
    if (sliderElement) {
      sliderElement.removeEventListener('touchstart', () => {});
      sliderElement.removeEventListener('touchend', () => {});
    }
  }
  
  handleSwipe(): void {
    // Only handle swipe if the slider is visible
    if (!this.isVisible) return;
    
    // Calculate swipe distance
    const swipeDistance = this.touchEndX - this.touchStartX;
    
    // Reset auto-slide timer when manually swiping
    this.stopAutoSlide();
    
    // Determine swipe direction if distance is greater than minimum
    if (Math.abs(swipeDistance) > this.minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped right - go to previous slide
        this.prevSlide();
      } else {
        // Swiped left - go to next slide
        this.nextSlide();
      }
    }
    
    // Restart auto-slide only if the slider is visible
    if (this.isVisible) {
      this.startAutoSlide();
    }
  }
  
  startAutoSlide(): void {
    // Only start auto-slide if slider is visible and no interval is already running
    if (this.isVisible && !this.autoSlideInterval) {
      // Auto-slide every 10 seconds (as in your updated code)
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
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
    const sliderWrapper = document.querySelector('.slider-wrapper') as HTMLElement;
    if (sliderWrapper) {
      sliderWrapper.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
    
    // Update the active dot
    this.updateActiveDot();
  }
  
  updateActiveDot(): void {
    const dots = document.querySelectorAll('.slider-dot');
    
    dots.forEach((dot, index) => {
      if (index === this.currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
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
}