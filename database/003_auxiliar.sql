USE FORTNITEDB;
GO

-- Agregar columnas a sprits
ALTER TABLE sprits ADD estaEnElJuego BIT DEFAULT 1;
ALTER TABLE sprits ADD temporada VARCHAR(20) NULL;
ALTER TABLE sprits ADD metodoSubidaNivel VARCHAR(100) NULL;

-- Agregar columnas a cantidadPolvoEspirituExtraer
ALTER TABLE cantidadPolvoEspirituExtraer ADD temporada VARCHAR(20) NULL;

-- Agregar columnas a cantidadPolvoEspirituInvocar
ALTER TABLE cantidadPolvoEspirituInvocar ADD temporada VARCHAR(20) NULL;

-- Agregar columnas a material
ALTER TABLE material ADD temporada VARCHAR(20) NULL;

-- Agregar columnas a nombresSprites
ALTER TABLE nombresSprites ADD temporada VARCHAR(20) NULL;

-- Agregar columnas a ordenDefault
ALTER TABLE ordenDefault ADD temporada VARCHAR(20) NULL;

-- Agregar columnas a ordenRareza
ALTER TABLE ordenRareza ADD temporada VARCHAR(20) NULL;

-- Actualizar temporada existente
UPDATE sprits SET temporada = 'C7T3' WHERE temporada IS NULL;
UPDATE cantidadPolvoEspirituExtraer SET temporada = 'C7T3' WHERE temporada IS NULL;
UPDATE cantidadPolvoEspirituInvocar SET temporada = 'C7T3' WHERE temporada IS NULL;
UPDATE material SET temporada = 'C7T3' WHERE temporada IS NULL;
UPDATE nombresSprites SET temporada = 'C7T3' WHERE temporada IS NULL;
UPDATE ordenDefault SET temporada = 'C7T3' WHERE temporada IS NULL;
UPDATE ordenRareza SET temporada = 'C7T3' WHERE temporada IS NULL;

PRINT '✅ Migración completada';
GO