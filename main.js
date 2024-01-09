// Hola mi nombre es Carlos Flores. y espero que les agrade mi Pagina!.

let productos = [];
let elementosAgregados = [];

const iconoCarrito = document.querySelector("#icono-carrito");
const carrito = document.querySelector(".carrito");
const cerrarCarrito = document.querySelector("#cerrar-carrito");
const contenidoCarrito = document.querySelector("#contenido-carrito");
const contenidoTienda = document.querySelector("#contenido-tienda");

iconoCarrito.addEventListener("click", () => {
  carrito.classList.add("active");
});

cerrarCarrito.addEventListener("click", () => {
  carrito.classList.remove("active");
});

document.addEventListener("DOMContentLoaded", iniciar);

function iniciar() {
  cargarProductos();
  agregarEventos();
}

// FUNCION PARA EXTRAER JSON!
function cargarProductos() {
  fetch('productos.json')
    .then(response => response.json())
    .then(data => {
      productos = data.productos;
      mostrarProductos();
    })
    .catch(error => console.error('Error cargando productos:', error));
}


// COMO SE MOSTRARA EL PRODUCTO EN LA PAGINA!
function mostrarProductos() {
  contenidoTienda.innerHTML = productos.map(producto => `
    <div class="caja-producto">
        <img src="${producto.imagen}" alt="" class="imagen-producto">
        <h2 class="titulo-producto">${producto.titulo}</h2>
        <span class="precio-producto">$${producto.precio}</span>
        <i class='bx bx-shopping-bag agregar-carrito' data-id="${producto.id}"></i>
    </div>`
  ).join('');
}

function agregarEventos() {
  contenidoTienda.addEventListener("click", event => {
    if (event.target.classList.contains("agregar-carrito")) {
      manejarAgregarElementoCarrito.call(event.target);
    }
  });

  contenidoCarrito.addEventListener("click", event => {
    if (event.target.classList.contains("eliminar-carrito")) {
      manejarEliminarElementoCarrito.call(event.target);
    }
  });

  contenidoCarrito.addEventListener("change", event => {
    if (event.target.classList.contains("cantidad-carrito")) {
      manejarCambiarCantidadElemento.call(event.target);
    }
  });

  const botonCompra = document.querySelector(".btn-compra");
  botonCompra.addEventListener("click", manejarCompra);
}

function manejarAgregarElementoCarrito() {
  let idProducto = parseInt(this.getAttribute("data-id"));
  let producto = productos.find(prod => prod.id === idProducto);

  let titulo = producto.titulo;
  let precio = producto.precio;
  let imgSrc = producto.imagen;

  let nuevoAgregar = {
    titulo,
    precio,
    imgSrc,
  };

  // SI EL ARTICULO EXITE!!
  if (elementosAgregados.find((el) => el.titulo === nuevoAgregar.titulo)) {
    Swal.fire('¡Este artículo ya existe!')
    return;
  } else {
    elementosAgregados.push(nuevoAgregar);
  }

  let cajaElementoCarrito = componenteCajaCarrito(titulo, precio, imgSrc);
  contenidoCarrito.insertAdjacentHTML("beforeend", cajaElementoCarrito);

  actualizarTotal();
}

function manejarEliminarElementoCarrito() {
  let titulo = this.parentElement.querySelector(".titulo-producto-carrito").innerHTML;
  this.parentElement.remove();
  elementosAgregados = elementosAgregados.filter(el => el.titulo !== titulo);

  actualizarTotal();
}

function manejarCambiarCantidadElemento() {
  if (isNaN(this.value) || this.value < 1) {
    this.value = 1;
  }
  this.value = Math.floor(this.value);

  actualizarTotal();
}

// SI NO HAY NINGUN ARTICULO!!
function manejarCompra() {
  if (elementosAgregados.length <= 0) {
    Swal.fire(
      '¡No hay ninguna orden para realizar!',
      'Por favor, haga un pedido primero.',
      'error'
    );
    return;
  }

  // FUNCION PARA COMPRA EXITOSA 
  contenidoCarrito.innerHTML = "";
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Su pedido ha sido realizado con éxito',
    showConfirmButton: false,
    timer: 1500
  });
  elementosAgregados = [];

  actualizarTotal();
}

function actualizarTotal() {
  let cajasCarrito = document.querySelectorAll(".caja-carrito");
  const elementoTotal = carrito.querySelector(".precio-total");
  let total = 0;

  cajasCarrito.forEach((cajaCarrito) => {
    let elementoPrecio = cajaCarrito.querySelector(".precio-carrito");
    let precio = parseFloat(elementoPrecio.innerHTML.replace("$", ""));
    let cantidadElemento = cajaCarrito.querySelector(".cantidad-carrito");
    let cantidad = cantidadElemento ? parseInt(cantidadElemento.value) : 1;

    total += precio * cantidad;
  });

  total = total.toFixed(2);
  elementoTotal.innerHTML = "$" + total;
}

// FUNCION PARA LA BARRA QUE ESTA A LA DERECHA
function componenteCajaCarrito(titulo, precio, imgSrc) {
  return `
    <div class="caja-carrito">
        <img src=${imgSrc} alt="" class="imagen-carrito">
        <div class="detalle-caja">
            <div class="titulo-producto-carrito">${titulo}</div>
            <div class="precio-carrito">${precio}</div>
            <input type="number" value="1" class="cantidad-carrito">
        </div>
        <i class='bx bxs-trash-alt eliminar-carrito'></i>
    </div>`;
}
