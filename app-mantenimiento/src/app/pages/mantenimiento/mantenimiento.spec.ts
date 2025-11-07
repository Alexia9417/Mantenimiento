import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './../../services/auth';

export interface Registro {
  id: number;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {
  private apiUrl = 'https://tu-backend.com/api/registros'; // Cambia a tu endpoint real

  constructor(private http: HttpClient, private authService: AuthService) {}

    private getHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  // Obtener todos los registros
  async getAll(): Promise<Registro[]> {
    return await firstValueFrom(this.http.get<Registro[]>(this.apiUrl));
  }

  // Crear o actualizar registro
  async save(registro: Registro): Promise<Registro> {
    if (registro.id) {
      return await firstValueFrom(this.http.put<Registro>(`${this.apiUrl}/${registro.id}`, registro));
    } else {
      return await firstValueFrom(this.http.post<Registro>(this.apiUrl, registro));
    }
  }

  // Eliminar registro
  async delete(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/${id}`));
  }

  // Buscar por nombre
  async search(nombre: string): Promise<Registro[]> {
    return await firstValueFrom(this.http.get<Registro[]>(`${this.apiUrl}?nombre=${nombre}`));
  }
}
