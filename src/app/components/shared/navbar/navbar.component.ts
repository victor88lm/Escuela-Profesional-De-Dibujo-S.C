import { Component, OnInit, AfterViewInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  public isSidenavOpen = false;
  public useBlueNavbar = false; // Nueva propiedad para controlar el estado del navbar
  @ViewChild('mobileSidenav') mobileSidenav: ElementRef | undefined;
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    // Usar bind para mantener el contexto correcto de this
    this.handleScroll = this.handleScroll.bind(this);
    // Manejador del evento de scroll para el efecto del navbar
    window.addEventListener('scroll', this.handleScroll);
    
    // Suscribirse a los eventos de cambio de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Lista de rutas donde el navbar debe ser azul directamente
      const blueNavbarRoutes = ['/Contactanos', '/Galeria', '/Planteles'];
      
      // Comprobar si la URL actual está en la lista
      this.useBlueNavbar = blueNavbarRoutes.includes(event.url);
      
      // Aplicar inmediatamente el estilo sin esperar al scroll
      this.applyNavbarStyle();
    });
  }
  
  ngAfterViewInit(): void {
    // Aplicar el estilo correcto del navbar después de cargar la vista
    this.applyNavbarStyle();
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
  
  // Nuevo método para aplicar el estilo del navbar
  applyNavbarStyle(): void {
    const navbar = document.querySelector('.navbar-transparent');
    if (navbar) {
      if (this.useBlueNavbar) {
        navbar.classList.add('scrolled');
      } else if (window.scrollY <= 30) {
        navbar.classList.remove('scrolled');
      }
    }
  }
  
  // Efecto de navbar al hacer scroll
  handleScroll(): void {
    const navbar = document.querySelector('.navbar-transparent');
    if (navbar) {
      // Si estamos en una ruta especial, siempre aplicar la clase scrolled
      if (this.useBlueNavbar) {
        navbar.classList.add('scrolled');
      } else {
        // Comportamiento normal para otras rutas
        if (window.scrollY > 30) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
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