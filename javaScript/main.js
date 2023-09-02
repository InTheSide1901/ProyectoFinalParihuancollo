
//---------------------------Variables---------------------------//
const numButtons = document.querySelectorAll(".num-button");
const primerMensaje = document.getElementById("primer_mensaje");
const segundoMensaje = document.getElementById("segundo_mensaje");
const jugarSiButton = document.getElementById("jugar_si");
const jugarNoButton = document.getElementById("jugar_no");
const iniciarJuegoButton = document.getElementById("iniciar_juego");
const ganadores = [];
const perdedores = [];
let jugadoresData = JSON.parse(localStorage.getItem("jugadoresData")) || [];
let numeroAleatorio;
let intentosRestantes;
let nombre;
const historial = {
    ganadores: [],
    perdedores: [],
};


//este codigo sirve para concatenar los botones del 1 al 10 con el sitio web
numButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (intentosRestantes > 0) {
            const numeroElegido = parseInt(button.textContent);
            verificarAdivinanza(numeroElegido);
        }
    });
});
//----------------------------------------


document.getElementById("exportar_historial").addEventListener("click", function () {
    const historialData = {
        ganadores: ganadores,
        perdedores: perdedores
    };

    const blob = new Blob([JSON.stringify(historialData)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "historial.json"; // Nombre del archivo
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
});




//verifica adivinanza y devuelve textos 
function verificarAdivinanza(numeroElegido) {
    if (numeroElegido === numeroAleatorio) {
        segundoMensaje.textContent = "¡Felicidades " + nombre + "!" + ", el número correcto era " + numeroAleatorio + ", por lo tanto ¡Ganaste el juego!";
        ganadores.push(nombre);
        historial.ganadores.push(nombre);
        jugarSiButton.style.display = "block";
        jugarNoButton.style.display = "block";
        actualizarLocalStorage();
    } else {
        intentosRestantes -= 1;
        if (intentosRestantes > 0) {
            primerMensaje.textContent = "Incorrecto, " + nombre + ", aún te quedan " + intentosRestantes + " intentos.";
        } else {
            primerMensaje.textContent = "Lo siento " + nombre + ", se agotaron tus intentos. El número era " + numeroAleatorio;
            perdedores.push(nombre);
            historial.perdedores.push(nombre);
            jugarSiButton.style.display = "block";
            jugarNoButton.style.display = "block";
            actualizarLocalStorage();
        }
    }
}
//--------------------------------------
//boton por si quiero volver a jugar

jugarSiButton.addEventListener("click", function () {
    primerMensaje.textContent = "!Para jugar devuelta, escriba su nombre y presione INICIAR!";
    segundoMensaje.textContent = "";
    intentosRestantes = 4;
});
//---------------------------

//boton por si no quiero volver a jugar
jugarNoButton.addEventListener("click", function () {
    primerMensaje.textContent = "¡Gracias por jugar!";
    segundoMensaje.textContent = "";
});
//--------------------------------------

//boton para iniciar el juego
iniciarJuegoButton.addEventListener("click", function () {
    nombre = document.getElementById("nombre_jugador").value;
    if (nombre) {
        primerMensaje.textContent = "¡Hola " + nombre + "! Intenta adivinar un número del 1 al 10";
        numeroAleatorio = Math.ceil(Math.random() * 10);
        intentosRestantes = 4;
        jugadoresData.push({
            nombre: nombre,
            intentosGanados: 0,
            intentosPerdidos: 0,
            intentosFallidos: []
        });
        actualizarLocalStorage();
    } else {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingresa tu nombre para comenzar.'
        });
    }
});
//-------------------------------------

//añadir informacion de los jugadores 
function actualizarLocalStorage() {
    localStorage.setItem("jugadoresData", JSON.stringify(jugadoresData));
    localStorage.setItem("historial", JSON.stringify(historial));
}
//.---------------------------------------

//boton para mostrar a los ganadores
function mostrarGanadores() {
    let infoGanadores = document.getElementById("info_ganadores");
    infoGanadores.textContent = "Los ganadores son: " + ganadores;
}
//----------------------------------------

//boton para mostrar a los perdedores
function mostrarPerdedores() {
    let infoPerdedores = document.getElementById("info_perdedores");
    infoPerdedores.textContent = "Los perdedores son: " + perdedores;
}
//---------------------------------

//-----------------para guardar el historial en archivo json-------------------
function guardarHistorial() {
    const blob = new Blob([JSON.stringify(historial)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "historial.json";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    }


//------------------guardar de forma asincronica con fetch----------------
async function cargarHistorial() {
try {
    const response = await fetch("historial.json");
    if (!response.ok) {
        throw new Error("Error al cargar el historial.");
    }
    const data = await response.json();
    // Aquí puedes usar data.ganadores y data.perdedores como desees.
} catch (error) {
    console.error("Error:", error);
}
}


//----------Eventos al presionar click y botones de ganadores y perdedores--------//
const mostrarALosGanadores = document.getElementById("boton_ganadores");
mostrarALosGanadores.addEventListener("click", mostrarGanadores);

const mostrarALosPerdedores = document.getElementById("boton_perdedores");
mostrarALosPerdedores.addEventListener("click", mostrarPerdedores);

//-----------guardar el historial--------------

const guardarHistorialButton = document.createElement("button");
guardarHistorialButton.textContent = "Guardar Historial";
guardarHistorialButton.addEventListener("click", guardarHistorial);
document.body.appendChild(guardarHistorialButton);


const cargarHistorialButton = document.createElement("button");
cargarHistorialButton.textContent = "Cargar Historial";
cargarHistorialButton.addEventListener("click", cargarHistorial);
document.body.appendChild(cargarHistorialButton);