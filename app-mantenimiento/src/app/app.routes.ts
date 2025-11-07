import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { Mantenimiento } from './pages/mantenimiento/mantenimiento';
import { authGuard } from './services/auth.guard';

// Definición de las rutas de la aplicación
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige la ruta vacía a /login por defecto
  { path: 'login', component: LoginComponent }, // Ruta para el componente de login
  { path: 'mantenimiento', component: Mantenimiento, // Ruta para el componente de mantenimiento
    canActivate: [authGuard] //Esto asegura que solo usuarios autenticados puedan acceder a mantenimiento
  },
  { path: '**', redirectTo: '/login' } // Redirige cualquier ruta no definida a /login
];

//Esto define el módulo de rutas de la aplicación
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
