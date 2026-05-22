// FRONTEND - Arquitectura de Componentes Angular
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
// CONEXIÓN FRONTEND-BACKEND - Servicios de comunicación
import { ProductService } from '../../services/product.service';
import { ProductDetail, ProductVariant } from '../../interfaces/product.interface';
import { CartService } from '../../services/cart.service';
import { first } from 'rxjs';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

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
    private cartService: CartService,
    private location: Location
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.getById(id).pipe(first()).subscribe({
        next: (data: any) => {
          this.producto = data;
          // Sincronización inicial con el campo del backend
          this.esFavorito = data.isFavorite;

          if (this.producto && this.producto.variants.length > 0) {
            this.seleccionarVariante(this.producto.variants[0]);
          }
        },
        error: (err) => console.error('Error cargando producto:', err)
      });
    }
  }

  // --- LÓGICA DE FAVORITOS (Ajustada al POST del Back) ---

  marcarFavorito() {
    if (!this.producto) return;

    const nuevoEstado = !this.esFavorito;

    // Cumplimos con el Body: { "productId": 1, "isFavorite": true }
    this.productService.toggleFavorite(this.producto.id, nuevoEstado).subscribe({
      next: () => {
        this.esFavorito = nuevoEstado;
        console.log(`Producto ${this.producto?.id} actualizado. Favorito: ${this.esFavorito}`);
      },
      error: (err) => {
        console.error("Error al actualizar favorito:", err);
        // Opcional: Revertir el estado visual si falla la red
      }
    });
  }

  // --- LÓGICA DE VARIANTES ---

  seleccionarVariante(variant: ProductVariant) {
    this.varianteSeleccionada = variant;
    this.imagenPrincipalUrl = variant.images[0]?.imageUrl || '';
    variant.values.forEach(v => this.seleccionActual[v.attributeName] = v.value);
  }

  actualizarSeleccion(nombreAtributo: string, valor: string) {
    this.seleccionActual[nombreAtributo] = valor;
    const coincidencia = this.producto?.variants.find(v =>
      v.values.every(val => this.seleccionActual[val.attributeName] === val.value)
    );
    if (coincidencia) {
      this.seleccionarVariante(coincidencia);
    } else {
      const sugerencia = this.producto?.variants.find(v =>
        v.values.some(val => val.attributeName === nombreAtributo && val.value === valor)
      );
      if (sugerencia) this.seleccionarVariante(sugerencia);
    }
  }

  get nombresAtributos(): string[] {
    if (!this.producto?.variants) return [];
    const nombres = new Set<string>();
    this.producto.variants.forEach(variant => {
      variant.values?.forEach(val => {
        if (val.attributeName) nombres.add(val.attributeName);
      });
    });
    return Array.from(nombres);
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

  // CARRITO

  agregarAlCarrito() {
    const commonConfig = {
      background: '#ffffff',
      color: '#1E293B',
      customClass: {
        popup: 'rounded-[6rem] border-8 border-white shadow-2xl',
        confirmButton: 'rounded-full px-10 py-3 font-black uppercase tracking-widest transition-transform hover:scale-105',
        title: 'font-black text-2xl'
      },
      buttonsStyling: true,
      backdrop: `rgba(45, 45, 45, 0.4)`
    };




    // VALIDACIÓN FRONTEND: Control de selección de variante obligatoria

    if (!this.varianteSeleccionada) {

      Swal.fire({
        ...commonConfig,
        title: '¡Hormiguita perdida!',
        text: 'Por favor, selecciona una opción para continuar.',
        imageUrl: 'assets/Hormiga-confundida.png',
        imageWidth: 150,
        confirmButtonText: '¡ENTENDIDO!',
        confirmButtonColor: '#F4A261'
      });
      return;
    }

    // VALIDACIÓN FRONTEND:Control de Stock disponible. Si pide más del stok en la bd, frena la operación y evita que la API falle o procese una compra inválida
    if (this.cantidad > (this.varianteSeleccionada.stock || 0)) {
      Swal.fire({
        ...commonConfig,
        title: '¡Vuelan muy rápido!',
        text: `Solo quedan ${this.varianteSeleccionada.stock} unidades de este producto.`,
        imageUrl: 'assets/Hormiga-stock.png',
        imageWidth: 150,
        confirmButtonText: 'REVISAR OTROS',
        confirmButtonColor: '#ec7272',
      });
      return;
    }

    // --- 2. BLOQUEO DE PANTALLA ---
    // Alerta que NO se puede cerrar para que el usuario no toque nada
    Swal.fire({

      title: 'Sincronizando...',
      text: 'Llevando tus productos al hormiguero',
      imageUrl: 'assets/hormiga-feliz.gif',
      imageWidth: 80,
      allowOutsideClick: false, // IMPIDE que cierren haciendo clic fuera
      allowEscapeKey: false,    
      showConfirmButton: false, 
      didOpen: () => {
        Swal.showLoading(); 
      }
    });

    const body = [{
      productVariantId: this.varianteSeleccionada.id,
      quantify: this.cantidad
    }];

    this.cartService.syncItems(body).subscribe({
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 900,
          timerProgressBar: false,
          title: '<span class="block text-center w-full">¡Añadido con éxito!</span>',
          imageUrl: 'assets/hormiga-feliz.gif',
          imageWidth: 50,
          background: '#ffffff',
          color: '#333',
          customClass: {
            popup: 'rounded-3xl shadow-lg border-2 border-white'
          }
        });
      },
      error: (err) => {
        Swal.fire({
          ...commonConfig,
          title: '¡Algo salió mal!',
          text: 'No pudimos conectar con el hormiguero.',
          imageUrl: 'assets/Hormiga-triste.png',
          imageWidth: 150,
          confirmButtonText: 'REINTENTAR',
          confirmButtonColor: '#ec7272'
        });
      }
    });
  }

  cambiarImagen(url: string) { this.imagenPrincipalUrl = url; }
  sumar() { this.cantidad++; }
  // VALIDACIÓN FRONTEND: Control de rango mínimo. no permitira que el contador sea menor a 1
  restar() { if (this.cantidad > 1) this.cantidad--; }

  // Método volver
  goBack() {
    this.location.back();
  }
}
