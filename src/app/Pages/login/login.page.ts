import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

declare var grecaptcha: any; // 👈 Necesario para usar reCAPTCHA

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule, RouterLink],
})
export class LoginPage implements OnInit, AfterViewInit {

  email: string = '';
  password: string = '';
  captcha: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {

    // 🟢 Callback cuando Google valida el captcha
    (window as any).onRecaptchaSuccess = (token: string) => {
      this.captcha = token;
      console.log('Captcha generado:', token);
    };

    // 🔥 Renderizar explícitamente el captcha para que no desaparezca al recargar
    setTimeout(() => {
      const captchaContainer = document.getElementById('recaptcha-container');
      if (captchaContainer) {
        grecaptcha.render('recaptcha-container', {
          sitekey: '6LeDPyUsAAAAACwfeolz2oPm5N_u4GoSiLwLuuBk', // <- PON AQUI TU CLAVE PÚBLICA
          callback: 'onRecaptchaSuccess'
        });
      }
    }, 300);
  }

  async login() {
    console.log('Click en login detectado');
    try {
      const response = await fetch('https://grupoduran.shop/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
          captcha: this.captcha
        })
      });
      const data = await response.json();
      console.log('Respuesta API:', data);
    } catch (err) {
      console.error('Error fetch:', err);
    }
  }


  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
