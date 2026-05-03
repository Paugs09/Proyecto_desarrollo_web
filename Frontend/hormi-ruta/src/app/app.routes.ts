import { Routes } from '@angular/router';
import { LoginComponent } from './feature/components/login/login.component';
import { DetailsComponent } from './feature/components/details/details.component';
import { RegisterComponent } from './feature/components/register/register.component';
import { HomeComponent } from './feature/components/home/home.component';
import { AdventureFormComponent } from './feature/components/adventure-form/adventure-form.component';
import { ProductsComponent } from './feature/components/products/products.component';
import { ProfileComponent } from './feature/components/profile/profile.component';
import { CartComponent } from './feature/components/cart/cart.component';


import { ProductFormComponent } from './feature/components/product-form/product-form.component';
import { adminGuard } from './feature/guards/admin.guard';
import { EditProfileComponent } from './feature/components/edit-profile/edit-profile.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'details/:id', component: DetailsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'adventure-form', component: AdventureFormComponent },
  { path: 'adventure-form/:id', component: AdventureFormComponent },
  {path: 'products', component:ProductsComponent},
  {path: 'cart', component: CartComponent},
  {path: 'edit-profile', component: EditProfileComponent},

  { 
    path: 'admin/crear-producto', 
    component: ProductFormComponent, 
    canActivate: [adminGuard] 
  },

  { 
    path: 'admin/editar-producto/:id',
    component: ProductFormComponent, 
    canActivate: [adminGuard] 
  }

 ];
