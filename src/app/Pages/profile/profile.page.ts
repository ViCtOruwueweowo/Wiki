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
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink,
    CommonModule,HttpClientModule ,
    FormsModule,
    TopbarComponent,
    BottombarComponent
  ]
})
export class ProfilePage implements OnInit {

  isMobile: boolean = false;

  user:any = null;
  favorites:any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastController,
    private loading: LoadingController
  ) {}

  ngOnInit() {
    this.checkScreen();
    this.getMyProfile();
  }

  @HostListener('window:resize')
  onResize(){ this.checkScreen(); }

  checkScreen(){ this.isMobile = window.innerWidth <= 768; }

  // OBTENER PERFIL DESDE TU API
async getMyProfile(){

  const token = localStorage.getItem("authToken"); // <<--- Debe existir desde tu login

  if(!token){
    console.error("No existe token, no puedes autenticarte");
    this.router.navigate(['/login']);
    return;
  }

  const headers = { 
    'Authorization': `Bearer ${token}` 
  };

  this.http.get("http://127.0.0.1:8000/api/my-profile", { headers })
    .subscribe((res:any)=>{
      this.user = res.data;
      this.favorites = []; // si luego agregas favoritos
    },
    err=>{
      console.error("Error ->",err);
      if(err.status === 401) this.router.navigate(['/login']);
    });
}

async logout(){

  const token = localStorage.getItem("authToken"); // ⚠ este es tu token real

  if(!token){
    this.router.navigate(['/login']);
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  this.http.post("http://127.0.0.1:8000/api/logout", {}, { headers })
    .subscribe({
      next: async (res:any)=>{
        
        localStorage.removeItem("authToken"); // << ahora correcto
        const t = await this.toast.create({
          message:"Cerraste sesión correctamente",
          duration:2000,
          color:"success"
        });
        t.present();
        this.router.navigate(['/']);
      },
      error: async(err)=>{
        const t = await this.toast.create({
          message:"Error al cerrar sesión",
          duration:2000,
          color:"danger"
        });
        t.present();
      }
    })
}


  update(){
    this.router.navigate(['/update-profile']); // futura pantalla para edición
  }

  goFav(){
    this.router.navigate(['/favorites']);
  }

}
