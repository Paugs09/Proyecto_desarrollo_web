import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DetallesComponent } from './pages/detalles/detalles.component';
import { RegistroComponent } from './pages/registro/registro.component';

export const routes: Routes = [
  { path: '', redirectTo: 'detalles', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'detalles', component: DetallesComponent },
  { path: 'registro', component: RegistroComponent },
 ];
