import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  offersSubs: Subscription;
  isLoading = false;
  constructor(private router: Router, private loadingCtrl: LoadingController, private placesService: PlacesService) { }

  ngOnInit() {
    this.offersSubs = this.placesService.places.subscribe(places => {
      this.offers = places;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.getPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

  ngOnDestroy() {
    if (this.offersSubs) {
      this.offersSubs.unsubscribe();
    }
  }
}
