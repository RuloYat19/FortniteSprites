**NOTA**: * -> Dato que depende de calculo mediante una tabla

### Sprites
**Nombre Tabla**: sprits
```json
{
    "nombre": "Espíritu de Agua", // Nombre del espíritu
    "rareza": "Raro", // Rareza del espíritu
    "material": "Normal", // Material del espíritu
    "nombreArchivoImagen": "./imagenesSprites/aguaNormal.png", // Ruta de la imagen
    "yaFueDominado": False, // Si aunque sea 1 vez ya fue dominado y por ende fichado
    "estaDominado": False, // Si en el inventario está en nivel 5
    "estaEnInventario": False, // Si se encuentra en el inventario
    "estaDesbloqueado": False, // Si ya se desbloqueó en el inventario
    "estaEnElJuego": True, // Si está disponible dentro del juego o todavía no
    "nivelEspiritu": 5, // Nivel actual de espíritu
    "temporada": "C7T3", // Temporada del espíritu
    "metodoSubidaNivel": "Abriendo contenedores", // Método para subir de nivel al espíritu
    "polvoAlExtraer": 500, // *Cantidad de Polvo de Espíritu que el espíritu da al ser extraído
    "polvoAlInvocar": 100 // *Cantidad de Polvo de Espíritu que se requiere para invocarlo
}
```

### Polvo al Extraer
**Nombre Tabla**: cantidadPolvoEspirituExtraer
```json
{
    "numeroOrden": 1, // Número de orden para seguir una jerarquía
    "temporada": "C7T3", // Temporada del polvo al extraer
    "rareza": "Raro", // Rareza del espíritu
    "nivelEspiritu": 1, // Nivel del espíritu
    "cantidad": 100, // Cantidad de polvo de espíritu al extraer
}
```

### Polvo al Invocar
**Nombre Tabla**: cantidadPolvoEspirituInvocar
```json
{
    "numeroOrden": 1, // Número de orden para seguir una jerarquía
    "temporada": "C7T3", // Temporada del polvo al invocar
    "material": "Normal", // Material del espíritu
    "rareza": "Raro", // Rareza del espíritu
    "cantidad": 100, // Cantidad de polvo de espíritu al extraer
}
```

### Materiales
**Nombre Tabla**: material
```json
{
    "numeroOrden": 1, // Número de orden para seguir una jerarquía
    "temporada": "C7T3", // Temporada del material
    "nombre": "Normal", // Nombre del Material
}
```

### Nombres de Sprites
**Nombre Tabla**: nombresSprites
```json
{
    "numeroOrden": 1, // Número de orden para seguir una jerarquía
    "temporada": "C7T3", // Temporada del espíritu
    "nombre": "Normal", // Nombre del Sprite
}
```

### Orden de Sprites Default
**Nombre Tabla**: ordenDefault
```json
{
    "numeroOrden": 1, // Número de orden para seguir una jerarquía
    "temporada": "C7T3", // Temporada del espíritu
    "nombre": "Normal", // Nombre del Sprite
}
```

### Orden de Sprites por Rarezas
**Nombre Tabla**: ordenRareza
```json
{
    "numeroOrden": 1, // Número de orden para seguir una jerarquía
    "temporada": "C7T3", // Temporada del espíritu
    "nombre": "Normal", // Nombre del Sprite
}
```