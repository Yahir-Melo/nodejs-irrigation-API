import express, { Router } from 'express';

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}

export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async start() {

    this.app.use(express.json()); 
    this.app.use(express.urlencoded({ extended: true })); 

    this.app.use(express.static(this.publicPath));

    this.app.use(this.routes);
    
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`✅ Servidor escuchando en el puerto ${this.port}`);
    });

    this.serverListener.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Error: El puerto ${this.port} ya está en uso.`);
      } else {
        console.error(`❌ Error inesperado en el servidor: ${error.code}`, error);
      }
      process.exit(1);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}

/**
 * ==================================================================================================
 *                                     DOCUMENTACIÓN DEL SERVIDOR
 * ==================================================================================================
 *
 * @file src/server.ts
 * @description Este archivo define la clase `Server`, una abstracción para configurar y ejecutar
 *              un servidor de Express de manera estructurada y reutilizable.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                          INTERFAZ Options
 * --------------------------------------------------------------------------------------------------
 * @interface Options
 * @description Define la estructura del objeto de configuración que necesita la clase `Server`
 *              para ser instanciada.
 * @property {number} port - El puerto en el que el servidor escuchará.
 * @property {Router} routes - El enrutador principal de Express que contiene todas las rutas de la API.
 * @property {string} [public_path='public'] - (Opcional) La ruta a la carpeta de archivos estáticos.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                             CLASE Server
 * --------------------------------------------------------------------------------------------------
 * @class Server
 * @description Encapsula toda la lógica para la creación, configuración y gestión de un servidor Express.
 *
 * @property {express.Application} app - La instancia principal de la aplicación Express.
 * @property {any} serverListener - Almacena la instancia del servidor una vez que está escuchando,
 *                                  para poder cerrarla posteriormente.
 * @property {number} port - El puerto en el que corre el servidor.
 * @property {string} publicPath - La ruta al directorio de archivos públicos.
 * @property {Router} routes - El enrutador principal de la aplicación.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                           CONSTRUCTOR
 * --------------------------------------------------------------------------------------------------
 * @constructor
 * @description Inicializa las propiedades de la clase a partir del objeto `options` recibido.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                         MÉTODO `start`
 * --------------------------------------------------------------------------------------------------
 * @method start
 * @description Inicia el servidor y lo configura para recibir peticiones. El proceso sigue
 *              un flujo de trabajo definido:
 *
 * @paso 1: Configuración de Middlewares
 *   - `express.json()`: Habilita el parseo de bodies de peticiones con formato JSON.
 *   - `express.urlencoded({ extended: true })`: Habilita el parseo de bodies de peticiones
 *     enviadas desde formularios HTML (x-www-form-urlencoded).
 *
 * @paso 2: Exposición de Carpeta Pública
 *   - `express.static(this.publicPath)`: Sirve archivos estáticos (como `index.html`, CSS, JS)
 *     desde el directorio especificado en `publicPath`.
 *
 * @paso 3: Registro de Rutas de la API
 *   - `this.app.use(this.routes)`: Monta el enrutador principal que contiene todas las rutas
 *     de la aplicación. Todas las peticiones a la API pasarán por este enrutador.
 *
 * @paso 4: Inicio del Servidor y Manejo de Eventos
 *   - `this.app.listen(this.port, ...)`: Pone al servidor a escuchar en el puerto especificado y
 *     ejecuta un callback que confirma el inicio exitoso.
 *   - `serverListener.on('error', ...)`: Captura errores que puedan ocurrir al iniciar el
 *     servidor, como un puerto que ya está en uso (`EADDRINUSE`), y termina el proceso
 *     de forma controlada mostrando un mensaje claro.
 *
 * @analogy El método `start` es como el director de una orquesta. Llama a cada sección (middlewares,
 *          rutas, etc.) en el orden correcto para que la sinfonía (la aplicación) suene como debe.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                         MÉTODO `close`
 * --------------------------------------------------------------------------------------------------
 * @method close
 * @description Detiene el servidor de forma segura. Es especialmente útil en entornos de
 *              pruebas (testing) para levantar y cerrar el servidor en cada test, asegurando
 *              un ambiente limpio y sin conflictos de puertos.
 *
 */