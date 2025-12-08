import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { TopbarComponent } from 'src/app/Components/topbar/topbar.component';
import { BottombarComponent } from 'src/app/Components/bottombar/bottombar.component';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [

    IonicModule,
    RouterLink,
    CommonModule, HttpClientModule,
    FormsModule,
    TopbarComponent,
    BottombarComponent
  ]
})
export class ProfilePage implements OnInit {

  isMobile: boolean = false;

  user: any = null;
  favorites: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastController,
    private loading: LoadingController
  ) { }

  ngOnInit() {
    this.checkScreen();
    this.getMyProfile();
  }

  @HostListener('window:resize')
  onResize() { this.checkScreen(); }

  checkScreen() { this.isMobile = window.innerWidth <= 768; }

  // OBTENER PERFIL DESDE TU API
  async getMyProfile() {

    const token = localStorage.getItem("authToken"); // <<--- Debe existir desde tu login

    if (!token) {
      console.error("No existe token, no puedes autenticarte");
      this.router.navigate(['/']);
      return;
    }

    const headers = {
      'Authorization': `Bearer ${token}`
    };

    this.http.get("http://143.110.205.116/api/my-profile", { headers })
      .subscribe((res: any) => {
        this.user = res.data;
        this.favorites = []; // si luego agregas favoritos
      },
        err => {
          console.error("Error ->", err);
          if (err.status === 401) this.router.navigate(['/']);
        });
  }

  async logout() {
    const token = localStorage.getItem("authToken");

    // Crear headers solo si existe token
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    this.http.post("http://143.110.205.116/api/logout", {}, { headers })
      .subscribe({
        next: async (res: any) => {
          localStorage.clear();

          const t = await this.toast.create({
            message: "Cerraste sesión correctamente",
            duration: 2000,
            color: "success"
          });
          t.present();

          this.router.navigate(['/']);
        },
        error: async (err) => {
          localStorage.clear();

          const t = await this.toast.create({
            message: "Error al cerrar sesión",
            duration: 2000,
            color: "danger"
          });
          t.present();

          this.router.navigate(['/']);
        }
      });
  }

  update() {
    this.router.navigate(['/update-profile']); // futura pantalla para edición
  }

  goFav() {
    this.router.navigate(['/favorites']);
  }

}
