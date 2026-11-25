import { Cuenta } from "../../auth/models/Cuenta";
import type { ICuenta } from "../../auth/models/Cuenta";
import { Id } from "../../../_shared_/models/Id";

export interface ICliente {
    _id?: string | undefined;
    nombre?: string | undefined;
    apellidos?: string | undefined;
    cuenta: ICuenta;
    direcciones?: unknown[] | undefined;
    pedidos?: unknown[] | undefined;
    opiniones?: unknown[] | undefined;
    favoritos?: unknown[] | undefined;
}

export class Cliente {
    _id: string;
    nombre: string;
    apellidos: string;
    cuenta: Cuenta;
    direcciones: unknown[];
    pedidos: unknown[];
    opiniones: unknown[];
    favoritos: unknown[];

    constructor( datosCliente: ICliente ){
        const { nombre, apellidos, cuenta, _id, direcciones, pedidos, opiniones, favoritos } = datosCliente;
        this._id= _id || Id.generateObjectId('mongodb').id;
        this.nombre = String(nombre || '').trim(); //new Texto(nombre).value;
        this.apellidos = String(apellidos || '').trim(); //new Texto(apellidos).value;
        this.cuenta = new Cuenta(cuenta);//({ email, password, fechaCreacion: new Date() });
        this.direcciones=direcciones || [];
        this.pedidos=pedidos || [];
        this.opiniones=opiniones || [];
        this.favoritos=favoritos || [];
    }

    static fromPrimitives(datosCliente: ICliente): Cliente{
        return new Cliente(datosCliente);
    }

    toPrimitives(){
        return {
            _id: this._id,
            nombre: this.nombre,
            apellidos: this.apellidos,
            cuenta: this.cuenta.toPrimitives(),
            direcciones: this.direcciones,
            pedidos: this.pedidos,
            opiniones: this.opiniones,
            favoritos: this.favoritos
        };
    }
}
