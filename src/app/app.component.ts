import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'EPD';

  constructor(private router: Router) {}

  ngOnInit() {
    this.showLoopMotionConsoleLog();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  showLoopMotionConsoleLog() {
    // Create an image element to load the logo
    const img = new Image();

    // Set up the onload event to log the image to console
    img.onload = () => {
      // Create a canvas to resize the image if needed
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set a max width for console display (adjust as needed)
      const maxWidth = 400;
      const scaleFactor = maxWidth / img.width;

      canvas.width = Math.min(img.width * scaleFactor, maxWidth);
      canvas.height = img.height * scaleFactor;

      // Draw the scaled image on the canvas
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        console.error('Failed to get 2D context for canvas.');
      }

      // Convert to data URL and log to console
      const resizedDataUrl = canvas.toDataURL('image/png');

      console.log(
        '%c ',
        `font-size: 0px; 
         background: url("${resizedDataUrl}") no-repeat; 
         background-size: contain; 
         padding-left: ${canvas.width}px; 
         padding-top: ${canvas.height}px; 
         display: block;`
      );

      console.log(
        '%c◈ LoopMotion Digital Solutions ◈\n' +
          '🌐 Desarrolladores de: epd.edu.mx\n' +
          '📞 Contacto: contacto@loopmotion.tech\n' +
          '🌍 Web: www.loopmotion.tech\n' +
          '✔ Innovación y Tecnología en Cada Proyecto',
        `background: linear-gradient(135deg, #007bff, #0056b3); 
         color: white; 
         padding: 20px; 
         font-size: 14px; 
         font-weight: bold; 
         border-radius: 15px; 
         line-height: 1.6; 
         text-align: center; 
         display: block; 
         width: auto; 
         margin: 10px 0;
         box-shadow: 0 8px 16px rgba(0,0,0,0.2);
         border: 2px solid rgba(255,255,255,0.3);`
      );
    };

    // Set the source to your logo
    img.src = 'img/LoopMotion.avif';
  }
}
