import { Link, useNavigate } from 'react-router-dom';
import '../Inicio.css';
import './InicioDroidTycoon.css';

const opciones = [
  {
    titulo: 'Ventajas de Droides',
    descripcion: 'Consulta las ventajas generales e icónicas.',
    icono: '✨',
  },
  {
    titulo: 'Renacimientos',
    descripcion: 'Revisa los ciclos y requisitos de renacimiento.',
    icono: '♻️',
  },
  {
    titulo: 'Fusiones',
    descripcion: 'Explora las combinaciones y reglas de fusión.',
    icono: '🔗',
  },
];

function InicioDroidTycoon() {
  const navigate = useNavigate();

  return (
    <main className="inicio-container inicio-droid-tycoon">
      <button
        type="button"
        className="inicio-droid-tycoon-back"
        onClick={() => navigate('/')}
      >
        ← Programas
      </button>

      <h1>Droid Tycoon</h1>

      <div className="inicio-cards">
        <Link to="/droid-tycoon/droidex" className="inicio-card">
          <div className="inicio-card-image">
            <img src="/imagenesGeneral/LogoDroidTycoon.png" alt="" />
          </div>
          <div className="inicio-card-content">
            <h3>Droidex y Scourgedex</h3>
            <p>Explora y completa tu colección de droides.</p>
          </div>
        </Link>

        <Link to="/droid-tycoon/administrador" className="inicio-card">
          <div className="inicio-card-image inicio-droid-tycoon-option-icon">
            <span aria-hidden="true">⚙️</span>
          </div>
          <div className="inicio-card-content">
            <h3>Administrar Droid Tycoon</h3>
            <p>Gestiona nombres, materiales, rarezas y costos.</p>
          </div>
        </Link>

        {opciones.map((opcion) => (
          <article className="inicio-card inicio-droid-tycoon-pending" key={opcion.titulo}>
            <div className="inicio-card-image inicio-droid-tycoon-option-icon">
              <span aria-hidden="true">{opcion.icono}</span>
            </div>
            <div className="inicio-card-content">
              <h3>{opcion.titulo}</h3>
              <p>{opcion.descripcion}</p>
              <span className="inicio-droid-tycoon-badge">Próximamente</span>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export default InicioDroidTycoon;
