import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { PlacesService } from '../../places.service';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  constructor(private router: Router, private loadingCtrl: LoadingController, private placeService: PlacesService) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(100)]
      }),
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      })
    });
  }

  onImagePick(imageData: string | File) {
    let imageFile;
    if (typeof imageData == 'string') {
      try {
        imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64', ''), 'image/jpeg');
      } catch (err) {
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({image: imageFile});
  }

  onCreateOffer() {
    if(this.form.invalid) {
      return;
    }
    
    this.loadingCtrl.create({ message: 'Creating..' }).then(el => {
      el.present();
      this.placeService.addPlaces(
        this.form.value.title,
        this.form.value.description,
        this.form.value.price,
        new Date(this.form.value.dateFrom),
        new Date(this.form.value.dateTo)
      ).subscribe(() => {
        el.dismiss();
        this.form.reset();
        this.router.navigateByUrl('/places/tabs/offers');
      });
    });
  }
}
