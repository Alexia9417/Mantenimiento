import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { AuthService } from './../services/auth';

export interface Producto {
    idProducto: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    idCategoria: number;
    idMarca: number;
    fechaRegistro: string;
    activo: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ProductoService {

    private baseUrl = 'http://localhost:5250/api'; //Url base de la API

    constructor(private http: HttpClient, private authService: AuthService) { }

    // Método para obtener los headers con el token de autenticación
    private getHeaders() {
        const token = this.authService.getToken();
        return {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            })
        };
    }
    // Método para agregar un nuevo producto
    agregarProducto(producto: any) {
        return this.http.post(`${this.baseUrl}/Producto`, producto, this.getHeaders()).toPromise();
    }

    // Método para obtener la lista de productos
    async getProductos(): Promise<any[]> {
        return await lastValueFrom(this.http.get<any[]>(`${this.baseUrl}/Producto`, this.getHeaders()));
    }

    // Método para obtener la lista de categorías
    async getCategorias(): Promise<any[]> {
        return await lastValueFrom(this.http.get<any[]>(`${this.baseUrl}/Categoria`, this.getHeaders()));
    }

    // Método para obtener la lista de marcas
    async getMarcas(): Promise<any[]> {
        return await lastValueFrom(this.http.get<any[]>(`${this.baseUrl}/Marca`, this.getHeaders()));
    }

    // Método para actualizar un producto existente
    actualizarProducto(id: number, producto: any) {
        return this.http.put(`${this.baseUrl}/Producto/${id}`, producto, this.getHeaders()).toPromise();
    }

    // Método para eliminar un producto por su ID
    eliminarProducto(id: number) {
        return this.http.delete(`${this.baseUrl}/Producto/${id}`, this.getHeaders()).toPromise();
    }

}