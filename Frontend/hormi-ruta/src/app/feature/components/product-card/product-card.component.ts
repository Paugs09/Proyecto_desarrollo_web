import { Component, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ProductDto } from '../../interfaces/product.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})

export class ProductCardComponent {
  @Input() product!: ProductDto;

  constructor(private router: Router) {}

  goToDetail() {
    this.router.navigate(['/details', this.product.id]);
  }
}
