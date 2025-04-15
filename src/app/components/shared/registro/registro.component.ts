import { Component } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

   ngOnInit() {
  window.scrollTo(0, 0); // Desplazar la página al inicio 
  }
  phoneNumber = '5516555577';
  message = 'Hola, vengo de la página web y me interesa obtener información sobre el preregistro.';
  
  // Método para generar el enlace de WhatsApp
  getWhatsAppLink(): string {
    const encodedMessage = encodeURIComponent(this.message);
    return `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
  }
}
