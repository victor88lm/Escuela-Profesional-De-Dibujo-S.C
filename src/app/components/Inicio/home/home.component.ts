import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrivacyModalService } from '../../shared/privacy-modal/privacy-modal.service';
import { PrivacyModalComponent } from '../../shared/privacy-modal/privacy-modal.component';
import { ContactService } from '../../../services/contact.service';
import { AlertService } from '../../../services/Alert.service';
import Swal from 'sweetalert2';

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
    private contactService: ContactService,
    private alertService: AlertService // Inject the AlertService
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
      // Mostrar alerta de error de validación
      this.alertService.error(
        'Por favor, completa todos los campos obligatorios correctamente.'
      );
      this.submitted = false; // Añadido para resetear el botón
      return;
    }
  
    // Enviar el formulario usando el servicio
    this.contactService.enviarFormulario(this.contactForm.value).subscribe(
      response => {
        if (response.status === 'success') {
          // Mostrar alerta de éxito personalizada
          Swal.fire({
            ...this.alertService.getSuccessConfig(
              'Tu solicitud ha sido enviada correctamente. Nos pondremos en contacto contigo pronto.'
            ),
            didClose: () => {
              // Resetear estado del formulario cuando se cierra la alerta
              this.submitted = false;
              this.formSuccess = false;
              this.contactForm.reset();
            }
          } as any);
        } else {
          // Mostrar alerta de error
          Swal.fire({
            ...this.alertService.getErrorConfig(
              response.message || 'Hubo un problema al enviar tu solicitud. Por favor, intenta nuevamente.'
            ),
            didClose: () => {
              // Resetear estado del formulario cuando se cierra la alerta
              this.submitted = false;
              this.formError = false;
            }
          } as any);
        }
      },
      error => {
        // Mostrar alerta de error de conexión
        Swal.fire({
          ...this.alertService.getErrorConfig(
            'No se pudo establecer conexión. Por favor, verifica tu conexión a internet e intenta de nuevo.'
          ),
          didClose: () => {
            // Resetear estado del formulario cuando se cierra la alerta
            this.submitted = false;
            this.formError = false;
          }
        } as any);
  
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