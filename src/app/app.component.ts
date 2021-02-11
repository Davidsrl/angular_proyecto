import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from './services/usuario/usuario.service';
import $ from 'jquery';
import { ProductoService } from './services/producto/producto.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Automotriz';

  public usuarioForm: FormGroup;
  public productoForm: FormGroup;
  public formulario: FormGroup;

  public codigoProducto = null;
  public nombreProducto = null;
  public cantidad = null;
  public fechaIngreso = null;
  public nombreUsuario = null;
  public validaEditar: boolean;
  public validaGuardar: boolean;
  public validaEliminar: boolean;
  public validaTable = true;
  public contador: number;
  public usuarios: any;
  public lstProductos: any;
  public lstProductosFilter: any;
  public codigoBoolean = false;
  public nombreUsuarioBoolean = true;
  public fechaMaxima = new Date;

  constructor(private usuarioService: UsuarioService, private productoService: ProductoService) {

  }


  public validarFormulario(): void {
    this.formulario = new FormGroup({
      'codigoProducto': new FormControl(''),
      'nombreProducto': new FormControl('', [Validators.required]),
      'cantidad': new FormControl(''),
      'fechaIngreso': new FormControl(''),
      'nombreUsuario': new FormControl('', [Validators.required])
    });
  }


  public seleccionarProducto(item: any, event) {
    this.limpiar();

    this.codigoBoolean = true;
    this.nombreUsuarioBoolean = false;
    this.codigoProducto = item.id;
    this.nombreProducto = item.nombreProducto;
    this.cantidad = item.cantidad;

    this.fechaIngreso = item.fechaIngreso;
    this.nombreUsuario = item.nombreUsuario;

    this.formulario.get('codigoProducto').setValue(this.codigoProducto);
    this.formulario.get('nombreProducto').setValue(this.nombreProducto.toLowerCase());
    this.formulario.get('cantidad').setValue(this.cantidad);
    this.formulario.get('fechaIngreso').setValue(this.fechaIngreso);
    this.usuarios = event.target.value;
    this.validaEditar = true;
    this.validaEliminar = true;
    this.validaGuardar = false;


  }

  /** Botones */
  public limpiar() {
    this.formulario.reset();
    this.codigoBoolean = false;
    this.nombreUsuarioBoolean = true;
    this.validaEditar = false;
    this.validaEliminar = false;
    this.validaGuardar = true;
    this.consultarUsuarios();
    this.consultarProductos();
    (document.getElementById('nombreUsuarioModal') as HTMLInputElement).value = null;
  }

  guardar(): void {
    var fecha = $('#fechaIngreso').val();

    const nombreProducto = (document.getElementById('nombreProducto') as HTMLInputElement).value;

    const result = this.lstProductosFilter.filter(word => word.nombreProducto == nombreProducto.toUpperCase());

    if (result.length === 0) {
      this.productoService.saveProducto(this.formulario.value, fecha).subscribe(resp => {
        this.limpiar();
        this.lstProductosFilter.push(resp);
      },
        error => { console.error(error) }
      )
    } else {
      alert("Existe un registro con el mismo nombre producto a ingresar.");
    }
  }


  public editar() {
    var fecha = $('#fechaIngreso').val();

    const nombreProducto = (document.getElementById('nombreProducto') as HTMLInputElement).value;
    const codigoProducto = this.codigoProducto;

    const result = this.lstProductosFilter.filter(word => word.nombreProducto == nombreProducto.toUpperCase());
    const nombreUsuario = this.nombreUsuario;
    if (result.length === 0) {
      this.productoService.updateProducto(this.formulario.value, fecha, nombreUsuario, codigoProducto).subscribe(resp => {
        this.limpiar();

      },
        error => { console.error(error) }
      )
    } else {
      alert("Existe un registro con el mismo nombre producto a ingresar.");
    }

  }

  public guardarUsuario() {

    const nombreUsuarioModal = (document.getElementById('nombreUsuarioModal') as HTMLInputElement).value;

    const result = this.lstProductosFilter.filter(word => word.nombreUsuario == nombreUsuarioModal.trim().toLowerCase());
    if (nombreUsuarioModal.trim() != null && nombreUsuarioModal !== undefined && nombreUsuarioModal.trim() !== '') {

      if (result.length === 0) {

        var usuario = {
          id: 0,
          nombreUsuario: nombreUsuarioModal.trim().toLowerCase()
        }

        this.usuarioService.saveUsuario(usuario).subscribe(resp => {
          this.limpiar();

          this.usuarios.push(resp);
        },
          error => { console.error(error) }
        )
      } else {
        alert("Existe un registro con el mismo nombre usuario a ingresar.");
      }


    } else {
      alert('NO se adminite el campo vacio.');
    }
  }

  eliminar() {

    const id = this.codigoProducto;
    var producto = {
      id: this.codigoProducto,
      nombreProducto: this.nombreProducto,
      cantidad: this.cantidad,
      fechaIngreso: this.fechaIngreso,
      nombreUsuario: this.nombreUsuario
    }

    this.productoService.deleteProducto(id).subscribe(resp => {
      if (resp === true) {
        this.lstProductos.pop(producto)
        this.lstProductosFilter.pop(producto);
        this.limpiar();
      }
    })
  }

  public navegacionTab(ide?: any, idx: number = -1): any {

  }
  public filtrarCampos() {

    const codigo = (document.getElementById('codigoTable') as HTMLInputElement).value;
    const nombreProducto = (document.getElementById('nombreProductoTable') as HTMLInputElement).value.toLowerCase();
    const cantidad = (document.getElementById('cantidadTable') as HTMLInputElement).value.toLowerCase();
    const nombreUsuario = (document.getElementById('nombreUsuarioTable') as HTMLInputElement).value.toLowerCase();

    const consultaFilter = this.lstProductos.filter((configConsulta) => {
      return (codigo !== undefined && codigo !== null && codigo.trim().length > 0 ? configConsulta.id.toString().includes(codigo) : true)
        && (nombreProducto !== undefined && nombreProducto !== null && nombreProducto.trim().length > 0 ? configConsulta.nombreProducto.includes(nombreProducto) : true)
        && (cantidad !== undefined && cantidad !== null && cantidad.trim().length > 0 ? configConsulta.cantidad.toString().includes(cantidad) : true)
        && (nombreUsuario !== undefined && nombreUsuario !== null && nombreUsuario.trim().length > 0 ? configConsulta.nombreUsuario.toLowerCase().includes(nombreUsuario) : true)
    });

    this.lstProductosFilter = consultaFilter;
  }

  public consultarUsuarios() {
    this.usuarioService.getAllUsers().subscribe(resp => {
      this.usuarios = resp;

    },
      error => {
        console.error(error)
      })
  }


  public consultarProductos() {
    this.productoService.getAllUsers().subscribe(resp => {
      this.lstProductos = resp.filter(item => item.nombreProducto !== undefined)
      this.lstProductosFilter = this.lstProductos;

    },
      error => {
        console.error(error)
      })
  }

  ngOnInit() {

    this.consultarUsuarios();
    this.consultarProductos();
    this.validarFormulario();
    this.validaEditar = false;
    this.validaEliminar = false;
    this.validaGuardar = true;
    $('#animateSlider').hide(0);
    $('#animateSlider').show(600);
    $(document).ready(function () {

      var now = new Date();

      var day = ("0" + now.getDate()).slice(-2);
      var month = ("0" + (now.getMonth() + 1)).slice(-2);

      var today = now.getFullYear() + "-" + (month) + "-" + (day);

      this.fechaMaxima = today;
    });
  }



}
