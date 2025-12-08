import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink, RouterModule } from '@angular/router';
import { TopbarComponent } from 'src/app/Components/topbar/topbar.component';
import { BottombarComponent } from 'src/app/Components/bottombar/bottombar.component';

@Component({
  selector: 'app-wikis',
  templateUrl: './wikis.page.html',
  styleUrls: ['./wikis.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    RouterLink,
    TopbarComponent,
    BottombarComponent
  ]
})
export class WikisPage implements OnInit {

  isMobile: boolean = false;
  searchTerm: string = '';
  games: any[] = []; // <-- Guardará datos del API

  constructor() {}

  ngOnInit() {
    this.checkScreen();
    this.getGames(); // ← Cargamos la API al entrar
  }

  // Detecta móvil
  @HostListener('window:resize')
  onResize() { this.checkScreen(); }

  checkScreen() {
    this.isMobile = window.innerWidth <= 768;
  }

  // Obtener datos de tu API
  async getGames() {
    try {
      const response = await fetch('https://143.110.205.116/api/auth/games');
      const data = await response.json();
      this.games = data.data;
    } catch (e) {
      console.log("Error cargando juegos", e);
    }
  }

  // Buscador filtrando títulos
  filterCards() {
    const term = this.searchTerm.toLowerCase();
    return this.games.filter(j => j.title.toLowerCase().includes(term));
  }
}

