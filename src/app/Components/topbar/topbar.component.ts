import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]  // ✅ Sin TopbarComponent aquí
})
export class TopbarComponent implements OnInit {

  isMobile: boolean = false;
  userRole: string | null = null;

  ngOnInit() {
    this.checkScreen();
    this.getUserRole();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreen();
  }

  checkScreen() {
    this.isMobile = window.innerWidth <= 768;
  }

  getUserRole(){
    this.userRole = localStorage.getItem('userRole'); // ← lee el rol
  }

}
