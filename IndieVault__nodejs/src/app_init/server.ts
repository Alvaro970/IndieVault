// import dotenv from 'dotenv';
// dotenv.config();
import "dotenv/config";
import express from "express";
import {MongoDBService} from "../modulos/_shared_/controllers/DbServices/MongoDBService";
import configPipeLine from "./config_pipeline_express/configPipeline";

const config:any={
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    mongoUri: process.env.MONGODB_URL,
    mongoDbName: process.env.MONGODB_DBNAME,
    mailJetApiUri: process.env.MAILJET_URI,
    mailJetApiAccount: process.env.MAILJET_ACCOUNT,
    mailJetApiPublicKey: process.env.MAILJET_PUBLIC_KEY,
    mailJetApiPrivateKey: process.env.MAILJET_PRIVATE_KEY,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI
}

const DbService=new MongoDBService({uri: config.mongoUri, dbName: config.mongoDbName});

const server=express();
configPipeLine(server,config,DbService);

server.listen(config.port, (err?: Error)=>{
    if (err) {
        console.error('Error al iniciar el servidor:', err);
        return;
    }
    console.log(`---Servidor Web nodejs+express escuchando en http://localhost:${config.port}-----`);
});