import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TopbarComponent } from 'src/app/Components/topbar/topbar.component';
import { BottombarComponent } from 'src/app/Components/bottombar/bottombar.component';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    RouterModule,
    CommonModule,
    FormsModule,
    TopbarComponent,
    BottombarComponent
  ]
})
export class IndexPage implements OnInit {

  // =========== RESPONSIVE ===========
  isMobile: boolean = false;

  // =========== LISTA DE JUEGOS ===========
  games: any[] = [];
  searchTerm: string = '';

  // =========== PWA PARA INSTALAR ===========
  deferredPrompt: any = null;
  showInstallBanner: boolean = false;

  ngOnInit() {
    this.checkScreen();
    this.getGames();
    this.listenInstallEvent(); // <<--- NECESARIO PARA MOSTRAR VENTANA DE INSTALACIÓN
  }

  @HostListener('window:resize')
  onResize() { this.checkScreen(); }

  checkScreen() { this.isMobile = window.innerWidth <= 768; }

  // ====== CARGA DE JUEGOS DESDE TU API ======
  async getGames() {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/games');
      const data = await response.json();
      this.games = data.data;
    } catch (e) {
      console.log("Error cargando juegos", e);
    }
  }

  filterHomeGames() {
    return this.searchTerm
      ? this.games.filter(j => j.title.toLowerCase().includes(this.searchTerm.toLowerCase()))
      : this.games;
  }

  // ==========================================================
  // 💛 EVENTO PARA MOSTRAR EL POPUP DE INSTALAR COMO PWA
  // ==========================================================
  listenInstallEvent() {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBanner = true;
    });
  }

  // ================= INSTALAR LA APP ==================
  showInstallPrompt() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();

    this.deferredPrompt.userChoice.then((choice: any) => {
      console.log(choice.outcome === 'accepted'
        ? '👍 El usuario instaló la app'
        : '❌ El usuario rechazó');

      this.showInstallBanner = false;
      this.deferredPrompt = null;
    });
  }

  // =============== CERRAR SIN INSTALAR =================
  closeInstallBanner() {
    this.showInstallBanner = false;
  }
}
