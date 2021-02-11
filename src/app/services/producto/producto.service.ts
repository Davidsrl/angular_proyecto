import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private API_SERVER = "http://localhost:8484/producto"
  constructor(private http: HttpClient) { }


  public getAllUsers(): Observable<any> {
    return this.http.get(this.API_SERVER + '/get/all');
  }

  public saveProducto(producto: any, fecha: Date): Observable<any> {
    producto.fechaIngreso = fecha;
    return this.http.post<Response>(this.API_SERVER, producto);
  }

  public deleteProducto(id): Observable<any> {
    return this.http.delete(this.API_SERVER + "/delete/" + id);
  }

  public updateProducto(producto: any, fecha: Date, nombreUsuario: String, id: String): Observable<any> {
    producto.fechaIngreso = fecha;
    producto.nombreUsuario = nombreUsuario;
    producto.id = id;
    return this.http.put<Response>(this.API_SERVER, producto);
  }

}
