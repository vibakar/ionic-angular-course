import { Component } from '@angular/core';
import { Plugins, Capacitor } from '@capacitor/core';

import { Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(Capacitor.isPluginAvailable('SplachScreen')) {
        Plugins.SplachScreen.hide();
      }
    });
  }

  onClickLogout(){
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
