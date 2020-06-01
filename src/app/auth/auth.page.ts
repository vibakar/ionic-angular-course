import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  authenticate(email: string, password: string, form: NgForm) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingEl => {
        loadingEl.present();
        if (this.isLogin) {
          this.authService.login(email, password).subscribe(response => {
            loadingEl.dismiss();
            this.router.navigateByUrl('/places/tabs/discover');
            form.reset();
          }, error => {
            loadingEl.dismiss();
            const code = error.error.error.message;
            let message = 'Could not login you, please try again';
            if (code == 'EMAIL_NOT_FOUND') {
              message = 'Email address does not exists';
            }
            this.showAlert(message);
          });
        } else {
          this.authService.signup(email, password).subscribe(response => {
            loadingEl.dismiss();
            this.router.navigateByUrl('/places/tabs/discover');
            form.reset();
          }, error => {
            loadingEl.dismiss();
            const code = error.error.error.message;
            let message = 'Could not sign you up, please try again';
            if (code == 'EMAIL_EXISTS') {
              message = 'Email address already exists';
            }
            this.showAlert(message);
          });
        }
      })
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      const email = form.value.email;
      const password = form.value.password;
      this.authenticate(email, password, form);
    }
  }

  switchForm() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message) {
    this.alertCtrl.
      create({ header: 'Authentication failed', message: message, buttons: ['Ok'] }).then(el => {
        el.present();
      })
  }
}
