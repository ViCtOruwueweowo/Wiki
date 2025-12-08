import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-second-factor',
  templateUrl: './second-factor.page.html',
  styleUrls: ['./second-factor.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
})
export class SecondFactorPage implements OnInit {
  code: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  async verifyCode() {
    const temporaryToken = localStorage.getItem('temporaryToken');
    const email = localStorage.getItem('email');
    const code = (this.code || '').trim();

    // 🔹 Validaciones en el frontend
    if (!temporaryToken) {
      this.showAlert('Sesión expirada', 'Por favor inicia sesión nuevamente.');
      this.router.navigate(['/login']);
      return;
    }

    if (!code) {
      this.showAlert('Campo vacío', 'Por favor ingresa el código de verificación.');
      return;
    }

    if (!/^\d{4,8}$/.test(code)) {
      this.showAlert('Código inválido', 'El código debe contener entre 4 y 8 dígitos numéricos.');
      return;
    }

    // 🔹 Loader mientras se hace la petición
    const loading = await this.loadingController.create({
      message: 'Verificando código...',
      spinner: 'crescent',
    });
    await loading.present();

    const url = `http://143.110.205.116/api/auth/verify-2fa?code=${code}&temporaryToken=${temporaryToken}`;

    this.http.post<any>(url, {}).subscribe({
      next: async (res) => {
        await loading.dismiss();

        if (res.success) {
          // Guardar token final y rol
          localStorage.setItem('authToken', res.data.token);
          localStorage.setItem('userRole', res.data.role);

          await this.showAlert('Éxito', 'Código verificado correctamente');
          this.router.navigate(['/']); // Redirige al dashboard o home
        } else {
          await this.showAlert('Error', res.message || 'Código incorrecto o expirado.');
        }
      },
      error: async (err) => {
        await loading.dismiss();

        const status = err.status;
        const data = err.error;

        switch (status) {
          case 400:
            this.showAlert('Error de validación', data.message || 'Código inválido.');
            break;
          case 401:
            this.showAlert('Código incorrecto', data.message || 'El código ingresado no es válido.');
            break;
          case 403:
            this.showAlert('Sesión expirada', data.message || 'Por favor inicia sesión nuevamente.');
            this.router.navigate(['/login']);
            break;
          case 500:
            this.showAlert('Error del servidor', data.message || 'Ocurrió un problema interno.');
            break;
          default:
            this.showAlert('Error desconocido', data.message || 'Intenta nuevamente.');
            break;
        }
      },
    });
  }

  // 🔹 Método reutilizable para mostrar alertas
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
