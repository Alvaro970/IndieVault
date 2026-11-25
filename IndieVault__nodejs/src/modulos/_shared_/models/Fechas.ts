import { ValidationError } from './errors';

export class Fecha {

    #fecha: number = 0;
    get value(): number { return this.#fecha; }
    set value(value: string | number | Date) { //<---- no debes preguntar q solo el tipo sea string, puede ser timestamp o date, lo q importa es q sea un valor q pueda ser convertido a date...esta mal el if
        // if(typeof value !== 'string' && !(value instanceof Date)){
        //     throw new ValidationError('Fecha debe ser una instancia de Date');
        // }
        const _fecha = new Date(value);
        if(isNaN(_fecha.getTime())){
            throw new ValidationError('Fecha inválida');
        }
        this.#fecha = _fecha.valueOf();
    }
    constructor(value: string | number | Date = Date.now()){
        this.value = value;
        Object.freeze(this); // Inmutable
    }
}
