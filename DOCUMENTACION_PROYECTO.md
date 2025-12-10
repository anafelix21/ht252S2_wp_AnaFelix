# 📚 DOCUMENTACIÓN DEL PROYECTO - Sistema de Gestión de Equipos

## 🎯 Descripción General del Sistema

Este es un **sistema web CRUD completo** (Create, Read, Update, Delete) desarrollado con Flask y MySQL para gestionar un inventario de equipos de cómputo. Permite registrar, visualizar, editar y eliminar equipos con sus especificaciones técnicas.

---

## 📁 Estructura del Proyecto

```
ht252S2_wp_AnaFelix/
├── app.py                      # Backend - Servidor Flask con API REST
├── requirements.txt            # Dependencias Python
├── .env.example               # Ejemplo de variables de entorno
├── .gitignore                 # Archivos ignorados por Git
├── static/                    # Archivos estáticos (CSS, JS, imágenes)
│   ├── css/
│   │   ├── equipos.css       # Estilos de la página de equipos
│   │   ├── input.css         # Estilos base de Tailwind
│   │   └── output.css        # Estilos compilados de Tailwind
│   ├── js/
│   │   ├── equipos.js        # Lógica de la página de equipos
│   │   └── form.js           # Lógica del formulario de registro
│   └── image/
│       ├── fondo.jpg         # Imagen de fondo
│       └── logo.jpg          # Logo del sistema
└── templates/                 # Plantillas HTML
    ├── index.html            # Página principal (formulario)
    └── equipos.html          # Página de lista de equipos
```

---

## 🔧 Archivos Principales y sus Funciones

### 1️⃣ **app.py** - Backend del Sistema

**Función**: Servidor backend desarrollado en Flask que maneja todas las operaciones de la base de datos.

#### 📌 Componentes Clave:

**A) Configuración de la Base de Datos**
- Conecta con MySQL en AWS RDS
- Host: `database-2.c5ks6s0kal3v.us-east-1.rds.amazonaws.com`
- Base de datos: `hackaton`
- Usuario: `admin`

**B) Rutas y Endpoints**

| Ruta | Método | Función | Descripción |
|------|--------|---------|-------------|
| `/` | GET | `index()` | Muestra la página principal con el formulario de registro |
| `/equipos` | GET | `equipos()` | Muestra la página con la tabla de equipos |
| `/api/equipos` | POST | `crear_equipo()` | Crea un nuevo equipo en la BD |
| `/api/equipos` | GET | `obtener_equipos()` | Obtiene todos los equipos registrados |
| `/api/equipos/<id>` | GET | `obtener_equipo(id)` | Obtiene un equipo específico por ID |
| `/api/equipos/<id>` | PUT | `actualizar_equipo(id)` | Actualiza los datos de un equipo |
| `/api/equipos/<id>` | DELETE | `eliminar_equipo(id)` | Elimina un equipo de la BD |

**C) Funciones Auxiliares**
- `ejecutar_query()`: Función centralizada para ejecutar consultas SQL de forma segura

---

### 2️⃣ **equipos.js** - Gestión de la Página de Equipos

**Función**: Maneja toda la interacción del usuario con la lista de equipos.

#### 📌 Funcionalidades Implementadas:

**A) Visualización de Equipos**
- Carga automática de todos los equipos al abrir la página
- Genera tabla HTML dinámica con los datos
- Muestra contador total de equipos
- Indica estado (activo/inactivo) con colores
- Maneja casos sin datos o con errores

**B) Edición de Equipos**
- Abre modal con formulario de edición
- Carga datos del equipo seleccionado
- Envía actualización a la API
- Recarga página para mostrar cambios

**C) Eliminación de Equipos**
- Solicita confirmación antes de eliminar
- Envía petición DELETE a la API
- Actualiza lista automáticamente

**D) Variables y Eventos**
- `equipoEnEdicion`: Almacena ID del equipo en edición
- `abrirModal(id)`: Abre ventana de edición
- `cerrarModal()`: Cierra ventana de edición
- `eliminarEquipo(id)`: Elimina equipo seleccionado
- Event listener para cerrar modal al hacer clic fuera

---

### 3️⃣ **form.js** - Lógica del Formulario de Registro

**Función**: Proporciona funcionalidad dinámica al formulario de registro de equipos.

#### 📌 Funcionalidades Implementadas:

**A) Diccionarios de Datos**
- `modelosPorMarca`: Contiene modelos disponibles por cada marca
  - HP: 7 modelos
  - Dell: 7 modelos
  - Lenovo: 7 modelos
  - ASUS: 7 modelos
  - Apple: 5 modelos

- `especificacionesModelo`: Contiene especificaciones técnicas de cada modelo
  - RAM (GB)
  - Almacenamiento (GB)
  - Procesador

- `fechasRegistro`: Fechas predefinidas para registro de equipos

**B) Carga Dinámica de Modelos**
- Cuando usuario selecciona una marca, carga automáticamente sus modelos
- Limpia el select anterior
- Llena con opciones correspondientes

**C) Autocompletado de Especificaciones**
- Al seleccionar un modelo, autocompleta:
  - Campo RAM
  - Campo Almacenamiento
- Agiliza el llenado del formulario
- Reduce errores de captura

**D) Configuración de Fechas**
- Establece fecha mínima de mantenimiento (no permite fechas pasadas)
- Carga fechas predefinidas en select de registro

---

## 🔄 Flujo de Funcionamiento del Sistema

### ✅ **Proceso de Registro de Equipo (CREATE)**

1. Usuario accede a la página principal (`/`)
2. Selecciona marca → Se cargan modelos automáticamente
3. Selecciona modelo → Se autocompletan RAM y Almacenamiento
4. Completa datos restantes:
   - Código del equipo
   - Tipo (Laptop, Desktop, etc.)
   - Sistema Operativo
   - Estado (Activo/Inactivo)
   - Fecha de mantenimiento
5. Envía formulario
6. JavaScript hace petición POST a `/api/equipos`
7. Flask inserta datos en MySQL
8. Retorna respuesta de éxito o error
9. Muestra mensaje al usuario

---

### 📋 **Proceso de Visualización de Equipos (READ)**

1. Usuario accede a `/equipos`
2. JavaScript ejecuta petición GET a `/api/equipos`
3. Flask consulta todos los equipos en MySQL
4. Retorna JSON con array de equipos
5. JavaScript genera tabla HTML dinámica
6. Muestra equipos con:
   - Todos sus datos
   - Botones de Editar y Eliminar
   - Indicador de estado con colores
   - Contador total

---

### ✏️ **Proceso de Edición de Equipo (UPDATE)**

1. Usuario hace clic en botón "Editar" de un equipo
2. JavaScript ejecuta `abrirModal(id)`
3. Se hace petición GET a `/api/equipos/id`
4. Flask obtiene datos del equipo de MySQL
5. JavaScript rellena formulario del modal
6. Usuario modifica los datos
7. Envía formulario
8. JavaScript hace petición PUT a `/api/equipos/id`
9. Flask actualiza registro en MySQL
10. Cierra modal y recarga página
11. Muestra equipo actualizado

---

### 🗑️ **Proceso de Eliminación de Equipo (DELETE)**

1. Usuario hace clic en botón "Eliminar"
2. JavaScript muestra ventana de confirmación
3. Si confirma:
4. JavaScript hace petición DELETE a `/api/equipos/id`
5. Flask elimina registro de MySQL
6. Recarga página
7. Lista se actualiza sin el equipo eliminado

---

## 🎨 Características de la Interfaz

### **Página Principal (index.html)**
- Formulario completo de registro
- Campos dinámicos (modelos según marca)
- Autocompletado de especificaciones
- Validaciones en campos
- Diseño responsive con Tailwind CSS

### **Página de Equipos (equipos.html)**
- Tabla responsive con todos los equipos
- Modal de edición
- Botones de acción (Editar/Eliminar)
- Indicadores visuales de estado
- Contador de equipos
- Mensajes cuando no hay datos

---

## 🔐 Seguridad y Buenas Prácticas

✅ **Implementadas:**
- Uso de parámetros en consultas SQL (previene SQL Injection)
- Validación de datos antes de insertar
- Manejo de errores con try-catch
- Confirmación antes de eliminar
- Uso de métodos HTTP apropiados (GET, POST, PUT, DELETE)

---

## 🚀 Tecnologías Utilizadas

### **Backend:**
- **Flask 3.0.0**: Framework web de Python
- **Flask-MySQLdb 2.0.0**: Conexión con MySQL
- **mysqlclient 2.2.0**: Cliente MySQL para Python
- **python-dotenv 1.0.0**: Manejo de variables de entorno
- **gunicorn 21.2.0**: Servidor WSGI para producción

### **Frontend:**
- **HTML5**: Estructura de las páginas
- **CSS3 / Tailwind CSS**: Estilos y diseño responsive
- **JavaScript (ES6+)**: Lógica del cliente
- **Fetch API**: Peticiones HTTP asíncronas

### **Base de Datos:**
- **MySQL**: Base de datos relacional en AWS RDS

### **Infraestructura:**
- **AWS EC2**: Servidor de aplicación
- **AWS RDS**: Base de datos MySQL
- **GitHub**: Control de versiones

---

## 📊 Tabla de Base de Datos

### **Tabla: `equipos`**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INT (PK, AI) | Identificador único |
| `codigo` | VARCHAR | Código del equipo |
| `tipo` | VARCHAR | Tipo (Laptop, Desktop, etc.) |
| `marcas` | VARCHAR | Marca del equipo |
| `modelo` | VARCHAR | Modelo específico |
| `so` | VARCHAR | Sistema Operativo |
| `almacenamiento` | INT | Almacenamiento en GB |
| `ram` | INT | Memoria RAM en GB |
| `estado` | VARCHAR | Estado (Activo/Inactivo) |
| `mantenimiento` | DATE | Fecha de último mantenimiento |
| `fecha_registro` | DATE | Fecha de registro en sistema |

---

## 🌐 URLs del Sistema

- **Aplicación Web**: `http://98.87.67.95:5000`
- **Página Principal**: `http://98.87.67.95:5000/`
- **Lista de Equipos**: `http://98.87.67.95:5000/equipos`
- **API Equipos**: `http://98.87.67.95:5000/api/equipos`

---

## 📝 Resumen de Commits

1. **chore(config)**: agregar configuración del proyecto y dependencias
2. **style(css)**: mejorar diseño responsive y estilos de equipos
3. **feat(app)**: actualizar conexión de base de datos y mejorar interfaz de usuario
4. **docs(code)**: agregar comentarios detallados explicando funcionalidad de cada bloque

---

## 🎓 Conclusión

Este sistema implementa un **CRUD completo** con arquitectura cliente-servidor, siguiendo el patrón **MVC** (Modelo-Vista-Controlador) y utilizando **API REST** para la comunicación. Todos los archivos están completamente documentados con comentarios explicativos que detallan la función de cada bloque de código.
