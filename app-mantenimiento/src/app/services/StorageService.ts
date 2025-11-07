import { Injectable } from '@angular/core';

// Servicio para encapsular el acceso a local storage y manejar entornos sin ventana (como SSR)
// Esto previene errores al intentar acceder a localStorage cuando no está disponible.

@Injectable({ providedIn: 'root' })
export class StorageService {
  // Verifica si el entorno actual tiene acceso a window y localStorage
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }
  // Para obtener un valor de localStorage (el token)
  get(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  }

  // Para establecer un valor en localStorage (el token)
  set(key: string, value: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, value);
    }
  }
  // Para eliminar un valor de localStorage (el token)
  remove(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }
}