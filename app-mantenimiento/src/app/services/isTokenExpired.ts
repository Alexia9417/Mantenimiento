import { jwtDecode } from 'jwt-decode';

export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return true;

  try {
    const decoded: any = jwtDecode(token);
    const exp = decoded?.exp;

    // Verificamos que exp exista y sea un número
    if (typeof exp !== 'number') return true;

    return exp * 1000 < Date.now();
  } catch {
    return true; // Si no se puede decodificar, lo tratamos como expirado
  }
}