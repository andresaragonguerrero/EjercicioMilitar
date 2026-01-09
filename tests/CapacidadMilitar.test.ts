import { ServicioCapacidadMilitar } from '../src/servicios/CapacidadMilitarService.js';
import { Ejercito } from '../src/clases/Ejercito.js';
import { Unidad } from '../src/clases/Unidad.js';

describe('ServicioCapacidadMilitar', () => {
    let servicio: ServicioCapacidadMilitar;
    let ejercito: Ejercito;

    beforeEach(() => {
        servicio = new ServicioCapacidadMilitar();
        ejercito = new Ejercito('Ejército de Prueba', 100000);
    });

    describe('contarUnidades()', () => {
        test('debe devolver 0 para ejército vacío', () => {
            expect(servicio.contarUnidades(ejercito)).toBe(0);
        });

        test('debe contar correctamente unidades en múltiples divisiones', () => {
            const division1 = ejercito.getOrCrearDivision('Artillería');
            const division2 = ejercito.getOrCrearDivision('Infantería');

            division1.agregarUnidad(new Unidad(10, 10, 10, 1000, 'U1'));
            division1.agregarUnidad(new Unidad(20, 20, 20, 2000, 'U2'));
            division2.agregarUnidad(new Unidad(30, 30, 30, 3000, 'U3'));

            expect(servicio.contarUnidades(ejercito)).toBe(3);
        });
    });

    describe('calcularPotenciaDeFuegoTotal()', () => {
        test('debe devolver 0 para ejército vacío', () => {
            expect(servicio.calcularPotenciaDeFuegoTotal(ejercito)).toBe(0);
        });

        test('debe sumar correctamente potencia de todas las unidades', () => {
            const division = ejercito.getOrCrearDivision('Mixta');
            division.agregarUnidad(new Unidad(10, 10, 15, 1000, 'U1')); 
            division.agregarUnidad(new Unidad(20, 20, 25, 2000, 'U2')); 

            expect(servicio.calcularPotenciaDeFuegoTotal(ejercito)).toBe(40);
        });
    });

    describe('calcularBlindajeTotal()', () => {
        test('debe devolver 0 para ejército vacío', () => {
            expect(servicio.calcularBlindajeTotal(ejercito)).toBe(0);
        });

        test('debe sumar correctamente blindaje de todas las unidades', () => {
            const division = ejercito.getOrCrearDivision('Blindada');
            division.agregarUnidad(new Unidad(10, 30, 10, 1000, 'U1'));
            division.agregarUnidad(new Unidad(20, 40, 20, 2000, 'U2'));

            expect(servicio.calcularBlindajeTotal(ejercito)).toBe(70);
        });
    });

    describe('calcularCapacidadMovimiento()', () => {
        test('debe devolver 0 para ejército vacío', () => {
            expect(servicio.calcularCapacidadMovimiento(ejercito)).toBe(0);
        });

        test('debe sumar correctamente velocidad de todas las unidades', () => {
            const division = ejercito.getOrCrearDivision('Móvil');
            division.agregarUnidad(new Unidad(50, 10, 10, 1000, 'U1'));
            division.agregarUnidad(new Unidad(30, 20, 20, 2000, 'U2')); 

            expect(servicio.calcularCapacidadMovimiento(ejercito)).toBe(80);
        });
    });

    describe('calcularGastoTotal()', () => {
        test('debe devolver 0 para ejército vacío', () => {
            expect(servicio.calcularGastoTotal(ejercito)).toBe(0);
        });

        test('debe sumar correctamente precio de todas las unidades', () => {
            const division = ejercito.getOrCrearDivision('Cara');
            division.agregarUnidad(new Unidad(10, 10, 10, 5000, 'U1'));
            division.agregarUnidad(new Unidad(20, 20, 20, 7500, 'U2'));

            expect(servicio.calcularGastoTotal(ejercito)).toBe(12500);
        });
    });

    describe('calcularCapacidadMilitar()', () => {
        test('debe devolver 0 para ejército vacío', () => {
            expect(servicio.calcularCapacidadMilitar(ejercito)).toBe(0);
        });

        test('debe calcular correctamente con valores normales', () => {
            const division = ejercito.getOrCrearDivision('Calculable');
            division.agregarUnidad(new Unidad(10, 20, 30, 1000, 'Calc1'));
            division.agregarUnidad(new Unidad(20, 30, 40, 2000, 'Calc2'));

            expect(servicio.calcularCapacidadMilitar(ejercito)).toBe(21);
        });

        test('debe devolver 0 si blindaje total es 100 (división por cero evitada)', () => {
            const division = ejercito.getOrCrearDivision('Indestructible');
            division.agregarUnidad(new Unidad(10, 50, 30, 1000, 'B1'));
            division.agregarUnidad(new Unidad(20, 50, 40, 2000, 'B2'));

            expect(servicio.calcularCapacidadMilitar(ejercito)).toBe(0);
        });

        test('debe manejar blindaje mayor a 100 (resultado negativo o cero)', () => {
            const division = ejercito.getOrCrearDivision('SuperBlindado');
            division.agregarUnidad(new Unidad(10, 75, 30, 1000, 'SB1'));
            division.agregarUnidad(new Unidad(20, 75, 40, 2000, 'SB2'));
            expect(servicio.calcularCapacidadMilitar(ejercito)).toBe(0);
        });

        test('debe manejar valores decimales', () => {
            const division = ejercito.getOrCrearDivision('Decimal');
            division.agregarUnidad(new Unidad(12.5, 25.5, 37.5, 1000, 'D1'));
            division.agregarUnidad(new Unidad(17.5, 34.5, 42.5, 2000, 'D2'));

            expect(servicio.calcularCapacidadMilitar(ejercito)).toBe(30);
        });
    });

    describe('obtenerInformeCompleto()', () => {
        test('debe generar informe para ejército vacío', () => {
            const informe = servicio.obtenerInformeCompleto(ejercito);

            expect(informe).toEqual({
                nombreEjercito: 'Ejército de Prueba',
                totalUnidades: 0,
                potenciaDeFuegoTotal: 0,
                blindajeTotal: 0,
                capacidadMovimiento: 0,
                gastoTotal: 0,
                capacidadMilitar: 0,
            });
        });

        test('debe generar informe completo con valores calculados', () => {
            const division = ejercito.getOrCrearDivision('Informe');
            division.agregarUnidad(new Unidad(10, 20, 30, 1000, 'Inf1'));
            division.agregarUnidad(new Unidad(20, 30, 40, 2000, 'Inf2'));

            const informe = servicio.obtenerInformeCompleto(ejercito);

            expect(informe.nombreEjercito).toBe('Ejército de Prueba');
            expect(informe.totalUnidades).toBe(2);
            expect(informe.potenciaDeFuegoTotal).toBe(70);
            expect(informe.blindajeTotal).toBe(50);
            expect(informe.capacidadMovimiento).toBe(30);
            expect(informe.gastoTotal).toBe(3000);
            expect(informe.capacidadMilitar).toBe(21);
        });

        test('debe incluir todas las propiedades esperadas', () => {
            const informe = servicio.obtenerInformeCompleto(ejercito);

            expect(Object.keys(informe)).toEqual([
                'nombreEjercito',
                'totalUnidades',
                'potenciaDeFuegoTotal',
                'blindajeTotal',
                'capacidadMovimiento',
                'gastoTotal',
                'capacidadMilitar',
            ]);
        });

        test('los valores del informe deben coincidir con métodos individuales', () => {
            const division = ejercito.getOrCrearDivision('Coherencia');
            division.agregarUnidad(new Unidad(15, 25, 35, 1500, 'C1'));
            division.agregarUnidad(new Unidad(25, 35, 45, 2500, 'C2'));

            const informe = servicio.obtenerInformeCompleto(ejercito);

            expect(informe.totalUnidades).toBe(servicio.contarUnidades(ejercito));
            expect(informe.potenciaDeFuegoTotal).toBe(servicio.calcularPotenciaDeFuegoTotal(ejercito));
            expect(informe.blindajeTotal).toBe(servicio.calcularBlindajeTotal(ejercito));
            expect(informe.capacidadMovimiento).toBe(servicio.calcularCapacidadMovimiento(ejercito));
            expect(informe.gastoTotal).toBe(servicio.calcularGastoTotal(ejercito));
            expect(informe.capacidadMilitar).toBe(servicio.calcularCapacidadMilitar(ejercito));
        });
    });

    describe('Implementación de interfaz', () => {
        test('debe implementar todos los métodos de ICapacidadMilitarService', () => {
            expect(typeof servicio.contarUnidades).toBe('function');
            expect(typeof servicio.calcularPotenciaDeFuegoTotal).toBe('function');
            expect(typeof servicio.calcularBlindajeTotal).toBe('function');
            expect(typeof servicio.calcularCapacidadMovimiento).toBe('function');
            expect(typeof servicio.calcularGastoTotal).toBe('function');
            expect(typeof servicio.calcularCapacidadMilitar).toBe('function');
            expect(typeof servicio.obtenerInformeCompleto).toBe('function');
        });
    });
});
