import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly BASE_URL = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  // ---- Autenticación ----
  login(email: string, password: string, captcha: string | null): Observable<any> {
    const url = `${this.BASE_URL}/auth/login`;
    const body = { email, password, captcha };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, body, { headers });
  }

  verify2FA(code: string, temporaryToken: string): Observable<any> {
    const url = `${this.BASE_URL}/auth/verify-2fa`;
    const body = { code, temporaryToken };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, body, { headers });
  }

  // ---- Juegos ----
  getJuegos(token: string): Observable<any> {
    const url = `${this.BASE_URL}/auth/games`;
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(url, { headers });
  }


  // ---- Perfil ----
  getMyProfile(token: string) {
    const url = `${this.BASE_URL}/my-profile`;
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(url, { headers });
  }

  logout(token: string) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.BASE_URL}/logout`;
    return this.http.post(url, {}, { headers });
  }

}
