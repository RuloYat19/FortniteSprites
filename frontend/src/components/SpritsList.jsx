import React, { useState, useEffect } from 'react';
import { spritsService } from '../services/api';
import './SpritsList.css';
import ConfirmModal from './ConfirmModal';

function SpritsList() {
  const [sprits, setSprits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ 
    rareza: '', 
    material: '',
    nombre: ''
  });
  const [flippedCards, setFlippedCards] = useState({});
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSprit, setEditSprit] = useState({
    id: null,
    nombre: '',
    rareza: '',
    material: '',
    nombreArchivoImagen: '',
    polvoAlExtraer: '',
    polvoAlInvocar: ''
  });
  const [editando, setEditando] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSprit, setNewSprit] = useState({
    nombre: '',
    rareza: '',
    material: '',
    nombreArchivoImagen: '',
    polvoAlExtraer: '',
    polvoAlInvocar: ''
  });
  const [agregando, setAgregando] = useState(false);

  // 🔵 Estado para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({
    title: '',
    message: '',
    type: 'success'
  });

  // 🔵 Estado para el modal de confirmación de eliminación
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [spritAEliminar, setSpritAEliminar] = useState(null);

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

  const mostrarConfirmacion = (title, message, type = 'success') => {
    setConfirmModalData({ title, message, type });
    setShowConfirmModal(true);
    
    setTimeout(() => {
      setShowConfirmModal(false);
    }, 2500);
  };

  // 🔵 Función para confirmar eliminación
  const confirmarEliminacion = (sprit) => {
    setSpritAEliminar(sprit);
    setShowDeleteConfirmModal(true);
  };

  // 🔵 Función para eliminar el sprit
  const eliminarSprit = async () => {
    if (!spritAEliminar) return;

    try {
      await spritsService.delete(spritAEliminar.id);
      await cargarSprits();
      setShowDeleteConfirmModal(false);
      setSpritAEliminar(null);
      mostrarConfirmacion(
        '🗑️ Sprit eliminado',
        `El sprit "${spritAEliminar.nombre}" se eliminó correctamente`,
        'success'
      );
    } catch (err) {
      console.error('Error al eliminar sprit:', err);
      setShowDeleteConfirmModal(false);
      mostrarConfirmacion(
        '❌ Error',
        'Hubo un error al eliminar el sprit',
        'error'
      );
    }
  };

  const handleImageClick = async (id) => {
    try {
      const spritActual = sprits.find(s => s.id === id);
      
      if (spritActual?.estaDominado) {
        setSprits(prevSprits => 
          prevSprits.map(sprit => 
            sprit.id === id 
              ? { ...sprit, estaDominado: false, estaEnInventario: false }
              : sprit
          )
        );
        
        await spritsService.update(id, {
          estaDominado: false,
          estaEnInventario: false
        });
        return;
      }
      
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

  const toggleFlip = (id, e) => {
    e.stopPropagation();
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const abrirEditModal = (sprit, e) => {
    e.stopPropagation();
    setEditSprit({
      id: sprit.id,
      nombre: sprit.nombre,
      rareza: sprit.rareza,
      material: sprit.material,
      nombreArchivoImagen: sprit.nombreArchivoImagen || '',
      polvoAlExtraer: sprit.polvoAlExtraer || '',
      polvoAlInvocar: sprit.polvoAlInvocar || ''
    });
    setShowEditModal(true);
  };

  const cerrarEditModal = () => {
    setShowEditModal(false);
    setEditSprit({
      id: null,
      nombre: '',
      rareza: '',
      material: '',
      nombreArchivoImagen: '',
      polvoAlExtraer: '',
      polvoAlInvocar: ''
    });
    setEditando(false);
  };

  const handleEditChange = (e) => {
    setEditSprit({
      ...editSprit,
      [e.target.name]: e.target.value
    });
  };

  const guardarSpritEditado = async () => {
    if (!editSprit.nombre || !editSprit.rareza || !editSprit.material) {
      mostrarConfirmacion('⚠️ Campos incompletos', 'Los campos Nombre, Rareza y Material son obligatorios', 'warning');
      return;
    }

    setEditando(true);
    try {
      const data = {
        nombre: editSprit.nombre,
        rareza: editSprit.rareza,
        material: editSprit.material,
        nombreArchivoImagen: editSprit.nombreArchivoImagen || null,
        polvoAlExtraer: editSprit.polvoAlExtraer ? parseInt(editSprit.polvoAlExtraer) : null,
        polvoAlInvocar: editSprit.polvoAlInvocar ? parseInt(editSprit.polvoAlInvocar) : null
      };

      await spritsService.update(editSprit.id, data);
      await cargarSprits();
      cerrarEditModal();
      mostrarConfirmacion('✅ Sprit actualizado', `El sprit "${editSprit.nombre}" se actualizó correctamente`, 'success');
    } catch (err) {
      console.error('Error al actualizar sprit:', err);
      mostrarConfirmacion('❌ Error', 'Hubo un error al actualizar el sprit', 'error');
    } finally {
      setEditando(false);
    }
  };

  const abrirAddModal = () => {
    setNewSprit({
      nombre: '',
      rareza: '',
      material: '',
      nombreArchivoImagen: '',
      polvoAlExtraer: '',
      polvoAlInvocar: ''
    });
    setShowAddModal(true);
  };

  const cerrarAddModal = () => {
    setShowAddModal(false);
    setNewSprit({
      nombre: '',
      rareza: '',
      material: '',
      nombreArchivoImagen: '',
      polvoAlExtraer: '',
      polvoAlInvocar: ''
    });
    setAgregando(false);
  };

  const handleAddChange = (e) => {
    setNewSprit({
      ...newSprit,
      [e.target.name]: e.target.value
    });
  };

  const guardarNuevoSprit = async () => {
    if (!newSprit.nombre || !newSprit.rareza || !newSprit.material) {
      mostrarConfirmacion('⚠️ Campos incompletos', 'Los campos Nombre, Rareza y Material son obligatorios', 'warning');
      return;
    }

    setAgregando(true);
    try {
      const data = {
        nombre: newSprit.nombre,
        rareza: newSprit.rareza,
        material: newSprit.material,
        nombreArchivoImagen: newSprit.nombreArchivoImagen || null,
        polvoAlExtraer: newSprit.polvoAlExtraer ? parseInt(newSprit.polvoAlExtraer) : null,
        polvoAlInvocar: newSprit.polvoAlInvocar ? parseInt(newSprit.polvoAlInvocar) : null,
        yaFueDominado: false,
        estaDominado: false,
        estaEnInventario: false,
        estaDesbloqueado: false
      };

      await spritsService.create(data);
      await cargarSprits();
      cerrarAddModal();
      mostrarConfirmacion('✅ Sprit agregado', `Se ha creado correctamente el sprit "${newSprit.nombre}"`, 'success');
    } catch (err) {
      console.error('Error al agregar sprit:', err);
      mostrarConfirmacion('❌ Error', 'Hubo un error al agregar el sprit', 'error');
    } finally {
      setAgregando(false);
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

        <button className="btn-agregar" onClick={abrirAddModal}>
          ➕ Agregar Sprit
        </button>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={confirmModalData.title}
        message={confirmModalData.message}
        type={confirmModalData.type}
        confirmText="Aceptar"
      />

      {/* 🔵 MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        title="⚠️ Confirmar eliminación"
        message={`¿Estás seguro de eliminar el sprit "${spritAEliminar?.nombre}"?\nEsta acción no se puede deshacer.`}
        type="warning"
        confirmText="Eliminar"
        onConfirm={eliminarSprit}
        showCancelButton={true}
      />

      <div className="sprits-grid">
        {spritsFiltrados.map((sprit) => (
          <div 
            key={sprit.id} 
            className={`sprit-card ${sprit.estaEnInventario ? 'inventario' : ''} ${sprit.estaDominado ? 'dominado' : ''} ${flippedCards[sprit.id] ? 'flipped' : ''}`}
          >
            <div className="sprit-card-inner">
              <div className="sprit-card-front">
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
                  
                  {sprit.estaDominado && (
                    <div className="corona-overlay">
                      <span className="corona-dominada">👑</span>
                    </div>
                  )}
                </div>

                <div className="sprit-rareza-wrapper">
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
                  <span 
                    className="eye-icon clickable"
                    onClick={(e) => toggleFlip(sprit.id, e)}
                    title="Ver detalles del sprit"
                  >
                    👁️
                  </span>
                </div>

                <div className="sprit-nombre">
                  <h4>{sprit.nombre}</h4>
                </div>
              </div>

              <div className="sprit-card-back">
                <div className="back-details">
                  <div className="detail-item">
                    <span className="detail-label">📦 Material:</span>
                    <span className="detail-value">{sprit.material}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">⬇️ Polvo al extraer:</span>
                    <span className="detail-value">{sprit.polvoAlExtraer || 0}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">⬆️ Polvo al invocar:</span>
                    <span className="detail-value">{sprit.polvoAlInvocar || 0}</span>
                  </div>
                </div>

                <div className="back-actions">
                  <span 
                    className="action-icon"
                    title="Editar"
                    onClick={(e) => abrirEditModal(sprit, e)}
                  >
                    ✏️
                  </span>
                  <span 
                    className="action-icon"
                    title="Eliminar"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmarEliminacion(sprit);
                    }}
                  >
                    🗑️
                  </span>
                  <span 
                    className="action-icon"
                    title="Volver"
                    onClick={(e) => toggleFlip(sprit.id, e)}
                  >
                    🔄
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {spritsFiltrados.length === 0 && (
        <p className="no-results">No hay sprits que coincidan con los filtros</p>
      )}

      {/* 🔵 MODAL DE AGREGAR SPRIT */}
      {showAddModal && (
        <div className="modal-overlay" onClick={cerrarAddModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Agregar Nuevo Sprit</h2>
              <button className="modal-close" onClick={cerrarAddModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="edit-form">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Espíritu del Punto Cero"
                    value={newSprit.nombre}
                    onChange={handleAddChange}
                  />
                </div>

                <div className="form-group">
                  <label>Rareza *</label>
                  <input
                    type="text"
                    name="rareza"
                    placeholder="Ej: Mítico"
                    value={newSprit.rareza}
                    onChange={handleAddChange}
                  />
                </div>

                <div className="form-group">
                  <label>Material *</label>
                  <input
                    type="text"
                    name="material"
                    placeholder="Ej: Galaxia"
                    value={newSprit.material}
                    onChange={handleAddChange}
                  />
                </div>

                <div className="form-group">
                  <label>Ruta de la Imagen</label>
                  <input
                    type="text"
                    name="nombreArchivoImagen"
                    placeholder="Ej: ./imagenesSprites/puntoCeroGalaxia.jpg"
                    value={newSprit.nombreArchivoImagen}
                    onChange={handleAddChange}
                  />
                </div>

                <div className="form-group">
                  <label>Polvo al Extraer</label>
                  <input
                    type="number"
                    name="polvoAlExtraer"
                    placeholder="Ej: 800"
                    value={newSprit.polvoAlExtraer}
                    onChange={handleAddChange}
                  />
                </div>

                <div className="form-group">
                  <label>Polvo al Invocar</label>
                  <input
                    type="number"
                    name="polvoAlInvocar"
                    placeholder="Ej: 15000"
                    value={newSprit.polvoAlInvocar}
                    onChange={handleAddChange}
                  />
                </div>

                <div className="form-hint">
                  <p>💡 Los campos con <strong>*</strong> son obligatorios</p>
                  <p>💡 Los campos <strong>yaFueDominado</strong>, <strong>estaDominado</strong>, <strong>estaEnInventario</strong> y <strong>estaDesbloqueado</strong> se establecen como <strong>false</strong> automáticamente</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarAddModal}>
                Cancelar
              </button>
              <button 
                className="btn-guardar" 
                onClick={guardarNuevoSprit}
                disabled={agregando}
              >
                {agregando ? '⏳ Guardando...' : '💾 Agregar Sprit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔵 MODAL DE EDICIÓN */}
      {showEditModal && (
        <div className="modal-overlay" onClick={cerrarEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Editar Sprit</h2>
              <button className="modal-close" onClick={cerrarEditModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="edit-form">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Espíritu del Punto Cero"
                    value={editSprit.nombre}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Rareza *</label>
                  <input
                    type="text"
                    name="rareza"
                    placeholder="Ej: Mítico"
                    value={editSprit.rareza}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Material *</label>
                  <input
                    type="text"
                    name="material"
                    placeholder="Ej: Galaxia"
                    value={editSprit.material}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Ruta de la Imagen</label>
                  <input
                    type="text"
                    name="nombreArchivoImagen"
                    placeholder="Ej: ./imagenesSprites/puntoCeroGalaxia.jpg"
                    value={editSprit.nombreArchivoImagen}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Polvo al Extraer</label>
                  <input
                    type="number"
                    name="polvoAlExtraer"
                    placeholder="Ej: 800"
                    value={editSprit.polvoAlExtraer}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Polvo al Invocar</label>
                  <input
                    type="number"
                    name="polvoAlInvocar"
                    placeholder="Ej: 15000"
                    value={editSprit.polvoAlInvocar}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-hint">
                  <p>💡 Los campos con <strong>*</strong> son obligatorios</p>
                  <p>💡 Los estados <strong>estaColeccionado</strong> y <strong>estaDominado</strong> no se modifican</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarEditModal}>
                Cancelar
              </button>
              <button 
                className="btn-guardar" 
                onClick={guardarSpritEditado}
                disabled={editando}
              >
                {editando ? '⏳ Guardando...' : '💾 Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpritsList;