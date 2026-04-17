import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { OrderItemDto, OrderDto} from '../../interfaces/cart.interface';

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

  items: OrderItemDto[] = [];
  totalCompra: number = 0;
  isLoading = true;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando el carrito: ', err);
        this.isLoading = false;
      }
    });
  }

  // ── Selección => Revisar y modificar cuando el back devuelva select
  // get allSelected(): boolean {
  //   return this.items.length > 0 && this.items.every((i) => i.selected);
  // }

  // toggleAll(checked: boolean): void {
  //   this.items.forEach((i) => (i.selected = checked));
  //   this.triggerSync();
  // }

  // toggleItem(item: CartItem): void {
  //   item.selected = !item.selected;
  //   this.triggerSync();
  // }

  // deleteSelected(): void {
  //   this.items = this.items.filter((i) => !i.selected);
  //   this.triggerSync();
  // }



  // REVISAR eliminar producto del carrito
  // removeItem(item: OrderItemDto): void {
  //   const payload = [{
  //     productVariantId: item.productVariantId,
  //     quantity: 0
  //   }];

    // Revisar en el servicio del carrito en front el userId
  //   this.cartService.createOrder(payload, "1")
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: () => {
  //         this.loadCart();
  //       },
  //       error: (err: unknown) => console.error('Error eliminando item:', err)
  //     });
  // }


  
  // Cantidad para probar front
  increment(item: OrderItemDto): void {
    item.quantify++;
  }

  decrement(item: OrderItemDto): void {
    if(item.quantify > 1){
      item.quantify--;
    }
  }

  // Cantidad de productos en el carrito
  get totalItemsCount(): number {
    return this.items.reduce((total, item) => total + item.quantify, 0);
  }

  // Cálculos directos front
  get subtotal(): number{
    return this.items.reduce((sum, i) => sum + (i.unitPrice * i.quantify), 0);
  }

  get total(): number {
    return this.subtotal;
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

  // Modal de detalle lupa
  selectedProduct: OrderItemDto | null = null;
  detailOpen = false;

  openDetail(item: OrderItemDto) {
    this.selectedProduct = item;
    this.detailOpen = true;
  }

  closeDetail() {
    this.detailOpen = false;
    this.selectedProduct = null;
  }

  checkout(): void {
      console.log('Ir a pagar:', this.total);
  }
}