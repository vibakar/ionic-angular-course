import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingService } from './booking.service';
import { Booking } from './bookings.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  bookingsSubs: Subscription;
  constructor(private loadingCtrl: LoadingController, private bookingService: BookingService) { }

  ngOnInit() {
    this.loadingCtrl.create().then((el) => {
      el.present();
      this.bookingsSubs = this.bookingService.bookings.subscribe(bookings => {
        this.loadedBookings = bookings;
        el.dismiss();
      });
    });
  }

  ionViewWillEnter() {
    this.bookingService.getBookings().subscribe();
  }

  onCancelBooking(bookingId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.loadingCtrl.create({message: 'Deleting the booking'}).then(el => {
      el.present();
      this.bookingService.cancelBooking(bookingId).subscribe(() => {
        el.dismiss();
      });
    });
  }

  ngOnDestroy() {
    if(this.bookingsSubs) {
      this.bookingsSubs.unsubscribe();
    }
  }
}
