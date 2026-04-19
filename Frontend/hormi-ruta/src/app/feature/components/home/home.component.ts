import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { CarouselComponent } from '../carousel/carousel.component';
import { ICarouselItem } from '../carousel/Icarousel-item.metadata';
import { CardsComponent, IPlaceCard } from '../cards/cards.component';
import { Router, RouterLink, RouterLinkActive  } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/category.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, FormsModule, NgFor, CardsComponent, RouterLink, RouterLinkActive, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private readonly authService = inject(AuthService);
  categories: Category[] = [];
  homeSearchText = '';  

  //Control del carrusel de productos
  currentSlide = 0;
  // products = [1, 2, 3];

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  constructor(private categoryService: CategoryService, private router: Router) { }

  ngOnInit() {
    console.log('Usuario actual:', this.authService.isAdmin());
    this.getCategories();
  }

  //Buscar productos en el buscador
    searchProducts() {
    if (this.homeSearchText.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { productName: this.homeSearchText.trim() }
      });
    }
  }

  // Permitir buscar con Enter
  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.searchProducts();
  }


  private getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error cargando categorías', error);
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