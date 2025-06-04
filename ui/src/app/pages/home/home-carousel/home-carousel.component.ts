import {Component, OnInit} from '@angular/core';
import {IonButton, IonIcon} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {play, pause} from "ionicons/icons";
import {Carousel} from "bootstrap";

@Component({
  selector: 'app-home-carousel',
  templateUrl: './home-carousel.component.html',
  styleUrls: ['./home-carousel.component.scss'],
  imports: [
    IonIcon,
    IonButton
  ],
  standalone: true
})
export class HomeCarouselComponent implements OnInit {
  carousel!:Carousel;
  carouselPaused = false;

  constructor() {
    addIcons({play, pause})
  }

  ngOnInit() {
    let myCarouselElement: Element|null = document.querySelector('#homeCarousel')
    if (myCarouselElement) {
      this.carousel = new Carousel(myCarouselElement, {
        interval: 4000,
        ride: "carousel",
        touch: true,
        pause: false
      })
      myCarouselElement.addEventListener('slide.bs.carousel', () => {
        this.onCarouselSlide()
      })
    }
  }

  onCarouselPausePlay() {
    if (this.carouselPaused) this.carousel.cycle()
    else this.carousel.pause()
    this.carouselPaused = !this.carouselPaused;
  }

  onCarouselSlide() {
    this.carouselPaused = false;
  }

}
