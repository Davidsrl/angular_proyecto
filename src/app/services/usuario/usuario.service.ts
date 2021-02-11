import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API_SERVER = "http://localhost:8484/usuario"
  constructor(private http: HttpClient) { }


  public getAllUsers(): Observable<any> {
    return this.http.get(this.API_SERVER + '/get/all');
  }

  public saveUsuario(usuario: any): Observable<any> {
    return this.http.post<Response>(this.API_SERVER, usuario);
  }
}
