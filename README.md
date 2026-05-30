# Prueba Técnica: Aplicación Full-Stack (Login & Dashboard)

Esta es una aplicación web completa que incluye un sistema de autenticación, un dashboard simple y una tabla con funcionalidad de búsqueda.

## Tecnologías Utilizadas

### Backend
- **Node.js** con **Express** y **TypeScript**.
- **SQLite** como base de datos (con `sqlite3`).
- **JWT (JSON Web Tokens)** para autenticación.
- **Bcryptjs** para el hash de contraseñas.

### Frontend
- **React** (creado con **Vite**) y **TypeScript**.
- **Tailwind CSS** para los estilos.
- **React Router Dom** para la navegación.
- **Axios** para las peticiones a la API.

---

## Instrucciones para Ejecutar el Proyecto

### 1. Requisitos Previos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 16 o superior).

### 2. Clonar el Repositorio
```bash
git clone https://github.com/kaikiller/Prueba-tecnica.git
cd Prueba-tecnica
```

### 3. Configurar y Ejecutar el Backend
```bash
# Ir a la carpeta del backend
cd backend

# Instalar dependencias
npm install

# Iniciar el servidor en modo desarrollo
npm run dev
```
El servidor backend correrá en `http://localhost:4000`. La base de datos se inicializará automáticamente con datos de prueba.

### 4. Configurar y Ejecutar el Frontend
Abre una **nueva terminal** y ejecuta:
```bash
# Ir a la carpeta del frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```
La aplicación frontend estará disponible en `http://localhost:5173`.

---

## Credenciales de Acceso
Para probar el login, utiliza las siguientes credenciales preconfiguradas:

- **Usuario:** `admin`
- **Contraseña:** `password`

---

## Funcionalidades Implementadas
- **Login:** Validación de credenciales y generación de token JWT.
- **Rutas Protegidas:** Solo usuarios autenticados pueden ver el Dashboard.
- **Dashboard:**
  - Tabla que muestra el inventario de equipos.
  - Buscador en tiempo real (filtra por nombre, descripción o estado).
  - Cierre de sesión (Logout).
