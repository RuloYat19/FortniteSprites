// frontend/src/components/Administrador/Administrador.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PolvoEspirituAdmin from './PolvoEspirituAdmin';
import MaterialesAdmin from './MaterialesAdmin';
import NombresSpritesAdmin from './NombresSpritesAdmin';
import OrdenesAdmin from './OrdenesAdmin';
import './Administrador.css';

function Administrador() {
  const navigate = useNavigate();
  
  // 🔵 Estado para la sección activa
  const [seccionActiva, setSeccionActiva] = useState('polvo');

  // 🔵 Renderizar la sección activa
  const renderSeccion = () => {
    switch(seccionActiva) {
      case 'materiales':
        return <MaterialesAdmin />;
      case 'nombres':
        return <NombresSpritesAdmin />;
      case 'ordenes':
        return <OrdenesAdmin />;
      case 'polvo':
      default:
        return <PolvoEspirituAdmin />;
    }
  };

  return (
    <div className="admin-container">
      {/* 🔵 BARRA LATERAL */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-icon">⚙️</span>
          <h2>Panel Admin</h2>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">📊 Módulos</div>
            <ul>
              {/* 🔵 Sección de Polvo de Espíritu */}
              <li 
                className={seccionActiva === 'polvo' ? 'active' : ''}
                onClick={() => setSeccionActiva('polvo')}
              >
                <img 
                  src="/imagenesSprites/polvoEspiritu.png" 
                  alt="Polvo de Espíritu"
                  className="nav-icon-img"
                />
                <span>Polvo de Espíritu</span>
              </li>

              {/* 🔵 Sección de Materiales */}
              <li 
                className={seccionActiva === 'materiales' ? 'active' : ''}
                onClick={() => setSeccionActiva('materiales')}
              >
                <span className="nav-icon">📦</span>
                <span>Materiales</span>
              </li>

              {/* 🔵 Sección de Nombres de Sprites */}
              <li 
                className={seccionActiva === 'nombres' ? 'active' : ''}
                onClick={() => setSeccionActiva('nombres')}
              >
                <span className="nav-icon">📝</span>
                <span>Nombres de Sprites</span>
              </li>

              {/* 🔵 Sección de Órdenes - NUEVA */}
              <li 
                className={seccionActiva === 'ordenes' ? 'active' : ''}
                onClick={() => setSeccionActiva('ordenes')}
              >
                <span className="nav-icon">📋</span>
                <span>Órdenes</span>
              </li>
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button 
            className="btn-volver-sidebar"
            onClick={() => navigate('/')}
          >
            ← Regresar a Inicio
          </button>
        </div>
      </aside>

      {/* 🔵 CONTENIDO PRINCIPAL */}
      {renderSeccion()}
    </div>
  );
}

export default Administrador;