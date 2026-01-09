import { Ejercito } from "./clases/Ejercito.js";

import { UnidadService } from "./servicios/UnidadService.js";
import { UnidadIndexedDBRepository } from "./repositories/UnidadIndexedDBRepository.js";

import { EjercitoService } from "./servicios/EjercitoService.js";
import { EjercitoIndexedDBRepository } from "./repositories/EjercitoIndexedDBRepository.js";
import { ServicioCapacidadMilitar } from "./servicios/CapacidadMilitarService.js";

import { FakeEjercitoRepository } from "./repositories/FakeEjercitoRepository.js";
import { FakeUnidadRepository } from "./repositories/FakeUnidadRepository.js";

import { UnidadDecoradaFactory } from "./factory/UnidadDecoradaFactory.js";
import { MarshallTank } from "./adaptadores/UnidadAmericanaAdaptador.js";

// REPOSITORIO FALSO PARA PRUEBAS RÁPIDAS
const usarFakeRepositories = false; // false para IndexedDB real

let unidadRepo, ejercitoRepo;

if (usarFakeRepositories) {
    unidadRepo = new FakeUnidadRepository();
    ejercitoRepo = new FakeEjercitoRepository();

    unidadRepo.cargarDatosEjemplo();
    ejercitoRepo.cargarEjercitosEjemplo();
} else {
    unidadRepo = new UnidadIndexedDBRepository();
    ejercitoRepo = new EjercitoIndexedDBRepository();
}

// Referencias DOM
const form = document.getElementById("formUnidad") as HTMLFormElement;
const formEjercito = document.getElementById("formEjercito") as HTMLFormElement;
const lista = document.getElementById("listaUnidades") as HTMLUListElement;
const listaEjercitos = document.getElementById("listaEjercitos") as HTMLUListElement;
const selectEjercito = document.getElementById("selectEjercito") as HTMLSelectElement;

const btnBorrarTodas = document.getElementById("borrarTodas") as HTMLButtonElement;
const btnBorrarUna = document.getElementById("borrarUna") as HTMLButtonElement;
const inputNombreABorrar = document.getElementById("nombreABorrar") as HTMLInputElement;

const btnInforme = document.getElementById("btnInforme") as HTMLButtonElement;
const informeLista = document.getElementById("informeEjercito") as HTMLUListElement;

const btnMejorarVelocidad = document.getElementById("btnMejorarVelocidad") as HTMLButtonElement;
const btnMejorarBlindaje = document.getElementById("btnMejorarBlindaje") as HTMLButtonElement;
const btnMejorarCompleto = document.getElementById("btnMejorarCompleto") as HTMLButtonElement;
const btnAgregarAmericano = document.getElementById("btnAgregarAmericano") as HTMLButtonElement;
const infoUnidadSeleccionada = document.getElementById("infoUnidadSeleccionada") as HTMLDivElement;
const resultadoDecorador = document.getElementById("resultadoDecorador") as HTMLDivElement;

// Servicios
const unidadService = new UnidadService(unidadRepo);
const ejercitoService = new EjercitoService(ejercitoRepo);
const servicioCM = new ServicioCapacidadMilitar();

// Init
await cargarUnidadesIniciales();
await cargarEjercitosIniciales();

async function cargarEjercitosIniciales() {
    const ejercitosArray = await ejercitoService.listarEjercitos();

    selectEjercito.innerHTML = "";
    listaEjercitos.innerHTML = "";

    for (const ej of ejercitosArray) {
        // SELECT
        const option = document.createElement("option");
        option.value = ej.nombre;
        option.textContent = ej.nombre;
        selectEjercito.appendChild(option);

        // LISTA EN PANTALLA
        const li = document.createElement("li");
        li.textContent = `${ej.nombre} (Fondo: ${ej.fondo})`;
        listaEjercitos.appendChild(li);
    }
}

async function cargarUnidadesIniciales() {
    const unidades = await unidadService.listarUnidades();
    lista.innerHTML = "";

    for (const unidad of unidades) {
        const li = document.createElement("li");
        li.textContent = `${unidad.nombre}: Vel ${unidad.velocidad.toFixed(1)}, Bl ${unidad.blindaje.toFixed(1)}, PF ${unidad.potenciaDeFuego.toFixed(1)}, Precio ${unidad.precio.toFixed(0)} €`;

        lista.appendChild(li);
    }
}

// async function cargarUnidadesIniciales() {
//     const unidades = await unidadService.listarUnidades();
//     lista.innerHTML = "";

//     for (const unidad of unidades) {
//         const li = document.createElement("li");
//         li.textContent = `${unidad.nombre}: Vel ${unidad.velocidad}, Bl ${unidad.blindaje}, PF ${unidad.potenciaDeFuego}, Precio ${unidad.precio}`;
//         lista.appendChild(li);
//     }
// }

// Crear unidad
form.addEventListener("submit", async (event) => {

    event.preventDefault();

    try {
        const formData = new FormData(form);

        const unidad = await unidadService.crearUnidad(
            Number(formData.get("velocidad")),
            Number(formData.get("blindaje")),
            Number(formData.get("potenciaDeFuego")),
            Number(formData.get("precio")),
            formData.get("nombre") as string,
        );

        await ejercitoService.agregarUnidadAEjercito(
            selectEjercito.value,
            formData.get("division") as string,
            unidad
        );

        await unidadService.guardarUnidad(unidad);
        await cargarUnidadesIniciales();
        form.reset();
    } catch (error) {
        console.error("Error al crear unidad:", error);
    }


});

// Borrar unidades
btnBorrarTodas.addEventListener("click", async () => {
    await unidadService.borrarTodasUnidades();
    await cargarUnidadesIniciales();
});

btnBorrarUna.addEventListener("click", async () => {
    const nombre = inputNombreABorrar.value.trim();
    if (!nombre) return;

    await unidadService.borrarUnidad(nombre);
    await cargarUnidadesIniciales();
    inputNombreABorrar.value = "";
});

// Crear ejército
formEjercito.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const formData = new FormData(formEjercito);

        await ejercitoService.crearEjercito(
            formData.get("nombreEjercito") as string,
            Number(formData.get("fondoEjercito"))
        );

        await cargarEjercitosIniciales();
        formEjercito.reset();

    } catch (error) {
        console.error("Error al crear ejército:", error);
    }
});

// Informe
btnInforme.addEventListener("click", async () => {
    const ejercitos = await ejercitoService.listarEjercitos();

    if (ejercitos.length === 0) {
        informeLista.innerHTML = "<li>No hay ejércitos creados</li>";
        return;
    }

    informeLista.innerHTML = "";

    for (const ejercitoPlano of ejercitos) {
        // Reconstruir cada ejército
        const ejercito = Ejercito.fromPlainObject(ejercitoPlano);

        // Obtener informe para este ejército
        const informe = servicioCM.obtenerInformeCompleto(ejercito);

        // Crear elemento de lista para este ejército
        const liEjercito = document.createElement("li");
        liEjercito.innerHTML = `<strong>${ejercito.nombre}</strong>`;

        // Lista interna con los detalles del informe
        const ulDetalles = document.createElement("ul");

        const itemsFormateados = [
            `Unidades: ${informe.totalUnidades}`,
            `Potencia: ${informe.potenciaDeFuegoTotal}`,
            `Blindaje: ${informe.blindajeTotal}`,
            `Movimiento: ${informe.capacidadMovimiento}`,
            `Gasto: ${informe.gastoTotal}`,
            `CM: ${informe.capacidadMilitar.toFixed(4)}`
        ];

        for (const item of itemsFormateados) {
            const liDetalle = document.createElement("li");
            liDetalle.textContent = item;
            ulDetalles.appendChild(liDetalle);
        }

        liEjercito.appendChild(ulDetalles);
        informeLista.appendChild(liEjercito);

        // Separador visual entre ejércitos
        const separador = document.createElement("hr");
        informeLista.appendChild(separador);
    }

    // Eliminar el último separador
    const ultimoSeparador = informeLista.querySelector("hr:last-of-type");
    if (ultimoSeparador) {
        ultimoSeparador.remove();
    }
});

// Función para aplicar mejora a los valores del formulario
function aplicarMejoraFormulario(tipo: 'velocidad' | 'blindaje' | 'completo') {
    const velocidadInput = document.querySelector('input[name="velocidad"]') as HTMLInputElement;
    const blindajeInput = document.querySelector('input[name="blindaje"]') as HTMLInputElement;
    const precioInput = document.querySelector('input[name="precio"]') as HTMLInputElement;
    const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;

    if (!velocidadInput.value || !blindajeInput.value || !precioInput.value || !nombreInput.value) {
        resultadoDecorador.innerHTML = '<div> Completa todos los campos del formulario primero</div>';
        return;
    }

    let velocidad = Number.parseFloat(velocidadInput.value);
    let blindaje = Number.parseFloat(blindajeInput.value);
    let precio = Number.parseFloat(precioInput.value);
    let mensaje = '';

    switch (tipo) {
        case 'velocidad':
            velocidad *= 1.3;
            precio *= 1.15;
            mensaje = `<strong>+30% Velocidad aplicada</strong><br>Nueva velocidad: ${velocidad.toFixed(2)} (+30%)<br>Nuevo precio: ${precio.toFixed(2)} € (+15%)`;
            break;

        case 'blindaje':
            blindaje *= 1.3;
            precio *= 1.2;
            mensaje = `<strong>+30% Blindaje aplicado</strong><br>Nuevo blindaje: ${blindaje.toFixed(2)} (+30%)<br>Nuevo precio: ${precio.toFixed(2)} € (+20%)`;
            break;

        case 'completo':
            velocidad *= 1.3;
            blindaje *= 1.3;
            precio *= 1.35;
            mensaje = `<strong>Mejora completa aplicada</strong><br>Velocidad: ${velocidad.toFixed(2)} (+30%)<br>Blindaje: ${blindaje.toFixed(2)} (+30%)<br>Precio: ${precio.toFixed(2)} € (+35%)`;
            break;
    }

    // Actualizar valores en el formulario
    velocidadInput.value = velocidad.toFixed(2);
    blindajeInput.value = blindaje.toFixed(2);
    precioInput.value = precio.toFixed(2);

    resultadoDecorador.innerHTML = `<div>${mensaje}</div>`;
}

// Función para agregar Marshall Tank al formulario
function agregarMarshallTankAlFormulario() {
    const nombreInput = document.querySelector('input[name="nombre"]') as HTMLInputElement;
    const velocidadInput = document.querySelector('input[name="velocidad"]') as HTMLInputElement;
    const blindajeInput = document.querySelector('input[name="blindaje"]') as HTMLInputElement;
    const potenciaInput = document.querySelector('input[name="potenciaDeFuego"]') as HTMLInputElement;
    const precioInput = document.querySelector('input[name="precio"]') as HTMLInputElement;
    const divisionSelect = document.querySelector('select[name="division"]') as HTMLSelectElement;

    // Datos del Marshall Tank (en sistema métrico ya convertido)
    const adaptador = UnidadDecoradaFactory.crearUnidadAmericana();
    const unidadAmericana = adaptador.toUnidad();

    // Rellenar formulario
    nombreInput.value = "Marshall Tank M1A2";
    velocidadInput.value = unidadAmericana.velocidad.toFixed(2);
    blindajeInput.value = unidadAmericana.blindaje.toFixed(2);
    potenciaInput.value = unidadAmericana.potenciaDeFuego.toFixed(2);
    precioInput.value = unidadAmericana.precio.toFixed(2);
    divisionSelect.value = "Caballería"; // Por defecto

    resultadoDecorador.innerHTML = `
        <div>
            <p>Marshall Tank cargado en formulario</p><br>
            Unidad americana adaptada al sistema métrico<br>
            <em>Ahora puedes aplicar mejoras o crear la unidad directamente</em>
        </div>
    `;
}

// Botones de decoradores
btnMejorarVelocidad.addEventListener("click", () => aplicarMejoraFormulario('velocidad'));
btnMejorarBlindaje.addEventListener("click", () => aplicarMejoraFormulario('blindaje'));
btnMejorarCompleto.addEventListener("click", () => aplicarMejoraFormulario('completo'));
btnAgregarAmericano.addEventListener("click", agregarMarshallTankAlFormulario);

infoUnidadSeleccionada.innerHTML = `
    1. Introduce los datos de la unidad en el formulario<br>
    2. Aplica mejoras (modificarán los valores del formulario)<br>
    3. Crea la unidad con los valores mejorados<br>
    <br>
    O carga el <strong>Marshall Tank</strong> (unidad americana)
`;