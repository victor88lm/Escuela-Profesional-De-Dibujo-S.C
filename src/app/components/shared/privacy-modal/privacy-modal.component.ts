// privacy-modal.component.ts (mejorado)
import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'app-privacy-modal',
  templateUrl: './privacy-modal.component.html',
  styleUrls: ['./privacy-modal.component.scss']
})
export class PrivacyModalComponent implements OnInit {
  @ViewChild('privacyModal') modalElement!: ElementRef;
  isVisible = false;

  constructor() { }

  ngOnInit(): void { }

  open(): void {
    this.isVisible = true;
    document.body.style.overflow = 'hidden'; // Prevenir scroll en el body
    
    // Añadir clase al body para indicar que hay un modal abierto
    document.body.classList.add('modal-open');
  }

  close(event?: MouseEvent): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation(); // Detener la propagación del evento
    }
    
    // Aplicar animación de salida
    const modalContent = this.modalElement.nativeElement.querySelector('div[class*="bg-white"]');
    if (modalContent) {
      modalContent.classList.remove('animate-scale-up');
      modalContent.classList.add('animate-scale-down');
      
      // Esperar a que termine la animación antes de ocultar el modal
      setTimeout(() => {
        this.isVisible = false;
        document.body.style.overflow = ''; // Restaurar scroll en el body
        document.body.classList.remove('modal-open');
      }, 300);
    } else {
      this.isVisible = false;
      document.body.style.overflow = ''; // Restaurar scroll en el body
      document.body.classList.remove('modal-open');
    }
  }

  acceptAndClose(event: MouseEvent): void {
    // Prevenir comportamiento por defecto y propagación
    event.preventDefault();
    event.stopPropagation();
    
    // Buscar el checkbox de privacidad y marcarlo
    const privacyCheckbox = document.getElementById('privacidad') as HTMLInputElement;
    if (privacyCheckbox) {
      privacyCheckbox.checked = true;
    }
    
    // Opcional: Mostrar una animación o efecto visual de confirmación
    const acceptButton = event.currentTarget as HTMLElement;
    if (acceptButton) {
      // Añadir clase temporal para mostrar efecto de confirmación
      acceptButton.classList.add('accepted');
      
      // Esperar un momento para mostrar la animación de confirmación antes de cerrar
      setTimeout(() => {
        this.close();
      }, 400);
    } else {
      this.close();
    }
  }

  // Cerrar modal al hacer clic fuera del contenido
  onBackdropClick(event: MouseEvent): void {
    event.preventDefault();
    if (event.target === this.modalElement.nativeElement) {
      this.close();
    }
  }
  
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: KeyboardEvent): void {
    if (this.isVisible) {
      this.close();
    }
  }
}