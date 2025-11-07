import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common'; // <-- IMPORTAR NgIf
import { AuthService } from '../../services/auth';

// Componente para la página de login
@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [FormsModule, NgIf] // <-- AGREGAR NgIf AQUÍ
})

export class LoginComponent {

  // Campos del formulario de login
  correo: string = '';
  clave: string = '';
  errorMsg: string = '';
  cargando: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  async login() {
    // Reiniciar mensaje de error y estado de carga
    this.errorMsg = '';
    this.cargando = true;

    try {
      //Realizar el login llamando al servicio de autenticación y se obtiene el resultado
      const resultado = await this.authService.login(this.correo, this.clave);

      if (resultado === 'usuario-inactivo') {
        this.errorMsg = 'Usuario no autorizado o no activo.';
      } else if (resultado === 'rol-no-permitido') {
        this.errorMsg = 'Usuario no autorizado. Solo Administrador o Vendedor.';
      } else if (resultado === true) {
        //Si todo es correcto, redirigir a la página de mantenimiento
        this.router.navigate(['/mantenimiento']);
      } else {
        this.errorMsg = 'Usuario o contraseña incorrectos.';
      }

    } catch (err) {
      this.errorMsg = 'Error al iniciar sesión.';
      console.error(err);
    } finally {
      this.cargando = false;
    }
  }
}
