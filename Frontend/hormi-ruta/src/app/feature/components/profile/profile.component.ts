import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // checkboxes
import { CommonModule } from '@angular/common'; //para *ngFor y [ngClass]


@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
pestanaActiva = 'mis-productos'; 

usuario = {

    FirstName: 'John',
    LastName: 'Doe',
    Email: 'pepa@yopmail.com',
    Phone: '+57 3125468531',
    ShippingAddress: 'Carrera 2 #10-20, San Gil',
    rol: 'HormiSeguidor',
    foto: ''
  };
  // Datos de prueba para la lista (Simulando base de datos)
 misProductos = [
    { nombre: 'Chicha Regional', precio: 85000, seleccionado: true, categoria: 'mis-productos' },
    { nombre: 'Artesanía de Barro', precio: 45000, seleccionado: false, categoria: 'favoritos' },
    { nombre: 'masato', precio: 10000, seleccionado: true, categoria: 'frecuentes' },
    { nombre: 'Hormigas Culonas', precio: 60000, seleccionado: false, categoria: 'favoritos' }
  ];
  //funcion para q se cambie segun categoria 'mis-productos', 'favoritos', 'frecuentes'
  get productosFiltrados() {
    return this.misProductos.filter(p => p.categoria === this.pestanaActiva);
  }

  constructor() { }
}
