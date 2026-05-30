AutoDrive - Inventario de Autos Usados

STACK:
Backend con Node, Express, TypeScript y SQLite.
Frontend con React, TypeScript y Tailwind CSS.

REQUISITOS:
Tener instalado Node.js (v16 o mas).

PASOS PARA CORRERLO (Copy-paste):

# 1. Clonar y entrar
git clone https://github.com/kaikiller/devpanel-NelsonPimentel.git
cd devpanel-NelsonPimentel

# 2. Arrancar Backend
cd backend
npm install
npm run dev &

# 3. Arrancar Frontend
cd ../frontend
npm install
npm run dev

CREDENCIALES:
Correo: admin@admin.com
Clave: password

NOTAS TECNICAS:
* Paginacion y filtros hechos en el servidor (SQL) para que sea rapido con muchos datos.
* Sesion con JWT guardado en localStorage y rutas protegidas en el front.
* Diseño verde esmeralda con Tailwind para que se vea limpio y moderno.
* Base de datos SQLite para que no necesites configurar nada externo.

LIMITACIONES:
* El token dura 1 hora, luego hay que loguearse de nuevo.
* Solo se puede buscar y ver, no hay botones para agregar o borrar carros aun.
* La base de datos se resetea si borras el archivo .sqlite de la carpeta backend.
