import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private apiUrl =
    'https://epd.edu.mx/Pagina_Principal/Cursos/stripe-checkout.php'; // Actualiza con la URL real de tu backend

  constructor(private http: HttpClient) {}

  /**
   * Crea una sesión de Stripe Checkout
   * @param paymentData Datos del pago
   * @returns Observable con la respuesta del servidor que contiene el ID de sesión
   */
  createCheckoutSession(paymentData: any): Observable<any> {
    return this.http.post(this.apiUrl, paymentData);
  }

  /**
   * Redirige al usuario a la página de Checkout de Stripe
   * @param sessionId ID de la sesión de Checkout
   */
  redirectToCheckout(sessionId: string): void {
    // Cargar la librería de Stripe.js de forma dinámica
    const stripeJs = document.createElement('script');
    stripeJs.src = 'https://js.stripe.com/v3/';
    stripeJs.onload = () => {
      // Inicializar Stripe con tu clave pública
      const stripe = (window as any).Stripe(
        'pk_test_51RByiNPHx1YvSlrKtw9aQkjJOfudXiMh1Rl6Wh0b9OIQ2nplbYDWBRjH6u9uTOFkU8qHBrEOD2ut62P1QnN6r3OF00tCKKHFsH'
      ); // Reemplaza con tu clave pública

      // Redirigir a Checkout usando el ID de sesión
      stripe.redirectToCheckout({ sessionId });
    };
    document.body.appendChild(stripeJs);
  }
}
