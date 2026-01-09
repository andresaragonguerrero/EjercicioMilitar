import { Ejercito } from "../clases/Ejercito.js";

export interface ICapacidadMilitarService {
    contarUnidades(ejercito: Ejercito): number;
    calcularPotenciaDeFuegoTotal(ejercito: Ejercito): number;
    calcularBlindajeTotal(ejercito: Ejercito): number;
    calcularCapacidadMovimiento(ejercito: Ejercito): number;
    calcularGastoTotal(ejercito: Ejercito): number;
    calcularCapacidadMilitar(ejercito: Ejercito): number;
    obtenerInformeCompleto(ejercito: Ejercito): Record<string, any>;
}