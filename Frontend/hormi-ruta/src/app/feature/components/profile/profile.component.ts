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
  const u = this.userSignal(); // Obtenemos el valor de la Signal

  // Lógica de Rol
  let nombreRol = 'HormiSeguidor';
  if (u?.role === 'admin' || u?.roleId === 1) {
    nombreRol = 'Administrador';
  } else if (u.roleId === 2 || u?.role === 'customer') {
    nombreRol = 'Cliente';
  }
  else if (u?.role) {
    //  cualquier otro, capitalizamos la primera letra
    nombreRol = u.role.charAt(0).toUpperCase() + u.role.slice(1);
  }

  return {
    
   nombre: u?.firstName || 'Usuario', 
    apellido: u?.lastName || '',       
    correo: u?.email || 'Sin correo',
    telefono: u?.phone || 'No registrado',
    direccion: u?.shippingAddress || 'Sin dirección', 
    rol: nombreRol
    //foto: u?.foto || u?.photo_url || ''
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
  
    this.authService.getUserInfo().subscribe({
    next: (data) => console.log('Datos cargados con éxito:', data),
    error: (err) => console.error('No se pudo cargar la info del usuario', err)
  });
  
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
      window.location.href = `/details/${productId}`; 
    }
  }
}