import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, query, updateDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC4_Y_xK6j1BIGeFn1vDNulZbrphOYMqpU",
    authDomain: "registrocrud-3d2ac.firebaseapp.com",
    projectId: "registrocrud-3d2ac",
    storageBucket: "registrocrud-3d2ac.appspot.com",
    messagingSenderId: "188375204900",
    appId: "1:188375204900:web:5cc4cec31fa77f4ac7c4b1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let bti = document.getElementById("inser");
let bte = document.getElementById("Edit");
let btel = document.getElementById("Elim");
const tablaUsuarios = document.querySelector("#tbUsuarios");

// Función para validar campos del formulario
function validarFormulario(isInsertForm) {
  const matriculaField = isInsertForm ? "matricula" : "editMatricula";
  const nombreField = isInsertForm ? "nombre" : "editNombre";
  const apellidoField = isInsertForm ? "apellido" : "editApellido";
  const correoField = isInsertForm ? "correo" : "editCorreo";
  const telefonoField = isInsertForm ? "telefono" : "editTelefono";

  const matricula = document.getElementById(matriculaField).value.trim();
  const nombre = document.getElementById(nombreField).value.trim();
  const apellido = document.getElementById(apellidoField).value.trim();
  const correo = document.getElementById(correoField).value.trim();
  const telefono = document.getElementById(telefonoField).value.trim();

  if (!matricula || !nombre || !apellido || !correo || !telefono) {
    alert("Por favor, complete todos los campos.");
    return false;
  }
  return true;
}

// Método para Agregar Registro
bti.addEventListener('click', async (e) => {
  if (!validarFormulario(true)) return;

  let matricula = document.getElementById("matricula").value.trim();
  let nombre = document.getElementById("nombre").value.trim();
  let apellido = document.getElementById("apellido").value.trim();
  let correo = document.getElementById("correo").value.trim();
  let telefono = document.getElementById("telefono").value.trim();

  try {
    const docRef = await addDoc(collection(db, "usuarios"), {
      matricula: Number(matricula),
      nombre: nombre,
      apellido: apellido,
      correo: correo,
      telefono: Number(telefono),
    });
    alert("Usuario agregado con éxito.");
    document.getElementById("userForm").reset(); // Limpiar formulario
    document.getElementById("userForm").style.display = "none"; // Ocultar formulario
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Error al agregar el usuario.");
  }
});

// Mostrar el formulario de edición al clickear en "Editar"
async function ShowUsers() {
  const tbody = document.querySelector("#tbUsuarios tbody");
  tbody.innerHTML = ""; // Limpiar el contenido existente

  const Allusers = await ViewUsuarios();

  Allusers.forEach((doc) => {
    const datos = doc.data();
    const row = document.createElement("tr");
  
    row.innerHTML = `
      <td>${datos.matricula}</td>
      <td>${datos.nombre}</td>
      <td>${datos.apellido}</td>
      <td>${datos.telefono}</td>
      <td>
          <button class="btn-primary btn m-1 editar_" data-id="${doc.id}">
          <i class="bi bi-pencil-square"></i> Editar 
          <span class="spinner-border spinner-border-sm" id="Edit-${doc.id}" style="display: none;"></span>
          </button> 
          <button class="btn-danger btn eliminar_" data-id="${doc.id}|${datos.nombre}">
          <i class="bi bi-trash"></i> Eliminar 
          <span class="spinner-border spinner-border-sm" id="elim-${doc.id}" style="display: none;"></span>
          </button>
          <button class="btn-info btn cargar_" data-id="${doc.id}">
          Consultar Materias
          </button>
      </td>
    `;
  
    tbody.appendChild(row);
  });
  

  // Agregar event listener a los botones "Editar"
  document.querySelectorAll('.editar_').forEach((button) => {
    button.addEventListener('click', async (e) => {
      const userId = e.target.dataset.id;
      const userDoc = await getDoc(doc(db, "usuarios", userId));
      const userData = userDoc.data();
      // Cargar datos del usuario en el formulario de edición
      document.getElementById("editUserId").value = userId;
      document.getElementById("editMatricula").value = userData.matricula;
      document.getElementById("editNombre").value = userData.nombre;
      document.getElementById("editApellido").value = userData.apellido;
      document.getElementById("editCorreo").value = userData.correo;
      document.getElementById("editTelefono").value = userData.telefono;
      // Mostrar u ocultar el formulario de edición
      const editForm = document.getElementById('editForm');
      editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
    });
  });

// Agregar event listener a los botones "Cargar"
document.querySelectorAll('.cargar_').forEach((button) => {
  button.addEventListener('click', async (e) => {
    const userId = e.target.dataset.id;
    // Redirigir a la página de materias con el ID del usuario como parámetro en la URL
    window.location.href = `materias.html?userId=${userId}`;
  });
});

}

async function ViewUsuarios() {
  const userRef = collection(db, "usuarios");
  const Allusers = await getDocs(userRef);
  return Allusers;
}

async function viewUsuarios2() {
  const q = query(collection(db, "usuarios"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    ShowUsers(); // Actualizar la lista al detectar cambios
    const usuario = [];
    querySnapshot.forEach((doc) => {
      usuario.push(doc.data().viewUsuarios2);
    });
    console.log("Usuarios en: ", usuario.join(", "));
  });
}

// Llamar a viewUsuarios2 para iniciar la escucha de cambios
viewUsuarios2();

// Evento de clic para el botón "Actualizar" dentro del formulario de edición
document.getElementById('updateUser').addEventListener('click', async () => {
  if (!validarFormulario(false)) return;

  let userId = document.getElementById("editUserId").value;
  let matricula = document.getElementById("editMatricula").value.trim();
  let nombre = document.getElementById("editNombre").value.trim();
  let apellido = document.getElementById("editApellido").value.trim();
  let correo = document.getElementById("editCorreo").value.trim();
  let telefono = document.getElementById("editTelefono").value.trim();

  try {
    const userRef = doc(db, "usuarios", userId);
    await updateDoc(userRef, {
      matricula: Number(matricula),
      nombre: nombre,
      apellido: apellido,
      correo: correo,
      telefono: Number(telefono),
    });
    alert("Usuario actualizado con éxito.");
    document.getElementById("editForm").style.display = "none"; // Ocultar formulario de edición
    ShowUsers(); // Actualizar lista de usuarios
  } catch (e) {
    console.error("Error updating document: ", e);
    alert("Error al actualizar el usuario.");
  }
});

// Método para eliminar
document.querySelector("#tbUsuarios").addEventListener('click', async function(e) {
  if (e.target.classList.contains('eliminar_')) {
    const userId = e.target.dataset.id.split('|')[0];

    try {
      await deleteDoc(doc(db, "usuarios", userId));
      // No es necesario llamar a ShowUsers() aquí
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert("Error al eliminar el usuario.");
    }
  }
});

// Función para filtrar usuarios
document.getElementById('search').addEventListener('input', function(e) {
  const searchValue = e.target.value.toLowerCase();
  filterUsers(searchValue);
});

async function filterUsers(searchValue) {
  const tbody = document.querySelector("#tbUsuarios tbody");
  tbody.innerHTML = ""; // Limpiar el contenido existente

  const Allusers = await ViewUsuarios();

  Allusers.forEach((doc) => {
    const datos = doc.data();
    const nombreCompleto = `${datos.nombre} ${datos.apellido}`.toLowerCase();

    if (nombreCompleto.includes(searchValue)) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${datos.matricula}</td>
        <td>${datos.nombre}</td>
        <td>${datos.apellido}</td>
        <td>${datos.telefono}</td>
        <td>
          <button class="btn-primary btn m-1 editar_" data-id="${doc.id}">
          <i class="bi bi-pencil-square"></i> Editar 
          <span class="spinner-border spinner-border-sm" id="Edit-${doc.id}" style="display: none;"></span>
          </button> 
          <button class="btn-danger btn eliminar_" data-id="${doc.id}|${datos.nombre}">
          <i class="bi bi-trash"></i> Eliminar 
          <span class="spinner-border spinner-border-sm" id="elim-${doc.id}" style="display: none;"></span>
          </button>
        </td>
      `;
      tbody.appendChild(row);
    }
  });
}

// Mostrar el formulario de agregar nuevo registro al hacer clic en "Agregar Nuevo Registro"
document.getElementById('showForm').addEventListener('click', function() {
  const form = document.getElementById('userForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
});
