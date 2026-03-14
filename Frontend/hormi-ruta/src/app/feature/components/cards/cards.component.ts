import { Component, Input } from '@angular/core';
import { CurrencyPipe, NgIf} from '@angular/common';
import { Adventure } from '../../interfaces/adventure.interface';

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
}