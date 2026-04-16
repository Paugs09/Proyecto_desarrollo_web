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

  seleccionarVariante(variant: ProductVariant) {
    this.varianteSeleccionada = variant;
    this.imagenPrincipalUrl = variant.images[0]?.imageUrl || '';
    variant.values.forEach(v => {
      this.seleccionActual[v.attributeName] = v.value;
    });
  }

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

    if (coincidencia) {
      this.seleccionarVariante(coincidencia);
    } else {
      const nuevaSugerencia = this.producto?.variants.find(v => 
        v.values.some(val => val.attributeName === nombreAtributo && val.value === valor)
      );
      if (nuevaSugerencia) this.seleccionarVariante(nuevaSugerencia);
    }
  }

  get nombresAtributos(): string[] {
    if (!this.producto?.variants[0]) return [];
    return this.producto.variants[0].values.map(v => v.attributeName);
  }

  cambiarImagen(url: string) { this.imagenPrincipalUrl = url; }
  sumar() { this.cantidad++; }
  restar() { if (this.cantidad > 1) this.cantidad--; }

  // --- LÓGICA DE DECODIFICACIÓN Y CARRITO ---

  private decodificarToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  agregarAlCarrito() {
    if (!this.varianteSeleccionada) {
      alert("Por favor selecciona una opción (talla/color)");
      return;
    }

    const userDataJson = sessionStorage.getItem('user_data');
    const userData = userDataJson ? JSON.parse(userDataJson) : null;

    if (!userData || !userData.accessToken) {
      alert("Debes iniciar sesión para añadir productos al carrito.");
      return;
    }

    // Obtenemos el ID del usuario
    let userId = userData.id || userData.userId;
    if (!userId) {
      const tokenData = this.decodificarToken(userData.accessToken);
      userId = tokenData?.nameid || tokenData?.sub || tokenData?.id;
    }

    if (!userId) {
      alert("Error: No se pudo identificar al usuario.");
      return;
    }

    const itemsParaEnviar = [{
      productVariantId: this.varianteSeleccionada.id,
      quantity: this.cantidad
    }];

    console.log("Enviando pedido para:", userId, itemsParaEnviar);

    // Llamamos al servicio pasando el ID del usuario
    this.cartService.createOrder(itemsParaEnviar, userId).subscribe({
      next: (res) => {
        alert("¡Hormiguita feliz! Producto añadido con éxito.");
      },
      error: (err) => {
        console.error("Error 400 detallado:", err.error);
        alert("Error al añadir.");
      }
    });
  }
}