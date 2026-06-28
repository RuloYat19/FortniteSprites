// frontend/src/components/SpritsList.jsx
import React, { useState, useEffect } from 'react';
import { spritsService } from '../services/api';
import './SpritsList.css';

function SpritsList() {
  const [sprits, setSprits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ 
    rareza: '', 
    material: '',
    nombre: ''
  });

  useEffect(() => {
    cargarSprits();
  }, []);

  const cargarSprits = async () => {
    try {
      setLoading(true);
      const response = await spritsService.getAll();
      setSprits(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los sprits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Manejar clic en la imagen (toggle inventario o resetear si está dominado)
  const handleImageClick = async (id) => {
    try {
      const spritActual = sprits.find(s => s.id === id);
      
      // Si está dominado, resetear todo (dominado: false, inventario: false)
      if (spritActual?.estaDominado) {
        setSprits(prevSprits => 
          prevSprits.map(sprit => 
            sprit.id === id 
              ? { ...sprit, estaDominado: false, estaEnInventario: false }
              : sprit
          )
        );
        
        // Actualizar en el backend ambos campos
        await spritsService.update(id, {
          estaDominado: false,
          estaEnInventario: false
        });
        return;
      }
      
      // Si NO está dominado, alternar inventario
      setSprits(prevSprits => 
        prevSprits.map(sprit => 
          sprit.id === id 
            ? { ...sprit, estaEnInventario: !sprit.estaEnInventario }
            : sprit
        )
      );
      
      await spritsService.toggleInventario(id);
    } catch (err) {
      console.error('Error al manejar clic en imagen:', err);
      cargarSprits();
    }
  };

  // 🔵 Toggle de dominado (hacer clic en la corona cuando está en inventario)
  const toggleDominado = async (id, e) => {
    e.stopPropagation();
    
    try {
      setSprits(prevSprits => 
        prevSprits.map(sprit => 
          sprit.id === id 
            ? { ...sprit, estaDominado: !sprit.estaDominado }
            : sprit
        )
      );
      
      await spritsService.toggleDominado(id);
    } catch (err) {
      console.error('Error al alternar dominado:', err);
      cargarSprits();
    }
  };

  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value
    });
  };

  const limpiarFiltros = () => {
    setFiltros({ 
      rareza: '', 
      material: '',
      nombre: ''
    });
  };

  const nombresDisponibles = [
    'Espíritu de Agua',
    'Espíritu de Tierra',
    'Espíritu de Fuego',
    'Espíritu Pato',
    'Espíritu Fantasmal',
    'Espíritu Demoníaco',
    'Espíritu Rey',
    'Espíritu Dormilón',
    'Espíritu Punk',
    'Espíritu del Punto Cero',
    'Cacahuate Tostado'
  ];

  const spritsFiltrados = sprits.filter(sprit => {
    if (filtros.rareza && sprit.rareza !== filtros.rareza) return false;
    if (filtros.material && sprit.material !== filtros.material) return false;
    if (filtros.nombre && sprit.nombre !== filtros.nombre) return false;
    return true;
  });

  if (loading) return <div className="loading">Cargando sprits...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="sprits-container">
      <h1>Sprits de Fortnite</h1>
      
      <div className="filtros">
        <select 
          name="nombre" 
          value={filtros.nombre} 
          onChange={handleFiltroChange}
        >
          <option value="">Todos los nombres</option>
          {nombresDisponibles.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>

        <select name="rareza" value={filtros.rareza} onChange={handleFiltroChange}>
          <option value="">Todas las rarezas</option>
          <option value="Raro">Raro</option>
          <option value="Épico">Épico</option>
          <option value="Legendario">Legendario</option>
          <option value="Mítico">Mítico</option>
        </select>
        
        <select name="material" value={filtros.material} onChange={handleFiltroChange}>
          <option value="">Todos los materiales</option>
          <option value="Normal">Normal</option>
          <option value="Oro">Oro</option>
          <option value="Gomita">Gomita</option>
          <option value="Galaxia">Galaxia</option>
        </select>
        
        <button onClick={limpiarFiltros}>
          Limpiar filtros
        </button>
      </div>

      <div className="sprits-grid">
        {spritsFiltrados.map((sprit) => (
          <div 
            key={sprit.id} 
            className={`sprit-card ${sprit.estaEnInventario ? 'inventario' : ''} ${sprit.estaDominado ? 'dominado' : ''}`}
          >
            {/* 🔵 Imagen (click para toggle inventario / resetear si está dominado) */}
            <div 
              className="sprit-image-wrapper"
              onClick={() => handleImageClick(sprit.id)}
            >
              {sprit.nombreArchivoImagen ? (
                <img 
                  src={sprit.nombreArchivoImagen} 
                  alt={sprit.nombre}
                  className="sprit-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/200/16213e/ffffff?text=Sin+imagen';
                  }}
                />
              ) : (
                <div className="sprit-img-placeholder">
                  🖼️ Sin imagen
                </div>
              )}
              
              {/* 🔵 Corona centrada en la parte superior cuando está dominado */}
              {sprit.estaDominado && (
                <div className="corona-overlay">
                  <span className="corona-dominada">👑</span>
                </div>
              )}
            </div>

            {/* 🔵 Rareza y corona (entre imagen y nombre) */}
            <div className="sprit-rareza-wrapper">
              {/* 🔵 La corona solo aparece aquí si está en inventario pero NO dominado */}
              {sprit.estaEnInventario && !sprit.estaDominado && (
                <span 
                  className="corona-icon clickable"
                  onClick={(e) => toggleDominado(sprit.id, e)}
                  title="Haz clic para dominar este sprit"
                >
                  👑
                </span>
              )}
              <span className={`rareza-badge ${sprit.rareza.toLowerCase()}`}>
                {sprit.rareza}
              </span>
            </div>

            {/* 🔵 Nombre del sprit */}
            <div className="sprit-nombre">
              <h4>{sprit.nombre}</h4>
            </div>
          </div>
        ))}
      </div>
      
      {spritsFiltrados.length === 0 && (
        <p className="no-results">No hay sprits que coincidan con los filtros</p>
      )}
    </div>
  );
}

export default SpritsList;