import { Component, OnInit, Input, ViewChild } from '@angular/core';

import { Place } from '../../places/place.model';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @ViewChild('f', { static: true }) form: NgForm;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {

  }

  onClose() {
    this.modalCtrl.dismiss(null, 'close');
  }

  onBookPlace() {
    if (this.form.invalid || !this.datesValid) {
      return;
    }
    this.modalCtrl.dismiss({
      bookingData: {
        firstName: this.form.value['firstName'],
        lastName: this.form.value['lastName'],
        guestNumber: this.form.value['noOfGuests'],
        startDate: this.form.value['dateFrom'],
        endDate: this.form.value['dateTo']
      }
    }, 'confirm');
  }

  datesValid() {
    const startDate = new Date(this.form.value['dateFrom']);
    const endDate = new Date(this.form.value['dateTo']);
    return endDate > startDate;
  }
}
