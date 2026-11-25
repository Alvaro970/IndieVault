import type { Request, Response, RequestHandler } from 'express';
import type { Document } from 'mongodb';

import { PasswordHasherService } from './services/PasswordHasherService';
import { JwtTokenService } from './services/JwtTokenService';
import { GoogleoAuthService } from './services/GoogleoAuthService';

import { ResponseAPI } from '../../../_shared_/models/ResponseAPI';
import { errorMessage } from '../../../_shared_/models/errors';
import type { IDBService } from '../../../_shared_/models/dbs/IDBService';
import { Cliente } from '../../_shared_/models/Cliente';

export interface IAuthControllerConfig {
    jwtSecret: string;
    jwtExpiresIn: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}

export class AuthController {
    private readonly dbService: IDBService;
    private readonly passwordHasherService: PasswordHasherService;
    private readonly jwtTokenService: JwtTokenService;
    private readonly googleoAuthService: GoogleoAuthService;

    constructor( dbService: IDBService, { jwtSecret, jwtExpiresIn, clientId, clientSecret, redirectUri }: IAuthControllerConfig ) {
        this.dbService = dbService;
        this.passwordHasherService = new PasswordHasherService();
        this.jwtTokenService = new JwtTokenService({ jwtSecret, jwtExpiresIn });
        this.googleoAuthService = new GoogleoAuthService({ clientId, clientSecret, redirectUri });
    }

    login(): RequestHandler {
        return async (req: Request, res: Response) => {
            const { email, password } = req.body;
            console.log(`AuthController.login - email: ${email}, password: ${password}`);

            try {
                const cliente = await this.dbService.selectOne('clientes', { 'cuenta.email': email });
                if (!cliente) throw new Error('Cliente no encontrado con el email proporcionado');
                if (! cliente.cuenta.activada) throw new Error('La cuenta del cliente no está activada');

                const isMatch = await this.passwordHasherService.verifyPassword(password, cliente.cuenta.password);
                if (!isMatch) throw new Error('Contraseña incorrecta');

                const tokenPayload = { _id: cliente._id, email: cliente.cuenta.email };
                const token = this.jwtTokenService.generateToken(tokenPayload);

                console.log(`AuthController.login - datos a devolver: ${JSON.stringify({ token, cliente })}`);
                const response=new ResponseAPI(0, 'Login exitoso', { token, cliente })
                console.log(`AuthController.login - response.toPrimitives(): ${JSON.stringify(response.toPrimitives())}`);

                res.status(200).json(response.toPrimitives());
            }
            catch (error: unknown) {
                console.log(`Error en AuthController.login: ${errorMessage(error)}`);
                res.status(200).json(new ResponseAPI(1, `Error en login: ${errorMessage(error)}`, null).toPrimitives());
            }
        };
    }

    registro(): RequestHandler {
        return async (req: Request, res: Response) => {
            const { nombre, email, password } = req.body;
            try {
                const existingCliente = await this.dbService.selectOne('clientes', { 'cuenta.email': String(email ?? '').trim().toLowerCase() }); // el email se guarda en cuenta.email (normalizado en minusculas)
                if (existingCliente) throw new Error('Ya existe un cliente con este email');

                const hashedPassword = await this.passwordHasherService.hashPassword(password);
                const datosCliente = new Cliente({ nombre, cuenta: { email, password: hashedPassword, activada: false } });

                const newCliente = await this.dbService.insertOne('clientes', datosCliente.toPrimitives());

                res.status(200).json(new ResponseAPI(0, 'Registro exitoso', {cliente: newCliente}).toPrimitives());

            } catch (error: unknown) {
                console.log(`Error en AuthController.registro: ${errorMessage(error)}`);
                res.status(200).json(new ResponseAPI(1, `Error en registro: ${errorMessage(error)}`, null).toPrimitives());
            }
        };
    }

    loginGoogle(): RequestHandler {
        return async (req: Request, res: Response) => {
            try {
                const url = await this.googleoAuthService.getAuthUrl();
                res.status(200).json(new ResponseAPI(0, 'URL de login con Google obtenida', { url }).toPrimitives());
            } catch (error: unknown) {
                console.log(`Error en AuthController.loginGoogle: ${errorMessage(error)}`);
                res.status(200).json(new ResponseAPI(1, `Error al obtener la URL de login con Google: ${errorMessage(error)}`, null).toPrimitives());
            }
        };
    }

    loginGoogleCallback(): RequestHandler {
        return async (req: Request, res: Response) => {
            try {
                const code = req.query.code;
                if (typeof code !== 'string') throw new Error('Falta el código de autorización de Google');

                const {
                    email,
                    telefonoContacto,
                    apellidos,
                    nombre,
                    direccion,
                    genero
                } = await this.googleoAuthService.getUserInfo(code);

                let cliente: Document | null = await this.dbService.selectOne('clientes', { 'cuenta.email': email });
                if (!cliente) {
                    const datosCliente = new Cliente({ nombre, apellidos, cuenta: { email, password: null, activada: true, telefono: telefonoContacto }, direcciones: direccion !== 'No disponible' ? [ direccion ] : [], opiniones:[], favoritos:[], pedidos:[] });
                    cliente = await this.dbService.insertOne('clientes', datosCliente.toPrimitives());
                }
                const token = this.jwtTokenService.generateToken({ _id: cliente._id, email: cliente.cuenta.email });

                res.status(200).send(`
                    <html>
                        <body>
                            <script>
                                window.opener.postMessage({ codigo:0, mensaje:'Login con Google correcto', datos: ${JSON.stringify({token,cliente})} }, '*');
                                window.close();
                            </script>
                        </body>
                    </html>
                `);

            } catch (error: unknown) {
                console.log(`Error en AuthController.loginGoogleCallback: ${errorMessage(error)}`);
                res.status(200).send(`
                        <html>
                            <body>
                                <script>
                                    window.opener.postMessage({ codigo:1, mensaje:'Error en login con Google' }, '*');
                                    window.close();
                                </script>
                            </body>
                        </html>
                    `);
            }
        };
    }
}
