from app.database import SessionLocal
from app.models import Sprit

def eliminarDatosSprits():
    db = SessionLocal()
    try:
        # Contar cuántos hay antes de eliminar
        count = db.query(Sprit).count()
        print(f"Hay {count} sprits en la base de datos")
        
        if count == 0:
            print("No hay sprits para eliminar")
            return
        
        # Preguntar confirmación
        respuesta = input(f"¿Estás seguro de eliminar todos los {count} sprits? (s/n): ")
        if respuesta.lower() != 's':
            print("Operación cancelada")
            return
        
        # Eliminar todos
        deleted = db.query(Sprit).delete()
        db.commit()
        print(f"Se ha eliminado {deleted} sprits exitosamente")
        
    except Exception as e:
        db.rollback()
        print(f"Hubo problemas al eliminar sprits: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    eliminarDatosSprits()