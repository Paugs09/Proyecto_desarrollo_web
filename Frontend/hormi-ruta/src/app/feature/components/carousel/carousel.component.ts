import { Component, Input, OnInit } from '@angular/core';
import { NgStyle, NgFor,NgIf } from '@angular/common';
import { ICarouselItem } from './Icarousel-item.metadata';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NgStyle, NgFor, NgIf],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent implements OnInit {

  @Input() height = 500;
  @Input() isFullScreen = false;
  @Input() items: ICarouselItem[] = [];

  public finalHeight: string | number = 0;
  public currentPosition = 0;
  ngOnInit() {
    this.finalHeight = this.isFullScreen ? '100vh' : `${this.height}px`;

    this.items.forEach((i, index) => {
      i.id = index;
      i.marginLeft = 0;
    });

  }
  
  setCurrentPosition(position: number) {
    this.currentPosition = position;
    this.items.find(i => i.id === 0)!.marginLeft = -100 * position;
  }

  setNext() {
    let finalPercentage = 0;
    let nextPosition = this.currentPosition + 1;
    if (nextPosition <= this.items.length - 1) {
      finalPercentage = -100 * nextPosition;
    } else {
      nextPosition = 0;
    }
    this.items.find(i => i.id === 0)!.marginLeft = finalPercentage;
    this.currentPosition = nextPosition;
  }

  setBack() {
    let finalPercentage = 0;
    let backPosition = this.currentPosition - 1;
    if (backPosition >= 0) {
      finalPercentage = -100 * backPosition;
    } else {
      backPosition = this.items.length - 1;
      finalPercentage = -100 * backPosition;
    }
    this.items.find(i => i.id === 0)!.marginLeft = finalPercentage;
    this.currentPosition = backPosition;
  }

  scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}