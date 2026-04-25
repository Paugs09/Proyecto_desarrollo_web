import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Router, RouterLink } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-CO';

registerLocaleData(localeEs);

interface ProductSnapshot {
  product_id: number;
  name: string;
  short_description: string;
  long_description: string;
  category_id: number;
  category: string;
  municipality_id: number;
  municipality: string;
  notes?: string;
  material?: string;
  material_id?: number;
  dimensions?: string;
}

interface Image {
  url: string;
  is_primary: boolean;
  display_order: number;
}

interface VariantSnapshot {
  variant_id: number;
  sku: string;
  attributes: Record<string, string>;
  price_at_purchase: number;
  current_list_price: number;
  quantify_purchased: number;
  total_value: number;
  stock_before_purchase: number;
  images: Image[];
}

interface Purchase {
  productSnapshot: ProductSnapshot;
  variantSnapshot: VariantSnapshot;
  purchaseDate: Date;
  status?: string;
}

@Component({
  selector: 'app-purchase-history',
  imports: [CommonModule, RouterLink],
  templateUrl: './purchase-history.component.html',
  styleUrl: './purchase-history.component.scss'
})
export class PurchaseHistoryComponent {

  purchases: Purchase[] = [];
  private productService = inject(ProductService);
  private router = inject(Router);

  searchTerm: string = '';
  expandedIndex: number | null = null;
  filteredPurchases: Purchase[] = [];

  ngOnInit(): void {
    this.updateFilteredPurchases();
  }

  ngOnChanges(): void {
    this.updateFilteredPurchases();
  }

  /**
   * Actualiza la lista filtrada basada en el término de búsqueda
   */
  private updateFilteredPurchases(): void {
    if (!this.searchTerm.trim()) {

      this.productService.getPurchaseHistory().subscribe({
        next: (data) => {
          this.purchases = data;
          this.filteredPurchases = data;
        }
      });
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredPurchases = this.purchases.filter(purchase => {
      const productName = purchase.productSnapshot.name.toLowerCase();
      const sku = purchase.variantSnapshot.sku.toLowerCase();
      const category = purchase.productSnapshot.category.toLowerCase();

      return (
        productName.includes(term) ||
        sku.includes(term) ||
        category.includes(term)
      );
    });
  }

  /**
   * Manejador del evento de búsqueda
   */
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.updateFilteredPurchases();
  }

  /**
   * Extrae los atributos de la variante en formato legible
   */
  getVariantAttributes(purchase: Purchase): Array<{ key: string; value: string }> {
    return Object.entries(purchase.variantSnapshot.attributes || {}).map(
      ([key, value]) => ({ key, value })
    );
  }

  /**
   * Calcula el cambio de precio y retorna un string formateado
   */
  getPriceChange(purchase: Purchase): string {
    const difference =
      purchase.variantSnapshot.current_list_price -
      purchase.variantSnapshot.price_at_purchase;

    if (difference === 0) return '';

    const sign = difference > 0 ? '+' : '';
    const percentage = ((difference / purchase.variantSnapshot.price_at_purchase) * 100).toFixed(1);

    return `(${sign}${percentage}%)`;
  }

  /**
   * Navega a la tienda
   */
  goToShop(): void {
    this.router.navigate(['/products']);
  }
}
