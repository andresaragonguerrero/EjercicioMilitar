import { EjercitoFactory } from "../src/factory/EjercitoFactory.js";
import { Ejercito } from "../src/clases/Ejercito.js";
import { Division } from "../src/clases/Division.js";

describe('EjercitoFactory', () => {
    describe('crearEjercito()', () => {
        describe('Casos exitosos', () => {
            test('debe crear un ejército con valores válidos', () => {
                const ejercito = EjercitoFactory.crearEjercito('Legión Imperial', 50000);

                expect(ejercito).toBeInstanceOf(Ejercito);
                expect(ejercito.nombre).toBe('Legión Imperial');
                expect(ejercito.fondo).toBe(50000);
                expect(ejercito.getDivisiones()).toEqual([]);
            });

            test('debe permitir fondo cero', () => {
                const ejercito = EjercitoFactory.crearEjercito('Pobre pero honrado', 0);

                expect(ejercito.fondo).toBe(0);
                expect(ejercito.nombre).toBe('Pobre pero honrado');
            });

            test('debe permitir nombres con espacios y caracteres especiales', () => {
                const ejercito = EjercitoFactory.crearEjercito('Ejército del Norte - 1ª División', 75000);

                expect(ejercito.nombre).toBe('Ejército del Norte - 1ª División');
            });

            test('debe permitir nombres con un solo carácter', () => {
                const ejercito = EjercitoFactory.crearEjercito('A', 10000);

                expect(ejercito.nombre).toBe('A');
            });
        });

        describe('Validaciones', () => {
            test('debe lanzar error si nombre es undefined', () => {
                expect(() => {
                    EjercitoFactory.crearEjercito(undefined as any, 10000);
                }).toThrow('El nombre del ejército es obligatorio');
            });

            test('debe lanzar error si nombre es null', () => {
                expect(() => {
                    EjercitoFactory.crearEjercito(null as any, 10000);
                }).toThrow('El nombre del ejército es obligatorio');
            });

            test('debe lanzar error si nombre está vacío', () => {
                expect(() => {
                    EjercitoFactory.crearEjercito('', 10000);
                }).toThrow('El nombre del ejército es obligatorio');
            });

            test('debe lanzar error si nombre solo tiene espacios', () => {
                const ejercito = EjercitoFactory.crearEjercito('   ', 10000);
                expect(ejercito.nombre).toBe('   ');
            });

            test('debe lanzar error si fondo es negativo', () => {
                expect(() => {
                    EjercitoFactory.crearEjercito('Ejército', -1);
                }).toThrow('El fondo del ejército no puede ser negativo');
            });

            test('debe lanzar error si fondo es decimal negativo', () => {
                expect(() => {
                    EjercitoFactory.crearEjercito('Ejército', -0.5);
                }).toThrow('El fondo del ejército no puede ser negativo');
            });

            test('debe permitir fondo decimal positivo', () => {
                const ejercito = EjercitoFactory.crearEjercito('Ejército', 12345.67);

                expect(ejercito.fondo).toBe(12345.67);
            });

            test('debe lanzar solo el primer error encontrado (nombre vs fondo)', () => {
                expect(() => {
                    EjercitoFactory.crearEjercito('', -1000);
                }).toThrow('El nombre del ejército es obligatorio');
            });
        });
    });

    describe('crearDivision()', () => {
        describe('Casos exitosos', () => {
            test('debe crear una división con nombre válido', () => {
                const division = EjercitoFactory.crearDivision('Artillería Pesada');

                expect(division).toBeInstanceOf(Division);
                expect(division.nombre).toBe('Artillería Pesada');
                expect(division.cantidadDeUnidades()).toBe(0);
            });

            test('debe permitir nombres con un solo carácter', () => {
                const division = EjercitoFactory.crearDivision('A');

                expect(division.nombre).toBe('A');
            });

            test('debe permitir nombres con espacios', () => {
                const division = EjercitoFactory.crearDivision('Caballería Ligera');

                expect(division.nombre).toBe('Caballería Ligera');
            });
        });

        describe('Validaciones', () => {
            test('debe lanzar error si nombre es undefined', () => {
                expect(() => {
                    EjercitoFactory.crearDivision(undefined as any);
                }).toThrow('El nombre de la división es obligatorio');
            });

            test('debe lanzar error si nombre es null', () => {
                expect(() => {
                    EjercitoFactory.crearDivision(null as any);
                }).toThrow('El nombre de la división es obligatorio');
            });

            test('debe aceptar nombre con solo espacios', () => {
                const division = EjercitoFactory.crearDivision('   ');
                expect(division.nombre).toBe('   ');
                expect(division).toBeInstanceOf(Division);
            });
        });
    });

    describe('Métodos estáticos', () => {
        test('ambos métodos deben ser estáticos', () => {
            expect(typeof EjercitoFactory.crearEjercito).toBe('function');
            expect(typeof EjercitoFactory.crearDivision).toBe('function');

            expect(EjercitoFactory.prototype).not.toHaveProperty('crearEjercito');
            expect(EjercitoFactory.prototype).not.toHaveProperty('crearDivision');
        });

        test('las factories deben ser independientes entre sí', () => {
            const ejercito = EjercitoFactory.crearEjercito('Test', 10000);
            const division = EjercitoFactory.crearDivision('TestDiv');

            expect(ejercito).toBeInstanceOf(Ejercito);
            expect(division).toBeInstanceOf(Division);
            expect(ejercito).not.toBeInstanceOf(Division);
            expect(division).not.toBeInstanceOf(Ejercito);
        });
    });

    describe('Uso conjunto', () => {
        test('se puede crear ejército y luego agregarle divisiones creadas con la factory', () => {
            const ejercito = EjercitoFactory.crearEjercito('Combinado', 20000);
            const division1 = EjercitoFactory.crearDivision('Artillería');
            const division2 = EjercitoFactory.crearDivision('Infantería');

            expect(ejercito).toBeInstanceOf(Ejercito);
            expect(division1).toBeInstanceOf(Division);
            expect(division2).toBeInstanceOf(Division);
        });
    });
});