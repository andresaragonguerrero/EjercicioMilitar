import { Unidad } from "../src/clases/Unidad.js";
import { Division } from "../src/clases/Division.js";

describe('Division', () => {
    describe('Constructor y propiedades básicas', () => {
        test('debe crear una división con nombre', () => {
            const division = new Division('Artillería');
            expect(division.nombre).toBe('Artillería');
        });

        test('getUnidades() debe devolver array vacío inicialmente', () => {
            const division = new Division('Infantería');
            expect(division.getUnidades()).toEqual([]);
            expect(division.getUnidades().length).toBe(0);
        });

        test('getUnidades() debe devolver array de solo lectura (TypeScript)', () => {
            const division = new Division('Caballería');
            const unidades = division.getUnidades();

            expect(unidades).toBe(division.getUnidades());

            expect(Array.isArray(unidades)).toBe(true);
        });
    });

    describe('agregarUnidad()', () => {
        let division: Division;
        let unidad1: Unidad;
        let unidad2: Unidad;

        beforeEach(() => {
            division = new Division('Artillería');
            unidad1 = new Unidad(20, 30, 40, 500, 'Cañón');
            unidad2 = new Unidad(15, 25, 35, 400, 'Obús');
        });

        test('debe agregar una unidad correctamente', () => {
            division.agregarUnidad(unidad1);
            expect(division.getUnidades()).toContain(unidad1);
            expect(division.cantidadDeUnidades()).toBe(1);
        });

        test('debe agregar múltiples unidades', () => {
            division.agregarUnidad(unidad1);
            division.agregarUnidad(unidad2);

            expect(division.cantidadDeUnidades()).toBe(2);
            expect(division.getUnidades()).toEqual([unidad1, unidad2]);
        });

        test('las unidades agregadas mantienen sus propiedades', () => {
            division.agregarUnidad(unidad1);
            const unidadGuardada = division.getUnidades()[0];

            expect(unidadGuardada.nombre).toBe('Cañón');
            expect(unidadGuardada.velocidad).toBe(20);
            expect(unidadGuardada.potenciaDeFuego).toBe(40);
        });
    });

    describe('cantidadDeUnidades()', () => {
        test('debe devolver 0 para división vacía', () => {
            const division = new Division('Vacía');
            expect(division.cantidadDeUnidades()).toBe(0);
        });

        test('debe devolver la cantidad correcta de unidades', () => {
            const division = new Division('Mixta');

            division.agregarUnidad(new Unidad(10, 10, 10, 100, 'U1'));
            expect(division.cantidadDeUnidades()).toBe(1);

            division.agregarUnidad(new Unidad(20, 20, 20, 200, 'U2'));
            expect(division.cantidadDeUnidades()).toBe(2);

            division.agregarUnidad(new Unidad(30, 30, 30, 300, 'U3'));
            expect(division.cantidadDeUnidades()).toBe(3);
        });
    });

    describe('Cálculos de totales', () => {
        let division: Division;
        let unidades: Unidad[];

        beforeEach(() => {
            division = new Division('Calculadora');
            unidades = [
                new Unidad(10, 20, 30, 100, 'U1'),
                new Unidad(15, 25, 35, 150, 'U2'),
                new Unidad(20, 30, 40, 200, 'U3')
            ];

            unidades.forEach(u => division.agregarUnidad(u));
        });

        test('potenciaDeFuegoTotal() debe sumar correctamente', () => {
            expect(division.potenciaDeFuegoTotal()).toBe(105);
        });

        test('blindajeTotal() debe sumar correctamente', () => {
            expect(division.blindajeTotal()).toBe(75);
        });

        test('velocidadTotal() debe sumar correctamente', () => {
            expect(division.velocidadTotal()).toBe(45);
        });

        test('precioTotal() debe sumar correctamente', () => {
            expect(division.precioTotal()).toBe(450);
        });

        test('debe manejar división vacía en cálculos', () => {
            const divisionVacia = new Division('Vacía');

            expect(divisionVacia.potenciaDeFuegoTotal()).toBe(0);
            expect(divisionVacia.blindajeTotal()).toBe(0);
            expect(divisionVacia.velocidadTotal()).toBe(0);
            expect(divisionVacia.precioTotal()).toBe(0);
        });

        test('debe manejar valores decimales en cálculos', () => {
            const divisionDecimal = new Division('Decimales');
            divisionDecimal.agregarUnidad(new Unidad(10.5, 20.75, 30.25, 100.99, 'Dec1'));
            divisionDecimal.agregarUnidad(new Unidad(15.25, 25.5, 35.75, 150.5, 'Dec2'));

            expect(divisionDecimal.velocidadTotal()).toBeCloseTo(25.75);
            expect(divisionDecimal.blindajeTotal()).toBeCloseTo(46.25);
            expect(divisionDecimal.potenciaDeFuegoTotal()).toBeCloseTo(66);
            expect(divisionDecimal.precioTotal()).toBeCloseTo(251.49);
        });
    });

    describe('Comportamiento con unidades modificadas', () => {
        test('los cálculos deben usar valores actuales de las unidades', () => {
            const division = new Division('Dinámica');
            const unidad = new Unidad(10, 20, 30, 100, 'Dinámica');
            division.agregarUnidad(unidad);

            // Valores iniciales
            expect(division.velocidadTotal()).toBe(10);
            expect(division.potenciaDeFuegoTotal()).toBe(30);

            // Modificar la unidad
            unidad.velocidad = 50;
            unidad.potenciaDeFuego = 80;

            // Los cálculos deben reflejar los nuevos valores
            expect(division.velocidadTotal()).toBe(50);
            expect(division.potenciaDeFuegoTotal()).toBe(80);
        });
    });
});