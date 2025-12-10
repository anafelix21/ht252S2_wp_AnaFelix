// ============================================
// ARCHIVO: equipos.js
// DESCRIPCIÓN: Maneja la funcionalidad de la página de equipos
// FUNCIONES: Listar, editar y eliminar equipos
// ============================================

// ============================================
// VARIABLE GLOBAL - EQUIPO EN EDICIÓN
// ============================================
// Almacena el ID del equipo que está siendo editado actualmente
// Permite identificar qué equipo actualizar cuando se envía el formulario
let equipoEnEdicion = null;

// ============================================
// FUNCIÓN: ABRIR MODAL DE EDICIÓN
// ============================================
// Esta función abre una ventana modal con el formulario de edición
// Carga los datos del equipo seleccionado en los campos del formulario
// 
// Parámetros:
//   - id: ID del equipo a editar
// 
// Proceso:
//   1. Guarda el ID del equipo en edición
//   2. Realiza petición GET a la API para obtener datos del equipo
//   3. Rellena los campos del formulario con los datos obtenidos
//   4. Muestra el modal de edición
function abrirModal(id) {
    // Guarda el ID del equipo que se va a editar
    equipoEnEdicion = id;
    
    // Realiza petición HTTP GET a la API para obtener datos del equipo
    // fetch() es una función moderna para hacer peticiones HTTP
    fetch(`/api/equipos/${id}`)
        // Convierte la respuesta a formato JSON
        .then(response => response.json())
        // Procesa los datos obtenidos
        .then(data => {
            // Verifica que la petición fue exitosa
            if (data.ok) {
                // Guarda los datos del equipo en una variable
                const eq = data.equipo;
                
                // Rellena cada campo del formulario con los datos del equipo
                // || '' asegura que si el valor es null, se muestre vacío
                document.getElementById('editCodigo').value = eq.codigo || '';
                document.getElementById('editTipo').value = eq.tipo || '';
                document.getElementById('editMarcas').value = eq.marcas || '';
                document.getElementById('editModelo').value = eq.modelo || '';
                document.getElementById('editSO').value = eq.so || '';
                document.getElementById('editAlmacenamiento').value = eq.almacenamiento || '';
                document.getElementById('editRam').value = eq.ram || '';
                document.getElementById('editEstado').value = eq.estado || '';
                
                // Para la fecha, toma solo los primeros 10 caracteres (YYYY-MM-DD)
                document.getElementById('editMantenimiento').value = (eq.mantenimiento || '').substring(0, 10);
                
                // Hace visible el modal cambiando su estilo display
                document.getElementById('modalEditar').style.display = 'block';
            }
        })
        // Maneja errores de la petición
        .catch(error => alert('Error al cargar el equipo: ' + error.message));
}

// ============================================
// FUNCIÓN: CERRAR MODAL DE EDICIÓN
// ============================================
// Esta función cierra la ventana modal de edición
// Resetea la variable de equipo en edición
// 
// Proceso:
//   1. Oculta el modal
//   2. Limpia la variable equipoEnEdicion
function cerrarModal() {
    // Oculta el modal cambiando su estilo display a 'none'
    document.getElementById('modalEditar').style.display = 'none';
    
    // Resetea la variable global para indicar que no hay equipo en edición
    equipoEnEdicion = null;
}

// ============================================
// EVENTO: CERRAR MODAL AL HACER CLIC FUERA
// ============================================
// Este evento cierra el modal cuando el usuario hace clic fuera de él
// Mejora la experiencia de usuario proporcionando una forma intuitiva de cerrar
// 
// Funciona capturando clics en cualquier parte de la ventana
// Si el clic fue en el fondo del modal (no en el contenido), cierra el modal
window.onclick = function(event) {
    // Obtiene el elemento del modal
    const modal = document.getElementById('modalEditar');
    
    // Verifica si el clic fue directamente en el fondo del modal
    if (event.target == modal) {
        // Si fue así, cierra el modal
        cerrarModal();
    }
}

// ============================================
// EVENTO: ENVIAR FORMULARIO DE EDICIÓN
// ============================================
// Este evento maneja el envío del formulario de edición
// Realiza una petición PUT a la API para actualizar el equipo
// 
// Proceso:
//   1. Previene el comportamiento por defecto del formulario
//   2. Recopila los datos del formulario
//   3. Envía petición PUT a la API
//   4. Muestra mensaje de éxito o error
//   5. Recarga la página para mostrar cambios
document.getElementById('formEditar').addEventListener('submit', async function(e) {
    // Previene que el formulario se envíe de la forma tradicional
    // Esto permite manejar el envío con JavaScript (AJAX)
    e.preventDefault();
    
    // Crea un objeto con todos los datos del formulario
    // Obtiene el valor de cada campo por su ID
    const datos = {
        codigo: document.getElementById('editCodigo').value,
        tipo: document.getElementById('editTipo').value,
        marcas: document.getElementById('editMarcas').value,
        modelo: document.getElementById('editModelo').value,
        so: document.getElementById('editSO').value,
        almacenamiento: document.getElementById('editAlmacenamiento').value,
        ram: document.getElementById('editRam').value,
        estado: document.getElementById('editEstado').value,
        mantenimiento: document.getElementById('editMantenimiento').value
    };

    try {
        // Realiza petición HTTP PUT para actualizar el equipo
        // await espera a que la petición se complete antes de continuar
        const response = await fetch(`/api/equipos/${equipoEnEdicion}`, {
            method: 'PUT',  // Método HTTP para actualizar
            headers: {'Content-Type': 'application/json'},  // Indica que enviamos JSON
            body: JSON.stringify(datos)  // Convierte el objeto a formato JSON
        });

        // Convierte la respuesta a formato JSON
        const data = await response.json();
        
        // Verifica si la actualización fue exitosa
        if (data.ok) {
            // Muestra mensaje de éxito
            alert('Equipo actualizado exitosamente');
            // Cierra el modal
            cerrarModal();
            // Recarga la página para mostrar los cambios actualizados
            location.reload();
        } else {
            // Si hubo error, muestra el mensaje de error
            alert('Error: ' + (data.error || 'No se pudo actualizar'));
        }
    } catch (error) {
        // Captura errores de red o de JavaScript
        alert('Error: ' + error.message);
    }
});

// ============================================
// FUNCIÓN: ELIMINAR EQUIPO
// ============================================
// Esta función elimina un equipo de la base de datos
// Solicita confirmación antes de realizar la eliminación
// 
// Parámetros:
//   - id: ID del equipo a eliminar
// 
// Proceso:
//   1. Muestra ventana de confirmación
//   2. Si el usuario confirma, envía petición DELETE a la API
//   3. Muestra mensaje de éxito o error
//   4. Recarga la página para actualizar la lista
async function eliminarEquipo(id) {
    // Muestra ventana de confirmación antes de eliminar
    // Retorna true si el usuario acepta, false si cancela
    if (confirm('¿Está seguro de que desea eliminar este equipo?')) {
        try {
            // Realiza petición HTTP DELETE para eliminar el equipo
            const response = await fetch(`/api/equipos/${id}`, {
                method: 'DELETE',  // Método HTTP para eliminar
                headers: {'Content-Type': 'application/json'}
            });

            // Convierte la respuesta a formato JSON
            const data = await response.json();
            
            // Verifica si la eliminación fue exitosa
            if (data.ok) {
                // Muestra mensaje de éxito
                alert('Equipo eliminado exitosamente');
                // Recarga la página para actualizar la lista sin el equipo eliminado
                location.reload();
            } else {
                // Si hubo error, muestra el mensaje de error
                alert('Error: ' + (data.error || 'No se pudo eliminar'));
            }
        } catch (error) {
            // Captura errores de red o de JavaScript
            alert('Error: ' + error.message);
        }
    }
}

// ============================================
// EVENTO: CARGAR EQUIPOS AL ABRIR LA PÁGINA
// ============================================
// Este evento se ejecuta cuando el DOM (estructura HTML) se ha cargado completamente
// Su función principal es obtener todos los equipos desde la API y mostrarlos en una tabla
// 
// Proceso:
//   1. Espera a que la página esté completamente cargada
//   2. Realiza petición GET a la API para obtener todos los equipos
//   3. Genera el HTML de la tabla con los datos
//   4. Inserta la tabla en el contenedor 'listaEquipos'
//   5. Maneja casos sin datos o con errores
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Realiza petición HTTP GET para obtener todos los equipos
        const response = await fetch('/api/equipos', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        
        // Convierte la respuesta a formato JSON
        const data = await response.json();
        
        // Verifica si hay equipos para mostrar
        if (data.ok && data.equipos && data.equipos.length > 0) {
            // ============================================
            // CONSTRUCCIÓN DE LA TABLA HTML
            // ============================================
            // Crea el HTML de la tabla dinámicamente
            
            // Inicia la estructura de la tabla con un contenedor
            let tabla = '<div class="tabla-wrapper"><table>';
            
            // Crea el encabezado de la tabla con los nombres de columnas
            tabla += '<thead><tr>';
            tabla += '<th>Código</th>';
            tabla += '<th>Tipo</th>';
            tabla += '<th>Marca</th>';
            tabla += '<th>Modelo</th>';
            tabla += '<th>SO</th>';
            tabla += '<th>Almacenamiento (GB)</th>';
            tabla += '<th>RAM (GB)</th>';
            tabla += '<th>Estado</th>';
            tabla += '<th>Mantenimiento</th>';
            tabla += '<th>Acciones</th>';
            tabla += '</tr></thead><tbody>';
            
            // ============================================
            // ITERACIÓN SOBRE CADA EQUIPO
            // ============================================
            // Recorre cada equipo y crea una fila en la tabla
            data.equipos.forEach((equipo, index) => {
                // Determina la clase CSS según el estado del equipo
                // Si el estado contiene "activo" o "funcionando", usa clase verde
                // De lo contrario, usa clase roja
                const estado = (equipo.estado || '').toLowerCase();
                const estadoClass = estado.includes('activo') || estado.includes('funcionando') ? 'estado-activo' : 'estado-inactivo';
                
                // Crea una fila para el equipo
                tabla += '<tr>';
                
                // Crea celdas con los datos del equipo
                // || '-' muestra guión si el valor es null o undefined
                tabla += '<td>' + (equipo.codigo || '-') + '</td>';
                tabla += '<td>' + (equipo.tipo || '-') + '</td>';
                tabla += '<td>' + (equipo.marcas || '-') + '</td>';
                tabla += '<td>' + (equipo.modelo || '-') + '</td>';
                tabla += '<td>' + (equipo.so || '-') + '</td>';
                tabla += '<td>' + (equipo.almacenamiento || '-') + '</td>';
                tabla += '<td>' + (equipo.ram || '-') + '</td>';
                
                // Celda del estado con clase CSS dinámica para color
                tabla += '<td><span class="' + estadoClass + '">' + (equipo.estado || '-') + '</span></td>';
                
                // Celda de fecha de mantenimiento (solo primeros 10 caracteres)
                tabla += '<td>' + (equipo.mantenimiento ? equipo.mantenimiento.substring(0, 10) : '-') + '</td>';
                
                // Celda de acciones con botones de editar y eliminar
                tabla += '<td><div class="acciones">';
                tabla += '<button class="btn-accion btn-editar" onclick="abrirModal(' + equipo.id + ')">✏️ Editar</button>';
                tabla += '<button class="btn-accion btn-eliminar" onclick="eliminarEquipo(' + equipo.id + ')">🗑️ Eliminar</button>';
                tabla += '</div></td>';
                
                // Cierra la fila
                tabla += '</tr>';
            });
            
            // Cierra la tabla y agrega contador de equipos
            tabla += '</tbody></table></div>';
            tabla += '<div class="contador">Total de equipos: <strong>' + data.equipos.length + '</strong></div>';
            
            // Inserta la tabla generada en el contenedor HTML
            document.getElementById('listaEquipos').innerHTML = tabla;
        } else {
            // ============================================
            // CASO: NO HAY EQUIPOS
            // ============================================
            // Si no hay equipos, muestra un mensaje informativo
            document.getElementById('listaEquipos').innerHTML = '<div class="sin-datos">ℹ️ No hay equipos registrados aún.</div>';
        }
    } catch (error) {
        // ============================================
        // MANEJO DE ERRORES
        // ============================================
        // Si ocurre algún error al cargar los equipos, muestra mensaje de error
        document.getElementById('listaEquipos').innerHTML = '<div class="sin-datos" style="color: #e74c3c;">❌ Error al cargar los equipos: ' + error.message + '</div>';
    }
});
