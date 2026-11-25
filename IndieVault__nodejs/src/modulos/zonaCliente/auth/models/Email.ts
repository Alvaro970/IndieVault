import { ValidationError } from '../../../_shared_/models/errors';

export class Email {
    #email: string = '';
    get value(): string { return this.#email; }
    set value(value: unknown){
        if(typeof value !== 'string' || value.trim().length === 0){
            throw new ValidationError('Email es requerido');
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){
            throw new ValidationError('Formato del email no válido');
        }
        this.#email = String(value).trim().toLowerCase()    ;
    }
    constructor(value: unknown){
        this.value=value;
        //String(value ?? '').trim().toLowerCase() ;
        Object.freeze(this); // Inmutable
    }
}
