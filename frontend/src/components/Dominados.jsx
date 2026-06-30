// frontend/src/components/Dominados.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spritsService } from '../services/api';
import './Dominados.css';
import ConfirmModal from './ConfirmModal';

function Dominados() {
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
          const ordenA = ordenMateriales[a.material] || 999;
          const ordenB = ordenMateriales[b.material] || 999;
          if (ordenA !== ordenB) return ordenA - ordenB;
          const nombreA = ordenNombresDefault[a.nombre] || 999;
          const nombreB = ordenNombresDefault[b.nombre] || 999;
          return nombreA - nombreB;
        });
      
      case 'rareza':
        return [...spritsList].sort((a, b) => {
          const rarezaA = ordenNombresRareza[a.nombre] || 999;
          const rarezaB = ordenNombresRareza[b.nombre] || 999;
          if (rarezaA !== rarezaB) return rarezaA - rarezaB;
          const materialA = ordenMateriales[a.material] || 999;
          const materialB = ordenMateriales[b.material] || 999;
          return materialA - materialB;
        });
      
      case 'default':
      default:
        return [...spritsList].sort((a, b) => {
          const nombreA = ordenNombresDefault[a.nombre] || 999;
          const nombreB = ordenNombresDefault[b.nombre] || 999;
          if (nombreA !== nombreB) return nombreA - nombreB;
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

    // 🔵 Si el sprit ya tiene yaFueDominado = false, mostrar mensaje
    if (!spritEncontrado.yaFueDominado) {
      mostrarConfirmacion('ℹ️ Ya está reseteado', `El sprit "${nombre}" ya tiene yaFueDominado = false`, 'info');
      cerrarResetModal();
      return;
    }

    // 🔵 Mostrar confirmación
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

  // 🔵 Aplicar el ordenamiento a los sprits filtrados
  const spritsOrdenados = ordenarSprits(spritsFiltrados);

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

        {/* 🔵 NUEVO BOTÓN: Resetear Dominado */}
        <button 
          className="btn-reset-dominado"
          onClick={abrirResetModal}
          title="Resetear yaFueDominado de un sprit específico"
        >
          🗑️ Resetear Dominado
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
              <h2>🗑️ Resetear yaFueDominado</h2>
              <button className="modal-close" onClick={cerrarResetModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <p className="modal-descripcion">
                Ingresa el <strong>Nombre</strong> y <strong>Material</strong> del sprit para resetear su estado <code>yaFueDominado</code> a <strong>false</strong>.
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

                <div className="form-hint">
                  <p>💡 El nombre y material deben coincidir <strong>exactamente</strong> (sin importar mayúsculas/minúsculas)</p>
                  <p>⚠️ Esta acción <strong>no se puede deshacer</strong> fácilmente</p>
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
                  {sprit.yaFueDominado}
                  <span className={`rareza-badge ${sprit.rareza.toLowerCase()}`}>
                    {sprit.rareza}
                  </span>
                </div>

                <div className="sprit-nombre">
                  <h4>{sprit.nombre}</h4>
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