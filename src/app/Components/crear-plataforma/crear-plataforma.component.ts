import { Component } from '@angular/core';
import { ModalController, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButtons, ToastController, LoadingController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonIcon } from '@ionic/angular/standalone';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';


@Component({
  selector: 'app-crear-plataforma',
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
      <ion-toolbar style="background:#f9f9f9; color:#222; font-family:'Times New Roman', serif;">
        <ion-title style="font-weight:700; font-size:1.5rem;">Ingresar Plataforma</ion-title>
         <ion-buttons slot="end">
          <ion-button (click)="dismiss()" 
                      style=" color:gray; border-radius:50%; width:36px; height:36px; padding:0;">
         X
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true" style="background:#ffffff; font-family:'Times New Roman', serif; color:#222; padding:15px;">
      <ion-card style="border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,.08);">
        <ion-card-content>
          <ion-item fill="outline" style="border-radius:8px; margin-bottom:15px;">
            <ion-label position="floating" style="font-weight:600; color:#0c1a2b;">Nombre de la Plataforma</ion-label>
            <ion-input [(ngModel)]="name"></ion-input>
          </ion-item>

          <ion-button 
            expand="block" 
            shape="round" 
            style=" color:#fff; font-weight:600; border-radius:12px;"
            (click)="crear()">
            Generar Nuevo Registro
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `
})
export class CrearPlataformaComponent {

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

    this.http.post('http://143.110.205.116/api/platforms/registerPlatform', body, {
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
