import { Component, Input } from '@angular/core';
import { CurrencyPipe, NgIf } from '@angular/common';
import { Adventure } from '../../interfaces/adventure.interface';
import { Router } from '@angular/router';

export interface IPlaceCard {
  title: string;
  description: string;
  image: string;
  price?: number;
  priceNote?: string;
}

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CurrencyPipe, NgIf],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent {
  @Input() place!: Adventure;

  constructor(private router: Router) { }

  editar() {
    console.log("gola");
    this.router.navigate(["/adventure-form", this.place.id]);
  }
}