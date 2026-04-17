import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service'; 
import { ProductDetail, ProductVariant } from '../../interfaces/product.interface';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  producto?: ProductDetail;
  imagenPrincipalUrl: string = '';
  cantidad = 1;
  varianteSeleccionada?: ProductVariant;
  seleccionActual: { [key: string]: string } = {};
  esFavorito: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.getById(id).subscribe({
        next: (data) => {
          this.producto = data;
          if (this.producto && this.producto.variants.length > 0) {
            this.seleccionarVariante(this.producto.variants[0]);
          }
        },
        error: (err) => console.error('Error cargando producto:', err)
      });
    }
  }

  // --- LOGICA DE FAVORITOS ---

  verificarSiEsFavorito() {
    if (!this.varianteSeleccionada) return;
    this.productService.getWishList().subscribe({
      next: (wishList: any[]) => {
        this.esFavorito = wishList.some(item => 
          String(item.productVariantId).trim() === String(this.varianteSeleccionada?.id).trim()
        );
      },
      error: (err) => console.error('Error wishlist:', err)
    });
  }

  marcarFavorito() {
    if (!this.varianteSeleccionada) return;
    const intento = !this.esFavorito;
    this.productService.toggleFavorite(this.varianteSeleccionada.id, intento).subscribe({
      next: () => { this.esFavorito = intento; },
      error: (err) => {
        if (err.error && typeof err.error === 'string' && err.error.includes("ya está en favoritos")) {
          this.esFavorito = true;
        } else {
          alert("Error al guardar favorito");
        }
      }
    });
  }

  // --- LOGICA DE VARIANTES (ESTO ES LO QUE TE DABA ERROR) ---

  seleccionarVariante(variant: ProductVariant) {
    this.varianteSeleccionada = variant;
    this.imagenPrincipalUrl = variant.images[0]?.imageUrl || '';
    variant.values.forEach(v => this.seleccionActual[v.attributeName] = v.value);
    this.verificarSiEsFavorito();
  }

  // ESTA ES LA FUNCIÓN QUE EL HTML NO ENCONTRABA
  getValoresAtributo(nombreAtributo: string): string[] {
    const valores = new Set<string>();
    this.producto?.variants.forEach(v => {
      v.values.forEach(val => {
        if (val.attributeName === nombreAtributo) valores.add(val.value);
      });
    });
    return Array.from(valores);
  }

  actualizarSeleccion(nombreAtributo: string, valor: string) {
    this.seleccionActual[nombreAtributo] = valor;
    const coincidencia = this.producto?.variants.find(v => 
      v.values.every(val => this.seleccionActual[val.attributeName] === val.value)
    );
    if (coincidencia) this.seleccionarVariante(coincidencia);
  }

  get nombresAtributos(): string[] {
    if (!this.producto?.variants[0]) return [];
    return this.producto.variants[0].values.map(v => v.attributeName);
  }

  // --- OTROS ---
  cambiarImagen(url: string) { this.imagenPrincipalUrl = url; }
  sumar() { this.cantidad++; }
  restar() { if (this.cantidad > 1) this.cantidad--; }

  agregarAlCarrito() {
    if (!this.varianteSeleccionada) return;
    const userDataJson = sessionStorage.getItem('user_data');
    const userData = userDataJson ? JSON.parse(userDataJson) : null;
    const userId = userData?.id || userData?.userId;
    if (!userId) { alert("Inicia sesión"); return; }

    this.cartService.createOrder([{
      productVariantId: this.varianteSeleccionada.id,
      quantity: this.cantidad
    }], userId).subscribe({
      next: () => alert("¡Hormiguita feliz!"),
      error: () => alert("Error al añadir")
    });
  }
}