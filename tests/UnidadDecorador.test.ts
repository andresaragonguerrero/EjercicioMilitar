import { Unidad } from "../src/clases/Unidad.js";
import { DecoradorBlindaje, DecoradorCompleto, DecoradorVelocidad } from "../src/decorador/UnidadDecorador.js";

describe('Decoradores de Unidad', () => {
    let unidadBase: Unidad;

    beforeEach(() => {
        unidadBase = new Unidad(100, 50, 80, 10000, "Tanque Base");
    });

    describe('DecoradorVelocidad', () => {
        test('debe aumentar velocidad en 30%', () => {
            const unidadVeloz = new DecoradorVelocidad(unidadBase);
            
            expect(unidadVeloz.velocidad).toBeCloseTo(130);
            expect(unidadVeloz.capacidadDeMovimiento()).toBeCloseTo(130);
        });

        test('debe aumentar precio en 15%', () => {
            const unidadVeloz = new DecoradorVelocidad(unidadBase);
            
            expect(unidadVeloz.precio).toBeCloseTo(11500);
        });
    });

    describe('DecoradorBlindaje', () => {
        test('debe aumentar blindaje en 30%', () => {
            const unidadBlindada = new DecoradorBlindaje(unidadBase);
            
            expect(unidadBlindada.blindaje).toBeCloseTo(65);
            expect(unidadBlindada.resistenciaAlAtaque()).toBeCloseTo(65);
        });

        test('debe aumentar precio en 20%', () => {
            const unidadBlindada = new DecoradorBlindaje(unidadBase);
            
            expect(unidadBlindada.precio).toBeCloseTo(12000);
        });
    });

    describe('DecoradorCompleto', () => {
        test('debe aumentar velocidad y blindaje', () => {
            const unidadMejorada = new DecoradorCompleto(unidadBase);
            
            expect(unidadMejorada.velocidad).toBeCloseTo(130);
            expect(unidadMejorada.blindaje).toBeCloseTo(65);
            expect(unidadMejorada.precio).toBeCloseTo(13500);
        });
    });
});