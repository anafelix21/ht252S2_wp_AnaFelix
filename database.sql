-- ============================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS
-- Base de datos: hackaton
-- Tabla: equipos
-- ============================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS hackaton;

-- Usar la base de datos
USE hackaton;

-- Eliminar la tabla si existe (para empezar limpio)
DROP TABLE IF EXISTS equipos;

-- Crear la tabla equipos
CREATE TABLE equipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    marcas VARCHAR(50) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    so VARCHAR(50) NOT NULL,
    almacenamiento INT NOT NULL,
    ram INT NOT NULL,
    estado VARCHAR(50) NOT NULL,
    mantenimiento DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo (opcional)
INSERT INTO equipos (codigo, tipo, marcas, modelo, so, almacenamiento, ram, estado, mantenimiento) VALUES
('EQ001', 'Laptop', 'Dell', 'Latitude 5420', 'Windows 11', 512, 16, 'Activo', '2025-12-20'),
('EQ002', 'Desktop', 'HP', 'EliteDesk 800 G6', 'Windows 10', 1024, 32, 'Activo', '2025-12-25'),
('EQ003', 'Laptop', 'Lenovo', 'ThinkPad X1 Carbon', 'Ubuntu 22.04', 256, 8, 'Mantenimiento', '2025-12-15');

-- Verificar que los datos se insertaron correctamente
SELECT * FROM equipos;
