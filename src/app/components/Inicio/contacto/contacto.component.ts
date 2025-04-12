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
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})

export class ContactoComponent implements OnInit {
 contactForm: FormGroup;
   submitted = false;
   messageLength = 0;
   
   // Opciones simplificadas
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
     private alertService: AlertService
   ) {
     // Inicializar formulario con validaciones
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
     
     // Contador de caracteres para el mensaje
     this.contactForm.get('mensaje')?.valueChanges.subscribe(value => {
       this.messageLength = value ? value.length : 0;
     });
 
     // Suscripción al servicio modal
     this.privacyModalService.openModal$.subscribe(() => {
       this.openPrivacyModal();
     });
   }
 
   // Getter para controles del formulario
   get f() {
     return this.contactForm.controls;
   }
 
   onSubmit(): void {
     this.submitted = true;
     
     // Detener si el formulario es inválido
     if (this.contactForm.invalid) {
       this.alertService.error('Por favor, completa todos los campos obligatorios correctamente.');
       this.submitted = false;
       return;
     }
   
     // Enviar el formulario
     this.contactService.enviarFormulario(this.contactForm.value).subscribe({
       next: (response) => {
         if (response.status === 'success') {
           Swal.fire({
             ...this.alertService.getSuccessConfig(
               'Tu solicitud ha sido enviada correctamente. Nos pondremos en contacto contigo pronto.'
             ),
             didClose: () => {
               this.submitted = false;
               this.contactForm.reset();
             }
           } as any);
         } else {
           Swal.fire({
             ...this.alertService.getErrorConfig(
               response.message || 'Hubo un problema al enviar tu solicitud. Por favor, intenta nuevamente.'
             ),
             didClose: () => {
               this.submitted = false;
             }
           } as any);
         }
       },
       error: (error) => {
         Swal.fire({
           ...this.alertService.getErrorConfig(
             'No se pudo establecer conexión. Por favor, verifica tu conexión a internet e intenta de nuevo.'
           ),
           didClose: () => {
             this.submitted = false;
           }
         } as any);
         
         console.error('Error al enviar formulario:', error);
       }
     });
   }
 
   // Verificar errores en campos específicos
   hasError(controlName: string, errorName: string): boolean {
     const control = this.contactForm.get(controlName);
     return !!(control && control.touched && control.hasError(errorName));
   }
 
   // Abrir modal de privacidad
   openPrivacyModal(event?: Event): void {
     if (event) {
       event.preventDefault();
     }
     
     if (this.privacyModal) {
       this.privacyModal.open();
     }
   }
}
