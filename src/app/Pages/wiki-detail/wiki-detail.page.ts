import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// IMPORTAR TODO lo que usas 🔥
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons,
  IonCard, IonCardContent, IonChip, IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-wiki-detail',
  templateUrl: './wiki-detail.page.html',
  styleUrls: ['./wiki-detail.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule,

    // IMPORTACIÓN COMPLETA 🔥
    IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons,
    IonCard, IonCardContent, IonChip, IonLabel
  ]
})
export class WikiDetailPage implements OnInit {

  juego: any = null;
  id!: number;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarJuego();
  }

  cargarJuego(){
    this.http.get<any>("http://143.110.205.116/api/auth/games")
      .subscribe(res => {
        this.juego = res.data.find((j: any) => j.id === this.id);
      });
  }
}
