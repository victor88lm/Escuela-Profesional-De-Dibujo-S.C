import { Component } from '@angular/core';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css'
})
export class GaleriaComponent {
  ngOnInit() {
    window.scrollTo(0, 0); // Scroll to the top of the page when the component is initialized
  }
}
