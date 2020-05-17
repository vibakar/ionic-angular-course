import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Taj Mahal',
      'In the city of Agra',
      'https://www.planetware.com/wpimages/2019/11/india-best-places-to-visit-agra.jpg',
      120.00
     ),
     new Place(
      'p2',
      'Eiffel Tower',
      'In the city of France',
      'https://img.traveltriangle.com/blog/wp-content/tr:w-700,h-400/uploads/2016/07/Eiffel-Tower-in-Paris1.jpg',
      151.00
     ),
     new Place(
      'p3',
      'Statue of Liberty',
      'In the city of New York',
      'https://untappedcities-wpengine.netdna-ssl.com/wp-content/uploads/2015/07/Statue-of-Liberty-Crown-Climb-Pedestal-Interior-Structure-NYC.jpg',
      287.00
     )
  ];

  constructor() { }

  get places () {
    return [...this._places];
  }
}
