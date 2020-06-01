import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { NavController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  form: FormGroup;
  offer: Place;
  offerSubs: Subscription;
  placeId: string;
  isLoading = false;
  constructor(private route: ActivatedRoute, private alertCtrl: AlertController, private router: Router, private loadingCtrl: LoadingController, private navCtrl: NavController, private placeService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.isLoading = true;
      this.placeId = paramMap.get('placeId');
      this.offerSubs = this.placeService.getPlace(this.placeId).subscribe((place: Place) => {
        this.offer = place;
        this.form = new FormGroup({
          title: new FormControl(this.offer.title, {
            updateOn: 'change',
            validators: [Validators.required]
          }),
          description: new FormControl(this.offer.description, {
            updateOn: 'change',
            validators: [Validators.required, Validators.maxLength(180)]
          })
        });
        this.isLoading = false;
      }, (error) => {
        this.alertCtrl.create({
          header: 'An error occured',
          message: 'Could not fetch place. Try again later',
          buttons: [{
            text: 'Ok',
            handler: () => {
              this.router.navigateByUrl('/places/tabs/offers');
            }
          }]
        }).then(el => {
          el.present();
        })
      });
    });
  }

  onUpdateOffer() {
    if (this.form.invalid) {
      return;
    }
    this.loadingCtrl.create({ message: 'Updating..' }).then((el) => {
      el.present();
      this.placeService.updatePlace(this.offer.id, this.form.value.title, this.form.value.description).subscribe(() => {
        el.dismiss();
        this.router.navigateByUrl('/places/tabs/offers');
      }, eror => {
        el.dismiss();
      });
    });
  }

  ngOnDestroy() {
    if (this.offerSubs) {
      this.offerSubs.unsubscribe();
    }
  }
}
