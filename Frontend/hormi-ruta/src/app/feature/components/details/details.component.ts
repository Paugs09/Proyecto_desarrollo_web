import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  
  // datos q simulan lo que vendrá de la bd
  producto = {
    nombre: 'Nombre del Producto',
    descripcion: '............................................',
    precio: 150000,
    tipoEleccion: 'Elección color/ tamaño/ sabor',
    opciones: ['Opción 1', 'Opción 2', 'Opción 3'],
    imagenes: [
      'https://via.placeholder.com/600x600/F4A261/8B4513?text=Imagen+1',
      'https://via.placeholder.com/600x600/8B4513/F4A261?text=Imagen+2',
      'https://via.placeholder.com/600x600/DDD/555?text=Imagen+3'
    ]
  };

  
  imagenPrincipalIdx = 0;
  opcionSeleccionada = '';
  cantidad = 1;

  // Funciones para que el cuadro de la cantidad se mueva
  cambiarImagen(index: number) {
    this.imagenPrincipalIdx = index;
  }

  sumar() {
    this.cantidad++;
  }

  restar() {
    if (this.cantidad > 1) this.cantidad--;
  }

  seleccionarOpcion(opt: string) {
    this.opcionSeleccionada = opt;
  }
}