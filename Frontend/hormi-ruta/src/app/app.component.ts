import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from "./shared/components/header/header.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { AuthService } from './feature/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'hormi-ruta';

  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.authService.logout$.subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
