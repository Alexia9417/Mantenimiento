import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

// Componente para la página de mantenimiento de productos
@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.html',
  styleUrls: ['./mantenimiento.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})

export class Mantenimiento implements OnInit {

  // Datos de productos, categorías y marcas
  productos: any[] = [];
  categorias: any[] = [];
  marcas: any[] = [];

  // Estado de carga y mensajes de error
  cargando = false;
  errorMsg: string = '';

  // Campos del formulario
  nombre = '';
  descripcion = '';
  precio: number | null = null;
  stock: number | null = null;
  idCategoria: string = '';
  idMarca: string = '';

  //Busqueda
  searchTerm: string = '';
  productosOriginales: any[] = [];

  // Edición
  editId: number | null = null;

  constructor(private servicio: ProductoService, private authService: AuthService, private router: Router) { }

  // Cargar datos al inicializar el componente
  async ngOnInit() {
    await this.cargarDatos();
  }

  // Función para cargar productos, categorías y marcas desde el servicio
  async cargarDatos() {
    try {
      this.cargando = true;
      // Cargar categorías, marcas y productos
      this.categorias = await this.servicio.getCategorias();
      //console.log('Categorias:', this.categorias);

      this.marcas = await this.servicio.getMarcas();
      //console.log('Marcas:', this.marcas);

      this.productos = await this.servicio.getProductos();
      //console.log('Productos:', this.productos);

      // Solo aquí llenamos la copia original para búsquedas
      this.productosOriginales = [...this.productos];


    } catch (error) {
      console.error('Error al cargar datos', error);
      this.errorMsg = 'Error al cargar datos del servidor.';
    } finally {
      this.cargando = false;
    }
  }

  //función de búsqueda
  buscar() {
    if (!this.productosOriginales || this.productosOriginales.length === 0) {
      this.productos = [];
      return;
    }

    const term = this.searchTerm?.trim().toLowerCase();
    if (!term) {
      this.productos = [...this.productosOriginales];
      return;
    }

    this.productos = this.productosOriginales.filter(p =>
      // buscar por nombre o descripcion
      (p.nombre?.toLowerCase().includes(term)) ||
      (p.descripcion?.toLowerCase().includes(term)) ||
      // buscar por id (convertimos id a string)
      p.idProducto.toString() === term
    );
  }

  // Limpiar formulario
  limpiarForm() {
    // Limpiar campos del formulario
    this.nombre = '';
    this.descripcion = '';
    this.precio = null;
    this.stock = null;
    this.idCategoria = '';
    this.idMarca = '';

    // Limpiar búsqueda
    this.searchTerm = '';

    // Restaurar lista completa de productos
    this.productos = [...this.productosOriginales];

    // Reiniciar modo edición
    this.editId = null;

    // Limpiar mensajes de error
    this.errorMsg = '';
  }

  // Guardar producto (agregar o editar)
  async guardar() {
    if (!this.nombre || !this.precio || !this.stock || !this.idCategoria || !this.idMarca) {
      this.errorMsg = 'Todos los campos son obligatorios.';
      return;
    }

    const producto = {
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio: this.precio,
      stock: this.stock,
      idCategoria: this.idCategoria,
      idMarca: this.idMarca,
      activo: true
    };

    try {
      //se indica que se está cargando
      this.cargando = true;
      if (this.editId) {
        await this.servicio.actualizarProducto(this.editId, producto);
      } else {
        await this.servicio.agregarProducto(producto);
      }
      await this.cargarDatos();
      this.limpiarForm();
    } catch (error: any) {
      console.error('Error al guardar producto', error);
      this.errorMsg = error.status ? `Error ${error.status}: ${error.message}` : 'Error al guardar producto.';
    } finally {
      this.cargando = false;
    }
  }

  // Se debe rellenar el formulario para editar
  editarProducto(p: any) {
    this.editId = p.idProducto;
    this.nombre = p.nombre;
    this.descripcion = p.descripcion;
    this.precio = p.precio;
    this.stock = p.stock;
    this.idCategoria = p.idCategoria;
    this.idMarca = p.idMarca;
  }

  async eliminarProducto(id: number) {
    if (!confirm('¿Desea eliminar este producto?')) return;
    try {
      this.cargando = true;
      await this.servicio.eliminarProducto(id);
      await this.cargarDatos();
    } catch (error: any) {
      console.error('Error al eliminar producto', error);
      this.errorMsg = error.status ? `Error ${error.status}: ${error.message}` : 'Error al eliminar producto.';
    } finally {
      this.cargando = false;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
