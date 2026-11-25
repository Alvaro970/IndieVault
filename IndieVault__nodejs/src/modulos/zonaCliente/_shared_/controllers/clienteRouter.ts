import express,{ Router } from 'express';
import { AuthController } from '../../auth/controllers/AuthController';
import type { IDBService } from '../../../_shared_/models/dbs/IDBService';

export function createRouterCliente(dbService: IDBService, config: any): Router {
    const router = express.Router();
    const authController = new AuthController( dbService,{
                                                            jwtSecret: config.jwtSecret,
                                                            jwtExpiresIn: config.jwtExpiresIn,
                                                            clientId: config.googleClientId,
                                                            clientSecret: config.googleClientSecret,
                                                            redirectUri: config.googleRedirectUri
                                                        } );

    router.post('/Login', authController.login() );
    router.post('/Registro', authController.registro() );
    router.get('/LoginGoogle', authController.loginGoogle() );
    router.get('/LoginGoogleCallback', authController.loginGoogleCallback() );

    return router;
}
