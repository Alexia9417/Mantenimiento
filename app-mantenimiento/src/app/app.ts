import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Para mostrar las rutas
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor

@Component({
  selector: 'app-root',
  standalone: true, // Indica que este componente es independiente
  imports: [CommonModule, RouterOutlet], // Importa los módulos necesarios
  template: `<router-outlet></router-outlet>` // Plantilla que muestra las rutas
})
export class App {}
