import { Component } from '@angular/core';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  ngOnInit() {
    window.scrollTo(0, 0); // Scroll to the top of the page when the component is initialized
  }
}
