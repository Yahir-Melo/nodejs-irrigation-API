import express, { Router } from 'express';
import path from 'path';

interface Options {
  port: number;
  routes: Router;
  public_path?: string;
}
/**
 * @interface Options
 * @description Define la estructura del objeto de configuración que se pasará al constructor de la clase `Server`.
 * - `port`: El número de puerto en el que el servidor escuchará.
 * - `routes`: El enrutador de Express que contiene todas las rutas de la API.
 * - `public_path`: (Opcional) El nombre de la carpeta que contendrá los archivos públicos. Por defecto es 'public'.
 */

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;
  /**
   * @description Propiedades de la clase `Server`.
   * - `app`: Es la instancia de la aplicación Express. Es pública para que pueda ser accesible desde fuera si es necesario.
   * - `serverListener`: Almacenará la instancia del servidor una vez que se inicie, para poder cerrarla después.
   * - `port`: El puerto en el que correrá el servidor.
   * - `publicPath`: La ruta a la carpeta de archivos públicos.
   * - `routes`: El conjunto de rutas que la aplicación utilizará.
   */

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }
  /**
   * @constructor
   * @description El constructor de la clase `Server` se encarga de inicializar las propiedades.
   * - Recibe el objeto `options` y desestructura sus valores.
   * - Asigna el puerto, las rutas y la ruta pública a las propiedades de la clase.
   * - Si no se proporciona un `public_path`, se establece 'public' como valor predeterminado.
   */

  async start() {
    //* Middlewares
    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded
    /**
     * @description Configuración de Middlewares.
     * - `express.json()`: Permite que el servidor entienda y procese peticiones cuyo cuerpo viene en formato JSON.
     * - `express.urlencoded({ extended: true })`: Permite procesar datos de formularios enviados en el cuerpo de la petición (formato x-www-form-urlencoded).
     */

    //* Public Folder
    this.app.use(express.static(this.publicPath));
    /**
     * @description Servir archivos estáticos.
     * - `express.static(this.publicPath)`: Expone la carpeta definida en `publicPath` (por defecto 'public')
     *   para que su contenido (HTML, CSS, JS, imágenes) sea accesible directamente desde el navegador.
     */

    //* Routes
    this.app.use(this.routes);
    /**
     * @description Registro de las rutas de la API.
     * - `this.app.use(this.routes)`: Monta el enrutador que se le pasó en el constructor.
     *   Todas las rutas definidas en `AppRoutes` (y pasadas a través de `main.ts`) quedan registradas
     *   y listas para recibir peticiones.
     */

    /* SPA /^\/(?!api).  <== Únicamente si no empieza con la palabra api
    this.app.get('*', (req, res) => {
      const indexPath = path.join( __dirname + `../../../${ this.publicPath }/index.html` );
      res.sendFile(indexPath);
    });
    */

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
    /**
     * @description Inicio del servidor.
     * - `this.app.listen()`: Pone en marcha el servidor para que escuche peticiones en el puerto especificado (`this.port`).
     * - El callback que se le pasa se ejecutará una vez que el servidor esté listo, mostrando un mensaje en consola.
     * - La instancia del listener se guarda en `this.serverListener` para poder detener el servidor más tarde.
     */
  }

  public close() {
    this.serverListener?.close();
  }
  /**
   * @method close
   * @description Detiene el servidor.
   * - `this.serverListener?.close()`: Cierra la conexión del servidor, dejando de aceptar nuevas peticiones.
   * - El operador `?.` (optional chaining) asegura que no haya un error si `serverListener` no está definido (el servidor no se ha iniciado).
   * - Es útil para escenarios de pruebas o para un apagado controlado de la aplicación.
   */
}