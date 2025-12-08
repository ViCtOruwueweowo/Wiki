import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TopbarComponent } from 'src/app/Components/topbar/topbar.component';
import { BottombarComponent } from 'src/app/Components/bottombar/bottombar.component';
import { CrearDesarrolladorComponent } from 'src/app/Components/crear-desarrollador/crear-desarrollador.component';
import { EditarDesarrolladorComponent } from 'src/app/Components/editar-desarrollador/editar-desarrollador.component';
import { CrearPlataformaComponent } from 'src/app/Components/crear-plataforma/crear-plataforma.component';
import { EditarPlataformaComponent } from 'src/app/Components/editar-plataforma/editar-plataforma.component';

@Component({
  selector: 'app-platform',
  templateUrl: './platform.page.html',
  styleUrls: ['./platform.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    TopbarComponent,
    BottombarComponent,
    CrearDesarrolladorComponent,
    EditarDesarrolladorComponent,
    CrearPlataformaComponent
  ]})
export class PlatformPage implements OnInit {

  isMobile: boolean = false;
    categorias: any[] = [];
  
    constructor(
      private modalCtrl: ModalController,
      private http: HttpClient,
      private toastCtrl: ToastController,
      private loadingCtrl: LoadingController,
      private alertCtrl: AlertController
    ) {}
  
    ngOnInit() {
      this.checkScreen();
      this.cargarCategorias();
    }
  
    @HostListener('window:resize')
    onResize() {
      this.checkScreen();
    }
  
    checkScreen() {
      this.isMobile = window.innerWidth <= 768;
    }
  
    async cargarCategorias() {
      const loading = await this.loadingCtrl.create({ message: 'Cargando plataformas...' });
      await loading.present();
  
      const token = localStorage.getItem('authToken');
  
      this.http.get('https://143.110.205.116/api/platforms/platformList', {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: async (res: any) => {
          await loading.dismiss();
          if (res.success && res.data) {
            this.categorias = res.data.map((cat: any) => ({
              id: cat.id,
              nombre: cat.name
            }));
          } else {
            this.showToast(res.message || 'No se pudo cargar categorías', 'warning');
          }
        },
        error: async () => {
          await loading.dismiss();
          this.showToast('Error al cargar plataformas', 'danger');
        }
      });
    }
  
    async crearCategoria() {
      const modal = await this.modalCtrl.create({ component: CrearPlataformaComponent });
  
      modal.onDidDismiss().then((data) => {
        if (data.data?.name) {
          this.categorias.push({ id: data.data.id, nombre: data.data.name });
        }
      });
  
      await modal.present();
    }
  
    async editarCategoria(categoria: any) {
      const modal = await this.modalCtrl.create({
        component: EditarPlataformaComponent,
        componentProps: { categoria }
      });
  
      modal.onDidDismiss().then((data) => {
        if (data.data) {
          const index = this.categorias.findIndex((c) => c.id === categoria.id);
          if (index > -1) this.categorias[index] = data.data;
        }
      });
  
      await modal.present();
    }
  
    async eliminarCategoria(categoria: any) {
      const alert = await this.alertCtrl.create({
        header: 'Confirmar eliminación',
        message: `¿Deseas eliminar la categoría "${categoria.nombre}"?`,
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          {
            text: 'Eliminar',
            role: 'confirm',
            handler: () => this.confirmDelete(categoria)
          }
        ]
      });
  
      await alert.present();
    }
  
    async confirmDelete(categoria: any) {
      const token = localStorage.getItem('authToken');
      const loading = await this.loadingCtrl.create({ message: 'Eliminando categoría...' });
      await loading.present();
  
      this.http.delete(`https://143.110.205.116/api/platforms/platformRemove/${categoria.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: async (res: any) => {
          await loading.dismiss();
          if (res.success) {
            this.categorias = this.categorias.filter((c) => c.id !== categoria.id);
            this.showToast(res.message || 'Categoría eliminada correctamente', 'success');
          } else {
            this.showToast(res.message || 'Error al eliminar categoría', 'danger');
          }
        },
        error: async () => {
          await loading.dismiss();
          this.showToast('Error al eliminar categoría', 'danger');
        }
      });
    }
  
    async showToast(message: string, color: string) {
      const toast = await this.toastCtrl.create({
        message,
        duration: 2000,
        color
      });
      await toast.present();
    }
  }
  