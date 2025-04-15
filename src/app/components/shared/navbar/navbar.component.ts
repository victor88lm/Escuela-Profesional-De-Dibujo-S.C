import { Component, OnInit, AfterViewInit, OnDestroy, HostListener, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Improve performance with OnPush strategy
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  public isSidenavOpen = false;
  public useBlueNavbar = false;
  @ViewChild('mobileSidenav') mobileSidenav: ElementRef | undefined;
  
  private destroy$ = new Subject<void>(); // For clean subscription management
  private readonly blueNavbarRoutes = ['/Contactanos', '/Galeria', '/Planteles', '/PreguntasFrecuentes', '/registro'];
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    // Use bound function for scroll handler
    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.handleScroll, { passive: true }); // Passive for performance
    
    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: any) => {
      this.useBlueNavbar = this.blueNavbarRoutes.includes(event.url);
      this.applyNavbarStyle();
    });
  }
  
  ngAfterViewInit(): void {
    this.applyNavbarStyle();
  }
  
  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
    document.body.style.overflow = this.isSidenavOpen ? 'hidden' : '';
  }
  
  private applyNavbarStyle(): void {
    const navbar = document.querySelector('.navbar-transparent');
    if (!navbar) return;
    
    if (this.useBlueNavbar || window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  private handleScroll(): void {
    this.applyNavbarStyle();
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth >= 768 && this.isSidenavOpen) {
      this.toggleSidenav();
    }
  }
  
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
    this.destroy$.next();
    this.destroy$.complete();
  }

  
}