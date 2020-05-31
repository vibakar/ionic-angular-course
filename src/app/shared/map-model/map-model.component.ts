import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { promise } from 'protractor';
import { resolve } from 'url';

@Component({
  selector: 'app-map-model',
  templateUrl: './map-model.component.html',
  styleUrls: ['./map-model.component.scss'],
})
export class MapModelComponent implements OnInit, AfterViewInit {
  @ViewChild('map', {static: true}) mapElementRef: ElementRef;
  constructor(private modalCtrl: ModalController, private renderer: Renderer2) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.getGoogleMaps().then((googleMaps) => {
      const mapEl = this.mapElementRef.nativeElement;
      const map = new googleMaps.Map(mapEl, {
        center: {lat: -34.397, lng: 150.644},
        zoom: 16
      });
      googleMaps.event.addListener(map, 'idle', () => {
        this.renderer.addClass(mapEl, 'visible');
      });
    }, (err) => {
      console.log('err', err);
    });
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  private getGoogleMaps(): Promise<any> {
    const wind = window as any;
    const googleModule = wind.google;
    if (googleModule) {
      return Promise.resolve(googleModule);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDPNvV7aaiS35k-eMc00oi3hyp1PkVOt9M";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = wind.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps sdk not available');
        }
      }
    });
  }
}
