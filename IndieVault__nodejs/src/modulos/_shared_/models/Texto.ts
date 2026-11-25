import { ValidationError } from './errors';

export class Texto {
    #texto: string = '';
    readonly minLength: number;
    readonly maxLength: number;

    get value(): string { return this.#texto; }
    set value(value: unknown){
        if(typeof value !== 'string' || value.trim().length === 0){
            throw new ValidationError('Texto es requerido');
        }
        if(value.trim().length < this.minLength){
            throw new ValidationError(`Texto debe tener al menos ${this.minLength} caracteres`);
        }
        if(value.trim().length > this.maxLength){
            throw new ValidationError(`Texto debe tener máximo ${this.maxLength} caracteres`);
        }
        this.#texto = String(value).trim();
    }
    constructor(value: unknown, minLength: number = 1, maxLength: number = 255){
        // los limites se asignan ANTES de validar el valor, el setter los necesita
        this.minLength=minLength;
        this.maxLength=maxLength;
        this.value=value;
        Object.freeze(this); // Inmutable
    }
}
