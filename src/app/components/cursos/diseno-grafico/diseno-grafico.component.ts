import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-diseno-grafico',
  templateUrl: './diseno-grafico.component.html',
  styleUrl: './diseno-grafico.component.css',
})
export class DisenoGraficoComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    let currentIndex = 0;
    const images = document.querySelectorAll('#gallerySlider img');
    const totalImages = images.length;

    // Función para mover a la siguiente imagen
    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % totalImages;
      const gallerySlider = document.getElementById('gallerySlider');
      if (gallerySlider) {
        gallerySlider.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
    };

    // Función para mover a la imagen anterior
    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + totalImages) % totalImages;
      const gallerySlider = document.getElementById('gallerySlider');
      if (gallerySlider) {
        gallerySlider.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
    };

    // Asegurarse de que los botones existan antes de agregarles los eventos
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    if (prevButton) {
      prevButton.addEventListener('click', prevSlide);
    }
    if (nextButton) {
      nextButton.addEventListener('click', nextSlide);
    }

    // Auto slide
    setInterval(nextSlide, 5000); // Cambia de imagen cada 5 segundos
  }
}
