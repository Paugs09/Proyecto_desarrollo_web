import { Component } from '@angular/core';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})

/** //Define qué datos necesita un producto
export interface Product {
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string; 
  //los q pnga en SupaBase Jefferson
}*/
export class ProductCardComponent {
//@Input() infoProducto!: Product;
}
