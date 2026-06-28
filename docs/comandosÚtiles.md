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
