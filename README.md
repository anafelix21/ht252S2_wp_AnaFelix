# Sistema de Gestión de Equipos - CRUD

Sistema web para registro y gestión de equipos informáticos desarrollado con Flask y MySQL.

## 🚀 Características

- ✅ Registro de equipos con información detallada
- 📋 Visualización de equipos en tabla interactiva
- ✏️ Edición de equipos existentes
- 🗑️ Eliminación de equipos
- 🎨 Interfaz moderna y responsive con Tailwind CSS
- 🔄 API REST con endpoints JSON

## 📋 Requisitos

- Python 3.8+
- MySQL 8.0+
- Ubuntu 22.04 (para despliegue en EC2)

## 🛠️ Instalación Local

### 1. Instalar MySQL
```bash
# En Ubuntu
sudo apt update
sudo apt install mysql-server -y
```

### 2. Configurar Base de Datos
```bash
# Acceder a MySQL
mysql -u root -p

# Importar estructura
mysql -u root -p < database.sql
```

### 3. Instalar Dependencias Python
```bash
# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### 4. Configurar Aplicación
Editar `app.py` línea 33:
```python
app.config['MYSQL_PASSWORD'] = 'tu_password_mysql'
```

### 5. Ejecutar Aplicación
```bash
python app.py
```

Abrir navegador en: `http://localhost:5000`

## 🌐 Despliegue en AWS EC2

Ver archivo `DESPLIEGUE_EC2.txt` para instrucciones completas.

### Resumen Rápido:
```bash
# 1. Instalar MySQL en EC2
sudo apt install mysql-server -y

# 2. Crear base de datos
mysql -u root -p < database.sql

# 3. Instalar dependencias
sudo apt install python3-dev default-libmysqlclient-dev build-essential -y
pip install -r requirements.txt

# 4. Ejecutar con Gunicorn
gunicorn --workers 3 --bind 0.0.0.0:5000 app:app
```

## 📁 Estructura del Proyecto

```
ht252S2_wp_AnaFelix/
├── app.py                  # Aplicación Flask principal
├── requirements.txt        # Dependencias Python
├── database.sql           # Estructura de base de datos
├── DESPLIEGUE_EC2.txt     # Guía completa de despliegue
├── static/
│   ├── css/
│   │   ├── output.css     # Tailwind CSS compilado
│   │   └── equipos.css    # Estilos personalizados
│   ├── js/
│   │   ├── form.js        # Lógica del formulario
│   │   └── equipos.js     # Gestión de equipos
│   └── image/
│       └── logo.png       # Logo de la aplicación
└── templates/
    ├── index.html         # Página de registro
    └── equipos.html       # Lista de equipos
```

## 🔌 API Endpoints

### GET /
Renderiza la página principal de registro

### GET /equipos
Renderiza la página de lista de equipos

### GET /api/equipos
Obtiene todos los equipos en formato JSON

**Respuesta:**
```json
{
  "success": true,
  "equipos": [...]
}
```

### GET /api/equipos/<id>
Obtiene un equipo específico

### POST /api/equipos
Crea un nuevo equipo

**Body:**
```json
{
  "codigo": "EQ001",
  "tipo": "Laptop",
  "marcas": "Dell",
  "modelo": "Latitude 5420",
  "so": "Windows 11",
  "almacenamiento": 512,
  "ram": 16,
  "estado": "Activo",
  "mantenimiento": "2025-12-20"
}
```

### PUT /api/equipos/<id>
Actualiza un equipo existente

### DELETE /api/equipos/<id>
Elimina un equipo

## 🗄️ Estructura de Base de Datos

### Tabla: equipos
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID autoincremental (PK) |
| codigo | VARCHAR(50) | Código único del equipo |
| tipo | VARCHAR(50) | Tipo de equipo (Laptop/Desktop) |
| marcas | VARCHAR(50) | Marca del equipo |
| modelo | VARCHAR(100) | Modelo específico |
| so | VARCHAR(50) | Sistema operativo |
| almacenamiento | INT | Capacidad en GB |
| ram | INT | Memoria RAM en GB |
| estado | VARCHAR(50) | Estado actual del equipo |
| mantenimiento | DATE | Fecha de mantenimiento |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última actualización |

## 🔧 Tecnologías Utilizadas

### Backend
- **Flask 3.0.0** - Framework web
- **Flask-MySQLdb 2.0.0** - Conector MySQL
- **Gunicorn 21.2.0** - Servidor WSGI

### Frontend
- **HTML5** - Estructura
- **Tailwind CSS 4.1.11** - Estilos
- **JavaScript ES6+** - Interactividad

### Base de Datos
- **MySQL 8.0** - Base de datos relacional

## 📝 Configuración de MySQL

### Credenciales por Defecto
```
Host: localhost
User: root
Password: tu_password_mysql
Database: hackaton
```

⚠️ **IMPORTANTE:** Cambiar la contraseña en `app.py` antes de usar.

## 🔒 Seguridad

- Validación de datos en frontend y backend
- Consultas parametrizadas para prevenir SQL injection
- Manejo de errores con try-catch
- CORS configurado según necesidades

## 🐛 Troubleshooting

### Error: ModuleNotFoundError: No module named 'MySQLdb'
```bash
sudo apt install python3-dev default-libmysqlclient-dev build-essential
pip install mysqlclient
```

### Error: Can't connect to MySQL server
```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mysql
sudo systemctl start mysql
```

### Error: Access denied for user 'root'@'localhost'
```bash
# Resetear contraseña de MySQL
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'nueva_password';
FLUSH PRIVILEGES;
```

## 👥 Autor

Ana Felix - [GitHub](https://github.com/anafelix21)

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo.

## 📞 Soporte

Para problemas o preguntas, consultar el archivo `DESPLIEGUE_EC2.txt` en la sección de **TROUBLESHOOTING**.
