import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TopbarComponent } from 'src/app/Components/topbar/topbar.component';
import { BottombarComponent } from 'src/app/Components/bottombar/bottombar.component';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [IonicModule,
    RouterLink,
    RouterModule,
    CommonModule,
    FormsModule,
    TopbarComponent,
    BottombarComponent]
})
export class FavoritesPage implements OnInit {

  isMobile: boolean = false;
  constructor() { }

  ngOnInit() {
    this.checkScreen();
    ; // <<--- NECESARIO PARA MOSTRAR VENTANA DE INSTALACIÓN
  }

  @HostListener('window:resize')
  onResize() { this.checkScreen(); }

  checkScreen() { this.isMobile = window.innerWidth <= 768; }

}
