import { Routes } from '@angular/router';
import { LoginComponent } from './feature/components/login/login.component';
import { DetailsComponent } from './feature/components/details/details.component';
import { RegisterComponent } from './feature/components/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'details', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'details', component: DetailsComponent },
  { path: 'register', component: RegisterComponent },
 ];
