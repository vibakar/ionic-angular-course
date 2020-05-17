import { Injectable } from '@angular/core';
import { Booking } from './bookings.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
    private _bookings: Booking[] = [
        new Booking(
            'abc',
            'p1',
            'xyz',
            'Taj Mahal',
            5
        ),
        new Booking(
            'def',
            'p2',
            'pqr',
            'Eiffel Tower',
            3
        )
    ];

    get bookings() {
        return [...this._bookings];
    }
}