# AutoDrive: Gestión de Inventario de Autos Usados

Esta es una aplicación web full-stack diseñada para la gestión de un concesionario de vehículos usados. Incluye autenticación segura, inventario dinámico con filtros avanzados y paginación del lado del servidor.

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js & Express** con **TypeScript**.
- **SQLite** (raw `sqlite3`) para persistencia de datos.
- **JWT (JSON Web Tokens)** para manejo de sesiones seguras.
- **Bcryptjs** para el cifrado de contraseñas.

### Frontend
- **React** (Vite) con **TypeScript**.
- **Tailwind CSS** para una interfaz moderna y responsiva.
- **Axios** para comunicación con la API.
- **React Router Dom** para navegación y rutas protegidas.

---

## 🛠️ Funcionalidades Principales

1.  **Autenticación Segura:** Login mediante correo y contraseña con persistencia de sesión (LocalStorage + JWT).
2.  **Rutas Protegidas:** Solo usuarios autenticados pueden acceder al panel de control.
3.  **Inventario Premium:** Base de datos poblada con más de 40 vehículos, incluyendo modelos de alto rendimiento (BMW M3 G80, Supra MK5, Lexus RC F).
4.  **Búsqueda y Filtros Avanzados:**
    -   Búsqueda global por texto (modelo, descripción).
    -   Filtros específicos por **Marca** y **Año**.
5.  **Paginación del Servidor:** Manejo eficiente de grandes volúmenes de datos mediante límites y offsets en SQL.

---

## 📋 Instrucciones de Ejecución

### 1. Clonar y Preparar
```bash
git clone https://github.com/kaikiller/Prueba-tecnica.git
cd Prueba-tecnica
```

### 2. Ejecutar Backend
```bash
cd backend
npm install
npm run dev
```
*El servidor correrá en `http://localhost:4000`.*

### 3. Ejecutar Frontend
En otra terminal:
```bash
cd frontend
npm install
npm run dev
```
*La aplicación estará disponible en `http://localhost:5173`.*

---

## 🔑 Credenciales de Acceso

- **Correo:** `admin@admin.com`
- **Contraseña:** `password`

---

## 📸 Captura de Pantalla (Estructura)
- `/login`: Formulario de acceso estilizado.
- `/dashboard`: Tabla dinámica con filtros, paginación y gestión de stock.
