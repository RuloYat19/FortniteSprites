import React, { useState, useEffect } from 'react';
import { nombresSpritesService } from '../../services/api';
import './Administrador.css';
import ConfirmModal from '../ConfirmModal';

function NombresSpritesAdmin() {
  const [nombres, setNombres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🔵 Filtros
  const [filtros, setFiltros] = useState({
    nombre: '',
    temporada: 'C7T4'
  });

  // 🔵 Estado para el modal de crear/editar
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    numeroOrden: '',
    temporada: '',
    nombre: ''
  });

  // 🔵 Estado para el modal de creación por lote
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchText, setBatchText] = useState('');

  // 🔵 Estado para modales de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({
    title: '',
    message: '',
    type: 'success'
  });
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [registroAEliminar, setRegistroAEliminar] = useState(null);

  const temporadas = ['C7T3', 'C7T4'];

  useEffect(() => {
    cargarNombres();
  }, []);

  const cargarNombres = async () => {
    try {
      setLoading(true);
      const response = await nombresSpritesService.getAll();
      const dataOrdenada = response.data.sort((a, b) => a.numeroOrden - b.numeroOrden);
      setNombres(dataOrdenada);
      setError(null);
    } catch (err) {
      setError('Error al cargar los nombres');
      console.error(err);
    } finally {
      setLoading(false);
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

  // 🔵 Manejar filtros
  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value
    });
  };

  const limpiarFiltros = () => {
    setFiltros({
      nombre: '',
      temporada: 'C7T4'
    });
  };

  const abrirCrearModal = () => {
    const siguienteNumero = obtenerSiguienteNumeroOrden();
    setFormData({
      id: null,
      numeroOrden: siguienteNumero.toString(),
      temporada: '',
      nombre: ''
    });
    setEditando(false);
    setShowModal(true);
  };

  const obtenerSiguienteNumeroOrden = () => {
    if (nombres.length === 0) return 1;
    
    const numerosExistentes = nombres.map(item => item.numeroOrden).sort((a, b) => a - b);
    
    let numeroEsperado = 1;
    for (let i = 0; i < numerosExistentes.length; i++) {
      if (numerosExistentes[i] > numeroEsperado) {
        return numeroEsperado;
      }
      numeroEsperado++;
    }
    
    return numerosExistentes.length + 1;
  };

  // 🔵 Abrir modal para editar
  const abrirEditarModal = (registro) => {
    setFormData({
      id: registro.id,
      numeroOrden: registro.numeroOrden,
      temporada: registro.temporada || '',
      nombre: registro.nombre
    });
    setEditando(true);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setFormData({
      id: null,
      numeroOrden: '',
      temporada: '',
      nombre: ''
    });
    setEditando(false);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const guardarRegistro = async () => {
    if (!formData.numeroOrden || !formData.temporada || !formData.nombre.trim()) {
      mostrarConfirmacion('⚠️ Campos incompletos', 'Todos los campos son obligatorios', 'warning');
      return;
    }

    try {
      const data = {
        numeroOrden: parseInt(formData.numeroOrden),
        temporada: formData.temporada,
        nombre: formData.nombre.trim()
      };

      if (editando) {
        await nombresSpritesService.update(formData.id, data);
        mostrarConfirmacion('✅ Actualizado', 'Nombre actualizado correctamente', 'success');
      } else {
        await nombresSpritesService.create(data);
        mostrarConfirmacion('✅ Creado', 'Nombre creado correctamente', 'success');
      }
      
      cerrarModal();
      cargarNombres();
    } catch (err) {
      console.error('Error al guardar:', err);
      const mensaje = err.response?.data?.detail || 'Error al guardar el nombre';
      mostrarConfirmacion('❌ Error', mensaje, 'error');
    }
  };

  // 🔵 Confirmar eliminación
  const confirmarEliminacion = (registro) => {
    setRegistroAEliminar(registro);
    setShowDeleteConfirmModal(true);
  };

  // 🔵 Eliminar registro
  const eliminarRegistro = async () => {
    if (!registroAEliminar) return;

    try {
      await nombresSpritesService.delete(registroAEliminar.id);
      setShowDeleteConfirmModal(false);
      setRegistroAEliminar(null);
      mostrarConfirmacion('🗑️ Eliminado', 'Nombre eliminado correctamente', 'success');
      cargarNombres();
    } catch (err) {
      console.error('Error al eliminar:', err);
      const mensaje = err.response?.data?.detail || 'Error al eliminar el nombre';
      mostrarConfirmacion('❌ Error', mensaje, 'error');
    }
  };

  // 🔵 Creación por lote
  const abrirBatchModal = () => {
    setBatchText('');
    setShowBatchModal(true);
  };

  const cerrarBatchModal = () => {
    setShowBatchModal(false);
    setBatchText('');
  };

  const guardarBatch = async () => {
    if (!batchText.trim()) {
      mostrarConfirmacion('⚠️ Campos incompletos', 'Ingresa al menos un nombre', 'warning');
      return;
    }

    const nombresArray = batchText
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0)
      .map((n, index) => ({ 
        numeroOrden: index + 1,
        temporada: 'C7T3',
        nombre: n 
      }));

    if (nombresArray.length === 0) {
      mostrarConfirmacion('⚠️ Campos incompletos', 'Ingresa al menos un nombre válido', 'warning');
      return;
    }

    try {
      const response = await nombresSpritesService.createBatch(nombresArray);
      const creados = response.data.length;
      mostrarConfirmacion('✅ Batch creado', `${creados} nombres creados correctamente`, 'success');
      cerrarBatchModal();
      cargarNombres();
    } catch (err) {
      console.error('Error al crear batch:', err);
      mostrarConfirmacion('❌ Error', err.response?.data?.detail || 'Error al crear los nombres', 'error');
    }
  };

  // 🔵 Filtrar datos
  const datosFiltrados = nombres.filter(item => {
    if (filtros.nombre && !item.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())) return false;
    if (filtros.temporada && item.temporada !== filtros.temporada) return false;
    return true;
  });

  const totalRegistros = nombres.length;
  const totalFiltrados = datosFiltrados.length;

  if (loading) return <div className="loading">Cargando nombres...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-main" style={{ padding: '30px 35px', flex: 1 }}>
      <header className="admin-header">
        <span className="titulo">
          📝 Gestión de Nombres de Sprites
        </span>
      </header>

      <div className="admin-filtros">
        <div className="filtros-group">
          <select 
            name="temporada" 
            value={filtros.temporada} 
            onChange={handleFiltroChange}
            className="filtro-select"
            style={{ borderColor: '#ff6f00', color: '#ffb74d' }}
          >
            <option value="">Todas las temporadas</option>
            {temporadas.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input
            type="text"
            name="nombre"
            placeholder="🔍 Buscar por nombre..."
            value={filtros.nombre}
            onChange={handleFiltroChange}
            className="filtro-select"
            style={{ minWidth: '200px' }}
          />

          <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
            Limpiar Filtros
          </button>
        </div>

        <div className="filtros-group" style={{ gap: '8px' }}>
          <button className="btn-agregar-admin" onClick={abrirCrearModal}>
            ➕ Agregar Nombre
          </button>
          <button 
            className="btn-agregar-admin" 
            onClick={abrirBatchModal}
            style={{ background: '#9c27b0' }}
          >
            📋 Batch
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-icon">📝</span>
          <div>
            <span className="stat-label">Total nombres</span>
            <span className="stat-value">{totalRegistros}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔍</span>
          <div>
            <span className="stat-label">Mostrando</span>
            <span className="stat-value">{totalFiltrados}</span>
          </div>
        </div>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th># Orden</th>
              <th>Temporada</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  {nombres.length === 0 ? 'No hay nombres en la base de datos' : 'No hay nombres que coincidan con los filtros'}
                </td>
              </tr>
            ) : (
              datosFiltrados.map((item) => (
                <tr key={item.id}>
                  <td className="td-orden">{item.numeroOrden}</td>
                  <td>
                    <span style={{ color: '#ffb74d', fontWeight: 'bold' }}>
                      {item.temporada || 'N/A'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', paddingLeft: '20px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 500 }}>
                      {item.nombre}
                    </span>
                  </td>
                  <td className="td-acciones">
                    <button 
                      className="btn-editar"
                      onClick={() => abrirEditarModal(item)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-eliminar"
                      onClick={() => confirmarEliminacion(item)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content modal-admin" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editando ? '✏️ Editar Nombre' : '➕ Nuevo Nombre'}</h2>
              <button className="modal-close" onClick={cerrarModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="admin-form">
                <div className="form-group">
                  <label>Número de Orden *</label>
                  <input
                    type="number"
                    name="numeroOrden"
                    placeholder="Ej: 1"
                    value={formData.numeroOrden}
                    onChange={handleFormChange}
                    min="1"
                    disabled={!editando}
                  />
                  {!editando && (
                    <small style={{ color: '#888', display: 'block', marginTop: '4px' }}>
                      💡 Número asignado automáticamente
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label>Temporada *</label>
                  <select
                    name="temporada"
                    value={formData.temporada || ''}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '2px solid #0f3460',
                      borderRadius: '6px',
                      background: '#1a1a2e',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Seleccionar temporada</option>
                    {temporadas.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Nombre del Sprite *</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Espíritu de Agua"
                    value={formData.nombre}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarModal}>
                Cancelar
              </button>
              <button className="btn-guardar" onClick={guardarRegistro}>
                {editando ? '💾 Actualizar' : '💾 Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showBatchModal && (
        <div className="modal-overlay" onClick={cerrarBatchModal}>
          <div className="modal-content modal-admin" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h2>📋 Crear Múltiples Nombres</h2>
              <button className="modal-close" onClick={cerrarBatchModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="admin-form">
                <div className="form-group">
                  <label>Nombres (uno por línea) *</label>
                  <textarea
                    name="batchText"
                    placeholder="Espíritu de Agua&#10;Espíritu de Tierra&#10;Espíritu de Fuego"
                    value={batchText}
                    onChange={(e) => setBatchText(e.target.value)}
                    style={{
                      width: '100%',
                      minHeight: '150px',
                      padding: '10px 14px',
                      border: '2px solid #0f3460',
                      borderRadius: '6px',
                      background: '#1a1a2e',
                      color: '#fff',
                      fontSize: '14px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                  <small style={{ color: '#888', display: 'block', marginTop: '4px' }}>
                    💡 Ingresa un nombre por línea. Los números de orden y temporada se asignarán automáticamente.
                  </small>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarBatchModal}>
                Cancelar
              </button>
              <button 
                className="btn-guardar" 
                onClick={guardarBatch}
                style={{ background: '#9c27b0' }}
              >
                📋 Crear Todos
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={confirmModalData.title}
        message={confirmModalData.message}
        type={confirmModalData.type}
        confirmText="Aceptar"
      />

      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        title="⚠️ Confirmar eliminación"
        message={`¿Estás seguro de eliminar el nombre "${registroAEliminar?.nombre}"?\nEsta acción no se puede deshacer.`}
        type="warning"
        confirmText="Eliminar"
        onConfirm={eliminarRegistro}
        showCancelButton={true}
      />
    </div>
  );
}

export default NombresSpritesAdmin;