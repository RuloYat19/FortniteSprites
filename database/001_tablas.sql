IF DB_ID('FORTNITEDB') IS NULL
BEGIN
    CREATE DATABASE FORTNITEDB;
    PRINT 'Base de datos FORTNITEDB creada';
END
GO

USE FORTNITEDB;
GO

-- ================================================
-- TABLA: Sprits
-- ================================================

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
        nivelEspiritu INT NULL,
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

-- ================================================
-- TABLA: Cantidad de Polvo de Espíritu al Extraer
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'cantidadPolvoEspirituExtraer')
BEGIN
    CREATE TABLE cantidadPolvoEspirituExtraer (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        rareza VARCHAR(50) NOT NULL,
        nivelEspiritu INT NOT NULL,
        cantidad INT NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    -- Índices
    CREATE INDEX idx_cantidadPolvoEspirituExtraer_rareza ON cantidadPolvoEspirituExtraer(rareza);
    CREATE INDEX idx_cantidadPolvoEspirituExtraer_nivelEspiritu ON cantidadPolvoEspirituExtraer(nivelEspiritu);
    CREATE INDEX idx_cantidadPolvoEspirituExtraer_cantidad ON cantidadPolvoEspirituExtraer(cantidad);
    
    PRINT '✅ Tabla cantidadPolvoEspirituExtraer creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla cantidadPolvoEspirituExtraer ya existe';
END
GO

-- ================================================
-- TABLA: Cantidad de Polvo de Espíritu al Invocar
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'cantidadPolvoEspirituInvocar')
BEGIN
    CREATE TABLE cantidadPolvoEspirituInvocar (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        material VARCHAR(50) NOT NULL,
        rareza VARCHAR(50) NOT NULL,
        cantidad INT NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    -- Índices
    CREATE INDEX idx_cantidadPolvoEspirituInvocar_material ON cantidadPolvoEspirituInvocar(material);
    CREATE INDEX idx_cantidadPolvoEspirituInvocar_rareza ON cantidadPolvoEspirituInvocar(rareza);
    CREATE INDEX idx_cantidadPolvoEspirituInvocar_cantidad ON cantidadPolvoEspirituInvocar(cantidad);
    
    PRINT '✅ Tabla cantidadPolvoEspirituInvocar creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla cantidadPolvoEspirituInvocar ya existe';
END
GO

-- ================================================
-- TABLA: Material
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'material')
BEGIN
    CREATE TABLE material (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        nombre VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    -- Índices
    CREATE INDEX idx_material_nombre ON material(nombre);
    
    PRINT '✅ Tabla material creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla material ya existe';
END
GO

-- ================================================
-- TABLA: Nombres de Sprites
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'nombresSprites')
BEGIN
    CREATE TABLE nombresSprites (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        nombre VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    -- Índices
    CREATE INDEX idx_nombresSprites_nombre ON nombresSprites(nombre);
    
    PRINT '✅ Tabla nombresSprites creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla nombresSprites ya existe';
END
GO

-- ================================================
-- TABLA: Orden de Sprites Default
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ordenDefault')
BEGIN
    CREATE TABLE ordenDefault (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        nombre VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    -- Índices
    CREATE INDEX idx_ordenDefault_nombre ON ordenDefault(nombre);
    
    PRINT '✅ Tabla ordenDefault creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla ordenDefault ya existe';
END
GO

-- ================================================
-- TABLA: Orden de Sprites por Rarezas
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ordenRareza')
BEGIN
    CREATE TABLE ordenRareza (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        nombre VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    -- Índices
    CREATE INDEX idx_ordenRareza_nombre ON ordenRareza(nombre);
    
    PRINT '✅ Tabla ordenRareza creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla ordenRareza ya existe';
END
GO

-- Verificar que las tablas se crearon
SELECT * FROM sys.tables WHERE name IN ('sprits', 'cantidadPolvoEspiritu', 'material', 'nombresSprites', 'ordenDefault', 'ordenRarezas', 'ordenMateriales');
GO