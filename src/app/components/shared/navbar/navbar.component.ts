import { Component, OnInit, AfterViewInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  public isSidenavOpen = false;
  @ViewChild('mobileSidenav') mobileSidenav: ElementRef | undefined;
  
  constructor() {}
  
  ngOnInit(): void {
    // Usar bind para mantener el contexto correcto de this
    this.handleScroll = this.handleScroll.bind(this);
    // Manejador del evento de scroll para el efecto del navbar
    window.addEventListener('scroll', this.handleScroll);
  }
  
  ngAfterViewInit(): void {
  }
  
  // Toggle del sidenav para móviles
  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
    
    // Evitar scroll cuando el sidenav está abierto
    if (this.isSidenavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      
      // Darle tiempo a la animación antes de ocultar completamente
      setTimeout(() => {
        if (!this.isSidenavOpen) {
          // Asegurar que esté oculto después de la animación
          console.log('Sidenav completamente cerrado');
        }
      }, 300); // Mismo tiempo que la duración de la transición
    }
  }
  
  // Efecto de navbar al hacer scroll
  handleScroll(): void {
    const navbar = document.querySelector('.navbar-transparent');
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }
  
  // Cerrar el sidenav al cambiar de tamaño de ventana
  @HostListener('window:resize', ['$event'])
  onResize() {
    // Si la pantalla es lo suficientemente grande y el sidenav está abierto, cerrarlo
    if (window.innerWidth >= 768 && this.isSidenavOpen) {
      this.toggleSidenav();
    }
  }
  
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }
}