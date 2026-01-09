import { Division } from "./Division.js";
import { Unidad } from "./Unidad.js";

export class Ejercito {
    private readonly divisiones: Division[] = [];

    constructor(public nombre: string, public fondo: number) { }

    static fromPlainObject(data: any): Ejercito {
        const ejercito = new Ejercito(data.nombre, data.fondo);

        if (Array.isArray(data.divisiones)) {
            for (const d of data.divisiones) {
                const division = ejercito.getOrCrearDivision(d.nombre);

                if (Array.isArray(d.unidades)) {
                    for (const u of d.unidades) {
                        division.agregarUnidad(
                            new Unidad(
                                u.velocidad,
                                u.blindaje,
                                u.potenciaDeFuego,
                                u.precio,
                                u.nombre
                            )
                        );
                    }
                }
            }
        }

        return ejercito;
    }

    getDivisiones(): readonly Division[] {
        return this.divisiones;
    }

    getOrCrearDivision(nombre: string): Division {
        let division = this.divisiones.find(d => d.nombre === nombre);
        if (!division) {
            division = new Division(nombre);
            this.divisiones.push(division);
        }
        return division;
    }

    cantidadTotalDeUnidades(): number {
        return this.divisiones.reduce((acc, division) => acc + division.cantidadDeUnidades(), 0);
    }

    potenciaDeFuegoTotal(): number {
        return this.divisiones.reduce((acc, division) => acc + division.potenciaDeFuegoTotal(), 0);
    }

    blindajeTotal(): number {
        return this.divisiones.reduce((acc, division) => acc + division.blindajeTotal(), 0);
    }

    velocidadTotal(): number {
        return this.divisiones.reduce((acc, division) => acc + division.velocidadTotal(), 0);
    }

    dineroGastado(): number {
        return this.divisiones.reduce((acc, division) => acc + division.precioTotal(), 0);
    }
}
