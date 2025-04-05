import { Component } from '@angular/core';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent {
ngOnInit() {
  window.scrollTo(0, 0); // Scroll to the top of the page when the component is initialized
}
}
