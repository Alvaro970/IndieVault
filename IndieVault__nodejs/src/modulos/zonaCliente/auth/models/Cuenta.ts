import { Email } from "./Email";

export interface ICuenta {
    email: string;
    password: string | null;
    fechaCreacion?: number | undefined;
    imagenAvatar?: string | undefined;
    telefono?: string | undefined;
    tipoCuenta?: string | undefined;
    activada?: boolean | undefined;
}

export class Cuenta {
    email: string;
    password: string | null;
    fechaCreacion: number;
    activada: boolean;
    imagenAvatar: string;
    telefono: string;
    tipoCuenta: string;

    constructor({ email, password, fechaCreacion, imagenAvatar='', telefono='', tipoCuenta='particular', activada=false }: ICuenta) {
        this.email = new Email(email).value;
        this.password = password; //new Password(password).value; <--- esta el hash
        this.fechaCreacion = fechaCreacion || Date.now();  //new Fecha(fechaCreacion).value : new Fecha().value;
        this.activada=activada;
        this.imagenAvatar = String(imagenAvatar ?? '').trim();
        this.telefono = String(telefono ?? '').trim();
        this.tipoCuenta = String(tipoCuenta ?? 'particular').trim().toLowerCase();
    }
    //hay q diferenciar entre la devolucion de la cuenta con passwrod o sin ella hasehada
    static fromPrimitives({ email, password, fechaCreacion, imagenAvatar, telefono, tipoCuenta, activada }: ICuenta): Cuenta {
        return new Cuenta({ email, password, fechaCreacion, imagenAvatar, telefono, tipoCuenta, activada });
    }
    toPrimitives(): Required<ICuenta> {
        return {
            email: this.email,
            password: this.password,
            fechaCreacion: this.fechaCreacion,
            imagenAvatar: this.imagenAvatar,
            telefono: this.telefono,
            tipoCuenta: this.tipoCuenta,
            activada: this.activada
        };
    }
}
