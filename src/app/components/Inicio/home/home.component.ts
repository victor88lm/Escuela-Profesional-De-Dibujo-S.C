import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrivacyModalService } from '../../shared/privacy-modal/privacy-modal.service';
import { PrivacyModalComponent } from '../../shared/privacy-modal/privacy-modal.component';
import { ContactService } from '../../../services/contact.service';

interface OpcionConocio {
  value: string;
  label: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  formError = false;
  errorMessage = '';

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

  contactForm: FormGroup;
  submitted = false;
  formSuccess = false;
  messageLength = 0;
  
  // Opciones para el campo "¿Cómo nos conociste?"
  opcionesConocio: OpcionConocio[] = [
    { value: 'Redes sociales', label: 'Redes sociales' },
    { value: 'Recomendación', label: 'Recomendación' },
    { value: 'Búsqueda en internet', label: 'Internet' },
    { value: 'Publicidad', label: 'Publicidad' },
    { value: 'Evento o feria', label: 'Evento o feria' },
    { value: 'Otro', label: 'Otro' }
  ];

  @ViewChild(PrivacyModalComponent) privacyModal!: PrivacyModalComponent;

  constructor(
    private formBuilder: FormBuilder, 
    private privacyModalService: PrivacyModalService,
    private contactService: ContactService
  )  {
    this.contactForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      email: ['', [Validators.required, Validators.email]],
      curso: ['', Validators.required],
      conocio: ['', Validators.required],
      mensaje: [''],
      privacidad: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    // Escuchar cambios en el campo de mensaje para actualizar el contador
    this.contactForm.get('mensaje')?.valueChanges.subscribe(value => {
      this.messageLength = value ? value.length : 0;
    });

    // Suscribirse al servicio modal
    this.privacyModalService.openModal$.subscribe(() => {
      this.openPrivacyModal();
    });
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

  // Getter para acceder fácilmente a los controles del formulario
  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.formSuccess = false;
    this.formError = false;

    // Detener si el formulario es inválido
    if (this.contactForm.invalid) {
      return;
    }

    // Enviar el formulario usando el servicio
    this.contactService.enviarFormulario(this.contactForm.value).subscribe(
      response => {
        if (response.status === 'success') {
          this.formSuccess = true;
          this.contactForm.reset();
          
          // Restablecer formulario después de mostrar mensaje de éxito
          setTimeout(() => {
            this.formSuccess = false;
          }, 5000);
        } else {
          this.formError = true;
          this.errorMessage = response.message || 'Hubo un error al enviar el formulario.';
        }
        this.submitted = false;
      },
      error => {
        this.formError = true;
        this.errorMessage = 'Error de conexión. Por favor, intenta nuevamente.';
        this.submitted = false;
        console.error('Error al enviar formulario:', error);
      }
    );
  }

  // Método para verificar si un campo específico tiene errores
  hasError(controlName: string, errorName: string): boolean {
    const control = this.contactForm.get(controlName);
    return !!(control && control.touched && control.hasError(errorName));
  }

  // Método para obtener clases CSS según estado del campo
  getFieldClass(controlName: string): string {
    const control = this.contactForm.get(controlName);
    if (control && control.touched) {
      return control.valid ? 'is-valid' : 'is-invalid';
    }
    return '';
  }

  // Método para actualizar la selección de radio buttons
  updateRadioSelection(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && target.name === 'conocio') {
      this.contactForm.get('conocio')?.setValue(target.value);
    }
  }

  openPrivacyModal(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    
    if (this.privacyModal) {
      this.privacyModal.open();
    } else {
      console.warn('privacyModal no está disponible');
    }
  }
}