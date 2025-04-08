import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '*',
        opacity: 1,
        transform: 'scaleY(1)',
        transformOrigin: 'top'
      })),
      state('closed', style({
        height: '0px',
        opacity: 0,
        transform: 'scaleY(0)',
        transformOrigin: 'top'
      })),
      transition('closed <=> open', [
        animate('350ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ])
  ]
})
export class FAQComponent {
  selectedCategory: string | null = null;
  
  faqs: FaqItem[] = [
    {
      category: 'Cursos',
      question: '¿Puedo inscribirme si soy principiante?',
      answer: 'Absolutamente. Ofrecemos cursos para todos los niveles:\n• Clases para principiantes\n• Grupos divididos por nivel de experiencia\n• Atención personalizada\n• Ambiente de aprendizaje inclusivo y motivador',
      isOpen: false
    },
    {
      category: 'Cursos',
      question: '¿Qué técnicas y estilos se enseñan?',
      answer: 'Cubrimos una amplia gama de técnicas:\n• Dibujo al carboncillo\n• Acuarela\n• Acrílico\n• Ilustración digital\n• Técnicas de concept art\n• Dibujo de figura humana\n• Paisaje y naturaleza muerta\n• Diseño gráfico\n• Animación',
      isOpen: false
    },
    {
      category: 'Horarios',
      question: '¿Tienen opciones de horario flexible?',
      answer: 'Diseñamos horarios para adaptarnos a diferentes necesidades:\n• Clases matutinas\n• Clases vespertinas\n• Grupos sabatinos\n• Cursos intensivos\n• Opciones de medio tiempo\n• Clases en línea y presenciales',
      isOpen: false
    },
    {
      category: 'Materiales',
      question: '¿Qué materiales necesito para empezar?',
      answer: 'Dependiendo del curso, te recomendamos:\n• Lápices de dibujo\n• Bloc de dibujo\n• Pinceles\n• Acuarelas o acrílicos\n• Tableta gráfica (para cursos digitales)\nPuedes consultar el listado específico con cada instructor al iniciar el curso.',
      isOpen: false
    },
    {
      category: 'Beneficios',
      question: '¿Obtendré alguna certificación?',
      answer: 'Todos nuestros programas están avalados por la Secretaría de Educación Pública (SEP):\n• Certificado oficial al concluir estudios\n• Reconocimiento en el ámbito educativo y profesional\n• Respaldo para continuar estudios superiores\n• Válido para bolsa de trabajo',
      isOpen: false
    },
    {
      category: 'Beneficios',
      question: '¿Me ayudarán a desarrollar mi portafolio?',
      answer: 'Trabajamos intensamente en tu desarrollo profesional:\n• Asesoría para crear portafolio\n• Exposiciones trimestrales de estudiantes\n• Vinculación con profesionales del arte\n• Consejos para presentación digital\n• Preparación para el mercado laboral',
      isOpen: false
    },
    {
      category: 'Información',
      question: '¿Puedo visitar la escuela antes de inscribirme?',
      answer: 'Claro que sí, te invitamos a:\n• Agendar tour guiado\n• Asistir a exposiciones de estudiantes\n• Participar en talleres demostrativos\n• Conocer nuestras instalaciones\n• Hablar con instructores y estudiantes actuales',
      isOpen: false
    },
    {
      category: 'Información',
      question: '¿Cómo me puedo inscribir?',
      answer: 'El proceso es muy sencillo:\n• Llámanos\n• Visítanos en nuestras instalaciones\n• Envía un correo electrónico\n• Completa formulario en línea\n• Agenda una cita informativa\nNuestro equipo te guiará en cada paso del proceso.',
      isOpen: false
    }
  ];

  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }

  filterByCategory(category: string | null): void {
    this.selectedCategory = category;
  }

  getFilteredFaqs(): FaqItem[] {
    return this.selectedCategory 
      ? this.faqs.filter(faq => faq.category === this.selectedCategory)
      : this.faqs;
  }
}