import { Component, ElementRef, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public cursos = [
    {
      id: 'dibujo-publicitario',
      titulo: 'Dibujo Publicitario',
      descripcion: 'Especialízate en técnicas de ilustración enfocadas a la publicidad y el marketing visual.',
      imagen: 'img/dibujo-publicitario.jpg',
      color: 'from-blue-500 to-indigo-600',
      botonColor: 'from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600',
      checkColor: 'text-blue-500',
      caracteristicas: [
        'Duración: 6 meses',
        'Certificación oficial',
        'Material incluido'
      ]
    },
    {
      id: 'diseno-grafico',
      titulo: 'Diseño Gráfico',
      descripcion: 'Aprende las herramientas digitales y principios de diseño para crear contenido visual impactante.',
      imagen: 'img/diseno-grafico.jpg',
      color: 'from-purple-500 to-pink-600',
      botonColor: 'from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600',
      checkColor: 'text-purple-500',
      caracteristicas: [
        'Duración: 8 meses',
        'Software profesional',
        'Portafolio final'
      ]
    },
    {
      id: 'talleres-especializados',
      titulo: 'Talleres Especializados',
      descripcion: 'Perfecciona técnicas específicas con nuestros talleres intensivos en diversas disciplinas artísticas.',
      imagen: 'img/talleres-especializados.jpg',
      color: 'from-green-500 to-teal-600',
      botonColor: 'from-green-600 to-green-500 hover:from-green-700 hover:to-green-600',
      checkColor: 'text-green-500',
      caracteristicas: [
        'Duración: Variable',
        'Grupos reducidos',
        'Instructores expertos'
      ]
    },
    {
      id: 'dibujo-infantil',
      titulo: 'Dibujo Infantil',
      descripcion: 'Desarrolla la creatividad y habilidades artísticas de los más pequeños con métodos pedagógicos adaptados.',
      imagen: 'img/dibujo-infantil.jpg',
      color: 'from-yellow-500 to-orange-600',
      botonColor: 'from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600',
      checkColor: 'text-yellow-500',
      caracteristicas: [
        'Edades: 5-12 años',
        'Ambiente lúdico',
        'Material incluido'
      ]
    }
  ];

  // Variables para animaciones
  private animatedItems: Set<HTMLElement> = new Set();

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    // Inicializar evento de scroll para detectar elementos en viewport
    this.checkItemsInViewport();
  }

  /**
   * Listener para el scroll que detecta elementos para animar
   */
  @HostListener('window:scroll', ['$event'])
  checkItemsInViewport(): void {
    const cards = this.elementRef.nativeElement.querySelectorAll('.bg-white.rounded-lg');
    
    cards.forEach((card: HTMLElement) => {
      if (this.isElementInViewport(card) && !this.animatedItems.has(card)) {
        this.animateCard(card);
        this.animatedItems.add(card);
      }
    });
  }

  /**
   * Verifica si un elemento está en el viewport
   * @param el El elemento a verificar
   * @returns boolean
   */
  private isElementInViewport(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    return (
      rect.top <= windowHeight * 0.85 && // El elemento está 85% dentro del viewport
      rect.bottom >= 0
    );
  }

  /**
   * Aplica animación a una tarjeta de curso
   * @param card La tarjeta a animar
   */
  private animateCard(card: HTMLElement): void {
    // Añadir clase para animar entrada
    card.classList.add('animate-fade-up');
    
    // Animar elementos dentro de la tarjeta secuencialmente
    const image = card.querySelector('.relative.h-56');
    const title = card.querySelector('h3');
    const description = card.querySelector('p');
    const list = card.querySelector('ul');
    const button = card.querySelector('a.block');
    
    if (image) setTimeout(() => image.classList.add('animate-fade-in'), 100);
    if (title) setTimeout(() => title.classList.add('animate-fade-in'), 200);
    if (description) setTimeout(() => description.classList.add('animate-fade-in'), 300);
    if (list) setTimeout(() => list.classList.add('animate-fade-in'), 400);
    if (button) setTimeout(() => button.classList.add('animate-fade-in'), 500);
  }

  /**
   * Maneja la redirección a la página de un curso específico
   * @param cursoId ID del curso
   */
  public navegarACurso(cursoId: string): void {
    console.log(`Navegando a la página del curso: ${cursoId}`);
    // Implementa la lógica de navegación, por ejemplo:
    // this.router.navigate(['/curso', cursoId]);
  }
}
