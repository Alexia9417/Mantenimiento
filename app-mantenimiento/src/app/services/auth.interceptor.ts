import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { isTokenExpired } from './isTokenExpired';
import { StorageService } from './StorageService';

// Interceptor HTTP para agregar el token de autorización a las solicitudes salientes

import { catchError } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const storage = inject(StorageService);

  const token = storage.get('token');

  // Si hay un token, verificar si está expirado
  if (token) {
    if (isTokenExpired(token)) {
      storage.remove('token');
      router.navigate(['/login']);
      return EMPTY;
    }

    //Se clona la solicitud para agregar el encabezado de autorización
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    // Manejo de errores de autenticación
    return next(authReq).pipe(
      catchError(err => {
        if (err.status === 401) {
          storage.remove('token');
          router.navigate(['/login']);
          return EMPTY;
        }
        throw err;
      })
    );
  }

  return next(req);
};