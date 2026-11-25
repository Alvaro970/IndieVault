export  interface IResponseAPI {
    codigo: number;
    mensaje: string;
    datos?: any;
}

export class ResponseAPI implements IResponseAPI {
    codigo: number;
    mensaje: string;
    datos?: any;

    constructor(codigo: number, mensaje: string, datos: any = null) {
        this.codigo = codigo;
        this.mensaje = mensaje;
        this.datos = datos;
    }

    static success(mensaje:string, datos = null) {
        return new ResponseAPI(0, mensaje, datos);
    }

    static error(codigo:number=1, mensaje:string, datos = null) {
        return new ResponseAPI(codigo, mensaje, datos);
    }

    static fromPrimitives(json: IResponseAPI) {
        return new ResponseAPI(json.codigo, json.mensaje, json.datos);
    }

    toPrimitives(): IResponseAPI {
        return {
            codigo: this.codigo,
            mensaje: this.mensaje,
            datos: this.datos
        };
    }
}
