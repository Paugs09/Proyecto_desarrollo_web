import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { CarouselComponent } from '../carousel/carousel.component';
import { ICarouselItem } from '../carousel/Icarousel-item.metadata';
import { CardsComponent, IPlaceCard } from '../cards/cards.component';
import { AdventureService } from '../../services/adventure.service';
import { Adventure } from '../../interfaces/adventure.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, FormsModule, NgFor, CardsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  adventures: Adventure[] = [];
  activities: Adventure[] = [];

  constructor(private adventureService: AdventureService) {
  }

  ngOnInit(){
    this.getAdventures();
  }

  private getAdventures() {
    this.adventureService.getAdventures().subscribe({
      next: (data) =>{
        this.adventures = data.filter(x=> x.category != "Deportes Extremos");
        this.activities = data.filter(x=> x.category == "Deportes Extremos");
      },
      error: (error) => {

      }
    });
  }

  filters = [
    { label: 'Aventura', value: 'aventura' },
    { label: 'Alojamientos', value: 'alojamientos' },
    { label: 'Lugares turísticos', value: 'lugares' },
  ];

  selectedFilter = 'aventura';

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

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
      scrollTo: 'actividades',
    },
    {
      image: 'assets/alojamientos-carrusel.jpg',
      title: { first: 'Siéntete en casa,', second: 'descansa mejor' },
      subtitle: 'El descanso perfecto después de explorar',
      overlayImage: 'assets/hormiga-hotelera.png',
      buttonText: 'Ver alojamientos',
      scrollTo: 'alojamientos',
    },
  ];

  // places: IPlaceCard[] = [
  //   { title: 'Parque El Gallineral', description: 'El Parque Natural El Gallineral es el sitio emblemático de San Gil, Santander, conocido por ser una isla natural de 4 hectáreas rodeada por el río Fonce y la quebrada Curití.', image: 'assets/sangil-carrusel.jpg', price: 20000, priceNote: 'Entrada al lugar' },
  //   { title: 'Cascada Juan Curí', description: 'El Parque Natural El Gallineral es el sitio emblemático de San Gil, Santander, conocido por ser una isla natural de 4 hectáreas rodeada por el río Fonce y la quebrada Curití.', image: 'assets/sangil-carrusel.jpg', price: 0, priceNote: 'Entrada gratis' },
  //   { title: 'Cueva de la Vaca', description: 'El Parque Natural El Gallineral es el sitio emblemático de San Gil, Santander, conocido por ser una isla natural de 4 hectáreas rodeada por el río Fonce y la quebrada Curití.', image: 'assets/sangil-carrusel.jpg', price: 20000, priceNote: 'Entrada al lugar' },
  //   { title: 'Río Fonce', description: 'El Parque Natural El Gallineral es el sitio emblemático de San Gil, Santander, conocido por ser una isla natural de 4 hectáreas rodeada por el río Fonce y la quebrada Curití.', image: 'assets/sangil-carrusel.jpg', price: 20000, priceNote: 'Entrada al lugar' },
  // ];

  // activities: IPlaceCard[] = [
  //   { title: 'Parque El Gallineral', description: 'El Parque Natural El Gallineral es el sitio emblemático de San Gil, Santander, conocido por ser una isla natural de 4 hectáreas rodeada por el río Fonce y la quebrada Curití.', image: 'assets/sangil-carrusel.jpg', price: 20000, priceNote: 'Entrada al lugar' },
  //   { title: 'Cascada Juan Curí', description: 'El Parque Natural El Gallineral es el sitio emblemático de San Gil, Santander, conocido por ser una isla natural de 4 hectáreas rodeada por el río Fonce y la quebrada Curití.', image: 'assets/sangil-carrusel.jpg', price: 0, priceNote: 'Entrada gratis' },
  //   { title: 'Cueva de la Vaca', description: 'El Parque Natural El Gallineral es el sitio emblemático de San Gil, Santander, conocido por ser una isla natural de 4 hectáreas rodeada por el río Fonce y la quebrada Curití.', image: 'assets/sangil-carrusel.jpg', price: 20000, priceNote: 'Entrada al lugar' },
  //   { title: 'Río Fonce', description: 'El Parque Natural El Gallineral es el sitio emblemático de San Gil, Santander, conocido por ser una isla natural de 4 hectáreas rodeada por el río Fonce y la quebrada Curití.', image: 'assets/sangil-carrusel.jpg', price: 20000, priceNote: 'Entrada al lugar' },
  // ];

  hotels: IPlaceCard[] = [
    { title: 'Parque El Gallineral', description: 'El Parque Natural El Gallineral es el sitio emblemático de San Gil, Santander, conocido por ser una isla natural de 4 hectáreas rodeada por el río Fonce y la quebrada Curití.', image: 'assets/sangil-carrusel.jpg', price: 20000, priceNote: 'Entrada al lugar' },
    { title: 'Cascada Juan Curí', description: 'El Parque Natural El Gallineral es el sitio emblemático de San Gil, Santander, conocido por ser una isla natural de 4 hectáreas rodeada por el río Fonce y la quebrada Curití.', image: 'assets/sangil-carrusel.jpg', price: 0, priceNote: 'Entrada gratis' },
    { title: 'Cueva de la Vaca', description: 'El Parque Natural El Gallineral es el sitio emblemático de San Gil, Santander, conocido por ser una isla natural de 4 hectáreas rodeada por el río Fonce y la quebrada Curití.', image: 'assets/sangil-carrusel.jpg', price: 20000, priceNote: 'Entrada al lugar' },
    { title: 'Río Fonce', description: 'El Parque Natural El Gallineral es el sitio emblemático de San Gil, Santander, conocido por ser una isla natural de 4 hectáreas rodeada por el río Fonce y la quebrada Curití.', image: 'assets/sangil-carrusel.jpg', price: 20000, priceNote: 'Entrada al lugar' },
  ];
}