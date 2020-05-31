import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';
import { BookingService } from '../../../bookings/booking.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  placeSubs: Subscription;
  showBookBtn = false;
  isLoading = false;
  constructor(private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private placeService: PlacesService,
    private bookingService: BookingService,
    private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.placeSubs = this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      let placeId = paramMap.get('placeId');
      this.placeService.getPlace(placeId).subscribe((place: Place) => {
        this.isLoading = false;
        this.place = place;
        console.log(this.place)
        this.showBookBtn = this.place.userId !== this.authService.userId;
      }, (error) => {
        this.alertCtrl.create({
          header: 'An error occured',
          message: 'Could not fetch place. Try again later',
          buttons: [{
            text: 'Ok',
            handler: () => {
              this.router.navigateByUrl('/places/tabs/discover');
            }
          }]
        }).then(el => {
          el.present();
        })
      });
    });
  }

  onClickBook() {
    this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps: {
        selectedPlace: this.place
      }
    })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(result => {
        if (result.role === 'confirm') {
          this.loadingCtrl.create({ message: 'Booking in progress..' })
            .then(el => {
              el.present();
              const data = result.data.bookingData;
              this.bookingService.addBooking(
                this.place.id,
                this.place.title,
                this.place.imageUrl,
                data.firstName,
                data.lastName,
                data.guestNumber,
                data.startDate,
                data.endDate
              ).subscribe(() => {
                el.dismiss();
                this.router.navigateByUrl('/places/tabs/discover');
              });
            })
        }
      });
  }

  ngOnDestroy() {
    if (this.placeSubs) {
      this.placeSubs.unsubscribe();
    }
  }
}
