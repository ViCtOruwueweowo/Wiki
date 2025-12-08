import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, Platform } from '@ionic/angular';
import { TopbarComponent } from 'src/app/Components/topbar/topbar.component';
import { BottombarComponent } from 'src/app/Components/bottombar/bottombar.component';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
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
export class FavoritesPage implements OnInit {

  isMobile: boolean = false;
  isWebAuthnSupported: boolean = false;

  constructor(private alertCtrl: AlertController, private platform: Platform) { }

  ngOnInit() {
    this.checkScreen();
    this.isWebAuthnSupported = ('credentials' in navigator) && ('PublicKeyCredential' in window);

    if (this.platform.is('capacitor') && this.isMobile) {
      // PWA en móvil → intentar huella nativa
      this.authenticateWithBiometricMobile();
    } else if (this.isWebAuthnSupported) {
      // PC o navegador compatible → WebAuthn
      this.authenticateWithWebAuthn();
    } else {
      this.showAlert('Info', 'Biometría no disponible en este navegador.');
    }
  }

  @HostListener('window:resize')
  onResize() { this.checkScreen(); }

  checkScreen() { this.isMobile = window.innerWidth <= 768; }

  // ---------------- WebAuthn para PC ----------------
  async authenticateWithWebAuthn() {
    try {
      const challenge = new Uint8Array([21,32,45,10,99,100,200,50]).buffer;
      const publicKeyCredentialRequestOptions: any = {
        challenge: challenge,
        timeout: 60000,
        userVerification: 'required'
      };
      const credential: any = await navigator.credentials.get({ publicKey: publicKeyCredentialRequestOptions });

      if (credential) {
        console.log('Autenticación WebAuthn exitosa', credential);
        this.showAlert('Éxito', 'Acceso concedido a Favorites (WebAuthn)');
      } else {
        this.showPinFallback();
      }
    } catch (err: any) {
      console.error('Error WebAuthn:', err);
      this.showPinFallback();
    }
  }

  // ---------------- Huella móvil PWA ----------------
  async authenticateWithBiometricMobile() {
    try {
      // Aquí iría un plugin nativo si fuera Capacitor (solo nativo)
      // En PWA móvil → WebAuthn también puede intentar PIN/biometría de plataforma
      if (this.isWebAuthnSupported) {
        await this.authenticateWithWebAuthn();
      } else {
        this.showPinFallback();
      }
    } catch {
      this.showPinFallback();
    }
  }

  // ---------------- Fallback PIN ----------------
  async showPinFallback() {
    const alert = await this.alertCtrl.create({
      header: 'Autenticación requerida',
      message: 'Ingresa tu PIN para acceder a Favorites',
      inputs: [{ name: 'pin', type: 'password', placeholder: 'PIN' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'OK',
          handler: data => {
            if (data.pin === '1234') {
              console.log('PIN correcto');
              this.showAlert('Éxito', 'Acceso concedido a Favorites (PIN)');
            } else {
              console.log('PIN incorrecto');
              this.showAlert('Fallido', 'PIN incorrecto');
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // ---------------- Alert genérico ----------------
  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

}
