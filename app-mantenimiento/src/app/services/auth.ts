import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { StorageService } from './StorageService';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5250/api/Usuario/login'; //url del servicio de login

  constructor(private http: HttpClient, private storage: StorageService) { }

  async login(correo: string, clave: string): Promise<boolean | 'rol-no-permitido' | 'usuario-inactivo'> {
    try {
      // Se prepara el cuerpo de la solicitud
      const body = { correo, clave };
      // Se realiza la solicitud HTTP POST
      const response: any = await firstValueFrom(
        this.http.post(this.apiUrl, body, { observe: 'response' })
      );

      // Se procesa la respuesta
      if (response.status === 200 && response.body?.ok === true) {
        const usuario = response.body.usuario;
        //Se guarda el token
        const token = response.body.token;

        // Guardar el token de forma segura
        this.storage.set('token', token);

        // Verificar si está activo
        if (!usuario.activo) return 'usuario-inactivo';

        // Verificar rol
        if (usuario.rol === 'Administrador' || usuario.rol === 'Vendedor') {
          return true;
        } else {
          // Rol no permitido
          return 'rol-no-permitido';
        }
      } else {
        return false; // Usuario o contraseña incorrectos
      }
    } catch (err: any) {
      if (err.status === 401) return false;
      console.error('Error en login', err);
      return false;
    }
  }
  logout() {
    this.storage.remove('token');
    this.storage.remove('usuario');
  }

  getToken(): string | null {
    return this.storage.get('token');
  }

}