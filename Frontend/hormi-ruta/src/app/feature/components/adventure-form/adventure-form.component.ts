import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CreateAdventure } from '../../interfaces/adventure.interface';
import { AdventureService } from '../../services/adventure.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adventure-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './adventure-form.component.html',
  styleUrl: './adventure-form.component.scss'
})
export class AdventureFormComponent implements OnInit {

  isEditMode = false;
  adventureId : string | null = null;

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
    private activateRoute: ActivatedRoute,
    private adventureService: AdventureService,
    private router: Router
  ) { }

  ngOnInit() {
    this.adventureId = this.activateRoute.snapshot.paramMap.get('id');
    if (this.adventureId) {
      this.isEditMode = true;

      this.adventureService.getAdventureById(this.adventureId).subscribe(data => {
        console.log("detalle: ", data);
        this.form = data;
      });
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

    if (this.isEditMode && this.adventureId) {
      this.adventureService.PutAdventure(this.adventureId, this.form).subscribe({
        next: (data) => {
        },
        error: (err) => {
          console.error('Error al crear la aventura:', err);
        },
        complete: () => {
          this.router.navigate(['/home']);
        }
      });
    }
    else {

      this.adventureService.PostAdventures(this.form).subscribe({
        next: (data) => {
        },
        error: (err) => {
          console.error('Error al crear la aventura:', err);
        },
        complete: () => {
          this.router.navigate(['/home']);
        }
      });
    }
  }


  // TODO: conectar al backend cuando esté listo
  // if (this.isEditMode) {
  //   this.adventureService.updateAdventure(this.form.id, this.form)...
  // } else {
  //   this.adventureService.createAdventure(this.form)...
  // }
}