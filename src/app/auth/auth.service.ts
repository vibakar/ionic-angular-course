import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, pipe, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';

import { environment } from '../../environments/environment';
import { User } from './user.model';
import { Router } from '@angular/router';

interface AuthRespData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;
  constructor(private http: HttpClient, private router: Router) { }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return !!user.token;
      }
      return false;
    }));
  }

  get userId() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.id;
      }
      return null;
    }));
  }

  get token() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.token;
      }
      return null;
    }));
  }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(map(storedData => {
      if (!storedData || !storedData.value) {
        return null;
      }
      const parsedData = JSON.parse(storedData.value) as {
        userId: string,
        token: string,
        expirationTime: string,
        email: string
      }
      const expirationTime = new Date(parsedData.expirationTime);
      if (expirationTime <= new Date()) {
        return null;
      }
      const user = new User(parsedData.userId, parsedData.email, parsedData.token, expirationTime);
      return user;
    }), tap(user => {
      if (user) {
        this._user.next(user);
        this.autoLogout(user.tokenDuration)
      }
    }), map(user => {
      return !!user;
    }));
  }

  private autoLogout(duration: number) {    
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  login(email: string, password: string) {
    return this.http.post<AuthRespData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(tap((userData) => {
      this.setUserData(userData);
    }));
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });
    this.router.navigateByUrl('/auth');
  }

  signup(email: string, password: string) {
    return this.http.post<AuthRespData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(tap((userData) => {
      this.setUserData(userData);
    }));
  }

  private setUserData(user: AuthRespData) {
    const expirationTime = new Date(new Date().getTime() + (+user.expiresIn * 1000));
    const userModal = new User(user.localId, user.email, user.idToken, expirationTime);
    this._user.next(userModal);
    this.autoLogout(userModal.tokenDuration);
    this.storeAuthData(user.localId, user.idToken, expirationTime.toISOString(), user.email);
  }

  private storeAuthData(userId: string, token: string, expirationTime: string, email: string) {
    const data = JSON.stringify({ userId, token, expirationTime, email });
    Plugins.Storage.set({ key: 'authData', value: data });
  }

  ngOnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }
}
