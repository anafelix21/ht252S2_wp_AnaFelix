// ============================================
// ARCHIVO: form.js
// DESCRIPCIÓN: Maneja la funcionalidad del formulario de registro de equipos
// FUNCIONES: Cargar modelos dinámicamente, autocompletar especificaciones
// ============================================

// ============================================
// DICCIONARIO DE MODELOS POR MARCA
// ============================================
// Este objeto contiene todos los modelos disponibles organizados por marca
// Cuando el usuario selecciona una marca, se cargan automáticamente estos modelos
// Estructura: { "marca": ["modelo1", "modelo2", ...] }
const modelosPorMarca = {
    "hp": ["HP 15-ef1xxx", "HP 15-dy1xxx", "HP ProBook 450 G7", "HP ProBook 640 G5", "HP Pavilion 15", "HP Envy 13", "HP ZBook 15"],
    "dell": ["Dell Inspiron 15 3000", "Dell Inspiron 15 5000", "Dell XPS 13", "Dell XPS 15", "Dell Latitude 5520", "Dell Latitude 7420", "Dell Vostro 15"],
    "lenovo": ["Lenovo ThinkPad E15", "Lenovo ThinkPad T14", "Lenovo ThinkPad X1", "Lenovo IdeaPad 5", "Lenovo IdeaPad 3", "Lenovo Legion 5", "Lenovo Yoga 9"],
    "asus": ["ASUS VivoBook 15", "ASUS VivoBook Pro", "ASUS ROG G513", "ASUS ROG Zephyrus", "ASUS ZenBook 13", "ASUS ZenBook 14", "ASUS TUF Gaming"],
    "apple": ["MacBook Air M1", "MacBook Air M2", "MacBook Pro 13", "MacBook Pro 14", "MacBook Pro 16", "iMac 24", "Mac Mini M1"]
};

// ============================================
// DICCIONARIO DE ESPECIFICACIONES POR MODELO
// ============================================
// Este objeto contiene las especificaciones técnicas de cada modelo
// Cuando el usuario selecciona un modelo, los campos RAM y Almacenamiento
// se autocompletan automáticamente con estos valores
// Estructura: { "modelo": { "ram": "GB", "almacenamiento": "GB", "procesador": "tipo" } }
const especificacionesModelo = {
    "HP 15-ef1xxx": { "ram": "8", "almacenamiento": "256", "procesador": "AMD Ryzen 5" },
    "HP 15-dy1xxx": { "ram": "8", "almacenamiento": "256", "procesador": "Intel Core i5" },
    "HP ProBook 450 G7": { "ram": "16", "almacenamiento": "512", "procesador": "Intel Core i7" },
    "HP ProBook 640 G5": { "ram": "16", "almacenamiento": "512", "procesador": "Intel Core i7" },
    "HP Pavilion 15": { "ram": "8", "almacenamiento": "256", "procesador": "Intel Core i5" },
    "HP Envy 13": { "ram": "8", "almacenamiento": "256", "procesador": "Intel Core i5" },
    "HP ZBook 15": { "ram": "16", "almacenamiento": "512", "procesador": "Intel Core i7" },
    "Dell Inspiron 15 3000": { "ram": "4", "almacenamiento": "128", "procesador": "Intel Core i3" },
    "Dell Inspiron 15 5000": { "ram": "8", "almacenamiento": "256", "procesador": "Intel Core i5" },
    "Dell XPS 13": { "ram": "16", "almacenamiento": "512", "procesador": "Intel Core i7" },
    "Dell XPS 15": { "ram": "16", "almacenamiento": "512", "procesador": "Intel Core i7" },
    "Dell Latitude 5520": { "ram": "16", "almacenamiento": "512", "procesador": "Intel Core i7" },
    "Dell Latitude 7420": { "ram": "16", "almacenamiento": "512", "procesador": "Intel Core i7" },
    "Dell Vostro 15": { "ram": "8", "almacenamiento": "256", "procesador": "Intel Core i5" },
    "Lenovo ThinkPad E15": { "ram": "8", "almacenamiento": "256", "procesador": "Intel Core i5" },
    "Lenovo ThinkPad T14": { "ram": "16", "almacenamiento": "512", "procesador": "Intel Core i7" },
    "Lenovo ThinkPad X1": { "ram": "16", "almacenamiento": "512", "procesador": "Intel Core i7" },
    "Lenovo IdeaPad 5": { "ram": "8", "almacenamiento": "256", "procesador": "AMD Ryzen 5" },
    "Lenovo IdeaPad 3": { "ram": "4", "almacenamiento": "128", "procesador": "Intel Core i3" },
    "Lenovo Legion 5": { "ram": "16", "almacenamiento": "512", "procesador": "Intel Core i7" },
    "Lenovo Yoga 9": { "ram": "16", "almacenamiento": "512", "procesador": "Intel Core i7" },
    "ASUS VivoBook 15": { "ram": "8", "almacenamiento": "256", "procesador": "AMD Ryzen 5" },
    "ASUS VivoBook Pro": { "ram": "16", "almacenamiento": "512", "procesador": "Intel Core i7" },
    "ASUS ROG G513": { "ram": "32", "almacenamiento": "1024", "procesador": "Intel Core i9" },
    "ASUS ROG Zephyrus": { "ram": "32", "almacenamiento": "1024", "procesador": "Intel Core i9" },
    "ASUS ZenBook 13": { "ram": "8", "almacenamiento": "256", "procesador": "Intel Core i5" },
    "ASUS ZenBook 14": { "ram": "8", "almacenamiento": "256", "procesador": "Intel Core i5" },
    "ASUS TUF Gaming": { "ram": "16", "almacenamiento": "512", "procesador": "Intel Core i7" },
    "MacBook Air M1": { "ram": "8", "almacenamiento": "256", "procesador": "Apple M1" },
    "MacBook Air M2": { "ram": "8", "almacenamiento": "256", "procesador": "Apple M2" },
    "MacBook Pro 13": { "ram": "16", "almacenamiento": "512", "procesador": "Apple M1" },
    "MacBook Pro 14": { "ram": "16", "almacenamiento": "512", "procesador": "Apple M1 Pro" },
    "MacBook Pro 16": { "ram": "32", "almacenamiento": "1024", "procesador": "Apple M1 Max" },
    "iMac 24": { "ram": "16", "almacenamiento": "512", "procesador": "Apple M1" },
    "Mac Mini M1": { "ram": "8", "almacenamiento": "256", "procesador": "Apple M1" }
};

// ============================================
// ARRAY DE FECHAS DE REGISTRO
// ============================================
// Este array contiene fechas predefinidas para el registro de equipos
// Se usa para poblar el campo de selección de fecha en el formulario
// Facilita la selección de fechas específicas sin necesidad de calendario
const fechasRegistro = [
    "2025-01-01",
    "2025-01-15",
    "2025-02-01",
    "2025-02-15",
    "2025-03-01",
    "2025-03-15",
    "2025-04-01"
];

// ============================================
// EVENTO: CARGAR MODELOS AL CAMBIAR MARCA
// ============================================
// Este evento se dispara cuando el usuario selecciona una marca
// Carga dinámicamente los modelos disponibles para esa marca
// 
// Proceso:
//   1. Captura el valor de la marca seleccionada
//   2. Limpia el select de modelos
//   3. Busca los modelos de esa marca en el diccionario
//   4. Llena el select con los modelos encontrados
document.getElementById("marcas").addEventListener("change", function() {
    // Obtiene el valor de la marca y lo convierte a minúsculas
    const marca = this.value.toLowerCase();
    
    // Obtiene el elemento select de modelos
    const modeloSelect = document.getElementById("modelo");
    
    // Limpia las opciones anteriores, dejando solo la opción por defecto
    modeloSelect.innerHTML = "<option value=\"\">Seleccionar...</option>";
    
    // Verifica si la marca existe en el diccionario y tiene modelos
    if (marca && modelosPorMarca[marca]) {
        // Itera sobre cada modelo de la marca seleccionada
        modelosPorMarca[marca].forEach(modelo => {
            // Crea un nuevo elemento <option>
            const option = document.createElement("option");
            // Establece el valor del option
            option.value = modelo;
            // Establece el texto visible del option
            option.textContent = modelo;
            // Agrega el option al select
            modeloSelect.appendChild(option);
        });
    }
});

// ============================================
// EVENTO: AUTOCOMPLETAR ESPECIFICACIONES AL SELECCIONAR MODELO
// ============================================
// Este evento se dispara cuando el usuario selecciona un modelo
// Autocompleta los campos de RAM y Almacenamiento con valores predefinidos
// Esto agiliza el llenado del formulario y reduce errores
// 
// Proceso:
//   1. Captura el modelo seleccionado
//   2. Busca las especificaciones de ese modelo
//   3. Autocompleta los campos RAM y Almacenamiento
document.getElementById("modelo").addEventListener("change", function() {
    // Obtiene el valor del modelo seleccionado
    const modelo = this.value;
    
    // Busca las especificaciones del modelo en el diccionario
    const specs = especificacionesModelo[modelo];
    
    // Si el modelo tiene especificaciones definidas
    if (specs) {
        // Autocompleta el campo RAM con el valor predefinido
        document.getElementById("ram").value = specs.ram;
        
        // Autocompleta el campo Almacenamiento con el valor predefinido
        document.getElementById("almacenamiento").value = specs.almacenamiento;
    }
});

// ============================================
// EVENTO: INICIALIZACIÓN AL CARGAR LA PÁGINA
// ============================================
// Este evento se ejecuta cuando el DOM está completamente cargado
// Configura valores iniciales y opciones dinámicas del formulario
// 
// Funciones:
//   1. Establece la fecha mínima para el campo de mantenimiento (hoy)
//   2. Llena el select de fechas de registro con opciones predefinidas
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // CONFIGURAR FECHA MÍNIMA DE MANTENIMIENTO
    // ============================================
    // Impide que el usuario seleccione fechas pasadas para mantenimiento
    
    // Obtiene la fecha actual
    const hoy = new Date();
    
    // Convierte la fecha a formato ISO (YYYY-MM-DD) y toma solo la parte de fecha
    const fechaMinima = hoy.toISOString().split('T')[0];
    
    // Establece el atributo 'min' del campo de fecha de mantenimiento
    // Esto deshabilita fechas anteriores a hoy en el selector de fecha
    document.getElementById('mantenimiento').min = fechaMinima;
    
    // ============================================
    // LLENAR SELECT DE FECHAS DE REGISTRO
    // ============================================
    // Carga las fechas predefinidas en el campo de selección
    
    // Obtiene el elemento select de fechas de registro
    const pruebaSelect = document.getElementById('prueba');
    
    // Itera sobre cada fecha del array predefinido
    fechasRegistro.forEach(fecha => {
        // Crea un nuevo elemento <option>
        const option = document.createElement('option');
        // Establece el valor del option con la fecha
        option.value = fecha;
        // Establece el texto visible con la fecha
        option.textContent = fecha;
        // Agrega el option al select
        pruebaSelect.appendChild(option);
    });
});

// Envío del formulario
document.getElementById("equipoForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Obtener fecha actual en formato YYYY-MM-DD
    const hoy = new Date();
    const fechaActual = hoy.toISOString().split('T')[0];
    
    const formData = {
        codigo: document.getElementById("codigo").value,
        tipo: document.getElementById("tipo").value,
        marcas: document.getElementById("marcas").value,
        modelo: document.getElementById("modelo").value,
        so: document.getElementById("so").value,
        almacenamiento: document.getElementById("almacenamiento").value,
        ram: document.getElementById("ram").value,
        estado: document.getElementById("estado").value,
        mantenimiento: document.getElementById("mantenimiento").value,
        fecha_registro: fechaActual
    };

    try {
        const response = await fetch("/api/equipos", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.ok) {
            mostrarMensaje("Equipo registrado exitosamente", "exito");
            document.getElementById("equipoForm").reset();
            document.getElementById("modelo").innerHTML = "<option value=\"\">Seleccionar...</option>";
        } else {
            mostrarMensaje(data.error || "Error al registrar el equipo", "error");
        }
    } catch (error) {
        mostrarMensaje("Error: " + error.message, "error");
    }
});

function mostrarMensaje(texto, tipo) {
    const div = document.getElementById("mensaje");
    div.textContent = texto;
    div.className = "mensaje " + tipo;
    div.style.display = "block";
    setTimeout(() => {div.style.display = "none";}, 3000);
}

// Botón para ver equipos registrados
document.addEventListener('DOMContentLoaded', function() {
    const verEquiposBtn = document.getElementById('verEquiposBtn');
    if (verEquiposBtn) {
        verEquiposBtn.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/equipos', {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                });
                
                const data = await response.json();
                
                if (data.ok && data.equipos) {
                    if (data.equipos.length === 0) {
                        mostrarMensaje('No hay equipos registrados', 'info');
                    } else {
                        window.location.href = '/equipos';
                    }
                } else {
                    mostrarMensaje('Error al obtener los equipos', 'error');
                }
            } catch (error) {
                mostrarMensaje('Error: ' + error.message, 'error');
            }
        });
    }
});
