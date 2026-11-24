-- database/001_tablas.sql

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
        estaEnElJuego BIT DEFAULT 1,
        temporada VARCHAR(20) NULL,
        metodoSubidaNivel VARCHAR(100) NULL,
        nivelEspiritu INT NULL,
        polvoAlExtraer INT NULL,
        polvoAlInvocar INT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );

    CREATE INDEX idx_sprits_nombre ON sprits(nombre);
    CREATE INDEX idx_sprits_rareza ON sprits(rareza);
    CREATE INDEX idx_sprits_material ON sprits(material);
    CREATE INDEX idx_sprits_temporada ON sprits(temporada);

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
        temporada VARCHAR(20) NULL,
        material VARCHAR(50) NOT NULL,
        rareza VARCHAR(50) NOT NULL,
        nivelEspiritu INT NOT NULL,
        cantidad INT NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    CREATE INDEX idx_cantidadPolvoEspirituExtraer_material ON cantidadPolvoEspirituExtraer(material);
    CREATE INDEX idx_cantidadPolvoEspirituExtraer_rareza ON cantidadPolvoEspirituExtraer(rareza);
    CREATE INDEX idx_cantidadPolvoEspirituExtraer_nivelEspiritu ON cantidadPolvoEspirituExtraer(nivelEspiritu);
    CREATE INDEX idx_cantidadPolvoEspirituExtraer_cantidad ON cantidadPolvoEspirituExtraer(cantidad);
    CREATE INDEX idx_cantidadPolvoEspirituExtraer_temporada ON cantidadPolvoEspirituExtraer(temporada);
    
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
        temporada VARCHAR(20) NULL,
        material VARCHAR(50) NOT NULL,
        rareza VARCHAR(50) NOT NULL,
        cantidad INT NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    CREATE INDEX idx_cantidadPolvoEspirituInvocar_material ON cantidadPolvoEspirituInvocar(material);
    CREATE INDEX idx_cantidadPolvoEspirituInvocar_rareza ON cantidadPolvoEspirituInvocar(rareza);
    CREATE INDEX idx_cantidadPolvoEspirituInvocar_cantidad ON cantidadPolvoEspirituInvocar(cantidad);
    CREATE INDEX idx_cantidadPolvoEspirituInvocar_temporada ON cantidadPolvoEspirituInvocar(temporada);
    
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
        temporada VARCHAR(20) NULL,
        nombre VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    CREATE INDEX idx_material_nombre ON material(nombre);
    CREATE INDEX idx_material_temporada ON material(temporada);
    
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
        temporada VARCHAR(20) NULL,
        nombre VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    CREATE INDEX idx_nombresSprites_nombre ON nombresSprites(nombre);
    CREATE INDEX idx_nombresSprites_temporada ON nombresSprites(temporada);
    
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
        temporada VARCHAR(20) NULL,
        nombre VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    CREATE INDEX idx_ordenDefault_nombre ON ordenDefault(nombre);
    CREATE INDEX idx_ordenDefault_temporada ON ordenDefault(temporada);
    
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
        temporada VARCHAR(20) NULL,
        nombre VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    CREATE INDEX idx_ordenRareza_nombre ON ordenRareza(nombre);
    CREATE INDEX idx_ordenRareza_temporada ON ordenRareza(temporada);
    
    PRINT '✅ Tabla ordenRareza creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla ordenRareza ya existe';
END
GO

-- ================================================
-- TABLA: Método de Subida de Nivel para los Espíritus
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'metodoSubidaNivel')
BEGIN
    CREATE TABLE metodoSubidaNivel (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        nombre VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    CREATE INDEX idx_metodoSubidaNivel_nombre ON metodoSubidaNivel(nombre);
    
    PRINT '✅ Tabla metodoSubidaNivel creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla metodoSubidaNivel ya existe';
END
GO

-- ================================================================================================

-- ================================================
-- TABLA: Droide
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'droide')
BEGIN
    CREATE TABLE droide (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        clase VARCHAR(50) NOT NULL,
        rareza VARCHAR(50) NOT NULL,
        estaImpecable BIT DEFAULT 0,
        estaEnScourgedex BIT DEFAULT 0,
        nombreArchivoImagen VARCHAR(255) NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );

    CREATE INDEX idx_droides_nombre ON droide(nombre);
    CREATE INDEX idx_droides_clase ON droide(clase);
    CREATE INDEX idx_droides_rareza ON droide(rareza);

    PRINT '✅ Tabla droide creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla droide ya existe';
END
GO

-- ================================================
-- TABLA: Material de Droide
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'materialDroide')
BEGIN
    CREATE TABLE materialDroide (
        id INT IDENTITY(1,1) PRIMARY KEY,
        droide_id INT NOT NULL,
        numeroOrden INT NOT NULL,
        material VARCHAR(50) NOT NULL,
        multiplicador INT NOT NULL,
        estaEnInventario BIT DEFAULT 0,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL,
        CONSTRAINT FK_materialDroide_droide FOREIGN KEY (droide_id) REFERENCES droide(id) ON DELETE CASCADE
    );
    
    CREATE INDEX idx_materialDroide_droide_id ON materialDroide(droide_id);
    CREATE INDEX idx_materialDroide_material ON materialDroide(material);
    
    PRINT '✅ Tabla materialDroide creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla materialDroide ya existe';
END
GO

-- ================================================
-- TABLA: Materiales de los Droides
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'materialDroidTycoon')
BEGIN
    CREATE TABLE materialDroidTycoon (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        material VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );

    CREATE INDEX idx_materialDroidTycoon_material ON materialDroidTycoon(material);

    PRINT '✅ Tabla materialDroidTycoon creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla materialDroidTycoon ya existe';
END
GO

INSERT INTO materialDroidTycoon (numeroOrden, material)
SELECT materiales.numeroOrden, materiales.material
FROM (VALUES
    (1, 'BASE'),
    (2, 'GOLD'),
    (3, 'DIA'),
    (4, 'RBW'),
    (5, 'BSK'),
    (6, 'GLC'),
    (7, 'STL'),
    (8, 'KYB'),
    (9, 'SCR')
) AS materiales(numeroOrden, material)
WHERE NOT EXISTS (
    SELECT 1
    FROM materialDroidTycoon AS existente
    WHERE existente.material = materiales.material
);
GO

-- ================================================
-- TABLA: Nombre de Droide
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'nombreDroide')
BEGIN
    CREATE TABLE nombreDroide (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        nombre VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    CREATE INDEX idx_nombreDroide_nombre ON nombreDroide(nombre);
    
    PRINT '✅ Tabla nombreDroide creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla nombreDroide ya existe';
END
GO

-- ================================================
-- TABLA: Rareza de Droide
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'rarezaDroide')
BEGIN
    CREATE TABLE rarezaDroide (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        nombre VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    CREATE INDEX idx_rarezaDroide_nombre ON rarezaDroide(nombre);
    
    PRINT '✅ Tabla rarezaDroide creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla rarezaDroide ya existe';
END
GO

-- ================================================
-- TABLA: Creditos por Segundo
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'creditosPorSegundo')
BEGIN
    CREATE TABLE creditosPorSegundo (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        nombreDroide VARCHAR(50) NOT NULL,
        cantidadPredeterminada INT NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );

    CREATE INDEX idx_creditosPorSegundo_nombreDroide ON creditosPorSegundo(nombreDroide);
    
    PRINT '✅ Tabla creditosPorSegundo creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla creditosPorSegundo ya existe';
END
GO

-- ================================================
-- TABLA: Chips al Vender a X Droide
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'chipsVentaDroide')
BEGIN
    CREATE TABLE chipsVentaDroide (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        rareza VARCHAR(50) NOT NULL,
        material VARCHAR(50) NOT NULL,
        cantidad INT NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );

    CREATE INDEX idx_chipsVentaDroide_rareza ON chipsVentaDroide(rareza);
    CREATE INDEX idx_chipsVentaDroide_material ON chipsVentaDroide(material);
    
    PRINT '✅ Tabla chipsVentaDroide creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla chipsVentaDroide ya existe';
END
GO

-- ================================================
-- TABLA: Kyber para Activar un Droide
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'kyberActivarDroide')
BEGIN
    CREATE TABLE kyberActivarDroide (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        rareza VARCHAR(50) NOT NULL,
        cantidad INT NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );

    CREATE INDEX idx_kyberActivarDroide_rareza ON kyberActivarDroide(rareza);
    
    PRINT '✅ Tabla kyberActivarDroide creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla kyberActivarDroide ya existe';
END
GO

-- ================================================
-- TABLA: Ventajas de los Droides
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ventajaDroide')
BEGIN
    CREATE TABLE ventajaDroide (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        nombreVentaja VARCHAR(50) NOT NULL,
        nombreDroide VARCHAR(50) NOT NULL,
        rareza VARCHAR(50) NOT NULL,
        descripción VARCHAR(275) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );
    
    CREATE INDEX idx_ventajaDroide_nombreVentaja ON ventajaDroide(nombreVentaja);
    CREATE INDEX idx_ventajaDroide_nombreDroide ON ventajaDroide(nombreDroide);
    CREATE INDEX idx_ventajaDroide_rareza ON ventajaDroide(rareza);
    CREATE INDEX idx_ventajaDroide_descripción ON ventajaDroide(descripción);
    
    PRINT '✅ Tabla ventajaDroide creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla ventajaDroide ya existe';
END
GO

-- ================================================
-- TABLA: Renacimientos
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'renacimiento')
BEGIN
    CREATE TABLE renacimiento (
        id INT IDENTITY(1,1) PRIMARY KEY,
        ciclo INT NOT NULL,
        numeroOrden INT NOT NULL,
        cantidadCreditos INT NOT NULL,
        droide1 VARCHAR(50) NOT NULL,
        material1 VARCHAR(50) NOT NULL,
        sePuedeVenderDroide1 BIT DEFAULT 0,
        droide2 VARCHAR(50) NOT NULL,
        material2 VARCHAR(50) NOT NULL,
        sePuedeVenderDroide2 BIT DEFAULT 0,
        droide3 VARCHAR(50) NOT NULL,
        material3 VARCHAR(50) NOT NULL,
        sePuedeVenderDroide3 BIT DEFAULT 0,
        cantidadCristalesNovaRenacimiento INT NOT NULL,
        cantidadCristalesNovaSuperRenacimiento INT NOT NULL,
        cantidadAumentadaCreditos INT NOT NULL,
        cantidadAumentadaXP INT NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );

    CREATE INDEX idx_renacimiento_droide1 ON renacimiento(droide1);
    CREATE INDEX idx_renacimiento_material1 ON renacimiento(material1);
    CREATE INDEX idx_renacimiento_droide2 ON renacimiento(droide2);
    CREATE INDEX idx_renacimiento_material2 ON renacimiento(material2);
    CREATE INDEX idx_renacimiento_droide3 ON renacimiento(droide3);
    CREATE INDEX idx_renacimiento_material3 ON renacimiento(material3);
    
    PRINT '✅ Tabla renacimiento creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla renacimiento ya existe';
END
GO

-- ================================================
-- TABLA: Fusiones
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'fusion')
BEGIN
    CREATE TABLE fusion (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        droide1 VARCHAR(50) NOT NULL,
        droide2 VARCHAR(50) NOT NULL,
        droide3 VARCHAR(50) NOT NULL,
        droideResultante VARCHAR(50) NOT NULL,
        rarezaResultante VARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );

    CREATE INDEX idx_fusion_droide1 ON fusion(droide1);
    CREATE INDEX idx_fusion_droide2 ON fusion(droide2);
    CREATE INDEX idx_fusion_droide3 ON fusion(droide3);
    CREATE INDEX idx_fusion_droideResultante ON fusion(droideResultante);
    CREATE INDEX idx_fusion_rarezaResultante ON fusion(rarezaResultante);
    
    PRINT '✅ Tabla fusion creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla fusion ya existe';
END
GO

-- ================================================
-- TABLA: Reglas de fusión
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'reglaFusion')
BEGIN
    CREATE TABLE reglaFusion (
        id INT IDENTITY(1,1) PRIMARY KEY,
        numeroOrden INT NOT NULL,
        descripcion VARCHAR(350) NOT NULL,
        created_at DATETIME DEFAULT GETDATE(),
        updated_at DATETIME NULL
    );

    CREATE INDEX idx_reglaFusion_descripcion ON reglaFusion(descripcion);
    
    PRINT '✅ Tabla reglaFusion creada';
END
ELSE
BEGIN
    PRINT '⚠️ Tabla reglaFusion ya existe';
END
GO

-- ================================================================================================

-- ================================================
-- VERIFICAR TABLAS CREADAS
-- ================================================
SELECT name FROM sys.tables 
WHERE name IN ('sprits', 'cantidadPolvoEspirituExtraer', 'cantidadPolvoEspirituInvocar', 'material', 'nombresSprites', 'ordenDefault', 'ordenRareza', 'metodoSubidaNivel');
GO