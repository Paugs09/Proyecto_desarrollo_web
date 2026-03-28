import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {

  reserva = {
    nombre: '',
    telefono: '',
    correo: '',
    fecha: '',
    adultos: 0,
    ninos: 0,
    observaciones: ''
  };

  crearReserva(){
    console.log(this.reserva);
    alert("Reserva enviada");
  }

}