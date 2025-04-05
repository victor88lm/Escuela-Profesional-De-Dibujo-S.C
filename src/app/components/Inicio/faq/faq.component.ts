import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FAQComponent {
  ngOnInit() {
    window.scrollTo(0, 0); // Scroll to the top of the page when the component is initialized
  }
}
