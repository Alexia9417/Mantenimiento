import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { StorageService } from './StorageService';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const storage = inject(StorageService); //se usa el servicio de almacenamiento
  const token = storage.get('token');
  if (!token || typeof token !== 'string') {
    router.navigate(['/login']);
    return false;
  }

  // Si no hay token, redirigir al login
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  //console.log('Token en guard:', token);

  try {
    // Decodificar el token para verificar su validez y rol
    const decoded: any = jwtDecode(token);
    // console.log('Expiración (ms):', decoded.exp * 1000);
    // console.log('Ahora (ms):', Date.now());
    const isExpired = decoded.exp * 1000 < Date.now();
    //console.log('Token decodificado:', decoded);

    // Verificar el rol del usuario
    const rol =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      decoded.role || decoded.Rol || decoded.rol;

    if (isExpired || !(rol === 'Administrador' || rol === 'Vendedor')) {
      storage.remove('token');
      router.navigate(['/login']);
      return false;

    }

    //console.log('Rol detectado:', rol);


    return true;
  } catch (err) {
    console.error('Error al decodificar token:', err);
    router.navigate(['/login']);
    return false;
  }
};