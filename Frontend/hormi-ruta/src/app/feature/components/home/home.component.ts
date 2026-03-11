import { Component } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { ICarouselItem } from '../carousel/Icarousel-item.metadata';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  carouselItems: ICarouselItem[] = [
  {
    image: 'assets/sangil-carrusel.jpg',
    title: { first: '¡Bienvenido a', second: 'San Gil!' },
    subtitle: 'Un destino lleno de lugares por descubrir',
    overlayImage: 'assets/hormiga-sangilena.png',
    buttonText: 'Comenzar mi ruta',
  },
  {
    image: 'assets/actividades-carrusel.jpg',
    title: { first: 'Siente la adrenalina', second: 'sangileña' },
    subtitle: 'Atrévete a vivir la aventura',
    overlayImage: 'assets/hormiga-aventurera.png',
    buttonText: 'Buscar aventuras',
  },
  {
    image: 'assets/alojamientos-carrusel.jpg',
    title: { first: 'Siéntete en casa,', second: 'descansa mejor' },
    subtitle: 'El descanso perfecto después de explorar',
    overlayImage: 'assets/hormiga-hotelera.png',
    buttonText: 'Ver alojamientos',
  },
];
}