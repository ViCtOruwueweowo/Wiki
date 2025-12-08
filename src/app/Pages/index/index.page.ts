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

  // =========== PWA ACTUALIZACIÓN ===========
  showUpdateAvailable: boolean = false;

  ngOnInit() {
    this.checkScreen();
    this.getGames();
    this.listenInstallEvent();
    this.registerServiceWorker();
  }

  @HostListener('window:resize')
  onResize() { this.checkScreen(); }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/pwa/ngsw-worker.js', { scope: '/pwa/' });
        console.log(' Service Worker registrado:', registration.scope);

        //  Detectar nueva versión
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nueva versión disponible
                this.showUpdateAvailable = true;
              }
            });
          }
        });

        // Escuchar mensajes de skipWaiting
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });

      } catch (err) {
        console.error('Error registrando SW:', err);
      }
    }
  }

  checkScreen() { this.isMobile = window.innerWidth <= 768; }

  // ====== CARGA DE JUEGOS DESDE TU API ======
  async getGames() {
    try {
      const apiUrl = 'https://grupoduran.shop/api/auth/games';
      const response = await fetch(apiUrl);
      const data = await response.json();
      this.games = data.data || [];
    } catch (e) {
      console.error("Error cargando juegos:", e);
    }
  }

  filterHomeGames() {
    return this.searchTerm
      ? this.games.filter(j => j.title.toLowerCase().includes(this.searchTerm.toLowerCase()))
      : this.games;
  }

  // ==========================================================
  //  EVENTO PARA MOSTRAR EL POPUP DE INSTALAR COMO PWA
  // ==========================================================
  listenInstallEvent() {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      this.deferredPrompt = e;
      if (this.isMobile) this.showInstallBanner = true;
    });
  }

  // ================= INSTALAR LA APP ==================
  showInstallPrompt() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();

    this.deferredPrompt.userChoice.then((choice: any) => {
      console.log(choice.outcome === 'accepted'
        ? ' El usuario instaló la app'
        : ' El usuario rechazó');

      this.showInstallBanner = false;
      this.deferredPrompt = null;
    });
  }

  // =============== CERRAR SIN INSTALAR =================
  closeInstallBanner() {
    this.showInstallBanner = false;
  }

  // ================= ACTUALIZAR PWA ==================
  reloadApp() {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
    }
  }
}
