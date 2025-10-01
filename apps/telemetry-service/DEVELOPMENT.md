
## ✍️ Historial de Desarrollo 
Aquí se documentan los pasos y decisiones tomadas durante la construcción de la API, permitiendo reconstruir el proceso mental en el futuro.

### **Fase 1: Configuración Inicial**  
$\small \text{ Fecha: 2025-SEP-23} $

* **1 - Inicializacion del Proyecto:** Se inicializó el proyecto con `npm init -y` 

* **2 - Instalación de Nodemon:** Se instalo Nodemon como  $ \color{green} \text{devDependencies}$ con el comando `npm install --save-dev nodemon` lo cual da como resultado la carpeta ***node_modules*** y el fichero ***package-lock. json*** tambien se creo la carpeta ***src*** y la carpeta ***assets*** para imagenes o archivos del ***README*** solo para eso es hasta el momento.


 ![Imagen de carpetas del proyecto](assets/step-2.png)


* ***3 - Creacion de carpeta docs:*** esta carpeta se utiliza para la documentacion profesional de la API y contiene archivos Markdown ***(.md)*** .
Cada archivo será una página en mi sitio web generado con MkDocs.  

![Imagen de carpetas del proyecto](assets/docs.png)

se crearon los archivos ***DEVELOPMENT.dm*** el cual se utiliza para guardar el historial de desarrollo del proyecto y el ***.gitignore*** para ignorar archivos a subir a git 

### **⚙️ instalacion y configuracion de TypeScript**  

* ***1 - Instalar TypeScript:*** para instalar TypeScript y node Type  se utiliza el comando ` npm i -D typescript @types/node` estas dependencias son de desarrollo asi que asegurarse de que esten en ***DevDependecies*** en el ***package.json***, estas por ningun motivo llegan a produccion.

* ***2 - inicializar el archivo de configuracion de TypeScript:*** (se puede configurar al gusto)  `npx tsc --init  -- outDir dist/ --rootDir src`  ( ***-- outDir dist/*** con este comando configura donde se guardara los archivos de salida de js y con ***--rootDir src*** se configura la carpeta src como principal ).

* ***3 - Cambiar el app.js por app.ts:*** se cambio el ***app.js*** por ***app.ts*** para emprezar a utilizar ***TypeScript***, tambien se crea la carpeta ***dist***. esta carpeta contendrá la versión de JavaScript de los archivos de la carpeta src.


  ![Imagen de carpetas del proyecto](assets/capture-dist.png)

* ***4 - Se ejecuto el comando:***`npm install -D ts-node` el cual descargara la devDependence ***ts-node*** la cual es una herramienta que te permite ejecutar código de ***TypeScript (.ts)*** directamente en ***Node.js***, sin tener que compilarlo a ***JavaScript (.js)*** primero.

* ***5 -Se creo el archivo nodemon.json:*** esta archivo contiene los siguientes comandos para nodemon 

  ![Imagen de carpetas del proyecto](assets/nodemon-comands.png)

  Cuando ejecutas nodemon en tu proyecto, la herramienta automáticamente busca este archivo ***nodemon.json*** y sigue estas reglas:

  * Vigila la carpeta ***src***

  * Dentro de src, presta atención solo a los archivos con extensión ***.ts*** o .***json.***

  * La primera vez que se inicia (y cada vez que uno de esos archivos cambia), ejecuta el comando ***ts-node ./src/app.ts***

* ***6 - Instalar rimraf:*** `npm install -D rimraf`  Es un paquete de ***Node.js*** que se usa para borrar archivos y carpetas de forma profunda y recursiva. El nombre viene de ***rm (remove)*** y ***rf (recursive, force)***.

* ***7 - Crear o verificar los scrips:*** El siguiente archivo  ***package.json*** se encuentran los Scripts para desarrollo, produccion y desarrollo.



  ![Imagen de carpetas del proyecto](assets/scripts-app.png)


  * ***Mientras Programas:*** Usas npm run dev para tener un servidor que se reinicia automáticamente con cada cambio.


  * ***Cuando Terminas:*** Usas npm run build para traducir tu código de      TypeScript a JavaScript limpio y listo para producción.

  * ***Para Desplegar:*** Usas npm run start en el servidor para ejecutar la versión de JavaScript ya compilada.


* ***8 - Se ejecuto el comando start:*** nota para mi borrar esto y documenta por que el comando start creo archivos en la carpeta dist que significa cada uno 

   ![Imagen de carpetas del proyecto](assets/dist-files.png)
