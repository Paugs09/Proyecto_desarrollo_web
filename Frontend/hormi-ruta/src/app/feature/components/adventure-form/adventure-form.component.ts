import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CreateAdventure } from '../../interfaces/adventure.interface';
import { AdventureService } from '../../services/adventure.service';

@Component({
  selector: 'app-adventure-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './adventure-form.component.html',
  styleUrl: './adventure-form.component.scss'
})
export class AdventureFormComponent implements OnInit {

  isEditMode = false;

  nivelesDificultad = ['Fácil', 'Moderada', 'Difícil', 'Extrema'];

  form: CreateAdventure = {
    categoryId: 1,
    name: '',
    description: '',
    difficultyId: 1,
    duration: '',
    minAge: 1,
    physicalRequirements: undefined
  };

  constructor(
    private route: ActivatedRoute,
    private adventureService: AdventureService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      // cuando el back esté listo prueba:
      // this.adventureService.getAdventureById(id).subscribe(data => {
      //   this.form = { ...data };
      // });
      /**this.form = {
        id: id,
        category: 'Aventura',
        name: 'Senderismo Sierra Nevada',
        description: 'Una experiencia increíble',
        duration: '4 horas',
        minAge: 12,
        difficulty: 'Moderada',
        physicalRequirements: 'Buena condición física',
        mainImageUrl: '',
        price: 150000,
        priceNote: 'Entrada al lugar'
      };**/
    }
  }

  /**onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
       // this.form.mainImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }**/

  guardar() {
    console.log('Modo:', this.isEditMode ? 'Edición' : 'Creación');
    console.log('Datos:', this.form);

    this.adventureService.PostAdventures(this.form).subscribe({
      next: (data) => {
        console.log('¡Aventura creada con éxito!', data);
        // 1. Mostrar una notificación de éxito (Toastr, SweetAlert, etc.)
        // 2. Redirigir al usuario o limpiar el formulario
      },
      error: (err) => {
        console.error('Error al crear la aventura:', err);
        // 3. Manejar el error (mostrar mensaje al usuario)
      },
      complete: () => {
        // 4. Lógica opcional al terminar la suscripción
      }
    });


  }


  // TODO: conectar al backend cuando esté listo
  // if (this.isEditMode) {
  //   this.adventureService.updateAdventure(this.form.id, this.form)...
  // } else {
  //   this.adventureService.createAdventure(this.form)...
  // }
}