import { Component } from '@angular/core';

@Component({
  selector: 'app-planteles',
  templateUrl: './planteles.component.html',
  styleUrl: './planteles.component.css'
})
export class PlantelesComponent {
  ngOnInit() {
    window.scrollTo(0, 0); // Scroll to the top of the page when the component is initialized
  }
}
