//  Validaciones en tiempo real 
function validarCampo(id, regex, mensaje) {
  const input = document.getElementById(id);
  input.addEventListener("input", function () {
    const valor = input.value.trim();
    const feedback = document.getElementById(id + "-error");

    if (!regex.test(valor)) {
      feedback.textContent = mensaje;
      feedback.style.color = "red";
    } else {
      feedback.textContent = "✔ Correcto";
      feedback.style.color = "green";
    }
  });
}

// Crear spans de feedback dinámicamente
["nombre","apellido","telefono","email"].forEach(id => {
  const input = document.getElementById(id);
  const span = document.createElement("span");
  span.id = id + "-error";
  input.insertAdjacentElement("afterend", span);
});

// Reglas de validación
validarCampo("nombre", /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/, "Debe tener al menos 2 letras");
validarCampo("apellido", /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/, "Debe tener al menos 2 letras");
validarCampo("telefono", /^[0-9]{7,15}$/, "Teléfono inválido (solo números)");
validarCampo("email", /^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Formato de email inválido");

document.getElementById("menu-toggle").addEventListener("click", function() {
  const nav = document.getElementById("nav-menu");
  nav.classList.toggle("active");
});

//  Funciones CRUD con localStorage 
function obtenerContactos() {
  return JSON.parse(localStorage.getItem("contactos")) || [];
}

function guardarContactos(contactos) {
  localStorage.setItem("contactos", JSON.stringify(contactos));
}

function mostrarContactos() {
  const contactos = obtenerContactos();
  const lista = document.getElementById("contact-list");
  lista.innerHTML = "";

  contactos.forEach((c, index) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${c.nombre}</td>
      <td>${c.apellido}</td>
      <td>${c.telefono}</td>
      <td>${c.email}</td>
      <td>${c.direccion}</td>
      <td>${c.categoria}</td>
      <td>
        <button onclick="editarContacto(${index})">Editar</button>
        <button onclick="eliminarContacto(${index})">Eliminar</button>
      </td>
    `;

    lista.appendChild(fila);
  });
}

//  Variable global para edición 
let indiceEditando = null;

//  Guardar contacto desde el formulario 
document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const contacto = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    telefono: document.getElementById("telefono").value,
    email: document.getElementById("email").value,
    direccion: document.getElementById("direccion").value,
    categoria: document.getElementById("categoria").value
  };

  const contactos = obtenerContactos();

  if (indiceEditando !== null) {
    // reemplazo el contacto editado
    contactos[indiceEditando] = contacto;
    indiceEditando = null;
    mostrarMensaje("Contacto editado", "success");
  } else {
    // agrego nuevo
    contactos.push(contacto);
    mostrarMensaje("Contacto agregado", "success");
  }

  guardarContactos(contactos);
  mostrarContactos();
  this.reset();
});

//  Eliminar contacto 
function eliminarContacto(index) {
  const contactos = obtenerContactos();
  contactos.splice(index, 1);
  guardarContactos(contactos);
  mostrarContactos();
  mostrarMensaje("Contacto eliminado", "error");
}

//  Editar contacto 
function editarContacto(index) {
  const contactos = obtenerContactos();
  const c = contactos[index];

  document.getElementById("nombre").value = c.nombre;
  document.getElementById("apellido").value = c.apellido;
  document.getElementById("telefono").value = c.telefono;
  document.getElementById("email").value = c.email;
  document.getElementById("direccion").value = c.direccion;
  document.getElementById("categoria").value = c.categoria;

  // guardo el índice para saber que estoy editando
  indiceEditando = index;
}

//  Mostrar contactos al cargar la página 
mostrarContactos();

function mostrarMensaje(texto, tipo) {
  const mensaje = document.getElementById("mensaje");
  mensaje.textContent = texto;
  mensaje.className = "mensaje show " + tipo;

  // Ocultar después de 3 segundos
  setTimeout(() => {
    mensaje.className = "mensaje";
    mensaje.textContent = "";
  }, 3000);
}
