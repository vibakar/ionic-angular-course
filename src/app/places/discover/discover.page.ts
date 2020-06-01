import { Component, OnInit, OnDestroy } from '@angular/core';

import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listLoadedPlaces: Place[];
  relevantPlaces: Place[];
  placesSubs: Subscription;
  isLoading = false;
  constructor(private placesService: PlacesService, private authService: AuthService) { }

  ngOnInit() {
    this.placesSubs = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.getPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onFilterChange(event: CustomEvent) {
    this.authService.userId.pipe(take(1)).subscribe(userId => {
      if (event.detail.value === 'allPlaces') {
        this.relevantPlaces = this.loadedPlaces;
        this.listLoadedPlaces = this.relevantPlaces.slice(1);
      } else {
        this.relevantPlaces = this.loadedPlaces.filter(p => p.userId !== userId);
        this.listLoadedPlaces = this.relevantPlaces.slice(1);
      }
    });
  }

  ngOnDestroy() {
    if (this.placesSubs) {
      this.placesSubs.unsubscribe();
    }
  }
}
