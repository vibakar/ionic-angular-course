import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';

import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  endpoint: string = 'https://ionic-angular-course-bbe41.firebaseio.com';
  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) { }

  get places() {
    return this._places.asObservable();
  }

  getPlaces() {
    return this.http.get<{ [key: string]: PlaceData }>(this.endpoint + '/offered-places.json')
      .pipe(map(resData => {
        let places = [];
        for (let key in resData) {
          if (resData.hasOwnProperty) {
            places.push(
              new Place(key,
                resData[key].title,
                resData[key].description,
                resData[key].imageUrl,
                resData[key].price,
                new Date(resData[key].availableFrom),
                new Date(resData[key].availableTo),
                resData[key].userId)
            );
          }
        }
        return places;
      }), tap(places => {
        this._places.next(places);
      }));
  }

  getPlace(id: string) {
    return this.http.get<PlaceData>(`${this.endpoint}/offered-places/${id}.json`).pipe(map((place) => {
      return new Place(id, place.title, place.description, place.imageUrl, place.price, new Date(place.availableFrom), new Date(place.availableTo), place.userId);
    }));
  }

  addPlaces(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
    let newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://www.planetware.com/wpimages/2019/11/india-best-places-to-visit-agra.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    return this.http.post<{ name: string }>(this.endpoint + '/offered-places.json', { ...newPlace, id: null })
      .pipe(switchMap(resData => {
        generatedId = resData.name;
        return this.places;
      }), take(1), tap(places => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      }));
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[] = [];
    return this.places.pipe(take(1), switchMap((places) => {
      if (places.length == 0) {
        return this.getPlaces();
      } else {
        return of(places);
      }
    }), switchMap((places) => {
      let placeIndex = places.findIndex(p => p.id === placeId);
      let oldPlace = places[placeIndex];
      updatedPlaces = [...places];
      updatedPlaces[placeIndex] = new Place(placeId, title, description, oldPlace.imageUrl, oldPlace.price, oldPlace.availableFrom, oldPlace.availableTo, oldPlace.userId);
      return this.http.put(`${this.endpoint}/offered-places/${placeId}.json`, { ...updatedPlaces[placeIndex] });
    }), tap(() => {
      this._places.next(updatedPlaces);
    }));
  }
}
