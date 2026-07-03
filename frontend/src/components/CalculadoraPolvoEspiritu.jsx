import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spritsService } from '../services/api';
import './CalculadoraPolvoEspiritu.css';

function CalculadoraPolvoEspiritu() {
  const navigate = useNavigate();
  const [sprits, setSprits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ 
    rareza: '', 
    material: '',
    nombre: '',
    orden: 'default'
  });
  
  // 🔵 Estado para los sprits seleccionados
  const [spritsSeleccionados, setSpritsSeleccionados] = useState({});

  // 🔵 Orden de materiales
  const ordenMateriales = {
    'Normal': 1,
    'Oro': 2,
    'Gomita': 3,
    'Galaxia': 4
  };

  // 🔵 Orden de nombres (Default)
  const ordenNombresDefault = {
    'Espíritu de Agua': 1,
    'Espíritu de Tierra': 2,
    'Espíritu de Fuego': 3,
    'Espíritu Pato': 4,
    'Espíritu Fantasmal': 5,
    'Espíritu Demoníaco': 6,
    'Espíritu Rey': 7,
    'Espíritu Dormilón': 8,
    'Espíritu Punk': 9,
    'Espíritu del Punto Cero': 10,
    'Cacahuate Tostado': 11,
    'Espíritu de Pez': 12,
    'Espíritu Goleador': 13,
    'Espíritu de Aura': 14,
    'Espíritu Jefe': 15,
    'Espíritu Parca': 16
  };

  // 🔵 Orden de nombres por Rareza
  const ordenNombresRareza = {
    'Espíritu de Agua': 1,
    'Espíritu de Tierra': 2,
    'Espíritu de Fuego': 3,
    'Espíritu de Pez': 4,
    'Espíritu Pato': 5,
    'Espíritu Fantasmal': 6,
    'Espíritu Demoníaco': 7,
    'Espíritu Rey': 8,
    'Espíritu Goleador': 9,
    'Espíritu de Aura': 10,
    'Espíritu Dormilón': 11,
    'Espíritu Punk': 12,
    'Espíritu Jefe': 13,
    'Espíritu Parca': 14,
    'Espíritu del Punto Cero': 15,
    'Cacahuate Tostado': 16
  };

  // 🔵 Función para ordenar sprits según el criterio seleccionado
  const ordenarSprits = (spritsList) => {
    const orden = filtros.orden || 'default';
    
    switch(orden) {
      case 'material':
        return [...spritsList].sort((a, b) => {
          // Primero ordenar por material
          const ordenA = ordenMateriales[a.material] || 999;
          const ordenB = ordenMateriales[b.material] || 999;
          if (ordenA !== ordenB) return ordenA - ordenB;
          // Luego por nombre (usando orden default)
          const nombreA = ordenNombresDefault[a.nombre] || 999;
          const nombreB = ordenNombresDefault[b.nombre] || 999;
          return nombreA - nombreB;
        });
      
      case 'rareza':
        return [...spritsList].sort((a, b) => {
          // Primero ordenar por rareza (usando el orden de rareza)
          const rarezaA = ordenNombresRareza[a.nombre] || 999;
          const rarezaB = ordenNombresRareza[b.nombre] || 999;
          if (rarezaA !== rarezaB) return rarezaA - rarezaB;
          // Si misma rareza, ordenar por material
          const materialA = ordenMateriales[a.material] || 999;
          const materialB = ordenMateriales[b.material] || 999;
          return materialA - materialB;
        });
      
      case 'default':
      default:
        return [...spritsList].sort((a, b) => {
          // Primero ordenar por nombre (orden default)
          const nombreA = ordenNombresDefault[a.nombre] || 999;
          const nombreB = ordenNombresDefault[b.nombre] || 999;
          if (nombreA !== nombreB) return nombreA - nombreB;
          // Luego por material
          const materialA = ordenMateriales[a.material] || 999;
          const materialB = ordenMateriales[b.material] || 999;
          return materialA - materialB;
        });
    }
  };

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

  // 🔵 Toggle de selección de un sprit (todos se pueden seleccionar)
  const toggleSeleccion = (id) => {
    setSpritsSeleccionados(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 🔵 Calcular el polvo total de los sprits seleccionados (solo los que NO están en inventario)
  const calcularPolvoSeleccionado = () => {
    return sprits
      .filter(sprit => spritsSeleccionados[sprit.id] && !sprit.estaEnInventario)
      .reduce((total, sprit) => total + (sprit.polvoAlInvocar || 0), 0);
  };

  // 🔵 Contar cuántos sprits están seleccionados (todos)
  const contarSeleccionados = () => {
    return Object.values(spritsSeleccionados).filter(Boolean).length;
  };

  // 🔵 Contar cuántos sprits seleccionados están en inventario
  const contarSeleccionadosEnInventario = () => {
    return sprits.filter(sprit => spritsSeleccionados[sprit.id] && sprit.estaEnInventario).length;
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
      nombre: '',
      orden: 'default'
    });
  };

  // 🔵 Limpiar todas las selecciones
  const limpiarSelecciones = () => {
    setSpritsSeleccionados({});
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
    'Cacahuate Tostado',
    'Espíritu de Pez',
    'Espíritu Goleador',
    'Espíritu de Aura',
    'Espíritu Jefe',
    'Espíritu Parca'
  ];

  const spritsFiltrados = sprits.filter(sprit => {
    if (filtros.rareza && sprit.rareza !== filtros.rareza) return false;
    if (filtros.material && sprit.material !== filtros.material) return false;
    if (filtros.nombre && sprit.nombre !== filtros.nombre) return false;
    return true;
  });

  // 🔵 Aplicar el ordenamiento a los sprits filtrados
  const spritsOrdenados = ordenarSprits(spritsFiltrados);

  if (loading) return <div className="loading">Cargando sprits...</div>;
  if (error) return <div className="error">{error}</div>;

  const polvoTotal = calcularPolvoSeleccionado();
  const totalSeleccionados = contarSeleccionados();
  const totalEnInventario = contarSeleccionadosEnInventario();

  return (
    <div className="calculadora-container">
      <h1>Calculadora de Polvo de Espíritu</h1>
      
      <div className="filtros">
        {/* 🔵 Nuevo filtro "Por Orden" - a la izquierda */}
        <select 
          name="orden" 
          value={filtros.orden} 
          onChange={handleFiltroChange}
          className="filtro-orden"
        >
          <option value="default">Por Orden (Default)</option>
          <option value="material">Por Orden (Material)</option>
          <option value="rareza">Por Orden (Rareza)</option>
        </select>

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

        <button className="btn-limpiar-seleccion" onClick={limpiarSelecciones}>
          🗑️ Limpiar selección
        </button>

        <div className="filtros-botones">
          <button 
            className="btn-volver"
            onClick={() => navigate('/')}
            title="Volver al inicio"
          >
            ←
          </button>
        </div>
      </div>

      {/* 🔵 TEXTO DE POLVO SELECCIONADO */}
      <div className="polvo-info">
        <div className="polvo-info-content">
          <img 
            src="./imagenesSprites/polvoEspiritu.png" 
            alt="Polvo de Espíritu"
            className="polvo-info-icon"
          />
          <span className="polvo-info-text">
            Polvo de Espíritu seleccionado:
          </span>
          <span className="polvo-info-cantidad">{polvoTotal.toLocaleString()}</span>
        </div>
        <div className="polvo-info-detalle">
          {totalSeleccionados} sprit{totalSeleccionados !== 1 ? 's' : ''} seleccionado{totalSeleccionados !== 1 ? 's' : ''}
          {totalEnInventario > 0 && (
            <span className="detalle-inventario"> (🫐 {totalEnInventario} en inventario - no suman polvo)</span>
          )}
        </div>
      </div>

      <div className="sprits-grid">
        {spritsOrdenados.map((sprit) => (
          <div 
            key={sprit.id} 
            className={`sprit-card ${spritsSeleccionados[sprit.id] ? 'seleccionado' : ''}`}
            onClick={() => toggleSeleccion(sprit.id)}
          >
            <div className="sprit-card-inner">
              <div className="sprit-card-front">
                <div className="sprit-image-wrapper">
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
                </div>

                <div className="sprit-rareza-wrapper">
                  {/* 🔵 Emoji de mora si está en inventario */}
                  {sprit.estaEnInventario && (
                    <span className="inventario-icon" title="Ya está en inventario">🫐</span>
                  )}
                  <span className="nivel-badge">
                    ✨ Nv. {sprit.nivelEspiritu || 1}
                  </span>
                  <span className={`rareza-badge ${sprit.rareza.toLowerCase()}`}>
                    {sprit.rareza}
                  </span>
                </div>

                <div className="sprit-nombre">
                  <h4 className={`nombre-material-${sprit.material.toLowerCase()}`}>
                    {sprit.nombre}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {spritsOrdenados.length === 0 && (
        <p className="no-results">No hay sprits que coincidan con los filtros</p>
      )}
    </div>
  );
}

export default CalculadoraPolvoEspiritu;