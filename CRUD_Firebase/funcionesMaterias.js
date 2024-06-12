import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { collection, doc, getDoc, getDocs, getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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

async function cargarMaterias() {
    const materiasRef = collection(db, "materias");
    const querySnapshot = await getDocs(materiasRef);
    const tbody = document.querySelector("#tbMaterias tbody");

    querySnapshot.forEach((doc) => {
        const materia = doc.data();
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${materia.grupo}</td>
            <td>${materia.nombreMat}</td>
            <td>${materia.maestro}</td>
        `;
        tbody.appendChild(row);
    });
}

async function cargarMateriasCursadas() {
    const usuariosRef = collection(db, "usuarios");
    const usuariosSnapshot = await getDocs(usuariosRef);

    usuariosSnapshot.forEach(async (usuarioDoc) => {
        const usuarioData = usuarioDoc.data();
        const materiasCursadasRefs = usuarioData.materiasCursadas;

        const usuarioMateriasList = document.createElement("ul");
        
        for (const materiaRef of materiasCursadasRefs) {
            const materiaDoc = await getDoc(doc(db, materiaRef.path));
            const materiaData = materiaDoc.data();
            const materiaItem = document.createElement("li");
            materiaItem.textContent = `${materiaData.grupo}: ${materiaData.nombreMat} - ${materiaData.maestro}`;
            usuarioMateriasList.appendChild(materiaItem);
        }

        const usuarioRow = document.createElement("tr");
        usuarioRow.innerHTML = `
            <td>${usuarioData.matricula}</td>
            <td>${usuarioData.nombre} ${usuarioData.apellido}</td>
            <td>${usuarioMateriasList.outerHTML}</td>
        `;

        const tbody = document.querySelector("#tbUsuarios tbody");
        tbody.appendChild(usuarioRow);
    });
}

// Llamar a la función para cargar las materias y las materias cursadas cuando la página se cargue completamente
document.addEventListener("DOMContentLoaded", async function() {
    await cargarMaterias();
    await cargarMateriasCursadas();
});
