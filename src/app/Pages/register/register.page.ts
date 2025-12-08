import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class RegisterPage implements OnInit {

  first_name: string = '';
  last_name: string = '';
  phone: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  // 🔹 Métodos para validar campos en el HTML
  isNameInvalid(): boolean {
    const pattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/;
    return this.first_name !== '' && !pattern.test(this.first_name);
  }

  isLastNameInvalid(): boolean {
    const pattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/;
    return this.last_name !== '' && !pattern.test(this.last_name);
  }

  isPhoneInvalid(): boolean {
    const pattern = /^[0-9]{8,15}$/;
    return this.phone !== '' && !pattern.test(this.phone);
  }

  isEmailInvalid(): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.email !== '' && !pattern.test(this.email);
  }

  isPasswordInvalid(): boolean {
    return this.password !== '' && this.password.length < 6;
  }

  // 🔹 Método principal de registro
  async register() {
    if (!this.first_name.trim() || !this.last_name.trim() || !this.phone.trim() || !this.email.trim() || !this.password.trim()) {
      this.showToast('Por favor completa todos los campos.', 'warning');
      return;
    }

    const namePattern = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/;
    const phonePattern = /^[0-9]{8,15}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!namePattern.test(this.first_name) || !namePattern.test(this.last_name)) {
      this.showToast('El nombre y apellido deben contener solo letras y al menos 2 caracteres.', 'warning');
      return;
    }

    if (!phonePattern.test(this.phone)) {
      this.showToast('El teléfono debe contener solo números y tener entre 8 y 15 dígitos.', 'warning');
      return;
    }

    if (!emailPattern.test(this.email)) {
      this.showToast('Por favor ingresa un correo electrónico válido.', 'warning');
      return;
    }

    if (this.password.length < 6) {
      this.showToast('La contraseña debe tener al menos 6 caracteres.', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Registrando usuario...',
      spinner: 'crescent'
    });
    await loading.present();

    const payload = {
      first_name: this.first_name.trim(),
      last_name: this.last_name.trim(),
      phone: this.phone.trim(),
      email: this.email.trim(),
      password: this.password
    };

    this.http.post('http://143.110.205.116/api/auth/registerVisit', payload)
      .subscribe({
        next: async (res: any) => {
          await loading.dismiss();
          await this.showToast(res.message || 'Registro exitoso 🎉');
          this.router.navigate(['/login']);
        },
        error: async (err: HttpErrorResponse) => {
          await loading.dismiss();

          let message = 'Error al registrar.';
          if (err.status === 400 && err.error?.errors) {
            message = Object.values(err.error.errors).flat().join('\n');
          } else if (err.error?.message) {
            message = err.error.message;
          } else if (err.status === 409) {
            message = 'El correo o teléfono ya están registrados.';
          } else if (err.status === 500) {
            message = 'Error interno del servidor.';
          }

          this.showToast(message, 'danger');
        }
      });
  }

  async showToast(message: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
