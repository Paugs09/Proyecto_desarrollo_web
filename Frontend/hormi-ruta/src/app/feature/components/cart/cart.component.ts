import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { OrderItemDto, OrderDto } from '../../interfaces/cart.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  items: OrderItemDto[] = [];
  selectedIds = new Set<number>();
  totalCompra: number = 0;
  isLoading = true;

  // Modal de detalle lupa
  selectedProduct: OrderItemDto | null = null;
  detailOpen = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Utilidades 

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  }

  trackById(index: number, item: OrderItemDto): string {
    return item.productName + index;
  }

  // Carga inicial 

  loadCart(): void {
    this.isLoading = true;
    this.cartService.listOrderItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: OrderDto) => {
          this.items = data.orderItems;
          this.totalCompra = data.totalAmount;
          this.selectedIds = new Set(this.items.map(i => i.productVariantId));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error cargando el HormiCarrito:', err);
          this.items = [];
          this.totalCompra = 0;
          this.selectedIds = new Set();
          this.isLoading = false;
        }
      });
  }

  // Selección con checkbox 

  get allSelected(): boolean {
    return this.items.length > 0 && this.items.every(i => this.selectedIds.has(i.productVariantId));
  }

  get someSelected(): boolean {
    return this.selectedIds.size > 0 && !this.allSelected;
  }

  toggleAll(checked: boolean): void {
    this.selectedIds = checked
      ? new Set(this.items.map(i => i.productVariantId))
      : new Set();
  }

  toggleItem(item: OrderItemDto): void {
    const updated = new Set(this.selectedIds);
    if (updated.has(item.productVariantId)) {
      updated.delete(item.productVariantId);
    } else {
      updated.add(item.productVariantId);
    }
    this.selectedIds = updated;
  }

  isSelected(item: OrderItemDto): boolean {
    return this.selectedIds.has(item.productVariantId);
  }

  get selectedItems(): OrderItemDto[] {
    return this.items.filter(i => this.selectedIds.has(i.productVariantId));
  }

  get hasSelection(): boolean {
    return this.selectedIds.size > 0;
  }

  // Sincronización con el servidor 

  private syncCart(variantId: number, quantity: number): void {
    const payload = [{ productVariantId: variantId, quantity }];

    // El back extrae el userId del token automáticamente
    this.cartService.createOrder(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadCart(),
        error: (err) => {
          console.error('Error al sincronizar:', err);
          this.loadCart(); // Rollback al estado real del servidor
        }
      });
  }

  // Acciones del carrito 

  increment(item: OrderItemDto): void {
    item.quantify++;
    this.syncCart(item.productVariantId, item.quantify);
  }

  decrement(item: OrderItemDto): void {
    if (item.quantify > 1) {
      item.quantify--;
      this.syncCart(item.productVariantId, item.quantify);
    }
  }

  removeItem(item: OrderItemDto): void {
    if (!confirm(`¿Quitar "${item.productName}" del HormiCarrito?`)) return;

    this.items = this.items.filter(i => i.productVariantId !== item.productVariantId);
    const updated = new Set(this.selectedIds);
    updated.delete(item.productVariantId);
    this.selectedIds = updated;

    const payload = [{ productVariantId: item.productVariantId, quantity: 0 }];

    this.cartService.createOrder(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadCart(),
        error: (err) => {
          console.error('Error al eliminar el producto:', err);
          this.loadCart();
          alert('No se pudo eliminar el producto. Intenta de nuevo.');
        }
      });
  }

  removeSelected(): void {
    if (!this.hasSelection) return;
    if (!confirm(`¿Quitar ${this.selectedIds.size} producto(s) del carrito?`)) return;

    const toRemove = [...this.selectedIds];

    this.items = this.items.filter(i => !this.selectedIds.has(i.productVariantId));
    this.selectedIds = new Set();

    toRemove.forEach(variantId =>
      this.cartService.createOrder([{ productVariantId: variantId, quantity: 0 }])
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (err) => console.error(`Error al eliminar variante ${variantId}:`, err)
        })
    );

    setTimeout(() => this.loadCart(), 500);
  }

  // Cálculos (solo sobre seleccionados)

  get totalItemsCount(): number {
    return this.selectedItems.reduce((total, item) => total + item.quantify, 0);
  }

  get subtotal(): number {
    return this.selectedItems.reduce((sum, i) => sum + i.unitPrice * i.quantify, 0);
  }

  get total(): number {
    return this.subtotal;
  }

  // Modal detalle lupa

  openDetail(item: OrderItemDto): void {
    this.selectedProduct = item;
    this.detailOpen = true;
  }

  closeDetail(): void {
    this.detailOpen = false;
    this.selectedProduct = null;
  }

  // Checkout (solo seleccionados)

  checkout(): void {
    if (!this.hasSelection) return;
    console.log('Ir a pagar:', this.selectedItems, 'Total:', this.total);
  }
}