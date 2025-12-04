import { Component } from '@angular/core';
import { ModalController, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButtons, ToastController, LoadingController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonIcon } from '@ionic/angular/standalone';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';


@Component({
  selector: 'app-crear-categoria',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonCardContent,
    IonCard,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title class="text-center">Ingresar Categoria</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" (click)="dismiss()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-card>
        <ion-card-content>
          <ion-item fill="outline">
            <ion-label position="floating">Ingresar Categoria</ion-label>
            <ion-input [(ngModel)]="name"></ion-input>
          </ion-item>

          <ion-button 
            expand="block" 
            shape="round" 
            color="primary" 
            class="ion-margin-top"
            (click)="crear()">
           Generar Nuevo Registro
          </ion-button>
        </ion-card-content>
      </ion-card>

    </ion-content>
  `
})
export class CrearCategoriaComponent {
  name: string = '';

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  async crear() {
    if (!this.name.trim()) {
      const toast = await this.toastCtrl.create({
        message: 'Se solicita llenar los campos',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Generando Registro...'
    });
    await loading.present();

    const body = { name: this.name };
    const token = localStorage.getItem('authToken'); // Ajusta según donde tengas tu JWT

    this.http.post('http://127.0.0.1:8000/api/categories/registerCategories', body, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        if (res.success) {
          const toast = await this.toastCtrl.create({
            message: res.message,
            duration: 2000,
            color: 'success'
          });
          await toast.present();

          // Devuelve la categoría creada al modal padre
          this.modalCtrl.dismiss(res.data);
        } else {
          const toast = await this.toastCtrl.create({
            message: res.message || 'Error desconocido',
            duration: 2000,
            color: 'danger'
          });
          await toast.present();
        }
      },
      error: async (err) => {
        await loading.dismiss();
        console.error('Error al crear', err);
        const toast = await this.toastCtrl.create({
          message: 'Error al crear',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
