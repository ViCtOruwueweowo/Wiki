import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
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

  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {
    this.checkScreen();

    // Detecta si WebAuthn está disponible
    this.isWebAuthnSupported = ('credentials' in navigator) && ('PublicKeyCredential' in window);

    if (this.isWebAuthnSupported) {
      this.authenticateWithWebAuthn();
    } else {
      this.showAlert('Info', 'Tu navegador no soporta autenticación biométrica (WebAuthn).');
    }
  }

  @HostListener('window:resize')
  onResize() { this.checkScreen(); }

  checkScreen() { this.isMobile = window.innerWidth <= 768; }

  // ---------------- WebAuthn ----------------
  async authenticateWithWebAuthn() {
    try {
      // Challenge de prueba (en producción, el backend genera este challenge)
      const challenge = new Uint8Array([21,32,45,10,99,100,200,50]).buffer;

      const publicKeyCredentialRequestOptions: any = {
        challenge: challenge,
        timeout: 60000,
        userVerification: 'required', // Siempre solicita biometría
      };

      const credential: any = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });

      if (credential) {
        console.log('Autenticación exitosa', credential);
        this.showAlert('Éxito', 'Acceso concedido a Favorites');
        // En producción: enviar credential.response al backend para validar
      } else {
        this.showAlert('Fallido', 'No se pudo autenticar el usuario');
      }
    } catch (err: any) {
      console.error('Error WebAuthn:', err);
      if (err.name === 'NotAllowedError') {
        this.showAlert('Cancelado', 'Usuario canceló la autenticación');
      } else {
        this.showAlert('Error', 'Autenticación fallida: ' + err.message);
      }
    }
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
