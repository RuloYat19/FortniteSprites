IF DB_ID('FORTNITEDB') IS NULL
BEGIN
    CREATE DATABASE FORTNITEDB;
    PRINT 'Base de datos FORTNITEDB creada';
END
GO

USE FORTNITEDB;
GO

-- Crear la tabla sprits
CREATE TABLE sprits (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    rareza VARCHAR(50) NOT NULL,
    material VARCHAR(50) NOT NULL,
    nombreArchivoImagen VARCHAR(255) NULL,
    yaFueDominado BIT DEFAULT 0,
    estaDominado BIT DEFAULT 0,
    estaEnInventario BIT DEFAULT 0,
    estaDesbloqueado BIT DEFAULT 0,
    polvoAlExtraer INT NULL,
    polvoAlInvocar INT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME NULL
);

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_sprits_nombre ON sprits(nombre);
CREATE INDEX idx_sprits_rareza ON sprits(rareza);
CREATE INDEX idx_sprits_material ON sprits(material);

-- Verificar que la tabla se creó
SELECT * FROM sys.tables WHERE name = 'sprits';
GO