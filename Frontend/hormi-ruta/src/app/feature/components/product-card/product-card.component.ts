import { Component, inject, Input, output } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ProductDto } from '../../interfaces/product.interface';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})

export class ProductCardComponent {
  @Input() product!: ProductDto;
  productChanged = output<void>();

  private readonly productService = inject(ProductService);
  private readonly authService = inject(AuthService);
  protected readonly isAdmin = this.authService.isAdmin;

  constructor(private router: Router) { }

  goToDetail() {
    this.router.navigate(['/details', this.product.id]);
  }

  goToEdit() {

  }

  delete() {
    this.productService.deleteProduct(this.product.id).subscribe({
      next: (value) => {
        this.productChanged.emit();
      },
      error: (err) => {

      }
    });
  }
}
