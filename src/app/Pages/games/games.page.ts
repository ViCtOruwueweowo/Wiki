import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TopbarComponent } from 'src/app/Components/topbar/topbar.component';
import { BottombarComponent } from 'src/app/Components/bottombar/bottombar.component';
import { EditarJuegoComponent } from 'src/app/Components/editar-juego/editar-juego.component';
import { CrearJuegoComponent } from 'src/app/Components/crear-juego/crear-juego.component';

@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    TopbarComponent,
    BottombarComponent,
    CrearJuegoComponent,
    EditarJuegoComponent
  ]
})
export class GamesPage implements OnInit {

  isMobile = false;
  juegos: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.checkScreen();
    this.cargarJuegos();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  checkScreen() {
    this.isMobile = window.innerWidth <= 768;
  }

  // ================= CARGAR JUEGOS ================= //
async cargarJuegos() {
  const loading = await this.loadingCtrl.create({ message: 'Cargando juegos...' });
  await loading.present();

  const token = localStorage.getItem('authToken');

  this.http.get('http://127.0.0.1:8000/api/auth/games', {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe({
    next: async (res: any) => {
      await loading.dismiss();

      if (res.success && res.data) {
        this.juegos = res.data.map((g: any) => ({
          id: g.id,
          titulo: g.title,
          descripcion: g.description,
          imagen: g.image_url,
          developer: g.developer?.name || 'N/A',
          category: g.category?.name || 'Sin categoría',
          plataformas: g.platforms?.map((p: any) => p.name).join(', ') || 'Sin plataformas'
        }));
      }
    },
    error: async () => {
      await loading.dismiss();
      this.showToast('Error cargando juegos', 'danger');
    }
  });
}


  // ================= CREAR JUEGO ================= //
  async crearJuego() {
    const modal = await this.modalCtrl.create({ component: CrearJuegoComponent });

    modal.onDidDismiss().then((data) => {
      if (data.data?.id) {
        this.juegos.push({
          id: data.data.id,
          nombre: data.data.title
        });
      }
    });

    await modal.present();
  }

  // ================= EDITAR JUEGO ================= //
  async editarJuego(juego: any) {
    const modal = await this.modalCtrl.create({
      component: EditarJuegoComponent,
      componentProps: { juego }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        const index = this.juegos.findIndex((c) => c.id === juego.id);
        if (index > -1) this.juegos[index] = data.data;
      }
    });

    await modal.present();
  }

  // ================= ELIMINAR JUEGO ================= //
  async eliminarJuego(juego: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: `¿Deseas eliminar a <b>${juego.nombre}</b>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'confirm', handler: () => this.confirmDeleteJuego(juego) }
      ]
    });

    await alert.present();
  }

  async confirmDeleteJuego(juego: any) {
    const token = localStorage.getItem('authToken');
    const loading = await this.loadingCtrl.create({ message: 'Eliminando juego...' });
    await loading.present();

    this.http.delete(`http://127.0.0.1:8000/api/games1/deactivate/${juego.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: async (res: any) => {
        await loading.dismiss();

        if (res.success) {
          this.juegos = this.juegos.filter((g) => g.id !== juego.id);
          this.showToast('Juego eliminado correctamente', 'success');
        } else {
          this.showToast('Error al eliminar juego', 'danger');
        }
      },
      error: async () => {
        await loading.dismiss();
        this.showToast('Error al eliminar juego', 'danger');
      }
    });
  }

  // ================= TOAST ================= //
  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color });
    toast.present();
  }

}
