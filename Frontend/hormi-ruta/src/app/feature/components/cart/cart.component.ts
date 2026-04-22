import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { OrderItemDto } from '../../interfaces/cart.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  orderId: number = 0;
  totalCompra: number = 0;
  isLoading = false;

  // Modal de detalle lupa
  selectedProduct: OrderItemDto | null = null;
  detailOpen = false;

  constructor(private cartService: CartService,
    private router: Router) { }

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

    this.cartService.listProductsOfCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: OrderItemDto[]) => {
          this.items = data;
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

  private syncCart(variantId: number, quantify: number): void {
    const payload = [{ productVariantId: variantId, quantify }];

    // El back extrae el userId del token automáticamente
    this.cartService.syncItems(payload)
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
    Swal.fire({
      title: '<span class="block text-center w-full">¿Quitar del HormiCarrito?</span>',
      html: `<p class="text-center">¿Estás seguro de que quieres eliminar <b>"${item.productName}"</b>?</p>`,
      imageUrl: 'assets/Hormiga-eliminar.png',
      imageWidth: 150,
      width: 450,
      background: '#ffffff',
      showCancelButton: true,
      confirmButtonColor: '#ec7272',
      cancelButtonColor: '#4cb8a8',
      confirmButtonText: 'Sí, quitar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-[3rem] border-8 border-white shadow-2xl',
        confirmButton: 'rounded-full px-8 py-3 font-bold uppercase',
        cancelButton: 'rounded-full px-8 py-3 font-bold uppercase',
        actions: 'justify-center gap-4'
      },
      backdrop: `rgba(45, 45, 45, 0.4)`
    }).then((result) => {
      if (result.isConfirmed) {
        this.items = this.items.filter(i => i.productVariantId !== item.productVariantId);
        const updated = new Set(this.selectedIds);
        updated.delete(item.productVariantId);
        this.selectedIds = updated;

        const payload = [{ productVariantId: item.productVariantId, quantify: 0 }];

        this.cartService.syncItems(payload)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => this.loadCart(),
            error: (err) => {
              console.error('Error al eliminar el producto:', err);
              this.loadCart();
              Swal.fire({
                title: '<span class="block text-center">¡Ups!</span>',
                text: 'No se pudo eliminar el producto. Intenta de nuevo.',
                imageUrl: 'assets/Hormiga-triste.png',
                imageWidth: 100,
                confirmButtonColor: '#ec7272',
                background: '#ffffff',
                customClass: { popup: 'rounded-[2rem] text-center' }
              });
            }
          });
      }
    });
  }

  removeSelected(): void {
    if (!this.hasSelection) return;
    Swal.fire({
      title: '<span class="block text-center w-full">¡Limpieza de Carrito!</span>',
      html: `<p class="text-center">Vas a quitar <b>${this.selectedIds.size}</b> producto(s) del carrito.</p>`,
      imageUrl: 'assets/Hormiga-limpiar.png',
      imageWidth: 150,
      width: 450,
      background: '#ffffff',
      showCancelButton: true,
      confirmButtonColor: '#ec7272',
      cancelButtonColor: '#4cb8a8',
      confirmButtonText: 'Sí, quitar todos',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-[3rem] border-8 border-white shadow-2xl',
        confirmButton: 'rounded-full px-8 py-3 font-bold uppercase',
        cancelButton: 'rounded-full px-8 py-3 font-bold uppercase',
        actions: 'justify-center gap-4'
      },
      backdrop: `rgba(45, 45, 45, 0.4)`
    }).then((result) => {
      if (result.isConfirmed) {
        const toRemove = [...this.selectedIds];
        this.items = this.items.filter(i => !this.selectedIds.has(i.productVariantId));
        this.selectedIds = new Set();

        const productsToRemove = toRemove.map(variantId => ({
          productVariantId: variantId,
          quantify: 0
        }));

        this.cartService.syncItems(productsToRemove)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            error: (err) => console.error(`Error al eliminar los productos del carro`, err)
          })

        setTimeout(() => this.loadCart(), 500);
      }
    });
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

    const productsToAdd = this.selectedItems.map(item => ({
      productVariantId: item.productVariantId,
      quantify: item.quantify
    }));

    this.cartService.createOrder(productsToAdd).subscribe({
      next: (data) => {

        this.cartService.finishOrder(data.order_id).subscribe({
          next: (value) => {

            Swal.fire({
              title: '<span class="block text-center w-full">¡Pedido Procesado!</span>',
              html: '<p class="text-center">Tu pedido se ha realizado correctamente.</p>',
              imageUrl: 'assets/Hormiga-carrito.png',
              imageWidth: 150,
              background: '#ffffff',
              confirmButtonColor: '#3aa394',
              confirmButtonText: 'VOLVER AL INICIO',
              allowOutsideClick: false,
              customClass: {
                popup: 'rounded-[3rem] border-8 border-white shadow-2xl',
                confirmButton: 'rounded-full px-10 py-3 font-black uppercase tracking-widest'
              },
              backdrop: `rgba(45, 45, 45, 0.4)`
            }).then(() => {
              this.router.navigate(['/home']);
            });

          },
          error: (err) => {

            Swal.fire({
              title: '<span class="block text-center w-full">Hubo un problema</span>',
              html: '<p class="text-center">No pudimos finalizar tu pedido. Por favor, intenta de nuevo.</p>',
              imageUrl: 'assets/Hormiga-triste.png',
              imageWidth: 120,
              background: '#ffffff',
              confirmButtonColor: '#F4A261',
              confirmButtonText: 'REINTENTAR',
              customClass: {
                popup: 'rounded-[3rem] border-8 border-white shadow-2xl',
                confirmButton: 'rounded-full px-10 py-3 font-black uppercase'
              }
            });
            console.error('Error en checkout:', err);

          }
        });

      },
      error: () => {

      }

    });
  }
}