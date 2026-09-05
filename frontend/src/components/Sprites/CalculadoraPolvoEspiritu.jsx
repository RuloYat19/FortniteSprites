import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  spritsService, 
  ordenDefaultService, 
  ordenRarezaService, 
  materialesService, 
  nombresSpritesService 
} from '../../services/api';
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
    orden: 'default',
    temporada: ''  // 🔵 NUEVO
  });
  
  // 🔵 Estado para los sprits seleccionados
  const [spritsSeleccionados, setSpritsSeleccionados] = useState({});

  // 🔵 ESTADOS PARA LOS ÓRDENES
  const [ordenDefault, setOrdenDefault] = useState({});
  const [ordenRareza, setOrdenRareza] = useState({});
  const [ordenMaterial, setOrdenMaterial] = useState({});
  const [ordenesCargados, setOrdenesCargados] = useState(false);

  // 🔵 ESTADOS PARA FILTROS DINÁMICOS
  const [nombresDisponibles, setNombresDisponibles] = useState([]);
  const [materialesDisponibles, setMaterialesDisponibles] = useState([]);
  const [filtrosCargados, setFiltrosCargados] = useState(false);
  const [opcionesTemporada, setOpcionesTemporada] = useState(['C7T3', 'C7T4']);  // 🔵 NUEVO

  // 🔵 Cargar órdenes desde el backend
  const cargarOrdenes = async () => {
    try {
      const [defaultRes, rarezaRes, materialRes] = await Promise.all([
        ordenDefaultService.getAll(),
        ordenRarezaService.getAll(),
        materialesService.getAll()
      ]);

      const defaultObj = {};
      defaultRes.data.forEach(item => {
        defaultObj[item.nombre] = item.numeroOrden;
      });

      const rarezaObj = {};
      rarezaRes.data.forEach(item => {
        rarezaObj[item.nombre] = item.numeroOrden;
      });

      const materialObj = {};
      materialRes.data.forEach(item => {
        materialObj[item.nombre] = item.numeroOrden;
      });

      setOrdenDefault(defaultObj);
      setOrdenRareza(rarezaObj);
      setOrdenMaterial(materialObj);
      setOrdenesCargados(true);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setOrdenesCargados(true);
    }
  };

  // 🔵 Cargar nombres y materiales para los filtros
  const cargarFiltros = async () => {
    try {
      const [nombresRes, materialesRes] = await Promise.all([
        nombresSpritesService.getAll(),
        materialesService.getAll()
      ]);

      const nombresOrdenados = nombresRes.data
        .sort((a, b) => (a.numeroOrden || a.id) - (b.numeroOrden || b.id))
        .map(item => item.nombre);
      
      const materiales = materialesRes.data.map(item => item.nombre);

      setNombresDisponibles(nombresOrdenados);
      setMaterialesDisponibles(materiales);
      setFiltrosCargados(true);
    } catch (err) {
      console.error('Error al cargar filtros:', err);
      setFiltrosCargados(true);
    }
  };

  // 🔵 Función de ordenamiento que usa los datos del backend
  const ordenarSprits = (spritsList) => {
    const orden = filtros.orden || 'default';

    const obtenerOrdenDefault = (sprit) => {
      const nombreA = ordenDefault[sprit.nombre] || 999;
      const materialA = ordenMaterial[sprit.material] || 999;
      return { nombreA, materialA };
    };
    
    switch(orden) {
      case 'material':
        return [...spritsList].sort((a, b) => {
          const ordenA = ordenMaterial[a.material] || 999;
          const ordenB = ordenMaterial[b.material] || 999;
          if (ordenA !== ordenB) return ordenA - ordenB;
          const nombreA = ordenDefault[a.nombre] || 999;
          const nombreB = ordenDefault[b.nombre] || 999;
          return nombreA - nombreB;
        });
      
      case 'rareza':
        return [...spritsList].sort((a, b) => {
          const rarezaA = ordenRareza[a.nombre] || 999;
          const rarezaB = ordenRareza[b.nombre] || 999;
          if (rarezaA !== rarezaB) return rarezaA - rarezaB;
          const materialA = ordenMaterial[a.material] || 999;
          const materialB = ordenMaterial[b.material] || 999;
          return materialA - materialB;
        });

      case 'seleccionados':
        return [...spritsList].sort((a, b) => {
          const seleccionadoA = spritsSeleccionados[a.id] || false;
          const seleccionadoB = spritsSeleccionados[b.id] || false;
          
          if (seleccionadoA !== seleccionadoB) {
            return seleccionadoA ? -1 : 1;
          }
          
          const nombreA = ordenDefault[a.nombre] || 999;
          const nombreB = ordenDefault[b.nombre] || 999;
          if (nombreA !== nombreB) {
            return nombreA - nombreB;
          }
          const materialA = ordenMaterial[a.material] || 999;
          const materialB = ordenMaterial[b.material] || 999;
          return materialA - materialB;
        });

      case 'default':
      default:
        return [...spritsList].sort((a, b) => {
          const nombreA = ordenDefault[a.nombre] || 999;
          const nombreB = ordenDefault[b.nombre] || 999;
          if (nombreA !== nombreB) return nombreA - nombreB;
          const materialA = ordenMaterial[a.material] || 999;
          const materialB = ordenMaterial[b.material] || 999;
          return materialA - materialB;
        });
    }
  };

  useEffect(() => {
    cargarSprits();
    cargarOrdenes();
    cargarFiltros();
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

  // 🔵 Toggle de selección de un sprit
  const toggleSeleccion = (id) => {
    setSpritsSeleccionados(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 🔵 Calcular el polvo total de los sprits seleccionados
  const calcularPolvoSeleccionado = () => {
    return sprits
      .filter(sprit => spritsSeleccionados[sprit.id] && !sprit.estaEnInventario)
      .reduce((total, sprit) => total + (sprit.polvoAlInvocar || 0), 0);
  };

  // 🔵 Contar cuántos sprits están seleccionados
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
      orden: 'default',
      temporada: ''  // 🔵 NUEVO
    });
  };

  // 🔵 Limpiar todas las selecciones
  const limpiarSelecciones = () => {
    setSpritsSeleccionados({});
  };

  // 🔵 Filtrar sprits
  const spritsFiltrados = sprits.filter(sprit => {
    if (filtros.rareza && sprit.rareza !== filtros.rareza) return false;
    if (filtros.material && sprit.material !== filtros.material) return false;
    if (filtros.nombre && sprit.nombre !== filtros.nombre) return false;
    // 🔵 NUEVO FILTRO POR TEMPORADA
    if (filtros.temporada && sprit.temporada !== filtros.temporada) return false;
    return true;
  });

  // 🔵 Aplicar el ordenamiento a los sprits filtrados
  const spritsOrdenados = ordenesCargados ? ordenarSprits(spritsFiltrados) : spritsFiltrados;

  if (loading) return <div className="loading">Cargando sprits...</div>;
  if (error) return <div className="error">{error}</div>;

  const polvoTotal = calcularPolvoSeleccionado();
  const totalSeleccionados = contarSeleccionados();
  const totalEnInventario = contarSeleccionadosEnInventario();

  return (
    <div className="calculadora-container">
      <h1>Calculadora de Polvo de Espíritu</h1>
      
      <div className="filtros">
        {/* 🔵 NUEVO FILTRO DE TEMPORADA */}
        <select 
          name="temporada" 
          value={filtros.temporada} 
          onChange={handleFiltroChange}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '2px solid #ff6f00',
            background: '#16213e',
            color: '#ffb74d',
            fontSize: '14px',
            cursor: 'pointer',
            minWidth: '150px'
          }}
        >
          <option value="">Todas las temporadas</option>
          {opcionesTemporada.map(temp => (
            <option key={temp} value={temp}>{temp}</option>
          ))}
        </select>
        
        {/* 🔵 Filtro "Por Orden" */}
        <select 
          name="orden" 
          value={filtros.orden} 
          onChange={handleFiltroChange}
          className="filtro-orden"
        >
          <option value="default">Por Orden (Default)</option>
          <option value="material">Por Orden (Material)</option>
          <option value="rareza">Por Orden (Rareza)</option>
          <option value="seleccionados">Seleccionados</option>
        </select>

        {/* 🔵 FILTRO DE NOMBRES - DINÁMICO */}
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

        {/* 🔵 FILTRO DE RAREZA */}
        <select name="rareza" value={filtros.rareza} onChange={handleFiltroChange}>
          <option value="">Todas las rarezas</option>
          <option value="Raro">Raro</option>
          <option value="Épico">Épico</option>
          <option value="Legendario">Legendario</option>
          <option value="Mítico">Mítico</option>
        </select>
        
        {/* 🔵 FILTRO DE MATERIALES - DINÁMICO */}
        <select name="material" value={filtros.material} onChange={handleFiltroChange}>
          <option value="">Todos los materiales</option>
          {materialesDisponibles.map((material) => (
            <option key={material} value={material}>
              {material}
            </option>
          ))}
        </select>
        
        <div className="filtros-botones">
          <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
            🗑️ Limpiar filtros
          </button>
          <button className="btn-limpiar-seleccion" onClick={limpiarSelecciones}>
            🗑️ Limpiar selección
          </button>
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