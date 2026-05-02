import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common';
import { AuthService } from '../../../feature/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgClass, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected isAdmin = this.authService.isAdmin;
  readonly user = this.authService.user;
  menuOpen = false;
  cartOpen = false;
  profileOpen = false;

  ngOnInit(): void {
    if (sessionStorage.getItem('token') && !this.user()) {
      this.authService.getUserInfo().subscribe();
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.profileOpen = false;
    this.router.navigate(['/login']);
  }
}