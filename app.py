# ============================================
# IMPORTACIONES DE LIBRERÍAS NECESARIAS
# ============================================
# Flask: Framework web para crear la aplicación
# render_template: Para renderizar plantillas HTML
# request: Para manejar peticiones HTTP (GET, POST, PUT, DELETE)
# jsonify: Para convertir datos Python a formato JSON
from flask import Flask, render_template, request, jsonify

# Flask-MySQLdb: Extensión para conectar Flask con MySQL
from flask_mysqldb import MySQL

# MySQLdb.cursors: Para trabajar con cursores de base de datos
import MySQLdb.cursors

# os: Para manejar variables de entorno (como el puerto)
import os

# ============================================
# CONFIGURACIÓN DE LA APLICACIÓN FLASK
# ============================================
# Inicializa la aplicación Flask
app = Flask(__name__)

# ============================================
# CONFIGURACIÓN DE LA BASE DE DATOS MySQL
# ============================================
# Estas configuraciones establecen la conexión con la base de datos MySQL local en EC2
# MYSQL_HOST: localhost porque MySQL estará en la misma instancia EC2
app.config['MYSQL_HOST'] = 'localhost'
# MYSQL_USER: Usuario root de MySQL local
app.config['MYSQL_USER'] = 'root'
# MYSQL_PASSWORD: Contraseña del usuario root (cambiar según tu configuración)
app.config['MYSQL_PASSWORD'] = 'tu_password_mysql'
# MYSQL_DB: Nombre de la base de datos específica a usar
app.config['MYSQL_DB'] = 'hackaton'

# Inicializa la conexión MySQL con las configuraciones anteriores
mysql = MySQL(app)

# ============================================
# FUNCIÓN AUXILIAR PARA EJECUTAR CONSULTAS
# ============================================
# Esta función centraliza la ejecución de consultas SQL
# Parámetros:
#   - query: Consulta SQL a ejecutar
#   - params: Parámetros para la consulta (previene inyección SQL)
#   - uno: Si es True, retorna solo un registro, si es False retorna todos
def ejecutar_query(query, params=None, uno=False):
    # Crea un cursor con formato de diccionario (más fácil de usar)
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    # Ejecuta la consulta SQL con los parámetros proporcionados
    cursor.execute(query, params or ())
    # Obtiene uno o todos los resultados según el parámetro 'uno'
    resultado = cursor.fetchone() if uno else cursor.fetchall()
    # Cierra el cursor para liberar recursos
    cursor.close()
    # Retorna los resultados obtenidos
    return resultado

# ============================================
# RUTA PRINCIPAL - PÁGINA DE INICIO
# ============================================
# Esta ruta muestra la página principal del sistema
# URL: http://tudominio.com/
# Método: GET
# Función: Renderiza la plantilla index.html (página de inicio/formulario)
@app.route('/')
def index():
    return render_template("index.html")

# ============================================
# RUTA DE EQUIPOS - PÁGINA DE VISUALIZACIÓN
# ============================================
# Esta ruta muestra la página donde se listan todos los equipos registrados
# URL: http://tudominio.com/equipos
# Método: GET
# Función: Renderiza la plantilla equipos.html (tabla con todos los equipos)
@app.route('/equipos')
def equipos():
    return render_template("equipos.html")

# ============================================
# API REST - CREAR NUEVO EQUIPO (CREATE)
# ============================================
# Esta ruta crea un nuevo equipo en la base de datos
# URL: http://tudominio.com/api/equipos
# Método: POST
# Función: Recibe datos JSON del formulario y los inserta en la tabla 'equipos'
# Entrada: JSON con datos del equipo (codigo, tipo, marca, modelo, etc.)
# Salida: JSON con estado de éxito o error
@app.route('/api/equipos', methods=['POST'])
def crear_equipo():
    try:
        # Obtiene los datos enviados en formato JSON desde el frontend
        datos = request.get_json()
        
        # Valida que se hayan enviado datos
        if not datos:
            return jsonify({'ok': False, 'error': 'No hay datos'}), 400
        
        # Crea un cursor para ejecutar comandos SQL
        cursor = mysql.connection.cursor()
        
        # Consulta SQL INSERT para agregar un nuevo equipo
        # Los %s son placeholders que se reemplazan con los valores reales
        sql = """INSERT INTO equipos 
                 (codigo, tipo, marcas, modelo, so, almacenamiento, ram, estado, mantenimiento, fecha_registro) 
                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        
        # Tupla con los valores que se insertarán en la base de datos
        # .get() obtiene el valor o None si no existe
        valores = (
            datos.get('codigo'),
            datos.get('tipo'),
            datos.get('marcas'),
            datos.get('modelo'),
            datos.get('so'),
            datos.get('almacenamiento'),
            datos.get('ram'),
            datos.get('estado'),
            datos.get('mantenimiento'),
            datos.get('fecha_registro')
        )
        
        # Ejecuta la consulta SQL con los valores
        cursor.execute(sql, valores)
        # Confirma los cambios en la base de datos (hace permanente la inserción)
        mysql.connection.commit()
        # Cierra el cursor para liberar recursos
        cursor.close()
        
        # Retorna respuesta exitosa en formato JSON
        return jsonify({'ok': True, 'mensaje': 'Equipo registrado exitosamente'}), 200
        
    except Exception as e:
        # Si ocurre algún error, lo imprime en consola
        print(f"Error: {str(e)}")
        # Retorna respuesta de error en formato JSON
        return jsonify({'ok': False, 'error': str(e)}), 500

# ============================================
# API REST - OBTENER TODOS LOS EQUIPOS (READ ALL)
# ============================================
# Esta ruta obtiene todos los equipos registrados en la base de datos
# URL: http://tudominio.com/api/equipos
# Método: GET
# Función: Consulta todos los registros de la tabla 'equipos' y los retorna en JSON
# Salida: JSON con lista de todos los equipos ordenados por fecha más reciente
@app.route('/api/equipos', methods=['GET'])
def obtener_equipos():
    try:
        # Crea cursor con formato de diccionario para facilitar el acceso a datos
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        
        # Consulta SQL SELECT para obtener todos los equipos
        # ORDER BY fecha_registro DESC: Ordena de más reciente a más antiguo
        sql = "SELECT * FROM equipos ORDER BY fecha_registro DESC"
        
        # Ejecuta la consulta
        cursor.execute(sql)
        
        # Obtiene todos los resultados como una lista de diccionarios
        equipos = cursor.fetchall()
        
        # Cierra el cursor
        cursor.close()
        
        # Retorna los equipos en formato JSON
        return jsonify({'ok': True, 'equipos': equipos}), 200
        
    except Exception as e:
        # Manejo de errores
        print(f"Error: {str(e)}")
        return jsonify({'ok': False, 'error': str(e)}), 500

# ============================================
# API REST - OBTENER UN EQUIPO POR ID (READ ONE)
# ============================================
# Esta ruta obtiene un equipo específico basado en su ID
# URL: http://tudominio.com/api/equipos/5 (donde 5 es el ID)
# Método: GET
# Función: Consulta un registro específico de la tabla 'equipos' por su ID
# Entrada: ID del equipo en la URL
# Salida: JSON con los datos del equipo o mensaje de error si no existe
@app.route('/api/equipos/<int:id>', methods=['GET'])
def obtener_equipo(id):
    try:
        # Crea cursor con formato de diccionario
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        
        # Consulta SQL SELECT con condición WHERE para buscar por ID
        # %s es un placeholder que se reemplaza de forma segura
        sql = "SELECT * FROM equipos WHERE id = %s"
        
        # Ejecuta la consulta pasando el ID como parámetro (protección contra SQL injection)
        cursor.execute(sql, (id,))
        
        # Obtiene solo un resultado (el primer registro encontrado)
        equipo = cursor.fetchone()
        
        # Cierra el cursor
        cursor.close()
        
        # Verifica si se encontró el equipo
        if equipo:
            # Si existe, retorna los datos del equipo
            return jsonify({'ok': True, 'equipo': equipo}), 200
        else:
            # Si no existe, retorna error 404 (No encontrado)
            return jsonify({'ok': False, 'error': 'Equipo no encontrado'}), 404
        
    except Exception as e:
        # Manejo de errores
        print(f"Error: {str(e)}")
        return jsonify({'ok': False, 'error': str(e)}), 500

# ============================================
# API REST - ACTUALIZAR EQUIPO (UPDATE)
# ============================================
# Esta ruta actualiza los datos de un equipo existente
# URL: http://tudominio.com/api/equipos/5 (donde 5 es el ID)
# Método: PUT
# Función: Modifica los datos de un equipo específico en la base de datos
# Entrada: ID en la URL y JSON con los nuevos datos del equipo
# Salida: JSON con estado de éxito o error
@app.route('/api/equipos/<int:id>', methods=['PUT'])
def actualizar_equipo(id):
    try:
        # Obtiene los datos actualizados enviados desde el frontend
        datos = request.get_json()
        
        # Valida que se hayan enviado datos
        if not datos:
            return jsonify({'ok': False, 'error': 'No hay datos'}), 400
        
        # Crea cursor para ejecutar la actualización
        cursor = mysql.connection.cursor()
        
        # Consulta SQL UPDATE para modificar el equipo
        # SET establece los nuevos valores
        # WHERE id = %s asegura que solo se actualice el equipo específico
        sql = """UPDATE equipos 
                 SET codigo = %s, tipo = %s, marcas = %s, modelo = %s, so = %s, 
                     almacenamiento = %s, ram = %s, estado = %s, mantenimiento = %s
                 WHERE id = %s"""
        
        # Tupla con los nuevos valores a actualizar
        # El último valor es el ID del equipo a modificar
        valores = (
            datos.get('codigo'),
            datos.get('tipo'),
            datos.get('marcas'),
            datos.get('modelo'),
            datos.get('so'),
            datos.get('almacenamiento'),
            datos.get('ram'),
            datos.get('estado'),
            datos.get('mantenimiento'),
            id  # ID del equipo a actualizar
        )
        
        # Ejecuta la consulta UPDATE
        cursor.execute(sql, valores)
        
        # Confirma los cambios en la base de datos
        mysql.connection.commit()
        
        # Cierra el cursor
        cursor.close()
        
        # rowcount indica cuántas filas fueron afectadas
        if cursor.rowcount > 0:
            # Si se actualizó al menos una fila, fue exitoso
            return jsonify({'ok': True, 'mensaje': 'Equipo actualizado exitosamente'}), 200
        else:
            # Si no se actualizó ninguna fila, el equipo no existe
            return jsonify({'ok': False, 'error': 'Equipo no encontrado'}), 404
        
    except Exception as e:
        # Manejo de errores
        print(f"Error: {str(e)}")
        return jsonify({'ok': False, 'error': str(e)}), 500

# ============================================
# API REST - ELIMINAR EQUIPO (DELETE)
# ============================================
# Esta ruta elimina un equipo de la base de datos
# URL: http://tudominio.com/api/equipos/5 (donde 5 es el ID)
# Método: DELETE
# Función: Borra permanentemente un equipo de la tabla 'equipos'
# Entrada: ID del equipo en la URL
# Salida: JSON con estado de éxito o error
@app.route('/api/equipos/<int:id>', methods=['DELETE'])
def eliminar_equipo(id):
    try:
        # Crea cursor para ejecutar la eliminación
        cursor = mysql.connection.cursor()
        
        # Consulta SQL DELETE para borrar el equipo
        # WHERE id = %s asegura que solo se elimine el equipo específico
        sql = "DELETE FROM equipos WHERE id = %s"
        
        # Ejecuta la consulta pasando el ID como parámetro
        cursor.execute(sql, (id,))
        
        # Confirma los cambios (hace permanente la eliminación)
        mysql.connection.commit()
        
        # Cierra el cursor
        cursor.close()
        
        # Retorna respuesta exitosa
        return jsonify({'ok': True, 'mensaje': 'Equipo eliminado exitosamente'}), 200
        
    except Exception as e:
        # Manejo de errores
        print(f"Error: {str(e)}")
        return jsonify({'ok': False, 'error': str(e)}), 500

# ============================================
# PUNTO DE ENTRADA DE LA APLICACIÓN
# ============================================
# Este bloque se ejecuta solo cuando el archivo se ejecuta directamente
# (no cuando se importa como módulo)
if __name__ == '__main__':
    # Obtiene el puerto desde variable de entorno PORT
    # Si no existe, usa el puerto 5000 por defecto
    puerto = int(os.environ.get('PORT', 5000))
    
    # Inicia el servidor Flask
    # host='0.0.0.0': Permite conexiones desde cualquier dirección IP (necesario para AWS)
    # port=puerto: Usa el puerto configurado
    # debug=False: Modo producción (no muestra errores detallados al usuario)
    app.run(host='0.0.0.0', port=puerto, debug=False)