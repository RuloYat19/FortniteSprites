## Cosas por Añadir al Programa

```json
{
    "nombre": "Espíritu de Agua", // Nombre del espíritu
    "rareza": "Raro", // Rareza del espíritu
    "material": "Normal", // Material del espíritu
    "nombreArchivoImagen": "./imagenesSprites/aguaNormal.png", // Ruta de la imagen dentro de la carpeta frontend
    "yaFueDominado": False, // Nuevo: Si aunque sea 1 vez ya fue dominado y por ende fichado
    "estaDominado": False, // Nuevo: Si en el inventario está en nivel 5
    "estaEnInventario": False, // Nuevo: Si se encuentra en el inventario
    "estaDesbloqueado": False, // Nuevo: Si ya se desbloqueó en el inventario
    "polvoAlExtraer": 500, // Cantidad de Polvo de Espíritu que el espíritu da al ser extraído
    "polvoAlInvocar": 100 // Cantidad de Polvo de Espíritu que se requiere para invocarlo
}
```

### Cosas que editar
- Hacer un orden en específico para que se muestren los espíritus

### Cosas Nuevas para Añadir
- Mostrar cantidad de Polvo de Espíritu para invocar a los que hacen falta
- Calculadora para indicar cuanto de Polvo de Espíritu se precisa para x cantidad y y tipo de espíritus
- Contador de espíritus extraídos, coleccionados y dominados
- Inventario de cuales se tiene dominados sin importar que estén extraídos
- Generar un backup de los espíritus que se tengan en la base de datos
- Gestión de espíritus para saber cuales tengo para dar y cuales no, y con ello calcular cuanto polvo preciso
