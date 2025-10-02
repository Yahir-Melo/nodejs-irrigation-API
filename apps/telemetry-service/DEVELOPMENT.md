## ✍️ Historial de Desarrollo 
Aquí se documentan los pasos y decisiones tomadas durante la construcción de la API, permitiendo reconstruir el proceso mental en el futuro.

### **Fase 1: Configuración Inicial**  
$\small \text{ Fecha: 2025-SEP-23} $

* **1 - Inicializacion del Proyecto:** Se inicializó el proyecto con `npm init -y` 

* **2 - Instalación de Nodemon:** Se instalo Nodemon como  $ \color{green} \text{devDependencies}$ con el comando `npm install --save-dev nodemon` lo cual da como resultado la carpeta ***node_modules*** y el fichero ***package-lock. json***tambien se creo la carpeta ***src*** y la carpeta ***assets*** para imagenes o archivos del ***README*** solo para eso es hasta el momento.


 ![Imagen de carpetas del proyecto](https://i.imgur.com/EMy8Zql.png) 


* ***3 - Creacion de carpeta docs:*** esta carpeta se utiliza para la documentacion profesional de la API y contiene archivos Markdown ***(.md)*** . 
Cada archivo será una página en mi sitio web generado con MkDocs.  

![Imagen de carpetas del proyecto](https://i.imgur.com/fdtefmR.png)

se crearon los archivos ***DEVELOPMENT.dm*** el cual se utiliza para guardar el historial de desarrollo del proyecto y el ***.gitignore*** para ignorar archivos a subir a git 

### **⚙️ Instalacion y configuracion de TypeScript**  

* ***1 - Instalar TypeScript:*** para instalar TypeScript y node Type  se utiliza el comando ` npm i -D typescript @types/node` estas dependencias son de desarrollo asi que asegurarse de que esten en ***DevDependecies*** en el ***package.json***, estas por ningun motivo llegan a produccion.

* ***2 - inicializar el archivo de configuracion de TypeScript:*** (se puede configurar al gusto)  `npx tsc --init  -- outDir dist/ --rootDir src`  ( ***-- outDir dist/*** con este comando configura donde se guardara los archivos de salida de js y con ***--rootDir src*** se configura la carpeta src como principal ).

* ***3 - Cambiar el app.js por app.ts:*** se cambio el ***app.js*** por ***app.ts*** para emprezar a utilizar ***TypeScript***, tambien se crea la carpeta ***dist***. esta carpeta contendrá la versión de JavaScript de los archivos de la carpeta src.


  ![Imagen de carpetas del proyecto](https://i.imgur.com/Zl0gyjW.png)

* ***4 - Se ejecuto el comando:***`npm install -D ts-node` el cual descargara la devDependence ***ts-node*** la cual es una herramienta que te permite ejecutar código de ***TypeScript (.ts)*** directamente en ***Node.js***, sin tener que compilarlo a ***JavaScript (.js)*** primero.

* ***5 -Se creo el archivo nodemon.json:*** esta archivo contiene los siguientes comandos para nodemon 

  ![Imagen de carpetas del proyecto](https://i.imgur.com/t0S9MIT.png)

  Cuando ejecutas nodemon en tu proyecto, la herramienta automáticamente busca este archivo ***nodemon.json*** y sigue estas reglas:

  * Vigila la carpeta ***src***

  * Dentro de src, presta atención solo a los archivos con extensión ***.ts*** o .***json.***

  * La primera vez que se inicia (y cada vez que uno de esos archivos cambia), ejecuta el comando ***ts-node ./src/app.ts***

* ***6 - Instalar rimraf:*** `npm install -D rimraf`  Es un paquete de ***Node.js*** que se usa para borrar archivos y carpetas de forma profunda y recursiva. El nombre viene de ***rm (remove)*** y ***rf (recursive, force)***.

* ***7 - Crear o verificar los scrips:*** El siguiente archivo  ***package.json*** se encuentran los Scripts para desarrollo, produccion y desarrollo.



  ![Imagen de carpetas del proyecto](https://i.imgur.com/qjOeYXG.png)


  * ***Mientras Programas:*** Usas npm run dev para tener un servidor que se reinicia automáticamente con cada cambio. 


  * ***Cuando Terminas:*** Usas npm run build para traducir tu código de      TypeScript a JavaScript limpio y listo para producción.

  * ***Para Desplegar:*** Usas npm run start en el servidor para ejecutar la versión de JavaScript ya compilada. 


* ***8 - Se ejecuto el comando start:*** En resumen, el comando primero compila tu código de ***TypeScript*** a ***JavaScript*** y luego ejecuta el resultado. La carpeta dist contiene el resultado del proceso de compilación (***npm run build***). Esto es lo que significa cada archivo:

   ![Imagen de carpetas del proyecto](https://i.imgur.com/v6r2rWm.png)

  * ***app.js***: Este es tu código TypeScript compilado a JavaScript. Es el archivo principal que se ejecuta.

  * ***app.js.map (Source Map):*** Es un "mapa de código fuente". Ayuda a las herramientas de depuración a conectar el código ***JavaScript*** (app.js) que se está ejecutando con tu código ***TypeScript*** original. Gracias a este archivo, si hay un error en ***app.js***, el depurador te puede mostrar la línea exacta del error en tu archivo ***app.ts***, lo cual hace mucho más fácil encontrar y corregir problemas.

  * ***app.d.ts (Archivo de Declaración de Tipos):*** Este archivo contiene solo las ***"firmas"*** de tipo de tu código. No contiene la lógica, solo la descripción de las funciones, variables y sus tipos. Es muy útil si quieres que otros proyectos de ***TypeScript*** utilicen tu código, ya que les proporciona autocompletado y verificación de tipos.

  * ***app.d.ts.map:*** Al igual que el ***app.js.map***, este es un mapa de código fuente pero para el archivo de declaración de tipos.

  * ***NOTA:*** se agrego al ***tsconfig.json***  

    
    ![Imagen de carpetas del proyecto](https://i.imgur.com/O1nARXg.png)

    ¿Para qué es? Para que TypeScript genere código compatible y resuelva los módulos como lo hace Node.js moderno. Tambien se agrego  el script al package.json ***"dev":  "nodemon --exec node --loader ts-node/esm ./src/app.ts"*** Es la forma correcta de decirle a Node.js que use ts-node para interpretar archivos .ts "al vuelo" cuando el proyecto es de tipo módulo, 

* ***9  - Creacion de carpetas:*** se crearon las siguientes carpetas 
    
    ![Creacion de carptetas SRC](https://i.imgur.com/BRHL7tU.png) 

    * ***adapters***: Esta carpeta contiene todos los adaptadores de la API ***(Patron adaptador)***

    * ***controllers***: La capa que maneja las ***peticiones HTTP***. Recibe la petición, llama al servicio correspondiente y devuelve una respuesta ***(JSON, HTML, etc.)***. Son los ***"porteros"*** de tu ***API.***

    * ***data***: Esta carpeta se usa para almacenar ***datos estáticos, mocks o datos de origen (seed data)***. Es información "cruda" que tu aplicación puede necesitar. Piensa en ella como el almacén o la despensa de tu aplicación

    * ***entities***: Define las estructuras de tus datos. Aquí irían las interfaces de ***TypeScript*** o las clases que representan tus objetos de negocio.

    * ***middlewares***: Funciones que se ejecutan antes de que una petición llegue al controlador final. Muy útil para ***autenticación, manejo de errores, logging, etc.***

    * ***services***: Aquí es donde vive la ***lógica de negocio*** de tu aplicación. Los servicios orquestan las operaciones, se comunican con la base de datos (o la capa de datos), llaman a ***APIs externas*** y aplican las reglas de negocio. Son los ***"cerebros"*** o los ***"trabajadores"*** de tu aplicación.

 * ***10 - Instalacion de 'dotenv'*** Se instaló la librería ***dotenv*** (npm install dotenv).

   * En el punto de entrada de la aplicación ***(app.ts)***, se importó y configuró ***dotenv*** para cargar las variables de entorno desde un archivo ***.env***.

    *  Se utilizó ***process.env*** para acceder a estas variables en el código ***(ej. process.env.DB_HOST).***

   * Se actualizó ***tsconfig.json*** con ***"types": ["node"]*** para que ***TypeScript*** reconociera correctamente el objeto global ***process***.


  ### **🔌 Instalacion y configuracion de ORM-Prisma**  

  
* ***1 - Ejecutar comando de instalacion:***`npm install prisma --save-dev` instala la caja de herramientas de Prisma (el CLI) en tu proyecto y la registra como una dependencia de desarrollo.

* ***2 - Correr el comando*** `npx prisma init --datasource-provider PostgreSQL` Este comando inicializa Prisma, creando la carpeta prisma y el archivo .env.  
  * ***--datasource-provider:*** Es una "bandera" (flag) que le permite especificar a Prisma qué tipo de base de datos vas a usar.

  * ***PostgreSQL:*** Es el valor que le pasas a la bandera. Le estás diciendo: ***"Mi base de datos es PostgreSQL"***. (Otros valores podrían ser mysql, sqlite, sqlserver, etc.).
  

* ***3 - Se crearon las entidades/tablas:*** 

![Creacion de entidades / tablas user y authtoken](https://i.imgur.com/Nz1L7xm.png)
 
* Despues se ejecuto el comando ` npx prisma migrate dev`  para crear las tablas en la base de datos de ***Postgresql*** y se crean las carpetas:

  ![Creacion de entidades / tablas user y authtoken](https://i.imgur.com/x7nlYHq.png)

  Tambien la carpeta ***generated*** la cual se guarda en el ***git ignore*** por que se puede generar 



 
  
### **Fase 2: Creación del Servidor Web con Express**
$\small \text{ Fecha: 2025-OCT-02} $

* ***1 - Instalar Express:*** Se instaló el framework `***Express***` para la creación del servidor y sus tipos correspondientes como una dependencia de desarrollo.
  `npm install express`
  `npm install -D @types/express`

* ***2 - Creación de `server.ts`:*** Se creó el archivo `src/server.ts`. Este archivo es fundamental ya que contiene la clase `Server`, la cual encapsula toda la lógica de configuración y arranque del servidor `***Express***`.

* ***3 - Creación de la estructura de rutas:*** Para mantener el código organizado, se crearon los siguientes archivos que definen la estructura de las rutas de la API:
    *   `src/main_routes.ts`: Actúa como el enrutador principal. Su propósito es centralizar y distribuir las peticiones a los enrutadores especializados.
    *   `src/routes/routes.ts`: Un enrutador especializado para un conjunto de funcionalidades (en este caso, autenticación).

* ***4 - Creación de la carpeta `public`:*** Se creó la carpeta `public/` en la raíz del proyecto.
    *   Dentro se añadió un archivo `index.html` básico. Esta carpeta es servida por `***Express***` para mostrar contenido estático, como una página de bienvenida para la API.