import { Ejercito } from "../clases/Ejercito.js";
import { IEjercitoRepository } from "../interfaces/IEjercitoRepository.js";
import { Division } from "../clases/Division.js";
import { Unidad } from "../clases/Unidad.js";

export class FakeEjercitoRepository implements IEjercitoRepository {
    private ejercitos: Ejercito[] = [];

    constructor(ejercitosIniciales: Ejercito[] = []) {
        this.ejercitos = [...ejercitosIniciales];
    }

    async guardar(ejercito: Ejercito): Promise<void> {
        const indice = this.ejercitos.findIndex(e => e.nombre === ejercito.nombre);

        if (indice >= 0) {
            this.ejercitos[indice] = ejercito;
        } else {
            this.ejercitos.push(ejercito);
        }
    }

    async listar(): Promise<Ejercito[]> {
        return this.ejercitos.map(ej => Ejercito.fromPlainObject(ej));
    }

    async borrarPorNombre(nombre: string): Promise<void> {
        this.ejercitos = this.ejercitos.filter(e => e.nombre !== nombre);
    }

    async borrarTodos(): Promise<void> {
        this.ejercitos = [];
    }

    async contar(): Promise<number> {
        return this.ejercitos.length;
    }

    async buscarPorNombre(nombre: string): Promise<Ejercito | undefined> {
        const ejercito = this.ejercitos.find(e => e.nombre === nombre);
        return ejercito ? Ejercito.fromPlainObject(ejercito) : undefined;
    }

    cargarEjercitoEjemplo(): void {
        const ejercitoEjemplo = new Ejercito("Ejército del Norte", 50000);

        // Crear divisiones y asignar unidades
        const caballeria = new Division("Caballería");
        caballeria.agregarUnidad(new Unidad(4.5, 1.4, 0, 4200, "Transporte MX-7899"));
        caballeria.agregarUnidad(new Unidad(7.3, 4.8, 9.8, 15600, "Tanque Sombras-VB98"));

        const infanteria = new Division("Infantería");
        infanteria.agregarUnidad(new Unidad(6, 0, 7, 250, "Infantería Básica"));
        infanteria.agregarUnidad(new Unidad(4, 0, 10, 400, "Ametrallador"));

        const artilleria = new Division("Artillería");
        artilleria.agregarUnidad(new Unidad(1, 0, 22, 1100, "Cañón Antiaéreo"));
        artilleria.agregarUnidad(new Unidad(3, 2, 19, 1350, "Torpedero móvil"));

        const ejercitoData = {
            nombre: "Ejército del Norte",
            fondo: 50000,
            divisiones: [
                {
                    nombre: "Caballería",
                    unidades: [
                        { velocidad: 4.5, blindaje: 1.4, potenciaDeFuego: 0, precio: 4200, nombre: "Transporte MX-7899" },
                        { velocidad: 7.3, blindaje: 4.8, potenciaDeFuego: 9.8, precio: 15600, nombre: "Tanque Sombras-VB98" }
                    ]
                },
                {
                    nombre: "Infantería",
                    unidades: [
                        { velocidad: 6, blindaje: 0, potenciaDeFuego: 7, precio: 250, nombre: "Infantería Básica" },
                        { velocidad: 4, blindaje: 0, potenciaDeFuego: 10, precio: 400, nombre: "Ametrallador" }
                    ]
                },
                {
                    nombre: "Artillería",
                    unidades: [
                        { velocidad: 1, blindaje: 0, potenciaDeFuego: 22, precio: 1100, nombre: "Cañón Antiaéreo" },
                        { velocidad: 3, blindaje: 2, potenciaDeFuego: 19, precio: 1350, nombre: "Torpedero móvil" }
                    ]
                }
            ]
        };

        const ejercito = Ejercito.fromPlainObject(ejercitoData);
        this.ejercitos.push(ejercito);
    }

    cargarEjercitosEjemplo(): void {
        this.borrarTodos();

        // Ejército 1
        const ejercito1Data = {
            nombre: "Ejército del Norte",
            fondo: 50000,
            divisiones: [
                {
                    nombre: "Caballería",
                    unidades: [
                        { velocidad: 4.5, blindaje: 1.4, potenciaDeFuego: 0, precio: 4200, nombre: "Transporte MX-7899" },
                        { velocidad: 12, blindaje: 0, potenciaDeFuego: 0, precio: 1600, nombre: "Transporte rápido TAXIN-66" }
                    ]
                }
            ]
        };

        // Ejército 2
        const ejercito2Data = {
            nombre: "Ejército del Sur",
            fondo: 75000,
            divisiones: [
                {
                    nombre: "Artillería",
                    unidades: [
                        { velocidad: 1, blindaje: 0, potenciaDeFuego: 22, precio: 1100, nombre: "Cañón Antiaéreo" },
                        { velocidad: 0, blindaje: 0, potenciaDeFuego: 14, precio: 1100, nombre: "Cañón" }
                    ]
                },
                {
                    nombre: "Infantería",
                    unidades: [
                        { velocidad: 7, blindaje: 5, potenciaDeFuego: 0, precio: 500, nombre: "Sanitario" }
                    ]
                }
            ]
        };

        this.ejercitos.push(Ejercito.fromPlainObject(ejercito1Data));
        this.ejercitos.push(Ejercito.fromPlainObject(ejercito2Data));
    }
}