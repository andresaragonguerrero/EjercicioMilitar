import { UnidadAmericanaAdaptador, MarshallTank } from "../src/adaptadores/UnidadAmericanaAdaptador";

describe('AdaptadorUnidadAmericana', () => {
    test('debe convertir mph a km/h correctamente', () => {
        const adaptador = new UnidadAmericanaAdaptador(MarshallTank);
        
        // 45 mph * 1.60934 ≈ 72.42 km/h
        expect(adaptador.velocidad).toBeCloseTo(72.42);
    });

    test('debe convertir USD a EUR correctamente', () => {
        const adaptador = new UnidadAmericanaAdaptador(MarshallTank);
        
        // 85000 USD * 0.85 ≈ 72250 EUR
        expect(adaptador.precio).toBeCloseTo(72250);
    });

    test('debe mantener otros valores', () => {
        const adaptador = new UnidadAmericanaAdaptador(MarshallTank);
        
        expect(adaptador.blindaje).toBe(8.5);
        expect(adaptador.potenciaDeFuego).toBe(12.5);
        expect(adaptador.nombre).toBe("Marshall Tank M1A2");
    });
});