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
  ) {}

  ngOnInit() {}

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
    if (!this.email.trim() || !this.password.trim()) {
      this.showAlert('Campos incompletos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    if (!this.captcha) {
      this.showAlert('Verificación requerida', 'Debes completar el reCAPTCHA.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
    });
    await loading.present();

    const body = {
      email: this.email,
      password: this.password,
      captcha: this.captcha
    };

    this.http.post<any>('http://127.0.0.1:8000/api/auth/login', body).subscribe({
      next: async (res) => {
        await loading.dismiss();

        if (res.success) {
          localStorage.setItem('temporaryToken', res.temporaryToken);
          localStorage.setItem('email', this.email);

          await this.showAlert('Éxito', res.message || 'Inicio de sesión exitoso.');
          this.router.navigate(['/second-factor']);
        } else {
          await this.showAlert('Error', res.message || 'Credenciales incorrectas.');
        }
      },
      error: async (err) => {
        await loading.dismiss();
        const status = err.status;
        const data = err.error;

        switch (status) {
          case 400:
            if (data.errors) {
              const errores = Object.values(data.errors).flat().join('<br>');
              this.showAlert('Errores de validación', errores);
            } else this.showAlert('Error', data.message || 'Falló la validación.');
            break;

          case 401:
            this.showAlert('Credenciales inválidas', data.message || 'Correo o contraseña incorrectos.');
            break;

          case 403:
            this.showAlert('Acceso denegado', data.message || 'Captcha no válido o expirado.');
            break;

          case 500:
            this.showAlert('Error del servidor', data.message || 'Ocurrió un error interno.');
            break;

          default:
            this.showAlert('Error', data.message || 'Error desconocido.');
            break;
        }
      },
    });
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