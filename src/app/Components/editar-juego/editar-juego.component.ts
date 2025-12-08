import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-editar-juego',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  template: `
<ion-header>
  <ion-toolbar style="background:#f9f9f9; color:#222; font-family:'Times New Roman', serif;">
    <ion-title style="font-weight:700; font-size:1.5rem;">Editar Juego</ion-title>
    <ion-buttons slot="end">
      <ion-button (click)="dismiss()" style="color:gray; border-radius:50%; width:36px; height:36px; padding:0;">X</ion-button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true" style="--background:#ffffff; font-family:'Times New Roman', serif; color:#222; padding:15px;">
  
  <ng-container *ngIf="juegoLoaded; else cargando">
    <ion-card style="border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,.08);">
      <ion-card-content>

        <ion-item style="margin-bottom:15px; border:none;">
          <ion-label position="floating" style="font-weight:600;">Título del juego</ion-label>
          <ion-input [(ngModel)]="title"></ion-input>
        </ion-item>

        <ion-item style="margin-bottom:15px; border:none;">
          <ion-label position="floating" style="font-weight:600;">Descripción</ion-label>
          <ion-textarea rows="5" autoGrow="true" [(ngModel)]="description"></ion-textarea>
        </ion-item>

        <ion-item style="margin-bottom:15px; border:none;">
          <ion-label position="floating" style="font-weight:600;">Última actualización</ion-label>
          <ion-input type="date" [(ngModel)]="last_update"></ion-input>
        </ion-item>

        <ion-item style="margin-bottom:15px; border:none;">
          <ion-label position="floating" style="font-weight:600;">Fecha de lanzamiento</ion-label>
          <ion-input type="date" [(ngModel)]="release_date"></ion-input>
        </ion-item>

        <ion-item style="margin-bottom:15px; border:none;">
          <ion-label style="font-weight:600;">Imagen del juego</ion-label>
          <input type="file" accept="image/*" (change)="onFileSelected($event)">
        </ion-item>

        <ion-item style="margin-bottom:15px; border:none;">
          <ion-label style="font-weight:600;">Desarrollador</ion-label>
          <ion-select interface="popover" [(ngModel)]="developer_id" placeholder="Seleccione desarrollador">
            <ion-select-option *ngFor="let dev of developers" [value]="dev.id">{{ dev.nombre }}</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item style="margin-bottom:15px; border:none;">
          <ion-label style="font-weight:600;">Categoría</ion-label>
          <ion-select interface="popover" [(ngModel)]="category_id" placeholder="Seleccione categoría">
            <ion-select-option *ngFor="let cat of categories" [value]="cat.id">{{ cat.nombre }}</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item style="margin-bottom:20px; border:none;">
          <ion-label style="font-weight:600;">Plataformas</ion-label>
          <ion-select [multiple]="true" interface="popover" [value]="platform_ids" (ionChange)="onPlatformsChange($event)" placeholder="Seleccione plataformas">
            <ion-select-option *ngFor="let p of platforms" [value]="p.id">{{ p.nombre }}</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-button expand="block" shape="round" style="color:#fff; font-weight:600; border-radius:12px;" (click)="editar()">
          Guardar Cambios
        </ion-button>

      </ion-card-content>
    </ion-card>
  </ng-container>

  <ng-template #cargando>
    <div style="display:flex; justify-content:center; align-items:center; height:100%;">
      <ion-spinner name="crescent"></ion-spinner>
    </div>
  </ng-template>

</ion-content>
  `
})
export class EditarJuegoComponent implements OnInit, OnChanges {

  @Input() juego: any;

  juegoLoaded = false;

  title = '';
  description = '';
  last_update = '';
  release_date = '';
  developer_id: number | '' = '';
  category_id: number | '' = '';
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['juego'] && this.juego) {
      console.log('=== Datos recibidos para editar ===');
      console.log(this.juego);

      this.title = this.juego.title || '';
      this.description = this.juego.description || '';
      this.last_update = this.juego.last_update ? this.juego.last_update.split('T')[0] : '';
      this.release_date = this.juego.release_date ? this.juego.release_date.split('T')[0] : '';
      this.developer_id = this.juego.developer_id || '';
      this.category_id = this.juego.category_id || '';
      this.platform_ids = this.juego.platforms?.map((p: any) => p.id) || [];

      console.log('=== Datos procesados para mostrar en formulario ===');
      console.log({
        title: this.title,
        description: this.description,
        last_update: this.last_update,
        release_date: this.release_date,
        developer_id: this.developer_id,
        category_id: this.category_id,
        platform_ids: this.platform_ids
      });

      this.juegoLoaded = true;
    }
  }

  loadCategories() {
    const token = localStorage.getItem('authToken') || '';
    this.http.get('https://143.110.205.116/api/categories/categoriesList', { headers: { Authorization: `Bearer ${token}` } })
      .subscribe((res: any) => {
        this.categories = res.data?.map((cat: any) => ({ id: cat.id, nombre: cat.name })) || [];
        console.log('Categorías cargadas:', this.categories);
      });
  }

  loadDevelopers() {
    const token = localStorage.getItem('authToken') || '';
    this.http.get('https://143.110.205.116/api/developers/developerList', { headers: { Authorization: `Bearer ${token}` } })
      .subscribe((res: any) => {
        this.developers = res.data?.map((dev: any) => ({ id: dev.id, nombre: dev.name })) || [];
        console.log('Desarrolladores cargados:', this.developers);
      });
  }

  loadPlatforms() {
    const token = localStorage.getItem('authToken') || '';
    this.http.get('https://143.110.205.116/api/platforms/platformList', { headers: { Authorization: `Bearer ${token}` } })
      .subscribe((res: any) => {
        this.platforms = res.data?.map((p: any) => ({ id: p.id, nombre: p.name })) || [];
        console.log('Plataformas cargadas:', this.platforms);
      });
  }

  onFileSelected(event: any) {
    this.selectedImage = event.target.files[0] || null;
    console.log('Imagen seleccionada:', this.selectedImage);
  }

  onPlatformsChange(event: any) {
    this.platform_ids = event.detail.value.map((v: any) => Number(v));
    console.log('Plataformas seleccionadas:', this.platform_ids);
  }

  async editar() {
    if (!this.title.trim() || !this.description.trim()) {
      return this.showToast('Título y descripción son obligatorios', 'warning');
    }

    console.log('=== Datos a enviar al backend ===');
    console.log({
      title: this.title,
      description: this.description,
      last_update: this.last_update,
      release_date: this.release_date,
      developer_id: this.developer_id,
      category_id: this.category_id,
      platform_ids: this.platform_ids,
      selectedImage: this.selectedImage
    });

    const loading = await this.loadingCtrl.create({ message: 'Actualizando juego...' });
    await loading.present();

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('last_update', this.last_update);
    formData.append('release_date', this.release_date);
    formData.append('developer_id', String(this.developer_id));
    formData.append('category_id', String(this.category_id));
    this.platform_ids.forEach((id, index) => formData.append(`platform_ids[${index}]`, String(id)));
    if (this.selectedImage) formData.append('image', this.selectedImage);

    const token = localStorage.getItem('authToken') || '';
    const url = `https://143.110.205.116/api/games1/update/${this.juego.id}`;

    this.http.post(url, formData, { headers: { Authorization: `Bearer ${token}` } })
      .subscribe({
        next: async (res: any) => {
          await loading.dismiss();
          if (res.success) {
            await this.showToast(res.message, 'success');
            this.modalCtrl.dismiss(res.data, 'updated');
          } else {
            await this.showToast(res.message || 'Error desconocido', 'danger');
          }
        },
        error: async (err) => {
          await loading.dismiss();
          console.error('Error al actualizar juego', err);
          await this.showToast('Error al actualizar el juego', 'danger');
        }
      });
  }

  dismiss() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color });
    toast.present();
  }
}
