
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service'; 
import { ProductDetail, ProductVariant } from '../../interfaces/product.interface';
import { CartService } from '../../services/cart.service';
import { first } from 'rxjs'; // Para optimizar la hidratación
import Swal from 'sweetalert2'; //Para alertas personalizadas

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
      // Usa .pipe(first()) para que la suscripción se cierre rápido y ayude a la hidratación
      this.productService.getById(id).pipe(first()).subscribe({
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

  // --- LÓGICA DE FAVORITOS  ---

  verificarSiEsFavorito() {
  if (!this.producto) return;

  // se crea una lista de todos los IDs que podrían representar a este producto
  
  const idsRelacionados = [
    this.producto.id, 
    ...this.producto.variants.map(v => v.id)
  ];

  this.productService.getWishList().pipe(first()).subscribe({
    next: (wishList: any[]) => {
      // Si alguno de los IDs de favoritos coincide con el ID del producto o de sus variantes
      this.esFavorito = wishList.some(fav => idsRelacionados.includes(fav.id));
      
      console.log("IDs del producto y sus variantes:", idsRelacionados);
      console.log("¿Alguno está en favoritos?:", this.esFavorito);
    },
    error: (err) => console.error('Error wishlist:', err)
  });
}

  marcarFavorito() {
    if (!this.varianteSeleccionada) return;

    const estadoIntento = !this.esFavorito;
    this.productService.toggleFavorite(this.varianteSeleccionada.id, estadoIntento).subscribe({
      next: () => {
        this.esFavorito = estadoIntento;
      },
      error: (err) => {
        if (err.error && typeof err.error === 'string' && err.error.includes("ya está en favoritos")) {
          this.esFavorito = true;
        } else {
          console.error("Error al actualizar favorito:", err);
        }
      }
    });
  }

  // --- LÓGICA DE VARIANTES ---

  seleccionarVariante(variant: ProductVariant) {
    this.varianteSeleccionada = variant;
    this.imagenPrincipalUrl = variant.images[0]?.imageUrl || '';
    
    // Actualizar botones
    variant.values.forEach(v => this.seleccionActual[v.attributeName] = v.value);
    
    // Comprobar favoritos
    this.verificarSiEsFavorito();
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
    return this.producto?.variants[0]?.values.map(v => v.attributeName) || [];
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

    if (!this.varianteSeleccionada) 
      {
      // alert("Por favor selecciona una opción (talla/color)");
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
    if (this.cantidad > (this.varianteSeleccionada.stock || 0)) {
      // alert(`Solo quedan ${this.varianteSeleccionada.stock} unidades.`);
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

    // Enviamos un ARRAY 
    const body = [{
      productVariantId: this.varianteSeleccionada.id,
      quantity: this.cantidad
    }];

    this.cartService.createOrder(body).subscribe({
      // next: () => alert("¡Hormiguita feliz! Añadido al carrito."),
      // error: (err) => alert("Error al añadir al carrito.")
      next: () => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3500,
          timerProgressBar: true,
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
  restar() { if (this.cantidad > 1) this.cantidad--; }
}
