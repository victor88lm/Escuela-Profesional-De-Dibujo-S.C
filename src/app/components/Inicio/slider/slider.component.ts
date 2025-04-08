import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, NgZone, Renderer2 } from '@angular/core';

interface OrbitalParticle {
  size: 'small' | 'medium' | 'large';
  orbit: number;
  angle: number;
  speed: number;
  direction: 'normal' | 'reverse';
  color: 'teal' | 'blue';
}



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

  currentMiniSlide: number = 0;
  totalMiniSlides: number = 3;
  miniSliderInterval: any;
  
  
  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
    private renderer: Renderer2
  ) {}


  ngOnInit(): void {
    // Set up the slider
    this.setupSlider();
    
    // Setup visibility observer
    this.setupVisibilityObserver();
    
    // Add event listeners for the dots
    this.setupDotControls();

    this.setupMiniSlider();

  }
  
  ngAfterViewInit(): void {
    // Set up navigation arrows
    this.setupNavArrows();
    
    // Set up play button functionality
    this.setupPlayButton();
    
    // Set up touch events for mobile swipe
    this.setupTouchEvents();

    this.createOrbitalParticles();
    this.setupMiniSliderControls();


  }

  private createOrbitalParticles(): void {
    const container = this.el.nativeElement.querySelector('#orbital-particles');
    if (!container) return;
    
    this.ngZone.runOutsideAngular(() => {
      // Crear partículas para cada órbita
      const particleCounts = {
        inner: 8,   // Órbita interna (150px)
        middle: 12, // Órbita media (200px)
        outer: 15   // Órbita externa (250px)
      };
      
      // Generar partículas para cada órbita
      this.generateOrbitalParticles(container, particleCounts.inner, 150);
      this.generateOrbitalParticles(container, particleCounts.middle, 200);
      this.generateOrbitalParticles(container, particleCounts.outer, 250);
    });
  }
  
  private generateOrbitalParticles(container: HTMLElement, count: number, radius: number): void {
    for (let i = 0; i < count; i++) {
      // Distribuir partículas uniformemente en la órbita
      const angle = (i / count) * 360;
      
      // Calcular parámetros de la partícula
      const particle = this.generateParticleConfig(angle, radius);
      
      // Crear y añadir la partícula
      this.createOrbitalParticleElement(container, particle);
    }
  }
  
  private generateParticleConfig(angle: number, orbitRadius: number): OrbitalParticle {
    // Determinar tamaño de la partícula
    const sizeRandom = Math.random();
    let size: 'small' | 'medium' | 'large';
    
    if (sizeRandom < 0.3) {
      size = 'small';
    } else if (sizeRandom < 0.7) {
      size = 'medium';
    } else {
      size = 'large';
    }
    
    // Determinar velocidad y dirección
    const speed = 15 + Math.random() * 20; // Entre 15 y 35 segundos por vuelta
    const direction = Math.random() > 0.5 ? 'normal' : 'reverse';
    
    // Determinar color
    const color = Math.random() > 0.5 ? 'teal' : 'blue';
    
    return {
      size,
      orbit: orbitRadius,
      angle,
      speed,
      direction,
      color
    };
  }
  
  private createOrbitalParticleElement(container: HTMLElement, particle: OrbitalParticle): void {
    const particleElement = this.renderer.createElement('div');
    
    // Aplicar clases
    this.renderer.addClass(particleElement, 'orbital-particle');
    this.renderer.addClass(particleElement, particle.size);
    this.renderer.addClass(particleElement, particle.color);
    
    // Calcular posición central
    const centerX = '50%';
    const centerY = '50%';
    
    // Establecer propiedades de posición
    this.renderer.setStyle(particleElement, 'left', centerX);
    this.renderer.setStyle(particleElement, 'top', centerY);
    this.renderer.setStyle(particleElement, '--orbit-radius', `${particle.orbit}px`);
    
    // Aplicar animación orbital
    const orbitAnimation = particle.direction === 'normal' 
      ? `orbit ${particle.speed}s linear infinite`
      : `orbit-reverse ${particle.speed}s linear infinite`;
    
    // Añadir animación de pulso
    const pulseAnimation = `pulse 2s ease-in-out infinite`;
    
    // Aplicar animaciones
    this.renderer.setStyle(particleElement, 'animation', `${orbitAnimation}, ${pulseAnimation}`);
    
    // Retraso inicial basado en ángulo
    const initialDelay = (particle.angle / 360) * particle.speed;
    this.renderer.setStyle(particleElement, 'animation-delay', `-${initialDelay}s, 0s`);
    
    // Añadir al contenedor
    this.renderer.appendChild(container, particleElement);
  }
  
  ngOnDestroy(): void {
    // Clean up the interval when component is destroyed
    this.stopAutoSlide();
    
    this.stopMiniSliderAutoSlide();


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

  setupMiniSlider(): void {
    // Iniciar auto-rotación del mini-slider
    this.startMiniSliderAutoSlide();
  }
  
  setupMiniSliderControls(): void {
    // Configurar los botones de navegación del mini-slider
    const prevButton = document.querySelector('.mini-slider-control.left');
    const nextButton = document.querySelector('.mini-slider-control.right');
    
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        this.prevMiniSlide();
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        this.nextMiniSlide();
      });
    }
    
    // Configurar los indicadores de posición
    const indicators = document.querySelectorAll('.mini-slider-indicator');
    
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.goToMiniSlide(index);
      });
    });
    
    // Pausar auto-rotación al pasar el ratón por encima
    const miniSliderContainer = document.querySelector('.mini-slider-container');
    
    if (miniSliderContainer) {
      miniSliderContainer.addEventListener('mouseenter', () => {
        this.stopMiniSliderAutoSlide();
      });
      
      miniSliderContainer.addEventListener('mouseleave', () => {
        this.startMiniSliderAutoSlide();
      });
    }
  }
  
  startMiniSliderAutoSlide(): void {
    // Solo iniciar auto-rotación si no hay un intervalo ya en ejecución
    if (!this.miniSliderInterval) {
      this.miniSliderInterval = setInterval(() => {
        this.nextMiniSlide();
      }, 5000); // Rotar cada 5 segundos
    }
  }
  
  stopMiniSliderAutoSlide(): void {
    if (this.miniSliderInterval) {
      clearInterval(this.miniSliderInterval);
      this.miniSliderInterval = null;
    }
  }
  
  goToMiniSlide(index: number): void {
    // Reiniciar el intervalo cuando se hace clic manualmente
    this.stopMiniSliderAutoSlide();
    
    this.currentMiniSlide = index;
    this.updateMiniSliderPosition();
    
    // Reiniciar auto-rotación
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
    // Actualizar la posición del track
    const track = document.getElementById('miniSliderTrack');
    if (track) {
      this.renderer.setStyle(track, 'transform', `translateX(-${this.currentMiniSlide * 100}%)`);
    }
    
    // Actualizar indicadores
    const indicators = document.querySelectorAll('.mini-slider-indicator');
    indicators.forEach((indicator, index) => {
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