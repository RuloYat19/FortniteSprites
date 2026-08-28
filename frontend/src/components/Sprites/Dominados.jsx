// frontend/src/components/Dominados.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  spritsService, 
  ordenDefaultService, 
  ordenRarezaService, 
  materialesService, 
  nombresSpritesService 
} from '../../services/api';
import './Dominados.css';
import ConfirmModal from '../ConfirmModal';

function Dominados() {
  const navigate = useNavigate();
  const [sprits, setSprits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ 
    rareza: '', 
    material: '',
    nombre: '',
    orden: 'default',
    yaFueDominado: '',
    temporada: ''  // 🔵 NUEVO
  });

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

  // 🔵 Estado para el modal de resetear dominado
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetData, setResetData] = useState({
    nombre: '',
    material: ''
  });
  const [resetConfirmData, setResetConfirmData] = useState(null);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // 🔵 Estado para el modal de confirmación de éxito/error
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({
    title: '',
    message: '',
    type: 'success'
  });

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
      yaFueDominado: '',
      temporada: ''  // 🔵 NUEVO
    });
  };

  // 🔵 FUNCIONES PARA RESETEAR yaFueDominado
  const abrirResetModal = () => {
    setResetData({ nombre: '', material: '' });
    setShowResetModal(true);
  };

  const cerrarResetModal = () => {
    setShowResetModal(false);
    setResetData({ nombre: '', material: '' });
    setResetConfirmData(null);
  };

  const handleResetChange = (e) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value
    });
  };

  // 🔵 Buscar el sprit por nombre y material
  const buscarSpritParaReset = () => {
    const { nombre, material } = resetData;
    if (!nombre.trim() || !material.trim()) {
      mostrarConfirmacion('⚠️ Campos incompletos', 'Debes ingresar tanto el Nombre como el Material del sprit', 'warning');
      return;
    }

    const spritEncontrado = sprits.find(s => 
      s.nombre.toLowerCase() === nombre.trim().toLowerCase() && 
      s.material.toLowerCase() === material.trim().toLowerCase()
    );

    if (!spritEncontrado) {
      mostrarConfirmacion('❌ Sprit no encontrado', `No se encontró un sprit con el nombre "${nombre}" y material "${material}"`, 'error');
      return;
    }

    if (!spritEncontrado.yaFueDominado) {
      mostrarConfirmacion('ℹ️ Ya está reseteado', `El sprit "${nombre}" ya tiene yaFueDominado = false`, 'info');
      cerrarResetModal();
      return;
    }

    setResetConfirmData(spritEncontrado);
    setShowResetConfirmModal(true);
  };

  // 🔵 Ejecutar el reset
  const confirmarReset = async () => {
    if (!resetConfirmData) return;

    setResetLoading(true);
    try {
      await spritsService.update(resetConfirmData.id, {
        yaFueDominado: false
      });
      
      await cargarSprits();
      
      setShowResetConfirmModal(false);
      cerrarResetModal();
      mostrarConfirmacion('✅ Reset exitoso', `El sprit "${resetConfirmData.nombre}" ya no está marcado como dominado`, 'success');
    } catch (err) {
      console.error('Error al resetear yaFueDominado:', err);
      mostrarConfirmacion('❌ Error', 'Hubo un error al resetear el sprit', 'error');
    } finally {
      setResetLoading(false);
    }
  };

  // 🔵 Mostrar confirmación simple
  const mostrarConfirmacion = (title, message, type = 'success') => {
    setConfirmModalData({ title, message, type });
    setShowConfirmModal(true);
    
    setTimeout(() => {
      setShowConfirmModal(false);
    }, 3000);
  };

  // 🔵 Filtrar sprits
  const spritsFiltrados = sprits.filter(sprit => {
    if (filtros.rareza && sprit.rareza !== filtros.rareza) return false;
    if (filtros.material && sprit.material !== filtros.material) return false;
    if (filtros.nombre && sprit.nombre !== filtros.nombre) return false;
    // 🔵 FILTRO POR yaFueDominado
    if (filtros.yaFueDominado !== '') {
      const filtro = filtros.yaFueDominado === 'true';
      if (sprit.yaFueDominado !== filtro) return false;
    }
    // 🔵 NUEVO FILTRO POR TEMPORADA
    if (filtros.temporada && sprit.temporada !== filtros.temporada) return false;
    return true;
  });

  // 🔵 Aplicar el ordenamiento a los sprits filtrados
  const spritsOrdenados = ordenesCargados ? ordenarSprits(spritsFiltrados) : spritsFiltrados;

  // 🔵 Contar cuántos sprits están dominados (yaFueDominado = true)
  const totalDominados = sprits.filter(s => s.yaFueDominado).length;
  const totalSprits = sprits.length;
  const porcentajeDominados = totalSprits > 0 ? (totalDominados / totalSprits) * 100 : 0;

  if (loading) return <div className="loading">Cargando sprits...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dominados-container">
      <h1>Sprits Dominados</h1>
      
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

        {/* 🔵 FILTRO DE DOMINADOS */}
        <select 
          name="yaFueDominado" 
          value={filtros.yaFueDominado} 
          onChange={handleFiltroChange}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '2px solid #FFD700',
            background: '#16213e',
            color: '#FFD700',
            fontSize: '14px',
            cursor: 'pointer',
            minWidth: '180px'
          }}
        >
          <option value="">Todos los sprits</option>
          <option value="true">👑 Ya fueron dominados</option>
          <option value="false">⏳ No han sido dominados</option>
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
          <button 
            className="btn-reset-dominado"
            onClick={abrirResetModal}
            title="Resetear yaFueDominado de un sprit específico"
          >
            🗑️ Resetear Dominado
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

      {/* 🔵 CONTADOR DE DOMINADOS */}
      <div className="dominados-info">
        <div className="dominados-info-content">
          <span className="dominados-icon">👑</span>
          <span className="dominados-text">
            Sprits Dominados:
          </span>
          <span className="dominados-cantidad">
            {totalDominados}/{totalSprits}
          </span>
        </div>
        <div className="dominados-barra">
          <div 
            className="dominados-llenado" 
            style={{ width: `${porcentajeDominados}%` }}
          />
        </div>
        <div className="dominados-porcentaje">
          {porcentajeDominados.toFixed(1)}% completado
        </div>
      </div>

      {/* 🔵 MODAL: Resetear Dominado */}
      {showResetModal && (
        <div className="modal-overlay" onClick={cerrarResetModal}>
          <div className="modal-content modal-reset" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🗑️ Resetear estado Dominado</h2>
              <button className="modal-close" onClick={cerrarResetModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <p className="modal-descripcion">
                Ingrese los datos del Sprite que desea <code>Resetear</code>
              </p>
              
              <div className="reset-form">
                <div className="form-group">
                  <label>Nombre del Sprit *</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Espíritu del Punto Cero"
                    value={resetData.nombre}
                    onChange={handleResetChange}
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label>Material del Sprit *</label>
                  <input
                    type="text"
                    name="material"
                    placeholder="Ej: Galaxia"
                    value={resetData.material}
                    onChange={handleResetChange}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarResetModal}>
                Cancelar
              </button>
              <button 
                className="btn-reset-buscar"
                onClick={buscarSpritParaReset}
              >
                🔍 Buscar y Resetear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔵 MODAL DE CONFIRMACIÓN DE RESET */}
      {showResetConfirmModal && resetConfirmData && (
        <div className="modal-overlay" onClick={() => setShowResetConfirmModal(false)}>
          <div className="modal-content modal-confirm-reset" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚠️ Confirmar Reset</h2>
              <button className="modal-close" onClick={() => setShowResetConfirmModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="confirm-reset-info">
                <p><strong>Sprit encontrado:</strong></p>
                <div className="confirm-reset-details">
                  <span>📛 {resetConfirmData.nombre}</span>
                  <span>📦 {resetConfirmData.material}</span>
                  <span>⭐ {resetConfirmData.rareza}</span>
                </div>
                <p className="confirm-reset-warning">
                  ⚠️ ¿Estás seguro de resetear <strong>yaFueDominado</strong> a <strong>false</strong>?
                </p>
                <p className="confirm-reset-subtext">
                  Esto eliminará la marca de dominado de este sprit.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancelar" 
                onClick={() => setShowResetConfirmModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-reset-confirmar"
                onClick={confirmarReset}
                disabled={resetLoading}
              >
                {resetLoading ? '⏳ Resetear...' : '✅ Confirmar Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔵 MODAL DE CONFIRMACIÓN (éxito/error) */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={confirmModalData.title}
        message={confirmModalData.message}
        type={confirmModalData.type}
        confirmText="Aceptar"
      />

      <div className="sprits-grid">
        {spritsOrdenados.map((sprit) => (
          <div 
            key={sprit.id} 
            className={`sprit-card ${sprit.yaFueDominado ? 'dominado-general' : ''}`}
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
                  
                  {/* 🔵 Corona cuando está dominado */}
                  {sprit.yaFueDominado && (
                    <div className="corona-overlay">
                      <span className="corona-dominada">👑</span>
                    </div>
                  )}
                </div>

                <div className="sprit-rareza-wrapper">
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

export default Dominados;