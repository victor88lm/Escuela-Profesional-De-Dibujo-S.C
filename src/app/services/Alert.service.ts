import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

interface AlertConfig {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  icon?: string;
  buttonText?: string;
  logoPath?: string;
  subtitle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  // Logo por defecto
  private readonly defaultLogo = 'img/favicon.png';

  // Configuraciones artísticas ultra premium con elementos visuales de lujo
  private readonly alertConfigs: Record<'success' | 'error' | 'warning' | 'info', { 
    background: string; 
    confirmColor: string; 
    titleColor: string; 
    messageColor: string;
    borderColor: string;
    glowColor: string;
    shadowColor: string;
    iconName: string;
    particleColor: string;
    ribbonColor: string;
    artworkGenerator: () => string; 
  }> = {
    success: {
      background: 'linear-gradient(135deg, #efffef 0%, #d7f8d7 50%, #efffef 100%)',
      confirmColor: '#28a745',
      titleColor: '#0d6831',
      messageColor: '#2e7d32',
      borderColor: '#86e297',
      glowColor: 'rgba(40, 167, 69, 0.6)',
      shadowColor: 'rgba(40, 167, 69, 0.15)',
      iconName: 'check-circle',
      particleColor: '#28a745',
      ribbonColor: '#28a745',
      artworkGenerator: () => `
        <div class="absolute inset-0 overflow-hidden">
          <svg viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice" class="absolute w-full h-full opacity-10">
            <defs>
              <filter id="glow-success">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="grad-success" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#28a745;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#5fd676;stop-opacity:1" />
              </linearGradient>
            </defs>
            <path fill="url(#grad-success)" d="M488.5,311.5Q469,373,415.5,409.5Q362,446,297.5,466.5Q233,487,171.5,458.5Q110,430,73.5,373.5Q37,317,36,245.5Q35,174,76.5,115.5Q118,57,183.5,42Q249,27,312.5,45.5Q376,64,421.5,115.5Q467,167,487.5,208.5Q508,250,488.5,311.5Z" transform="translate(0, 0)" filter="url(#glow-success)">
              <animateTransform attributeName="transform" type="rotate" from="0 250 250" to="360 250 250" dur="60s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
      `
    },
    error: {
      background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 50%, #fff5f5 100%)',
      confirmColor: '#dc3545',
      titleColor: '#841c26',
      messageColor: '#c62828',
      borderColor: '#f5aaaf',
      glowColor: 'rgba(220, 53, 69, 0.6)',
      shadowColor: 'rgba(220, 53, 69, 0.15)',
      iconName: 'times-circle',
      particleColor: '#dc3545',
      ribbonColor: '#dc3545',
      artworkGenerator: () => `
        <div class="absolute inset-0 overflow-hidden">
          <svg viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice" class="absolute w-full h-full opacity-10">
            <defs>
              <filter id="glow-error">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="grad-error" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#dc3545;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#e75f6b;stop-opacity:1" />
              </linearGradient>
            </defs>
            <path fill="url(#grad-error)" d="M467,311.5Q446,373,394.5,414Q343,455,277,462.5Q211,470,155,438.5Q99,407,57.5,353Q16,299,31.5,241Q47,183,80,129Q113,75,180,53.5Q247,32,307,62Q367,92,401.5,147.5Q436,203,462,226.5Q488,250,467,311.5Z" transform="translate(0, 0)" filter="url(#glow-error)">
              <animateTransform attributeName="transform" type="rotate" from="0 250 250" to="360 250 250" dur="60s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
      `
    },
    warning: {
      background: 'linear-gradient(135deg, #fffbf0 0%, #fef3c7 50%, #fffbf0 100%)',
      confirmColor: '#ff9800',
      titleColor: '#854d0e',
      messageColor: '#b45309',
      borderColor: '#fcd34d',
      glowColor: 'rgba(255, 152, 0, 0.6)',
      shadowColor: 'rgba(255, 152, 0, 0.15)',
      iconName: 'exclamation-triangle',
      particleColor: '#ff9800',
      ribbonColor: '#ff9800',
      artworkGenerator: () => `
        <div class="absolute inset-0 overflow-hidden">
          <svg viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice" class="absolute w-full h-full opacity-10">
            <defs>
              <filter id="glow-warning">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="grad-warning" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ff9800;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ffb74d;stop-opacity:1" />
              </linearGradient>
            </defs>
            <path fill="url(#grad-warning)" d="M490.5,305.5Q446,361,401,403Q356,445,292,461Q228,477,170,444.5Q112,412,77,360Q42,308,24.5,237.5Q7,167,61,116.5Q115,66,181.5,49Q248,32,310,57.5Q372,83,423.5,126.5Q475,170,505,210Q535,250,490.5,305.5Z" transform="translate(0, 0)" filter="url(#glow-warning)">
              <animateTransform attributeName="transform" type="rotate" from="0 250 250" to="360 250 250" dur="60s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
      `
    },
    info: {
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)',
      confirmColor: '#0ea5e9',
      titleColor: '#075985',
      messageColor: '#0369a1',
      borderColor: '#7dd3fc',
      glowColor: 'rgba(14, 165, 233, 0.6)',
      shadowColor: 'rgba(14, 165, 233, 0.15)',
      iconName: 'info-circle',
      particleColor: '#0ea5e9',
      ribbonColor: '#0ea5e9',
      artworkGenerator: () => `
        <div class="absolute inset-0 overflow-hidden">
          <svg viewBox="0 0 500 500" preserveAspectRatio="xMidYMid slice" class="absolute w-full h-full opacity-10">
            <defs>
              <filter id="glow-info">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="grad-info" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#38bdf8;stop-opacity:1" />
              </linearGradient>
            </defs>
            <path fill="url(#grad-info)" d="M457.5,306.5Q438,363,395.5,409Q353,455,286,466Q219,477,163,442.5Q107,408,69,352Q31,296,25.5,233Q20,170,68,124Q116,78,177,49Q238,20,303.5,46Q369,72,409,122Q449,172,463,211Q477,250,457.5,306.5Z" transform="translate(0, 0)" filter="url(#glow-info)">
              <animateTransform attributeName="transform" type="rotate" from="0 250 250" to="360 250 250" dur="60s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
      `
    }
  };

  // Método para obtener configuración de alerta de éxito
  getSuccessConfig(message: string): Partial<SweetAlertOptions> {
    return this.getAlertConfig({
      title: '¡Mensaje enviado con éxito!',
      message,
      type: 'success',
      buttonText: 'Continuar',
      subtitle: 'Nos pondremos en contacto contigo lo antes posible'
    });
  }

  // Método para obtener configuración de alerta de error
  getErrorConfig(message: string): Partial<SweetAlertOptions> {
    return this.getAlertConfig({
      title: 'Error al enviar el mensaje',
      message,
      type: 'error',
      buttonText: 'Entendido',
      subtitle: 'Por favor, inténtalo de nuevo más tarde'
    });
  }

  // Método unificado para obtener configuración
  private getAlertConfig(config: AlertConfig): Partial<SweetAlertOptions> {
    const typeConfig = this.alertConfigs[config.type];
    
    return {
      html: this.createAlertHTML(config),
      background: typeConfig.background,
      confirmButtonText: config.buttonText || 'Continuar',
      confirmButtonColor: typeConfig.confirmColor,
      backdrop: `rgba(0,0,0,0.3)`,
      customClass: {
        popup: 'rounded-2xl shadow-2xl border-0 overflow-hidden animate__animated animate__fadeInUp',
        htmlContainer: 'p-0',
        confirmButton: 'rounded-full text-base px-8 py-2 font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg'
      },
      width: '460px', // Reducido para un diseño más compacto
      padding: 0, // Sin padding para control total del diseño interno
      timer: config.type === 'error' ? undefined : 6000,
      timerProgressBar: config.type !== 'error',
      showConfirmButton: true,
      heightAuto: false,
      showCloseButton: true,
      didRender: this.addAnimations.bind(this)
    };
  }

  // Método para crear contenido HTML de la alerta con diseño ultra premium pero compacto
  private createAlertHTML(config: AlertConfig): string {
    const typeConfig = this.alertConfigs[config.type];
    const logoPath = config.icon || this.defaultLogo;
    const subtitle = config.subtitle || 'Nos pondremos en contacto contigo lo antes posible';

    return `
      <div class="relative overflow-hidden text-center">
        <!-- Fondo decorativo animado -->
        ${typeConfig.artworkGenerator()}
        
        <!-- Cinta decorativa en la parte superior -->
        <div class="absolute top-0 left-0 w-full h-1" style="background: ${typeConfig.ribbonColor};"></div>
        
        <!-- Área de contenido principal -->
        <div class="relative pt-10 pb-8 px-5">
          <!-- Logo en círculo con efecto de lujo -->
          <div class="flex justify-center items-center mb-5">
            <div class="relative">
              <!-- Círculo pulsante alrededor del logo -->
              <div class="absolute inset-0 w-full h-full rounded-full pulse-circle"
                   style="background: ${typeConfig.glowColor};"></div>
              
              <!-- Contenedor principal del logo -->
              <div class="relative w-24 h-24 rounded-full flex items-center justify-center logo-container z-10"
                   style="background: ${typeConfig.confirmColor}; box-shadow: 0 8px 25px -5px ${typeConfig.glowColor}, inset 0 0 15px rgba(255,255,255,0.3);">
                <!-- Logo de la empresa -->
                <div class="relative w-18 h-18 overflow-hidden rounded-full logo-inner flex items-center justify-center">
                  <img src="${logoPath}" alt="Logo" class="w-16 h-16 object-contain transform hover:scale-110 transition-all duration-500" />
                </div>
                
                <!-- Icono de estado superpuesto -->
                <div class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center status-badge"
                     style="background: white; box-shadow: 0 3px 8px ${typeConfig.shadowColor};">
                  <i class="fas fa-${typeConfig.iconName}" style="color: ${typeConfig.confirmColor}; font-size: 14px;"></i>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Panel de cristal que contiene el mensaje -->
          <div class="backdrop-filter backdrop-blur-sm bg-white bg-opacity-60 rounded-xl p-5 shadow-lg"
               style="box-shadow: 0 8px 20px ${typeConfig.shadowColor}, inset 0 0 0 1px rgba(255,255,255,0.5);">
            <!-- Título con decoración -->
            <div class="relative mb-3">
              <h2 
                class="font-bold text-2xl mb-2 tracking-tight leading-tight"
                style="color: ${typeConfig.titleColor}; 
                       text-shadow: 0px 1px 2px rgba(0,0,0,0.05);"
              >
                ${config.title}
              </h2>
              <div class="w-12 h-1 mx-auto rounded-full" style="background: ${typeConfig.confirmColor};"></div>
            </div>
            
            <!-- Mensaje principal -->
            <p 
              class="text-lg mb-3 leading-relaxed"
              style="color: ${typeConfig.messageColor};"
            >
              ${config.message}
            </p>
            
            <!-- Subtítulo o mensaje secundario -->
            <div class="flex items-center justify-center text-xs opacity-70 mt-2 transition-opacity duration-300 hover:opacity-100"
                 style="color: ${typeConfig.messageColor};">
              <i class="fas fa-info-circle text-xs mr-1"></i>
              <p class="italic">${subtitle}</p>
            </div>
          </div>
        </div>
        
        <!-- Elementos decorativos flotantes (versión reducida) -->
        <div class="floating-elements">
          <div class="floating-dot" style="top: 15%; left: 10%; background: ${typeConfig.confirmColor};"></div>
          <div class="floating-dot" style="top: 80%; left: 8%; background: ${typeConfig.confirmColor};"></div>
          <div class="floating-dot" style="top: 30%; right: 12%; background: ${typeConfig.confirmColor};"></div>
          <div class="floating-dot" style="top: 70%; right: 8%; background: ${typeConfig.confirmColor};"></div>
        </div>
      </div>
      
      <style>
        /* Estilos base optimizados */
        .swal2-popup {
          overflow: visible !important;
        }
        
        /* Animación para el logo */
        .logo-container {
          transition: transform 0.5s, box-shadow 0.5s;
        }
        
        .logo-container:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px -5px ${typeConfig.glowColor}, inset 0 0 20px rgba(255,255,255,0.4);
        }
        
        .logo-inner {
          position: relative;
          overflow: hidden;
          transition: all 0.5s;
          background-color: white;
          border: 2px solid rgba(255,255,255,0.7);
        }
        
        .logo-inner:after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(45deg);
          animation: shine 4s infinite;
        }
        
        /* Círculo pulsante más sutil */
        .pulse-circle {
          opacity: 0;
          animation: pulse-out 3s infinite;
        }
        
        @keyframes pulse-out {
          0% { transform: scale(0.8); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0; }
          100% { transform: scale(0.8); opacity: 0; }
        }
        
        /* Elementos flotantes decorativos más pequeños */
        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }
        
        .floating-dot {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          opacity: 0.4;
          filter: blur(1px);
          animation: float 8s ease-in-out infinite;
        }
        
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-6px) translateX(3px); }
          50% { transform: translateY(0) translateX(6px); }
          75% { transform: translateY(6px) translateX(3px); }
          100% { transform: translateY(0) translateX(0); }
        }
        
        @keyframes shine {
          0% { transform: rotate(45deg) translateY(-100%); }
          10% { transform: rotate(45deg) translateY(100%); }
          100% { transform: rotate(45deg) translateY(100%); }
        }
        
        /* Efectos de hover para el botón */
        .swal2-confirm {
          position: relative;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        
        .swal2-confirm:after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(45deg);
          transition: all 0.5s;
          opacity: 0;
        }
        
        .swal2-confirm:hover:after {
          opacity: 1;
          animation: button-shine 1s forwards;
        }
        
        @keyframes button-shine {
          0% { transform: rotate(45deg) translateY(-100%); }
          100% { transform: rotate(45deg) translateY(100%); }
        }
        
        /* Mejora para la insignia de estado */
        .status-badge {
          transition: transform 0.3s, box-shadow 0.3s;
          animation: badge-pulse 2s infinite;
        }
        
        @keyframes badge-pulse {
          0% { transform: scale(1); box-shadow: 0 3px 8px ${typeConfig.shadowColor}; }
          50% { transform: scale(1.1); box-shadow: 0 3px 12px ${typeConfig.glowColor}; }
          100% { transform: scale(1); box-shadow: 0 3px 8px ${typeConfig.shadowColor}; }
        }
      </style>
    `;
  }

  // Método para añadir animaciones optimizadas
  private addAnimations(popup: HTMLElement): void {
    // Configurar efectos visuales según el tipo de alerta
    const alertIcon = popup.querySelector('.fa-check-circle, .fa-times-circle, .fa-exclamation-triangle, .fa-info-circle');
    
    if (alertIcon) {
      let type: 'success' | 'error' | 'warning' | 'info';
      
      if (alertIcon.classList.contains('fa-check-circle')) {
        type = 'success';
      } else if (alertIcon.classList.contains('fa-times-circle')) {
        type = 'error';
      } else if (alertIcon.classList.contains('fa-exclamation-triangle')) {
        type = 'warning';
      } else {
        type = 'info';
      }
      
      const config = this.alertConfigs[type];
      
      // Ajustar la sombra principal del popup
      popup.style.boxShadow = `0 15px 40px -10px ${config.shadowColor}, 0 0 20px ${config.glowColor}`;
      
      // Animar el botón de confirmación
      const confirmButton = popup.querySelector('.swal2-confirm') as HTMLElement;
      if (confirmButton) {
        confirmButton.style.boxShadow = `0 8px 15px -5px ${config.shadowColor}`;
        
        // Efecto hover avanzado
        confirmButton.addEventListener('mouseenter', () => {
          confirmButton.style.boxShadow = `0 12px 20px -5px ${config.glowColor}`;
        });
        
        confirmButton.addEventListener('mouseleave', () => {
          confirmButton.style.boxShadow = `0 8px 15px -5px ${config.shadowColor}`;
        });
      }
    }
  }

  // Método general para mostrar alertas
  show(config: AlertConfig) {
    return Swal.fire(this.getAlertConfig(config) as SweetAlertOptions);
  }

  // Métodos de alerta existentes con mensajes predeterminados
  success(message: string, logoPath?: string) {
    this.show({
      title: '¡Mensaje enviado con éxito!',
      message,
      type: 'success',
      buttonText: 'Continuar',
      icon: logoPath,
      subtitle: 'Nos pondremos en contacto contigo lo antes posible'
    });
  }

  error(message: string, logoPath?: string) {
    this.show({
      title: 'Error al enviar el mensaje',
      message,
      type: 'error',
      buttonText: 'Entendido',
      icon: logoPath,
      subtitle: 'Por favor, inténtalo de nuevo más tarde'
    });
  }

  warning(message: string, logoPath?: string) {
    this.show({
      title: 'Formulario incompleto',
      message,
      type: 'warning',
      buttonText: 'Revisar',
      icon: logoPath,
      subtitle: 'Por favor, completa todos los campos requeridos'
    });
  }

  info(message: string, logoPath?: string) {
    this.show({
      title: 'Información',
      message,
      type: 'info',
      buttonText: 'Entendido',
      icon: logoPath,
      subtitle: 'Información importante para ti'
    });
  }
}