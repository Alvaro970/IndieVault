import express, { Express } from "express";
import cookiesParser from "cookie-parser";
import cors from "cors";
import { IDBService } from "../../modulos/_shared_/models/dbs/IDBService.js";
import { createRouterCliente } from "../../modulos/zonaCliente/_shared_/controllers/clienteRouter.js";
//import { createRouterTienda } from "../../modulos/Tienda/router/createRouterTienda";

export default function configPipeLine(server: Express, config: any, mongoDbService: IDBService): void {
    console.log('Configurando pipeline de express...');
    console.log('==== midlewares globales para todos los path ====');
    server.use(express.json());
    server.use(express.urlencoded({extended:true}));
    server.use(cookiesParser());
    server.use(cors({
        exposedHeaders: ['x-access-token'],
        allowedHeaders: ['Content-Type','Authorization','x-refresh-token'],
        credentials: true
    }));

    console.log('==== midlewares especificos para un path ========');
    server.use('/api/Cliente', createRouterCliente(mongoDbService,config));
    //server.use('/api/Tienda', createRouterTienda(mongoDbService,config));
}