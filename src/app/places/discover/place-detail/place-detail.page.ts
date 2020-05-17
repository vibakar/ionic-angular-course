import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;
  constructor(private navCtrl: NavController, private modalCtrl: ModalController, private route: ActivatedRoute, private placeService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      let placeId = paramMap.get('placeId');
      this.place = this.placeService.places.find(p => p.id === placeId);
    });
  }

  onClickBook() {
    // this.navCtrl.navigateBack("/places/tabs/discover");
    this.modalCtrl.create({ component: CreateBookingComponent, componentProps: { selectedPlace: this.place }})
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss()
      })
      .then(result => {
        if(result.role === 'confirm') {
          console.log('Booked');
        }
      });
  }

}
