import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { CarouselComponent } from '../carousel/carousel.component';
import { ICarouselItem } from '../carousel/Icarousel-item.metadata';
import { CardsComponent, IPlaceCard } from '../cards/cards.component';
import { AdventureService } from '../../services/adventure.service';
import { Adventure } from '../../interfaces/adventure.interface';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, FormsModule, NgFor, CardsComponent, RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  adventures: Adventure[] = [];
  activities: Adventure[] = [];

  //Control del carrusel de productos
  currentSlide = 0;
  products = [1, 2, 3];

  goToSlide(index: number){
    this.currentSlide = index;
  }

  categories = [
    {
      title: 'Artesanías de fique',
      description: 'Descubre los mejores productos artesanales de fique directos de Curití',
      image: 'assets/img/prducts.png',
      url: '/categoria/artesanias-fique'
    },
    {
      title: 'Dulces tradicionales',
      description: 'Los dulces más típicos y deliciosos de la región.',
      image: 'assets/img/prducts.png',
      url: '/categoria/dulces-tradicionales'
    },
    {
      title: 'Sabores de origen',
      description: 'Productos auténticos con sabor a tierra guanentina.',
      image: 'assets/img/prducts.png',
      url: '/categoria/sabores-origen'
    },
    {
      title: 'Bebidas típicas',
      description: 'Las bebidas más representativas de nuestra región.',
      image: 'assets/img/prducts.png',
      url: '/categoria/bebidas-tipicas'
    },
    {
      title: 'Artesanías de barro',
      description: 'Piezas únicas elaboradas a mano por artesanos locales.',
      image: 'assets/img/prducts.png',
      url: '/categoria/artesanias-barro'
    },
  ];

  constructor(private adventureService: AdventureService) {}

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

  carouselItems: ICarouselItem[] = [
    {
      image: 'assets/img/bannerHome.jpeg',
      title: { first: '¡Bienvenido a', second: 'HormiGuane!' },
      subtitle: 'Una tienda llena de productos por descubrir',
      overlayImage: 'assets/hormiga-indicadora.png',
      buttonText: 'Comenzar compras',
      scrollTo: 'sesion-banner',
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

  scrollCarousel(trackId: string, direction: 'left' | 'right') {
  const track = document.getElementById(trackId);
  if (!track) return;
  const item = track.querySelector('.home-places_item') as HTMLElement;
  const itemWidth = item ? item.offsetWidth + 16 : 300;
  track.scrollLeft += direction === 'right' ? itemWidth : -itemWidth;
}
}