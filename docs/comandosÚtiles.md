## Para el entorno virtual para el Backend
**Para crear el entorno virtual**
```bash
python3 -m venv venv
```

**Para entrar al entorno virtual**
```bash
source venv/bin/activate
```

**Para instalar las dependencias**
```bash
pip install -r requirements.txt
```

## Para ejecutar el servidor del backend
```bash
uvicorn app.main:app --reload
```

**Para ver las peticiones**
```bash
http://localhost:8000/docs
```

**Para ver los sprits creados**
```bash
http://localhost:8000/api/sprits
```

## Para ejecutar el seed con los datos de los Sprits
```bash
python3 -m app.seed
```

## Para los datos creados de los Sprits
```bash
python3 -m app.limpiarSprits
```

## Ejecutar un script .sql
**Estando en el directorio /database**
```bash
docker exec -i db_fortnite_sprits /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd' -C -d FORTNITEDB < 001_tablas.sql
```

## Ejecutar solamente un container del Docker Compose
```bash
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=YourStrong!Passw0rd' \
   -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
```

## Rehacer la base de datos con cambios en la seed y/o de los atributos
```bash
# 1. Detener todo
docker compose down

# 2. Eliminar el volumen de la base de datos
docker compose down -v

# 3. Reconstruir todo
docker compose up -d --build

# 4. Crear la base de datos
docker exec -it db_fortnite_sprits /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd' -C -Q "CREATE DATABASE FORTNITEDB"

# 5. Verificar que la base de datos se creó
docker exec -it db_fortnite_sprits /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd' -C -Q "SELECT name FROM sys.databases WHERE name = 'FORTNITEDB'"

# 6. Ejecutar el script de creación de tablas
docker exec -i db_fortnite_sprits /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd' -C -d FORTNITEDB < database/001_tablas.sql

# 7. Verificar que la tabla se creó
docker exec -it db_fortnite_sprits /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd' -C -d FORTNITEDB -Q "SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'sprits' ORDER BY ORDINAL_POSITION"

# 6. Ejecutar el seed
docker exec -it backend_fortnite_sprits python -m app.seed
```

## Para detener o parar un momento los contenedores
```bash
# Para apagar sin perder datos
docker compose down

# Para iniciar de nuevo después de down
docker compose up -d

# Para solo pausar
docker compose stop

# Para iniciar de nuevo después de stop
docker compose start
```