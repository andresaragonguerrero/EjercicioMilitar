import { Ejercito } from "../clases/Ejercito.js";
import { ICapacidadMilitarService } from "../interfaces/ICapacidadMilitarService.js";

export class ServicioCapacidadMilitar implements ICapacidadMilitarService {

    contarUnidades(ejercito: Ejercito): number {
        return ejercito.cantidadTotalDeUnidades();
    }

    calcularPotenciaDeFuegoTotal(ejercito: Ejercito): number {
        return ejercito.potenciaDeFuegoTotal();
    }

    calcularBlindajeTotal(ejercito: Ejercito): number {
        return ejercito.blindajeTotal();
    }

    calcularCapacidadMovimiento(ejercito: Ejercito): number {
        return ejercito.velocidadTotal();
    }

    calcularGastoTotal(ejercito: Ejercito): number {
        return ejercito.dineroGastado();
    }

    calcularCapacidadMilitar(ejercito: Ejercito): number {
        const potencia = this.calcularPotenciaDeFuegoTotal(ejercito);
        const movimiento = this.calcularCapacidadMovimiento(ejercito);
        const blindaje = this.calcularBlindajeTotal(ejercito);

        if (100 - blindaje === 0) return 0;

        const divisor = 100 - blindaje;
        if (divisor <= 0) return 0;

        return (potencia * movimiento / 2) / (100 - blindaje);
    }

    obtenerInformeCompleto(ejercito: Ejercito) {
        return {
            nombreEjercito: ejercito.nombre,
            totalUnidades: this.contarUnidades(ejercito),
            potenciaDeFuegoTotal: this.calcularPotenciaDeFuegoTotal(ejercito),
            blindajeTotal: this.calcularBlindajeTotal(ejercito),
            capacidadMovimiento: this.calcularCapacidadMovimiento(ejercito),
            gastoTotal: this.calcularGastoTotal(ejercito),
            capacidadMilitar: this.calcularCapacidadMilitar(ejercito),
        };
    }
}
