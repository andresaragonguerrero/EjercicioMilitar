import { Ejercito } from "../src/clases/Ejercito.js";
import { Unidad } from "../src/clases/Unidad.js";
import { Division } from "../src/clases/Division.js";

describe('Ejercito', () => {
    describe('Constructor', () => {
        test('debe crear un ejército con nombre y fondo', () => {
            const ejercito = new Ejercito('Ejército Rojo', 50000);

            expect(ejercito.nombre).toBe('Ejército Rojo');
            expect(ejercito.fondo).toBe(50000);
            expect(ejercito.getDivisiones()).toEqual([]);
        });

        test('debe permitir fondo cero', () => {
            const ejercito = new Ejercito('Pobre', 0);
            expect(ejercito.fondo).toBe(0);
        });
    });

    describe('getDivisiones()', () => {
        test('debe devolver array vacío inicialmente', () => {
            const ejercito = new Ejercito('Test', 1000);
            expect(ejercito.getDivisiones()).toEqual([]);
        });

        test('debe devolver array de solo lectura', () => {
            const ejercito = new Ejercito('Test', 1000);
            const divisiones = ejercito.getDivisiones();
            expect(divisiones).toBe(ejercito.getDivisiones());
        });
    });

    describe('getOrCrearDivision()', () => {
        let ejercito: Ejercito;

        beforeEach(() => {
            ejercito = new Ejercito('Test', 10000);
        });

        test('debe crear nueva división si no existe', () => {
            const division = ejercito.getOrCrearDivision('Artillería');

            expect(division.nombre).toBe('Artillería');
            expect(division).toBeInstanceOf(Division);
            expect(ejercito.getDivisiones()).toContain(division);
            expect(ejercito.getDivisiones().length).toBe(1);
        });

        test('debe devolver división existente si ya existe', () => {
            const division1 = ejercito.getOrCrearDivision('Infantería');
            const division2 = ejercito.getOrCrearDivision('Infantería');

            expect(division1).toBe(division2);
            expect(ejercito.getDivisiones().length).toBe(1);
        });

        test('debe manejar múltiples divisiones', () => {
            const div1 = ejercito.getOrCrearDivision('Artillería');
            const div2 = ejercito.getOrCrearDivision('Infantería');
            const div3 = ejercito.getOrCrearDivision('Caballería');

            expect(ejercito.getDivisiones().length).toBe(3);
            expect(ejercito.getDivisiones()).toEqual([div1, div2, div3]);
        });

        test('debe ser case-sensitive para nombres', () => {
            const div1 = ejercito.getOrCrearDivision('artilleria');
            const div2 = ejercito.getOrCrearDivision('Artilleria');
            const div3 = ejercito.getOrCrearDivision('ARTILLERIA');

            expect(ejercito.getDivisiones().length).toBe(3);
        });
    });

    describe('Métodos de cálculo', () => {
        let ejercito: Ejercito;
        let division1: Division;
        let division2: Division;

        beforeEach(() => {
            ejercito = new Ejercito('Calculador', 20000);
            division1 = ejercito.getOrCrearDivision('Artillería');
            division2 = ejercito.getOrCrearDivision('Infantería');

            // Agregar unidades a división 1
            division1.agregarUnidad(new Unidad(10, 20, 30, 1000, 'Tanque'));
            division1.agregarUnidad(new Unidad(15, 25, 35, 1500, 'Cañón'));

            // Agregar unidades a división 2
            division2.agregarUnidad(new Unidad(20, 30, 40, 2000, 'Soldado'));
            division2.agregarUnidad(new Unidad(25, 35, 45, 2500, 'Francotirador'));
        });

        test('cantidadTotalDeUnidades() debe sumar unidades de todas las divisiones', () => {
        });

        test('potenciaDeFuegoTotal() debe sumar correctamente', () => {
            expect(ejercito.potenciaDeFuegoTotal()).toBe(150);
        });

        test('blindajeTotal() debe sumar correctamente', () => {
            expect(ejercito.blindajeTotal()).toBe(110);
        });

        test('velocidadTotal() debe sumar correctamente', () => {
            expect(ejercito.velocidadTotal()).toBe(70);
        });

        test('dineroGastado() debe sumar correctamente', () => {
            expect(ejercito.dineroGastado()).toBe(7000);
        });

        test('debe manejar ejército vacío', () => {
            const ejercitoVacio = new Ejercito('Vacío', 5000);

            expect(ejercitoVacio.cantidadTotalDeUnidades()).toBe(0);
            expect(ejercitoVacio.potenciaDeFuegoTotal()).toBe(0);
            expect(ejercitoVacio.blindajeTotal()).toBe(0);
            expect(ejercitoVacio.velocidadTotal()).toBe(0);
            expect(ejercitoVacio.dineroGastado()).toBe(0);
        });

        test('debe manejar división vacía junto con divisiones con unidades', () => {
            const ejercitoMixto = new Ejercito('Mixto', 10000);
            const divConUnidades = ejercitoMixto.getOrCrearDivision('Activa');
            const divVacia = ejercitoMixto.getOrCrearDivision('Inactiva');

            divConUnidades.agregarUnidad(new Unidad(10, 20, 30, 1000, 'Activo1'));
            divConUnidades.agregarUnidad(new Unidad(15, 25, 35, 1500, 'Activo2'));

            expect(ejercitoMixto.cantidadTotalDeUnidades()).toBe(2);
            expect(ejercitoMixto.potenciaDeFuegoTotal()).toBe(65);
        });
    });

    describe('fromPlainObject()', () => {
        test('debe crear Ejercito desde objeto plano', () => {
            const objetoPlano = {
                nombre: 'Ejército Reconstruido',
                fondo: 30000,
                divisiones: [
                    {
                        nombre: 'Artillería',
                        unidades: [
                            { velocidad: 10, blindaje: 20, potenciaDeFuego: 30, precio: 1000, nombre: 'Cañón' },
                            { velocidad: 15, blindaje: 25, potenciaDeFuego: 35, precio: 1500, nombre: 'Obús' }
                        ]
                    },
                    {
                        nombre: 'Infantería',
                        unidades: [
                            { velocidad: 20, blindaje: 30, potenciaDeFuego: 40, precio: 2000, nombre: 'Soldado' }
                        ]
                    }
                ]
            };

            const ejercito = Ejercito.fromPlainObject(objetoPlano);

            expect(ejercito.nombre).toBe('Ejército Reconstruido');
            expect(ejercito.fondo).toBe(30000);
            expect(ejercito.cantidadTotalDeUnidades()).toBe(3);
            expect(ejercito.potenciaDeFuegoTotal()).toBe(105);
            expect(ejercito.dineroGastado()).toBe(4500);
        });

        test('debe manejar objeto sin divisiones', () => {
            const objetoPlano = {
                nombre: 'Sin Divisiones',
                fondo: 10000
            };

            const ejercito = Ejercito.fromPlainObject(objetoPlano);

            expect(ejercito.nombre).toBe('Sin Divisiones');
            expect(ejercito.fondo).toBe(10000);
            expect(ejercito.cantidadTotalDeUnidades()).toBe(0);
            expect(ejercito.getDivisiones().length).toBe(0);
        });

        test('debe manejar divisiones sin unidades', () => {
            const objetoPlano = {
                nombre: 'Divisiones Vacías',
                fondo: 5000,
                divisiones: [
                    { nombre: 'Vacía1', unidades: [] },
                    { nombre: 'Vacía2' }
                ]
            };

            const ejercito = Ejercito.fromPlainObject(objetoPlano);

            expect(ejercito.nombre).toBe('Divisiones Vacías');
            expect(ejercito.cantidadTotalDeUnidades()).toBe(0);
            expect(ejercito.getDivisiones().length).toBe(2);
        });

        test('debe manejar objeto vacío creando ejército con valores undefined', () => {
            const ejercito = Ejercito.fromPlainObject({});

            expect(ejercito.nombre).toBeUndefined();
            expect(ejercito.fondo).toBeUndefined();
            expect(ejercito.cantidadTotalDeUnidades()).toBe(0);
        });
    });

    describe('Relación entre fondo y gasto', () => {
        test('dineroGastado() no debe exceder el fondo (lógica de negocio)', () => {
            const ejercito = new Ejercito('Equilibrado', 5000);
            const division = ejercito.getOrCrearDivision('Principal');

            division.agregarUnidad(new Unidad(10, 10, 10, 3000, 'Carro'));

            expect(ejercito.dineroGastado()).toBe(3000);
            expect(ejercito.dineroGastado()).toBeLessThanOrEqual(ejercito.fondo);

            division.agregarUnidad(new Unidad(10, 10, 10, 3000, 'Tanque'));
        });
    });
});