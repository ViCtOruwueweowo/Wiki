import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TopbarComponent } from 'src/app/Components/topbar/topbar.component';
import { BottombarComponent } from 'src/app/Components/bottombar/bottombar.component';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.page.html',
  styleUrls: ['./gestion.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    TopbarComponent,
    BottombarComponent,
    RouterLink
  ]
})
export class GestionPage implements OnInit {

  isMobile: boolean = false;
  searchTerm: string = '';

  // Datos para gráficas
  gamesTotal:number=0;
  categoriesTotal:number=0;
  developersTotal:number=0;
  platformsTotal:number=0;

  // charts
  statsChart:any;
  gamesChart:any;
  categoriesChart:any;
  developersChart:any;
  platformsChart:any;

  constructor(private http:HttpClient){}

  ngOnInit(){
    this.checkScreen();
    this.fetchData();
  }

  // ======================================================
  // PETICIONES HTTP
  // ======================================================
  fetchData(){
    const token = localStorage.getItem("authToken")||"";

    const headers = new HttpHeaders({
      "Authorization":`Bearer ${token}`
    });

    this.http.get<any>('http://127.0.0.1:8000/api/auth/games',{headers})
      .subscribe(res=>{
        this.gamesTotal = res.data.length;
        this.loadMainChart();
        this.loadIndividualCharts();
      });

    this.http.get<any>('http://127.0.0.1:8000/api/categories/categoriesList',{headers})
      .subscribe(res=>{
        this.categoriesTotal = res.data.length;
        this.loadMainChart();
        this.loadIndividualCharts();
      });

    this.http.get<any>('http://127.0.0.1:8000/api/developers/developerList',{headers})
      .subscribe(res=>{
        this.developersTotal = res.data.length;
        this.loadMainChart();
        this.loadIndividualCharts();
      });

    this.http.get<any>('http://127.0.0.1:8000/api/platforms/platformList',{headers})
      .subscribe(res=>{
        this.platformsTotal = res.data.length;
        this.loadMainChart();
        this.loadIndividualCharts();
      });

  }

  // ======================================================
  // GRÁFICA GLOBAL
  // ======================================================
  loadMainChart(){

    if (!this.gamesTotal || !this.categoriesTotal || !this.developersTotal || !this.platformsTotal) return;

    if(this.statsChart) this.statsChart.destroy();

    const ctx = document.getElementById('statsChart') as HTMLCanvasElement;

    this.statsChart = new Chart(ctx,{
      type:'bar',
      data:{
        labels:['Juegos','Categorias','Desarrolladores','Plataformas'],
        datasets:[{
          label:'',
          data:[this.gamesTotal,this.categoriesTotal,this.developersTotal,this.platformsTotal],
          backgroundColor:'#3b5998',
          borderColor:'#27ae60',
          borderWidth:1,
          borderRadius:12,
          hoverBackgroundColor:'#4B0082'
        }]
      },
      options:{
        responsive:true,
        maintainAspectRatio:false,
        plugins:{ legend:{display:false} }
      }
    });
  }

  // ======================================================
  // GRÁFICAS INDIVIDUALES
  // ======================================================
  loadIndividualCharts(){

    const generateChart = (elementId:string,value:number,title:string,ref:any)=>{

      if(ref) ref.destroy();

      let ctx = document.getElementById(elementId) as HTMLCanvasElement;

      return new Chart(ctx,{
        type:'bar',
        data:{
          labels:[title],
          datasets:[{
            label:`Total de ${title}`,
            data:[value],
            backgroundColor:'#3b5998',
            borderColor:'#27ae60',
            borderWidth:1,
            borderRadius:10,
            hoverBackgroundColor:'#8000dbff'
          }]
        },
        options:{ responsive:true, maintainAspectRatio:false }
      });
    }

    this.gamesChart       = generateChart('gamesChart',this.gamesTotal,'Juegos',this.gamesChart);
    this.categoriesChart  = generateChart('categoriesChart',this.categoriesTotal,'Categorias',this.categoriesChart);
    this.developersChart  = generateChart('developersChart',this.developersTotal,'Desarrolladores',this.developersChart);
    this.platformsChart   = generateChart('platformsChart',this.platformsTotal,'Plataformas',this.platformsChart);
  }


  @HostListener('window:resize') onResize(){ this.checkScreen(); }
  checkScreen(){ this.isMobile = window.innerWidth<=768; }
}
