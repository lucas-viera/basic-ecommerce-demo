function Cliente(nombre, telefono, direccion) {
  this.nombre = nombre;
  this.telefono = telefono;
  this.direccion = direccion;
}

function Producto(id, nombre, precio, destacado, imagen) {
  this.id = id;
  this.nombre = nombre;
  this.precio = precio;
  this.destacado = destacado;
  this.imagen = imagen;
}

function Pedido_compra() {
  this.cliente = undefined;
  this.items = [];
  this.total = 0;
  var fecha = new Date();
  fecha = fecha.getDate() + "/" + fecha.getMonth() + "/" + fecha.getFullYear();
  this.fecha = fecha;
}

function consultar_edad() {
  var edad = localStorage.getItem("edad");
  if (edad == null) {
    $("#modal-edad").modal("show");
  } else {
    edad_valida(edad);
  }
}

function set_edad() {
  const edad = $("#validar-edad").val();
  if (edad.trim() != "") {
    localStorage.setItem("edad", edad);
    $("#modal-edad").modal("hide");
    edad_valida(edad);
  }
}

function edad_valida(edad) {
  if (edad < 18) {
    $("#modal-menor").modal("show");
    var formulario = document.getElementById("customer");
    formulario.parentNode.removeChild(formulario);
    $("#beers").hide();
    $("#pedidos").hide();
  }
}

function obtener_datos(productos, articulos) {
  productos.forEach((producto, indice) => {
    var articulo = new Producto(
      producto.id,
      producto.nombre,
      producto.precio,
      producto.destacado,
      producto.imagen
    );
    articulos.push(articulo);

    if (articulo.destacado) {
      html_producto_insertar(articulo);
    }
    carga_selec(articulo);
    if (indice == 0) {
      $("#precio").val(articulo.precio);
    }
  });
}

function html_producto_insertar(producto) {
  var html = `<div class="col-sm col-md-6 col-xl-3 bot1">
    <img src="${producto.imagen}">
    <div class="description">
      <div class="product-name">
      ${producto.nombre}
      </div>
      <div class="price">
      $${producto.precio}
      </div>
      <button class="shop" onclick="elegit_prod(${producto.id})">Agregar artículo</button>
    </div>
  </div>`;
  $("#beers").append(html);
}

function elegit_prod(productoId) {
  let posicion = $("#customer").offset().top;
  $("html, body").animate({ scrollTop: posicion }, 1000);
  $("#cervezas").val(productoId).change();
}

function carga_selec(producto) {
  var option = `<option value="${producto.id}">${producto.nombre}</option>`;
  $("#cervezas").append(option);
}

function obtener_precio() {
  $("#error").html("");
  var valor = $("#cervezas option:selected").val();
  var encontrado = articulos.find((articulo) => {
    return articulo.id == valor;
  });
  $("#precio").val(encontrado.precio);
  $("#cantidad").val("");
  $("#subtotal").val("");
}

function check_numero(event) {
  var key = event.keyCode;
  if (key < 48 || key > 57) {
    event.preventDefault();
  }
}

function obtener_subtotal() {
  var cantidad = $("#cantidad").val();
  if (cantidad > 0) {
    $("#error").html("");
    var precio = $("#precio").val();
    var subtotal = parseInt(cantidad) * parseInt(precio);
    $("#subtotal").val(subtotal);
  } else {
    $("#error").html("Debe ingresar cantidad");
    $("#subtotal").val("");
  }
}

function anadir_item() {
  var cantidad = parseInt($("#cantidad").val());
  if (cantidad > 0) {
    $("#error").html("");
    var itemId = parseInt($("#cervezas").val());

    var indiceYaExiste = pedido.items.findIndex((item) => {
      return item.itemId == itemId;
    });
    if (indiceYaExiste == -1) {
      pedido.items.push({ itemId, cantidad });
    } else {
      pedido.items[indiceYaExiste].cantidad += cantidad;
    }
    $("#cantidad").val("");
    $("#subtotal").val("");
    mostrar_pedido_compra();
  } else {
    $("#error").html("Debe ingresar cantidad");
  }
}

function mostrar_pedido_compra() {
  var tablaHeader = `<table class="table table-hover table-dark finalizar-pedido">
  <thead>
    <tr class="items">
      <th scope="col">#</th>
      <th scope="col">Producto</th>
      <th scope="col">Cantidad</th>
      <th scope="col">Precio</th>
      <th scope="col">Subtotal</th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody>`;
  var tablaBody = "";
  var total = 0;
  var iconoEliminar = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>`;
  pedido.items.forEach((item, indice) => {
    var articulo = articulos.find((articulo) => {
      return item.itemId == articulo.id;
    });
    tablaBody += `<tr>
      <th scope="row">${indice + 1}</th>
      <td>${articulo.nombre}</td>
      <td>$${articulo.precio}</td>
      <td>${item.cantidad}</td>
      <td>$${parseInt(item.cantidad) * parseInt(articulo.precio)}</td>
      <td><span class="icono-eliminar" onclick="quitar_item(${indice})">${iconoEliminar}</span></td>
    </tr>`;
    total += parseInt(item.cantidad) * parseInt(articulo.precio);
  });
  var tablaFooter = `<tr>
    <td colspan="3"></td>
    <td class="total">TOTAL</td>
    <td class="monto">$${total}</td>
    <td></td>
  </tr>
  </tbody>
  </table>`;
  var formulario_comprador = `<div class="row">
      <div class="col-sm column-1">
        Nombre y Apellido:
      </div>
      <div class="col-sm column-2">
        <input class="field" type="text" name="name" id="name">
      </div>
    </div>
    <div class="row">
      <div class="col-sm column-1">
        Telefono:
      </div>
      <div class="col-sm column-2">
        <input class="field" type="text" name="phone" id="phone" >
      </div>
    </div>
    <div class="row">
      <div class="col-sm column-1">
        Dirección:
      </div>
      <div class="col-sm column-2">
        <input class="field" type="text" name="adress" id="adress">
      </div>
    </div>
    <div class="row" >
      <div class="col-sm column-1">
      </div>
      <div class="col-sm column-2">
        <div class="error" id="error-cliente"></div>
        <button class="finalizar" onclick="realizar_pedido()">FINALIZAR PEDIDO</button>
      </div>
    </div>`;
  if (pedido.items.length) {
    $("#pedido-final").html(tablaHeader + tablaBody + tablaFooter);
    if ($("#formulario_de_cliente").html() === "") {
      $("#formulario_de_cliente").html(formulario_comprador);
    }
  } else {
    $("#pedido-final").html("");
    $("#formulario_de_cliente").html("");
  }
}

function quitar_item(indice) {
  pedido.items.splice(indice, 1);
  mostrar_pedido_compra();
}

function realizar_pedido() {
  if ($("#name").val().trim() === "") {
    $("#error-cliente").html("Debe ingresar un nombre");
    return;
  }
  if ($("#phone").val().trim() === "") {
    $("#error-cliente").html("Debe ingresar un teléfono");
    return;
  }
  if ($("#adress").val().trim() === "") {
    $("#error-cliente").html("Debe ingresar una dirección");
    return;
  }
  $("#error-cliente").html("");
  var mensaje = `Gracias por tu compra ${$(
    "#name"
  ).val()}, Pedido sera enviado a ${$(
    "#adress"
  ).val()}`;
  $("#detalle-pedido").html(mensaje);
  $("#modal-pedido").modal();
  $("#pedido-final").html("");
  $("#formulario_de_cliente").html("");
}

//  Main

var articulos = [];
$.ajax({
  url: "./js/datos.json",
  dataType: "json",
  success: (response) => {
    obtener_datos(response, articulos);
  },
});
var pedido = new Pedido_compra();
$("#cantidad").keypress(check_numero);
$("#validar-edad").keypress(check_numero);

$("#pedidos").on("click", function () {
  let posicion = $("#customer").offset().top;
  $("html, body").animate({ scrollTop: posicion }, 2000);
});

$(document).ready(() => {
  consultar_edad();
});
