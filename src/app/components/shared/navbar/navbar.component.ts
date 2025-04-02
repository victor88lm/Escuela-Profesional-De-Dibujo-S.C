import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isSidenavOpen = false;
  
  @ViewChild('mobileSidenav', { static: true }) mobileSidenav!: ElementRef;
  
  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
  
  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {
    // Close sidenav when clicking outside if it's open
    if (this.isSidenavOpen && 
        this.mobileSidenav && 
        !this.mobileSidenav.nativeElement.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('#mobile-menu-toggle')) {
      this.isSidenavOpen = false;
    }
  }
}