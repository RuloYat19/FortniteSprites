import React, { useState, useEffect } from 'react';
import { metodoSubidaNivelService } from '../../services/api';
import './Administrador.css';
import ConfirmModal from '../ConfirmModal';

function MetodosSubidaNivelAdmin() {
  const [metodos, setMetodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🔵 Filtros
  const [filtros, setFiltros] = useState({
    nombre: ''
  });

  // 🔵 Estado para el modal de crear/editar
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    numeroOrden: '',
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

  useEffect(() => {
    cargarMetodos();
  }, []);

  const cargarMetodos = async () => {
    try {
      setLoading(true);
      const response = await metodoSubidaNivelService.getAll();
      const dataOrdenada = response.data.sort((a, b) => a.numeroOrden - b.numeroOrden);
      setMetodos(dataOrdenada);
      setError(null);
    } catch (err) {
      setError('Error al cargar los métodos de subida de nivel');
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
      nombre: ''
    });
  };

  // 🔵 Función para obtener el siguiente número de orden disponible
  const obtenerSiguienteNumeroOrden = () => {
    if (metodos.length === 0) return 1;
    
    const numerosExistentes = metodos.map(item => item.numeroOrden).sort((a, b) => a - b);
    
    let numeroEsperado = 1;
    for (let i = 0; i < numerosExistentes.length; i++) {
      if (numerosExistentes[i] > numeroEsperado) {
        return numeroEsperado;
      }
      numeroEsperado++;
    }
    
    return numerosExistentes.length + 1;
  };

  // 🔵 Abrir modal para crear
  const abrirCrearModal = () => {
    const siguienteNumero = obtenerSiguienteNumeroOrden();
    setFormData({
      id: null,
      numeroOrden: siguienteNumero.toString(),
      nombre: ''
    });
    setEditando(false);
    setShowModal(true);
  };

  // 🔵 Abrir modal para editar
  const abrirEditarModal = (registro) => {
    setFormData({
      id: registro.id,
      numeroOrden: registro.numeroOrden,
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

  // 🔵 Guardar (crear o actualizar)
  const guardarRegistro = async () => {
    if (!formData.numeroOrden || !formData.nombre.trim()) {
      mostrarConfirmacion('⚠️ Campos incompletos', 'Todos los campos son obligatorios', 'warning');
      return;
    }

    // Verificar si el número de orden ya existe (solo en creación)
    if (!editando) {
      const numeroExistente = metodos.some(
        item => item.numeroOrden === parseInt(formData.numeroOrden)
      );
      if (numeroExistente) {
        const siguienteNumero = obtenerSiguienteNumeroOrden();
        mostrarConfirmacion(
          '⚠️ Número duplicado', 
          `El número de orden ${formData.numeroOrden} ya existe. Se usará el siguiente disponible: ${siguienteNumero}`,
          'warning'
        );
        setFormData({
          ...formData,
          numeroOrden: siguienteNumero.toString()
        });
        return;
      }
    }

    try {
      const data = {
        numeroOrden: parseInt(formData.numeroOrden),
        nombre: formData.nombre.trim()
      };

      if (editando) {
        await metodoSubidaNivelService.update(formData.id, data);
        mostrarConfirmacion('✅ Actualizado', 'Método actualizado correctamente', 'success');
      } else {
        await metodoSubidaNivelService.create(data);
        mostrarConfirmacion('✅ Creado', 'Método creado correctamente', 'success');
      }
      
      cerrarModal();
      cargarMetodos();
    } catch (err) {
      console.error('Error al guardar:', err);
      const mensaje = err.response?.data?.detail || 'Error al guardar el método';
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
      await metodoSubidaNivelService.delete(registroAEliminar.id);
      setShowDeleteConfirmModal(false);
      setRegistroAEliminar(null);
      mostrarConfirmacion('🗑️ Eliminado', 'Método eliminado correctamente', 'success');
      cargarMetodos();
    } catch (err) {
      console.error('Error al eliminar:', err);
      const mensaje = err.response?.data?.detail || 'Error al eliminar el método';
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
      mostrarConfirmacion('⚠️ Campos incompletos', 'Ingresa al menos un método', 'warning');
      return;
    }

    // Separar por líneas y filtrar vacíos
    const metodosArray = batchText
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0)
      .map((n, index) => ({ 
        numeroOrden: index + 1, 
        nombre: n 
      }));

    if (metodosArray.length === 0) {
      mostrarConfirmacion('⚠️ Campos incompletos', 'Ingresa al menos un método válido', 'warning');
      return;
    }

    try {
      const response = await metodoSubidaNivelService.createBatch(metodosArray);
      const creados = response.data.length;
      mostrarConfirmacion('✅ Batch creado', `${creados} métodos creados correctamente`, 'success');
      cerrarBatchModal();
      cargarMetodos();
    } catch (err) {
      console.error('Error al crear batch:', err);
      mostrarConfirmacion('❌ Error', err.response?.data?.detail || 'Error al crear los métodos', 'error');
    }
  };

  // 🔵 Filtrar datos
  const datosFiltrados = metodos.filter(item => {
    if (filtros.nombre && !item.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())) return false;
    return true;
  });

  // 🔵 Calcular estadísticas
  const totalRegistros = metodos.length;
  const totalFiltrados = datosFiltrados.length;

  if (loading) return <div className="loading">Cargando métodos de subida de nivel...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-main" style={{ padding: '30px 35px', flex: 1 }}>
      <header className="admin-header">
        <span className="titulo">
          📈 Gestión de Métodos de Subida de Nivel
        </span>
        <p className="admin-subtitle">Métodos disponibles para subir de nivel a los sprits</p>
      </header>

      {/* 🔵 FILTROS */}
      <div className="admin-filtros">
        <div className="filtros-group">
          <input
            type="text"
            name="nombre"
            placeholder="🔍 Buscar por método..."
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
            ➕ Agregar Método
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

      {/* 🔵 ESTADÍSTICAS RÁPIDAS */}
      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-icon">📈</span>
          <div>
            <span className="stat-label">Total métodos</span>
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

      {/* 🔵 TABLA */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th># Orden</th>
              <th>Método de Subida de Nivel</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">
                  {metodos.length === 0 ? 'No hay métodos en la base de datos' : 'No hay métodos que coincidan con los filtros'}
                </td>
              </tr>
            ) : (
              datosFiltrados.map((item) => (
                <tr key={item.id}>
                  <td className="td-orden">{item.numeroOrden}</td>
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

      {/* 🔵 MODAL PARA CREAR/EDITAR */}
      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content modal-admin" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editando ? '✏️ Editar Método' : '➕ Nuevo Método'}</h2>
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
                  <label>Método de Subida de Nivel *</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Abriendo contenedores"
                    value={formData.nombre}
                    onChange={handleFormChange}
                  />
                  <small style={{ color: '#888', display: 'block', marginTop: '4px' }}>
                    💡 Describe cómo se sube de nivel al sprit (ej: "Abriendo contenedores", "Completando misiones")
                  </small>
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

      {/* 🔵 MODAL PARA BATCH */}
      {showBatchModal && (
        <div className="modal-overlay" onClick={cerrarBatchModal}>
          <div className="modal-content modal-admin" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h2>📋 Crear Múltiples Métodos</h2>
              <button className="modal-close" onClick={cerrarBatchModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="admin-form">
                <div className="form-group">
                  <label>Métodos (uno por línea) *</label>
                  <textarea
                    name="batchText"
                    placeholder="Abriendo contenedores&#10;Completando misiones semanales&#10;Derrotando jefes&#10;Participando en eventos"
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
                    💡 Ingresa un método por línea. Los números de orden se asignarán automáticamente.
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

      {/* 🔵 MODAL DE CONFIRMACIÓN SIMPLE */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={confirmModalData.title}
        message={confirmModalData.message}
        type={confirmModalData.type}
        confirmText="Aceptar"
      />

      {/* 🔵 MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        title="⚠️ Confirmar eliminación"
        message={`¿Estás seguro de eliminar el método "${registroAEliminar?.nombre}"?\nEsta acción no se puede deshacer.`}
        type="warning"
        confirmText="Eliminar"
        onConfirm={eliminarRegistro}
        showCancelButton={true}
      />
    </div>
  );
}

export default MetodosSubidaNivelAdmin;