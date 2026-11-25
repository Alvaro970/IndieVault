// export  interface IDBService {
//     select(tableOrCollection:string, query: any, projection?: any): Promise<any[]>,
//     insertOne(tableOrCollection:string, document: any): Promise<any>,
//     updateOne(tableOrCollection:string, query: any, update: any): Promise<any>,
//     deleteOne(tableOrCollection:string, query: any): Promise<any>
// }

import type { Document, Filter, UpdateFilter, UpdateResult, WithId } from 'mongodb';

// Contrato (modelo) que debe cumplir cualquier servicio de acceso a datos.
// Los controladores dependen de esta interfaz, no de la implementacion concreta (MongodbService...)
export interface IDBService {
    selectOne<T extends Document = Document>(tableOrCollection: string, query: Filter<T>, projection?: Document): Promise<WithId<T> | null>;
    selectMany<T extends Document = Document>(tableOrCollection: string, query: Filter<T>, projection?: Document): Promise<WithId<T>[]>;
    insertOne<T extends Document = Document>(tableOrCollection: string, data: T): Promise<WithId<T>>;
    updateOne<T extends Document = Document>(tableOrCollection: string, query: Filter<T>, update: UpdateFilter<T>): Promise<UpdateResult<T>>;
    //deleteOne<T extends Document = Document>(tableOrCollection: string, query: Filter<T>): Promise<UpdateResult<T>>;
}