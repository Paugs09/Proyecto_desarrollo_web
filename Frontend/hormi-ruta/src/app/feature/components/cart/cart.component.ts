import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject, debounceTime, takeUntil } from 'rxjs';

// export interface CartItem {
//   id: number;
//   name: string;
//   category: string;
//   price: number;
//   quantity: number;
//   image: string;
//   selected: boolean;
// }

export interface CartItem {
  id: number;
  productVariantId: number; 
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  selected: boolean;
  isFavorite: boolean;
}

export interface OrderPayload {
  items: { id: number; quantity: number; price: number }[];
  subtotal: number;
  discount: number;
  total: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private orderUpdate$ = new Subject<void>();

  // --- endpoints (revisar) ---
  private readonly CART_API = '/api/cart/order-items';
  private readonly ORDER_API = '/api/cart/create-order';
  private readonly WISHLIST_API = '/api/product/wish-list';

  items: CartItem[] = [];
  isLoading = true;
  isSyncing = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCart();

    // Debounce: espera 600 ms tras el último cambio antes de enviar al back
    this.orderUpdate$
      .pipe(debounceTime(600), takeUntil(this.destroy$))
      .subscribe(() => this.sendOrderToBack());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Carga inicial 
  loadCart(): void {
    this.isLoading = true;
    this.http.get<any[]>(this.CART_API).subscribe({
      next: (data) => {
        this.items = data.map((i, index) => ({
          id: index,
          productVariantId: i.productVariantId,
          name: i.productName,
          category: i.category,
          price: i.unitPrice,
          quantity: i.quantity ?? 1,
          image: i.imageUrl,
          selected: true,
          isFavorite: false,
        }));
        this.isLoading = false;
        this.triggerSync();
      },
      error: () => {
        // Datos de ejemplo 
        this.items = [
          {
            id: 1,
            productVariantId: 101,
            name: 'Dulce de Feijoa',
            category: 'Dulces',
            price: 25000,
            quantity: 1,
            image: 'assets/img/prod.png',
            selected: true,
            isFavorite: true,
          },
          {
            id: 2,
            productVariantId: 102,
            name: 'Nombre de la bebida...',
            category: 'Bebidas',
            price: 15000,
            quantity: 1,
            image: '',
            selected: true,
            isFavorite: false,
          },
          {
            id: 3,
            productVariantId: 103,
            name: 'Nombre de la artesanía de fique...',
            category: 'Artesanías de fique',
            price: 45000,
            quantity: 1,
            image: '',
            selected: true,
            isFavorite: false,
          },
        ];
        this.isLoading = false;
        this.triggerSync();
      },
    });
  }

  // ── Selección 
  get allSelected(): boolean {
    return this.items.length > 0 && this.items.every((i) => i.selected);
  }

  toggleAll(checked: boolean): void {
    this.items.forEach((i) => (i.selected = checked));
    this.triggerSync();
  }

  toggleItem(item: CartItem): void {
    item.selected = !item.selected;
    this.triggerSync();
  }

  deleteSelected(): void {
    this.items = this.items.filter((i) => !i.selected);
    this.triggerSync();
  }

  // ── Cantidad 
  get selectedItems(): CartItem[] {
    return this.items.filter((i) => i.selected);
  }

  get selectedCount(): number {
    return this.selectedItems.reduce((s, i) => s + i.quantity, 0);
  }

  increment(item: CartItem): void {
    item.quantity++;
    this.triggerSync();
  }

  decrement(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.triggerSync();
    }
  }

  removeItem(item: CartItem): void {
    this.items = this.items.filter((i) => i.id !== item.id);
    this.triggerSync();
  }

  // ── Cálculos reactivos 
  get subtotal(): number {
    return this.selectedItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
  }

  get discount(): number {
    // Esta es la lógica para descuento (opcional -- esperar aprobación de hormicompañeros): 10 % si hay 3 o más artículos seleccionados
    return this.selectedCount >= 3 ? Math.round(this.subtotal * 0.1) : 0;
  }

  get total(): number {
    return this.subtotal - this.discount;
  }

  // ── Envío al back 
  triggerSync(): void {
    this.orderUpdate$.next();
  }

  sendOrderToBack(): void {
    if (this.selectedItems.length === 0) return;

    this.isSyncing = true;
    const payload: OrderPayload = {
      items: this.selectedItems.map((i) => ({
        id: i.id,
        quantity: i.quantity,
        price: i.price,
      })),
      subtotal: this.subtotal,
      discount: this.discount,
      total: this.total,
    };

    this.http.post(this.ORDER_API, payload).subscribe({
      next: () => (this.isSyncing = false),
      error: () => (this.isSyncing = false),
    });
  }

  checkout(): void {
    // Forzar sincronización inmediata antes de redirigir
    this.sendOrderToBack();
    // Aquí añade navegación: this.router.navigate(['/checkout'])
  }

  // ── Utilidades 
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  }

  trackById(_: number, item: CartItem): number {
    return item.id;
  }

  selectedProduct: CartItem | null = null;
detailOpen = false;

openDetail(item: CartItem) {
  this.selectedProduct = item;
  this.detailOpen = true;
}

closeDetail() {
  this.detailOpen = false;
  this.selectedProduct = null;
}

  toggleFavorite(item: CartItem): void {
    item.isFavorite = !item.isFavorite;
 
    this.http.post(this.WISHLIST_API, {
      productVariantId: item.productVariantId,
      isFavorite: item.isFavorite,
    }).subscribe({
      error: () => {
        item.isFavorite = !item.isFavorite;
      },
    });
  }
}