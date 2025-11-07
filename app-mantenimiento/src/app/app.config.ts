import { importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login';
import { Mantenimiento } from './pages/mantenimiento/mantenimiento';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { authGuard } from './services/auth.guard';

// Definir las rutas principales de la aplicación
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'mantenimiento', component: Mantenimiento , canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];

// Configuración de providers
// Permite importar los módulos necesarios y configurar interceptores HTTP
export const appConfig = {
  providers: [
    importProvidersFrom(RouterModule.forRoot(routes)),
    importProvidersFrom(FormsModule),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withInterceptors([AuthInterceptor])) // Aplicar el interceptor de autenticación por defecto

  ]
};