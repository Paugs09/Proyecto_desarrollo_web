import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
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
 private authService = inject(AuthService);

 readonly userSignal = this.authService.user;

  pestanaActiva = 'favoritos'; 
  misProductos: any[] = []; 
  loading = false;

  get usuario() {
  const data = this.userSignal();
  // Si el back devuelve { user: {...}, token: '...' }, usamos data.user
  // Si devuelve el usuario directo, usamos data
  const u = data?.user ? data.user : data;

  let nombreRol = 'HormiSeguidor'; 
  
  // Lógica de Rol mejorada
  const roleInfo = u?.role || u?.Role;
  if (roleInfo?.name) {
    nombreRol = roleInfo.name === 'admin' ? 'Administrador' : 'Cliente';
  } else if (u?.roleId || u?.role_id) {
    const rId = u?.roleId || u?.role_id;
    nombreRol = rId === 1 ? 'Administrador' : 'Cliente';
  }

  return {
    nombre: u?.firstName || u?.first_name || u?.FirstName || 'Usuario',
    apellido: u?.lastName || u?.last_name || u?.LastName || '',
    correo: u?.email || u?.Email || 'Sin correo',
    telefono: u?.phone || u?.Phone || 'No registrado',
    direccion: u?.shippingAddress || u?.shipping_address || u?.ShippingAddress || 'Sin dirección',
    rol: nombreRol,
    foto: u?.foto || u?.photo_url || ''
  };
}

  //usuario = {
    //FirstName: 'John',
    //LastName: 'Doe',
    //Email: 'usuario@correo.com',
    //Phone: '+57 300 000 0000',
    //ShippingAddress: 'Carrera 10 #5-20, San Gil',
    //rol: 'HormiSeguidor',
    //foto: ''};

  ngOnInit(): void {
    this.cargarFavoritos();
    console.log('Datos del usuario logueado:', this.userSignal());
  }

  cargarFavoritos(): void {
  this.loading = true;
  this.productService.getWishList().pipe(first()).subscribe({
    next: (data: any[]) => {
      console.log('Datos del back:', data);
      this.misProductos = data.map((fav: any) => {
        // Buscamos la primera variante si existe para sacar el precio y la imagen
        const primeraVariante = fav.variants && fav.variants.length > 0 ? fav.variants[0] : null;

        return {
          id: fav.id,
          nombre: fav.productName || fav.name || 'Producto sin nombre',
          
          
          precio: fav.price || fav.basePrice || 0,
          
          
          foto: fav.imageUrl || (primeraVariante && primeraVariante.images?.length > 0 ? primeraVariante.images[0].imageUrl : ''),
          
          seleccionado: false,
          categoria: 'favoritos'
        };
      });
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