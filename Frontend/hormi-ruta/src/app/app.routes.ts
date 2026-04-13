import { Routes } from '@angular/router';
import { LoginComponent } from './feature/components/login/login.component';
import { DetailsComponent } from './feature/components/details/details.component';
import { RegisterComponent } from './feature/components/register/register.component';
import { HomeComponent } from './feature/components/home/home.component';
import { AdventureFormComponent } from './feature/components/adventure-form/adventure-form.component';
import { ProductsComponent } from './feature/components/products/products.component';
import { ProfileComponent } from './feature/components/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'details', component: DetailsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'adventure-form', component: AdventureFormComponent },
  { path: 'adventure-form/:id', component: AdventureFormComponent },
  {path: 'products', component:ProductsComponent},
 ];
