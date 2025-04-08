import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso, getCursoBySlug } from '../cursos';
import { CommonModule, NgIf } from '@angular/common';
@Component({
  selector: 'app-detalle-curso',
  templateUrl: './detalle-curso.component.html',
  styleUrls: ['./detalle-curso.component.css'],
  standalone: true,
  imports: [CommonModule, NgIf],
})
export class DetalleCursoComponent implements OnInit {
  curso: Curso | undefined;
  currentSlideIndex = 0;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Obtener el slug del curso desde la URL
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        // Buscar el curso por su slug
        this.curso = getCursoBySlug(slug);
        if (!this.curso) {
          // Si no se encuentra el curso, redirigir a la página principal de cursos
          this.router.navigate(['/OfertaEducativa']);
        }
      }
    });

    // Inicializar el slider después de cargar la vista
    setTimeout(() => {
      this.initSlider();
    }, 500);
  }

  // Método para inicializar el slider
  private initSlider(): void {
    // Configura los listeners para botones prev/next si existen en el DOM
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');

    if (prevButton) {
      prevButton.addEventListener('click', () => this.prevSlide());
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => this.nextSlide());
    }
  }

  // Métodos para controlar el slider de imágenes
  nextSlide(): void {
    if (this.curso?.imagenes) {
      this.currentSlideIndex =
        (this.currentSlideIndex + 1) % this.curso.imagenes.length;
      this.updateSlider();
    }
  }

  prevSlide(): void {
    if (this.curso?.imagenes) {
      this.currentSlideIndex =
        (this.currentSlideIndex - 1 + this.curso.imagenes.length) %
        this.curso.imagenes.length;
      this.updateSlider();
    }
  }

  private updateSlider(): void {
    const slider = document.getElementById('gallerySlider');
    if (slider && this.curso?.imagenes) {
      const translateValue = -this.currentSlideIndex * 100;
      slider.style.transform = `translateX(${translateValue}%)`;
    }
  }

  // Método para abrir modal de inscripción (implementación pendiente)
  abrirModalInscripcion(): void {
    // Aquí iría la lógica para abrir el modal de inscripción
    console.log('Abrir modal de inscripción para:', this.curso?.titulo);
    // Por ejemplo, podrías disparar un evento o cambiar una variable para mostrar un modal
  }
}
