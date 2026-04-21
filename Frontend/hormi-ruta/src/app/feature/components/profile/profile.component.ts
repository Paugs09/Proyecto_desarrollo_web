import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { ProductService } from '../../services/product.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private productService = inject(ProductService);

  pestanaActiva = 'favoritos'; 
  misProductos: any[] = []; 
  loading = false;

  usuario = {
    FirstName: 'John',
    LastName: 'Doe',
    Email: 'usuario@correo.com',
    Phone: '+57 300 000 0000',
    ShippingAddress: 'Carrera 10 #5-20, San Gil',
    rol: 'HormiSeguidor',
    foto: ''
  };

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  cargarFavoritos(): void {
    this.loading = true;
    this.productService.getWishList().pipe(first()).subscribe({
      next: (data: any[]) => {
        this.misProductos = data.map((fav) => ({
          // CAMBIO: Ahora usamos el ID del producto para navegar y eliminar
          id: fav.productId || fav.id, 
          nombre: fav.productName || fav.name, 
          precio: fav.price || 0,
          foto: fav.imageUrl,
          seleccionado: false,
          categoria: 'favoritos'
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar:', err);
        this.loading = false;
      }
    });
  }

 eliminarFavoritosSeleccionados(): void {
    const seleccionados = this.misProductos.filter(p => p.seleccionado);
    
    seleccionados.forEach(item => {
      // CAMBIO: Enviamos item.id (que es el productId) y false para quitar
      this.productService.toggleFavorite(item.id, false).subscribe({
        next: () => {
          this.misProductos = this.misProductos.filter(p => p.id !== item.id);
        },
        error: (err) => console.error("Error al eliminar favorito:", err)
      });
    });
  }

  get haySeleccionados(): boolean {
    return this.misProductos.some(p => p.seleccionado);
  }
//funcion para q se cambie segun categoria 'frecuentes', 'favoritos'
  get productosFiltrados() {
    return this.misProductos.filter(p => p.categoria === this.pestanaActiva);
  }

  irADetalle(productId: number): void {
    if (productId) {
      // Inyecta el Router en el constructor o usa inject(Router)
      // this.router.navigate(['/details', productId]);
      window.location.href = `/details/${productId}`; // O usa el router de Angular
    }
  }
}