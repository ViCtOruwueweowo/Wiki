import { Component, Input } from '@angular/core';
import { IonicModule, ModalController, IonButton, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButtons, ToastController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-editar-categoria',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Editar Categoría</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">Nombre de la categoría</ion-label>
        <ion-input [(ngModel)]="categoria.nombre"></ion-input>
      </ion-item>

      <ion-button expand="block" color="warning" (click)="editar()">Guardar Cambios</ion-button>
    </ion-content>
  `
})
export class EditarCategoriaComponent {
  @Input() categoria: any;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  async editar() {
    if (!this.categoria.nombre.trim()) {
      const toast = await this.toastCtrl.create({
        message: 'El nombre de la categoría es obligatorio',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Actualizando categoría...' });
    await loading.present();

    const token = localStorage.getItem('authToken');
    const body = { name: this.categoria.nombre };
    const url = `http://127.0.0.1:8000/api/categories/categorieUpdate/${this.categoria.id}`;

    this.http.put(url, body, {
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

          // Retorna la categoría editada al modal padre
          this.modalCtrl.dismiss({ 
            id: this.categoria.id, 
            nombre: this.categoria.nombre 
          });
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
        console.error('Error al actualizar categoría', err);
        const toast = await this.toastCtrl.create({
          message: 'Error al actualizar categoría',
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
