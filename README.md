# AutoDrive - Inventario de Autos Usados

### Stack Elegido
**Backend:** Node.js, Express, TypeScript, SQLite (raw sqlite3), JWT, Bcrypt.  
**Frontend:** React (Vite), TypeScript, Tailwind CSS, Axios, React Router.

### Prerrequisitos
- **Node.js:** Versión 16 o superior.
- **npm:** Incluido con Node.js.

### Pasos para instalar y correr
```bash
# 1. Clonar el repositorio
git clone https://github.com/kaikiller/devpanel-NelsonPimentel.git
cd devpanel-NelsonPimentel

# 2. Configurar el Backend
cd backend
npm install
npm run dev & # Inicia el backend en :4000

# 3. Configurar el Frontend (en otra terminal)
cd ../frontend
npm install
npm run dev   # Inicia el frontend en :5173
```

### Credenciales de prueba
- **Usuario:** `admin@admin.com`
- **Contraseña:** `password`

### Decisiones técnicas clave
- **Paginación y Filtros en el Servidor:** Se implementó lógica de SQL (`LIMIT`, `OFFSET` y `WHERE` dinámicos) para manejar el rendimiento y evitar sobrecargar el frontend con miles de registros.
- **Seguridad con JWT:** Uso de JSON Web Tokens almacenados en `localStorage` para persistencia de sesión y protección de rutas mediante un componente `PrivateRoute`.
- **Diseño con Tailwind CSS:** Enfoque en una interfaz moderna y limpia utilizando una paleta de colores esmeralda para transmitir profesionalismo y claridad visual.
- **Base de Datos Ligera:** Elección de SQLite por su simplicidad de configuración ("Zero-config"), ideal para pruebas técnicas y entornos de desarrollo rápido.

### Limitaciones conocidas
- **Gestión de Sesión:** El token JWT no tiene un sistema de "refresh token"; expira en 1 hora y requiere nuevo login.
- **CRUD Incompleto:** Actualmente el sistema es de solo lectura (búsqueda y visualización). Las funciones de Crear, Editar y Eliminar autos no están implementadas en la interfaz.
- **Base de Datos Local:** Los cambios en la base de datos se pierden si se elimina el archivo `.sqlite` (no hay migraciones formales, solo seeding inicial).
