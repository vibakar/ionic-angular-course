import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, delay, tap, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Booking } from './bookings.model';
import { AuthService } from '../auth/auth.service';

interface BookingData {
    availableFrom: string;
    availableTo: string;
    firstName: string;
    lastName: string;
    guestNumber: number;
    placeId: string;
    userId: string;
    placeImage: string;
    placeTitle: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
    private _bookings = new BehaviorSubject<Booking[]>([]);
    endpoint: string = 'https://ionic-angular-course-bbe41.firebaseio.com';

    constructor(private http: HttpClient, private authService: AuthService) { }

    get bookings() {
        return this._bookings.asObservable();
    }

    addBooking(placeId: string, placeTitle: string, placeImage: string, firstName: string, lastName: string, guestNumber: number, dateFrom: Date, dateTo: Date) {
        let generatedId: string;
        const newBooking = new Booking(
            Math.random.toString(),
            placeId,
            this.authService.userId,
            placeTitle,
            placeImage,
            firstName,
            lastName,
            guestNumber,
            dateFrom,
            dateTo
        );
        return this.http.post<{ name: string }>(`${this.endpoint}/bookings.json`, { ...newBooking, id: null }).pipe(switchMap((resData) => {
            generatedId = resData.name;
            return this.bookings;
        }), take(1), tap(bookings => {
            newBooking.id = generatedId;
            this._bookings.next(bookings.concat(newBooking));
        }));
    }

    getBookings() {
        return this.http.get<{ [key: string]: BookingData }>(`${this.endpoint}/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`)
            .pipe(map((resData) => {
                let bookings = [];
                for (let key in resData) {
                    if (resData.hasOwnProperty(key)) {
                        bookings.push(
                            new Booking(
                                key,
                                resData[key].placeId,
                                resData[key].userId,
                                resData[key].placeTitle,
                                resData[key].placeImage,
                                resData[key].firstName,
                                resData[key].lastName,
                                resData[key].guestNumber,
                                new Date(resData[key].availableFrom),
                                new Date(resData[key].availableTo)
                            )
                        )
                    }
                }
                return bookings;
            }), tap((bookings) => {
                this._bookings.next(bookings);
            }));
    }

    cancelBooking(bookingId: string) {
        console.log(bookingId);
        return this.http.delete(`${this.endpoint}/bookings/${bookingId}.json`)
            .pipe(switchMap((res) => {
                console.log(res);
                
                return this.bookings;
            }), take(1), tap(bookings => {
                this._bookings.next(bookings.filter(b => b.id !== bookingId));
            }));
    }
}