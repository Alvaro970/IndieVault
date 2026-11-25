import { MongoClient } from 'mongodb';
import type { Document, Filter, UpdateFilter, UpdateResult, WithId } from 'mongodb';
import type { IDBService } from '../../models/dbs/IDBService';

import { errorMessage as errorMsg } from '../../models/errors';

export class MongoDBService implements IDBService
{
    private readonly uri: string;
    private readonly dbName: string;
    private readonly client: MongoClient;

    constructor({ uri, dbName }: { uri: string; dbName: string }) {
        this.uri = uri;
        this.dbName = dbName;
        this.client = new MongoClient(this.uri);
    }

    async selectOne<T extends Document = Document>(tableOrCollection: string, query: Filter<T>, projection?: Document): Promise<WithId<T> | null> {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection<T>(tableOrCollection);
            return await collection.findOne(query, projection ? { projection } : {});
        } catch (error: unknown) {
            throw new Error(`Error en MongodbService.selectOne: ${errorMsg(error)}`);
        }
    }

    async selectMany<T extends Document = Document>(tableOrCollection: string, query: Filter<T>, projection?: Document): Promise<WithId<T>[]> {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection<T>(tableOrCollection);
            return await collection.find(query, projection ? { projection } : {}).toArray();
        } catch (error: unknown) {
            throw new Error(`Error en MongodbService.selectMany: ${errorMsg(error)}`);
        }
    }

    async insertOne<T extends Document = Document>(tableOrCollection: string, data: T): Promise<WithId<T>> {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection<Document>(tableOrCollection);
            const result = await collection.insertOne(data);

            if ( !result.acknowledged || !result.insertedId )  throw new Error('Fallo al insertar el documento en la colección');

            const clienteInsertado = await collection.findOne({ _id: result.insertedId });
            if (!clienteInsertado) throw new Error('No se pudo recuperar el documento insertado');
            return clienteInsertado as WithId<T>;

        } catch (error: unknown) {
            throw new Error(`Error en MongodbService.insertOne: ${errorMsg(error)}`);
        }
    }

    async updateOne<T extends Document = Document>(tableOrCollection: string, query: Filter<T>, update: UpdateFilter<T>): Promise<UpdateResult<T>> {
        try {
            await this.client.connect();
            const db = this.client.db(this.dbName);
            const collection = db.collection<T>(tableOrCollection);
            const result = await collection.updateOne(query, update);

            if ( !result.acknowledged )  throw new Error('Fallo al actualizar el documento en la colección');
            return result;

        } catch (error: unknown) {
            throw new Error(`Error en MongodbService.updateOne: ${errorMsg(error)}`);
        }
    }
}
