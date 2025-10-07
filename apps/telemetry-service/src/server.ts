import express, { Router } from 'express';
import path from 'path';

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
    // Middlewares
    this.app.use(express.json()); 
    this.app.use(express.urlencoded({ extended: true })); 

    // Public folder
    this.app.use(express.static(this.publicPath));

    // Routes
    this.app.use(this.routes);

    // SPA Fallback (optional)
    /*
    this.app.get('*', (req, res) => {
      const indexPath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
      res.sendFile(indexPath);
    });
    */

    // Start server
    this.serverListener = this.app.listen(this.port);

    this.serverListener.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Error: El puerto ${this.port} ya está en uso.`);
        process.exit(1);
      } else {
        console.error('Ocurrió un error inesperado al iniciar el servidor.');
        console.error(`El código del error es: ${error.code}`);
        console.error('Detalles completos del error:', error);
        process.exit(1);
      }
    });

    this.serverListener.on('listening',() => {
        console.log(`Servidor escuchando en el puerto ${this.port}`);
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
 *   - `this.app.listen(this.port)`: Pone al servidor a escuchar en el puerto especificado.
 *   - `serverListener.on('error', ...)`: Captura errores que puedan ocurrir al iniciar el
 *     servidor, como un puerto que ya está en uso (`EADDRINUSE`), y termina el proceso
 *     de forma controlada si es necesario.
 *   - `serverListener.on('listening', ...)`: Muestra un mensaje en consola cuando el servidor
 *     se ha iniciado correctamente y está listo para recibir peticiones.
 *
 * @paso 5: Fallback para Single Page Applications (SPA) - (Opcional, comentado)
 *   - El bloque `this.app.get('*', ...)` está diseñado para soportar SPAs (React, Angular, Vue).
 *     Si una petición no coincide con ninguna ruta de la API, se le entrega el `index.html`.
 *     Esto permite que el framework de frontend maneje el enrutamiento en el lado del cliente.
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