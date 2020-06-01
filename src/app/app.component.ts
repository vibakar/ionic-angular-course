import { Component, OnInit, OnDestroy } from '@angular/core';
import { Plugins, Capacitor } from '@capacitor/core';

import { Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  authSubs: Subscription;
  prevAuthState = false;
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplachScreen')) {
        Plugins.SplachScreen.hide();
      }
    });
  }

  ngOnInit() {
    // this.authSubs = this.authService.userIsAuthenticated.subscribe(isAuthenticated => {
    //   if (!isAuthenticated && this.prevAuthState !== isAuthenticated) {
    //     this.router.navigateByUrl('/auth');
    //   }
    //   this.prevAuthState = isAuthenticated;
    // })
  }

  onClickLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authSubs) {
      this.authSubs.unsubscribe();
    }
  }
}
