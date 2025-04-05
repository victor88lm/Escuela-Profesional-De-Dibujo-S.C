import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

interface AlertConfig {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  // Configuraciones artísticas detalladas (código anterior se mantiene igual)
  private readonly alertConfigs: Record<'success' | 'error' | 'warning' | 'info', { 
    background: string; 
    confirmColor: string; 
    titleColor: string; 
    messageColor: string; 
    artworkGenerator: () => string; 
  }> = {
    success: {
      background: '#d4edda',
      confirmColor: '#28a745',
      titleColor: '#155724',
      messageColor: '#155724',
      artworkGenerator: () => '<svg>...</svg>' // Replace with actual SVG or artwork
    },
    error: {
      background: '#f8d7da',
      confirmColor: '#dc3545',
      titleColor: '#721c24',
      messageColor: '#721c24',
      artworkGenerator: () => '<svg>...</svg>' // Replace with actual SVG or artwork
    },
    warning: {
      background: '#fff3cd',
      confirmColor: '#ffc107',
      titleColor: '#856404',
      messageColor: '#856404',
      artworkGenerator: () => '<svg>...</svg>' // Replace with actual SVG or artwork
    },
    info: {
      background: '#d1ecf1',
      confirmColor: '#17a2b8',
      titleColor: '#0c5460',
      messageColor: '#0c5460',
      artworkGenerator: () => '<svg>...</svg>' // Replace with actual SVG or artwork
    }
  };

  // Método para obtener configuración de alerta de éxito
  getSuccessConfig(message: string): Partial<SweetAlertOptions> {
    const typeConfig = this.alertConfigs['success'];
    
    return {
      html: this.createAlertHTML({
        title: '¡Mensaje enviado con éxito!',
        message,
        type: 'success'
      }),
      background: typeConfig.background,
      confirmButtonText: 'Continuar',
      confirmButtonColor: typeConfig.confirmColor,
      backdrop: `rgba(0,0,0,0.1)`,
      customClass: {
        popup: 'rounded-3xl shadow-2xl border-4 overflow-hidden',
        htmlContainer: 'p-0',
        confirmButton: 'rounded-lg text-base px-10 py-3 font-semibold hover:opacity-90 transition-opacity mt-4'
      },
      width: '550px',
      timer: 6000,
      timerProgressBar: true,
      showConfirmButton: true,
      heightAuto: false,
      didRender: this.addBackgroundAnimation
    };
  }

  // Método para obtener configuración de alerta de error
  getErrorConfig(message: string): Partial<SweetAlertOptions> {
    const typeConfig = this.alertConfigs['error'];
    
    return {
      html: this.createAlertHTML({
        title: 'Error al enviar el mensaje',
        message,
        type: 'error'
      }),
      background: typeConfig.background,
      confirmButtonText: 'Entendido',
      confirmButtonColor: typeConfig.confirmColor,
      backdrop: `rgba(0,0,0,0.1)`,
      customClass: {
        popup: 'rounded-3xl shadow-2xl border-4 overflow-hidden',
        htmlContainer: 'p-0',
        confirmButton: 'rounded-lg text-base px-10 py-3 font-semibold hover:opacity-90 transition-opacity mt-4'
      },
      width: '550px',
      showConfirmButton: true,
      heightAuto: false,
      didRender: this.addBackgroundAnimation
    };
  }

  // Método para crear contenido HTML de la alerta
  private createAlertHTML(config: AlertConfig): string {
    const typeConfig = this.alertConfigs[config.type];

    return `
      <div class="relative overflow-hidden rounded-3xl p-6 text-center">
        ${typeConfig.artworkGenerator()}
        
        <div class="relative z-10 space-y-4">
          <div class="flex justify-center mb-4 transform transition-transform duration-300 hover:scale-105">
            <img 
              src="${config.icon || 'img/favicon.png'}" 
              alt="Logo Escuela Profesional de Dibujo" 
              class="w-40 h-40 object-contain rounded-full shadow-2xl border-4 border-white"
            >
          </div>
          
          <div class="space-y-4">
            <h2 
              class="font-bold text-3xl mb-3 tracking-tight"
              style="color: ${typeConfig.titleColor}; 
                     text-shadow: 1px 1px 2px rgba(0,0,0,0.1);"
            >
              ${config.title}
            </h2>
            
            <p 
              class="text-xl mb-4 leading-relaxed font-medium"
              style="color: ${typeConfig.messageColor};"
            >
              ${config.message}
            </p>
            
            <p 
              class="text-sm opacity-60 mt-4 italic"
              style="color: ${typeConfig.messageColor};"
            >
              Nos pondremos en contacto contigo lo antes posible
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // Método para añadir animación de fondo
  private addBackgroundAnimation(popup: HTMLElement): void {
    const background = popup.querySelector('svg');
    if (background) {
      background.classList.add('animate-pulse-slow');
    }
  }

  // Métodos de alerta existentes (mantienen su implementación anterior)
  show(config: AlertConfig) {
    const typeConfig = this.alertConfigs[config.type];

    Swal.fire({
      html: this.createAlertHTML(config),
      background: typeConfig.background,
      confirmButtonText: 'Continuar',
      confirmButtonColor: typeConfig.confirmColor,
      backdrop: `rgba(0,0,0,0.1)`,
      customClass: {
        popup: 'rounded-3xl shadow-2xl border-4 overflow-hidden',
        htmlContainer: 'p-0',
        confirmButton: 'rounded-lg text-base px-10 py-3 font-semibold hover:opacity-90 transition-opacity mt-4'
      },
      width: '550px',
      timer: 6000,
      timerProgressBar: true,
      showConfirmButton: true,
      heightAuto: false,
      didRender: this.addBackgroundAnimation
    });
  }

  // Métodos de alerta existentes
  success(message: string) {
    this.show({
      title: '¡Mensaje enviado con éxito!',
      message,
      type: 'success'
    });
  }

  error(message: string) {
    this.show({
      title: 'Error al enviar el mensaje',
      message,
      type: 'error'
    });
  }

  warning(message: string) {
    this.show({
      title: 'Formulario incompleto',
      message,
      type: 'warning'
    });
  }

  info(message: string) {
    this.show({
      title: 'Información',
      message,
      type: 'info'
    });
  }
}