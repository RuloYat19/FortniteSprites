IF DB_ID('FORTNITEDB') IS NULL
BEGIN
    CREATE DATABASE FORTNITEDB;
    PRINT 'Base de datos FORTNITEDB creada';
END
GO

USE FORTNITEDB;
GO

-- ============================================
-- TABLA: Sprits
-- ============================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'sprits')
BEGIN
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

    PRINT '✅ Tabla sprits creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla sprits ya existe';
END
GO

-- ============================================
-- TABLA: Material
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'materiales')
BEGIN
    CREATE TABLE materiales (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        nombreMaterial VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    -- Índices
    CREATE INDEX idx_materiales_numeroOrden ON materiales(numeroOrden);
    CREATE INDEX idx_materiales_nombre ON materiales(nombreMaterial);
    
    PRINT '✅ Tabla materiales creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla materiales ya existe';
END
GO

-- ============================================
-- TABLA: Nombre (Sprits)
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'nombres')
BEGIN
    CREATE TABLE nombres (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        nombreSprite VARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    -- Índices
    CREATE INDEX idx_nombres_numeroOrden ON nombres(numeroOrden);
    CREATE INDEX idx_nombres_nombre ON nombres(nombreSprite);
    
    PRINT '✅ Tabla nombres creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla nombres ya existe';
END
GO

-- Verificar que las tablas se crearon
SELECT * FROM sys.tables WHERE name IN ('sprits', 'materiales', 'nombres');
GO