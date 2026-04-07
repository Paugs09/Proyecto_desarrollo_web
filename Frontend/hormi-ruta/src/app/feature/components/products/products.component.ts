import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar directivas como @for o ngIf
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,  
    ProductCardComponent
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  constructor() {}
} 