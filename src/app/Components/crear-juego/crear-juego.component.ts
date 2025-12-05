import { Component, OnInit } from '@angular/core';
import { 
  ModalController, 
  IonButton, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonItem, 
  IonTextarea,
  IonLabel, 
  IonInput, 
  IonButtons, 
  IonSelect, 
  IonSelectOption,
  ToastController, 
  LoadingController 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonIcon, IonCard, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-crear-juego',
  standalone: true,
  imports: [
    IonHeader,
      IonTextarea,
    IonToolbar,
    IonTitle,
    IonIcon,
    IonCard,
    IonCardContent,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonSelect,
    IonSelectOption,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
template: `<ion-header>
  <ion-toolbar style="background:#f9f9f9; color:#222; border-bottom:1px solid #ccc;">
       <ion-title style="font-weight:700; font-size:1.5rem;">Ingresar Juego</ion-title>
       <ion-buttons slot="end">
          <ion-button (click)="dismiss()" 
                      style=" color:gray; border-radius:50%; width:36px; height:36px; padding:0;">
         X
          </ion-button>
        </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true" style="--background:#f9f9f9; padding:20px; font-family:'Times New Roman', serif; color:#222;">
  <ion-card style="border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08); padding:20px; background:#fff;">
    <ion-card-content>

      <!-- Título del juego -->
      <ion-item style="margin-bottom:15px; border:none;">
        <ion-label position="floating" style="font-weight:600;">Título del juego</ion-label>
        <ion-input [(ngModel)]="title"></ion-input>
      </ion-item>

      <!-- Descripción -->
      <ion-item style="margin-bottom:15px; border:none;">
        <ion-label position="floating" style="font-weight:600;">Descripción</ion-label>
        <ion-textarea rows="5" autoGrow="true" [(ngModel)]="description"></ion-textarea>
      </ion-item>

      <!-- Fechas -->
      <ion-item style="margin-bottom:15px; border:none;">
        <ion-label position="floating" style="font-weight:600;">Última actualización</ion-label>
        <ion-input type="date" [(ngModel)]="last_update"></ion-input>
      </ion-item>

      <ion-item style="margin-bottom:15px; border:none;">
        <ion-label position="floating" style="font-weight:600;">Fecha de lanzamiento</ion-label>
        <ion-input type="date" [(ngModel)]="release_date"></ion-input>
      </ion-item>

      <!-- Imagen -->
      <ion-item style="margin-bottom:15px; border:none;">
        <ion-label style="font-weight:600;">Imagen del juego</ion-label>
        <input type="file" accept="image/*" (change)="onFileSelected($event)">
      </ion-item>

      <!-- Developer -->
      <ion-item style="margin-bottom:15px; border:none;">
        <ion-label style="font-weight:600;">Desarrollador</ion-label>
        <ion-select interface="popover" [(ngModel)]="developer_id" placeholder="Seleccione desarrollador">
          <ion-select-option *ngFor="let dev of developers" [value]="dev.id">{{ dev.nombre }}</ion-select-option>
        </ion-select>
      </ion-item>

      <!-- Categoría -->
      <ion-item style="margin-bottom:15px; border:none;">
        <ion-label style="font-weight:600;">Categoría</ion-label>
        <ion-select interface="popover" [(ngModel)]="category_id" placeholder="Seleccione categoría">
          <ion-select-option *ngFor="let cat of categories" [value]="cat.id">{{ cat.nombre }}</ion-select-option>
        </ion-select>
      </ion-item>

      <!-- Plataformas -->
      <ion-item style="margin-bottom:20px; border:none;">
        <ion-label style="font-weight:600;">Plataformas</ion-label>
        <ion-select multiple="true" interface="popover" [value]="platform_ids" (ionChange)="onPlatformsChange($event)" placeholder="Seleccione plataformas">
          <ion-select-option *ngFor="let p of platforms" [value]="p.id">{{ p.nombre }}</ion-select-option>
        </ion-select>
      </ion-item>

      <!-- Botón principal -->
      <ion-button expand="block" shape="round" (click)="crear()"
                  style=" color:#fff; font-weight:600; border-radius:12px;">
        Generar Nuevo Registro
      </ion-button>

    </ion-card-content>
  </ion-card>
</ion-content>

`

})
export class CrearJuegoComponent implements OnInit {

  title = '';
  description = '';
  last_update = '';
  release_date = '';
  developer_id: any = '';
  category_id: any = '';
  platform_ids: number[] = [];
  selectedImage: File | null = null;

  categories: any[] = [];
  developers: any[] = [];
  platforms: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadDevelopers();
    this.loadPlatforms();
  }

  // Carga categorías reales
  loadCategories() {
    const token = localStorage.getItem('authToken');
    this.http.get('http://127.0.0.1:8000/api/categories/categoriesList', { headers: { Authorization: `Bearer ${token}` } })
      .subscribe((res: any) => {
        this.categories = res.data
          ? res.data.map((cat: any) => ({ id: cat.id, nombre: cat.name }))
          : [];
      });
  }

  // Carga desarrolladores reales
  loadDevelopers() {
    const token = localStorage.getItem('authToken');
    this.http.get('http://127.0.0.1:8000/api/developers/developerList', { headers: { Authorization: `Bearer ${token}` } })
      .subscribe((res: any) => {
        this.developers = res.data
          ? res.data.map((dev: any) => ({ id: dev.id, nombre: dev.name }))
          : [];
      });
  }

  // Carga plataformas reales
  loadPlatforms() {
    const token = localStorage.getItem('authToken');
    this.http.get('http://127.0.0.1:8000/api/platforms/platformList', { headers: { Authorization: `Bearer ${token}` } })
      .subscribe((res: any) => {
        this.platforms = res.data
          ? res.data.map((p: any) => ({ id: p.id, nombre: p.name }))
          : [];
      });
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0];
  }

  // Convierte valores de select múltiple a números
  onPlatformsChange(event: any) {
    this.platform_ids = event.detail.value.map((v: any) => Number(v));
  }

  async crear() {
    // Validación completa
    if (
      !this.title.trim() ||
      !this.description.trim() ||
      !this.last_update ||
      !this.release_date ||
      !this.developer_id ||
      !this.category_id ||
      this.platform_ids.length === 0
    ) {
      return this.showToast('Debe llenar todos los campos', 'warning');
    }

    if (!this.selectedImage) {
      return this.showToast('Debes subir una imagen válida', 'warning');
    }

    const loading = await this.loadingCtrl.create({ message: 'Registrando Juego...' });
    await loading.present();

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('last_update', this.last_update);
    formData.append('release_date', this.release_date);
    formData.append('developer_id', this.developer_id);
    formData.append('category_id', this.category_id);
    this.platform_ids.forEach((id, index) => formData.append(`platform_ids[${index}]`, String(id)));
    formData.append('image', this.selectedImage);

    const token = localStorage.getItem('authToken');

    this.http.post(
      'http://127.0.0.1:8000/api/games1/registerGames',
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    ).subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        if (res.success) {
          await this.showToast(res.message, 'success');
          this.modalCtrl.dismiss(res.data, 'created');
        } else {
          await this.showToast(res.message || 'Error desconocido', 'danger');
        }
      },
      error: async () => {
        await loading.dismiss();
        await this.showToast('Error al crear el juego', 'danger');
      }
    });
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}
