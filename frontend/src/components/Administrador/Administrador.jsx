import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PolvoEspirituAdmin from './PolvoEspirituAdmin';
import PolvoInvocarAdmin from './PolvoInvocarAdmin';
import MaterialesAdmin from './MaterialesAdmin';
import NombresSpritesAdmin from './NombresSpritesAdmin';
import OrdenesAdmin from './OrdenesAdmin';
import BackupAdmin from './BackupAdmin';
import './Administrador.css';

function Administrador() {
  const navigate = useNavigate();
  
  const [seccionActiva, setSeccionActiva] = useState('polvo-extraer');

  const renderSeccion = () => {
    switch(seccionActiva) {
      case 'polvo-extraer':
        return <PolvoEspirituAdmin />;
      case 'polvo-invocar':
        return <PolvoInvocarAdmin />;
      case 'materiales':
        return <MaterialesAdmin />;
      case 'nombres':
        return <NombresSpritesAdmin />;
      case 'ordenes':
        return <OrdenesAdmin />;
      case 'backup':
        return <BackupAdmin />;
      default:
        return <PolvoEspirituAdmin />;
    }
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-icon">⚙️</span>
          <h2>Panel Admin</h2>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">📊 Módulos</div>
            <ul>
              {/* 🔵 Polvo al Extraer */}
              <li 
                className={seccionActiva === 'polvo-extraer' ? 'active' : ''}
                onClick={() => setSeccionActiva('polvo-extraer')}
              >
                <img 
                  src="/imagenesSprites/polvoEspiritu.png" 
                  alt="Polvo al Extraer"
                  className="nav-icon-img"
                />
                <span>Polvo al Extraer</span>
              </li>

              {/* 🔵 Polvo al Invocar*/}
              <li 
                className={seccionActiva === 'polvo-invocar' ? 'active' : ''}
                onClick={() => setSeccionActiva('polvo-invocar')}
              >
                <img 
                  src="/imagenesSprites/polvoEspiritu.png" 
                  alt="Polvo al Invocar"
                  className="nav-icon-img"
                />
                <span>Polvo al Invocar</span>
              </li>

              {/* 🔵 Materiales */}
              <li 
                className={seccionActiva === 'materiales' ? 'active' : ''}
                onClick={() => setSeccionActiva('materiales')}
              >
                <span className="nav-icon">📦</span>
                <span>Materiales</span>
              </li>

              {/* 🔵 Nombres de Sprites */}
              <li 
                className={seccionActiva === 'nombres' ? 'active' : ''}
                onClick={() => setSeccionActiva('nombres')}
              >
                <span className="nav-icon">📝</span>
                <span>Nombres de Sprites</span>
              </li>

              {/* 🔵 Órdenes */}
              <li 
                className={seccionActiva === 'ordenes' ? 'active' : ''}
                onClick={() => setSeccionActiva('ordenes')}
              >
                <span className="nav-icon">📋</span>
                <span>Órdenes</span>
              </li>

              {/* 🔵 Backup */}
              <li 
                className={seccionActiva === 'backup' ? 'active' : ''}
                onClick={() => setSeccionActiva('backup')}
              >
                <span className="nav-icon">💾</span>
                <span>Backup</span>
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

      {renderSeccion()}
    </div>
  );
}

export default Administrador;