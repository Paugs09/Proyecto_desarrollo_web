import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DetailsComponent } from './pages/details/details.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'details', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'details', component: DetailsComponent },
  { path: 'register', component: RegisterComponent },
 ];
