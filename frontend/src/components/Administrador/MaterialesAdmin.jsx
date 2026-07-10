// frontend/src/components/MaterialesAdmin.jsx
import React, { useState, useEffect } from 'react';
import { materialesService } from '../../services/api';
import './Administrador.css';
import ConfirmModal from '../ConfirmModal';

function MaterialesAdmin() {
  const [materiales, setMateriales] = useState([]);
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
    cargarMateriales();
  }, []);

  const cargarMateriales = async () => {
    try {
      setLoading(true);
      const response = await materialesService.getAll();
      // Ordenar por numeroOrden ascendente
      const dataOrdenada = response.data.sort((a, b) => a.numeroOrden - b.numeroOrden);
      setMateriales(dataOrdenada);
      setError(null);
    } catch (err) {
      setError('Error al cargar los materiales');
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
    if (materiales.length === 0) return 1;
    
    const numerosExistentes = materiales.map(item => item.numeroOrden).sort((a, b) => a - b);
    
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
    // Validaciones
    if (!formData.numeroOrden || !formData.nombre.trim()) {
      mostrarConfirmacion('⚠️ Campos incompletos', 'Todos los campos son obligatorios', 'warning');
      return;
    }

    // 🔵 Validar que el número de orden no exista (solo para creación)
    if (!editando) {
      const numeroExistente = materiales.some(
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
        await materialesService.update(formData.id, data);
        mostrarConfirmacion('✅ Actualizado', 'Material actualizado correctamente', 'success');
      } else {
        await materialesService.create(data);
        mostrarConfirmacion('✅ Creado', 'Material creado correctamente', 'success');
      }
      
      cerrarModal();
      cargarMateriales();
    } catch (err) {
      console.error('Error al guardar:', err);
      mostrarConfirmacion('❌ Error', err.response?.data?.detail || 'Error al guardar el material', 'error');
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
      await materialesService.delete(registroAEliminar.id);
      setShowDeleteConfirmModal(false);
      setRegistroAEliminar(null);
      mostrarConfirmacion('🗑️ Eliminado', 'Material eliminado correctamente', 'success');
      cargarMateriales();
    } catch (err) {
      console.error('Error al eliminar:', err);
      const mensaje = err.response?.data?.detail || 'Error al eliminar el material';
      mostrarConfirmacion('❌ Error', mensaje, 'error');
    }
  };

  // 🔵 Filtrar datos
  const datosFiltrados = materiales.filter(item => {
    if (filtros.nombre && !item.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())) return false;
    return true;
  });

  // 🔵 Calcular estadísticas
  const totalRegistros = materiales.length;
  const totalFiltrados = datosFiltrados.length;

  if (loading) return <div className="loading">Cargando materiales...</div>;
  if (error) return <div className="error">{error}</div>;

  // 🔵 Colores para los badges de material
  const getMaterialColor = (nombre) => {
    const colores = {
      'Normal': { bg: '#0f3460', color: '#ffffff' },
      'Oro': { bg: '#FFD700', color: '#1a1a2e' },
      'Gomita': { bg: 'linear-gradient(90deg, #4CAF50, #FF69B4)', color: '#1a1a2e' },
      'Galaxia': { bg: 'linear-gradient(90deg, #1a237e, #4a148c)', color: '#ffffff' },
      'Holofoil': { bg: 'linear-gradient(90deg, #d490f4, #60f76d)', color: '#1a1a2e' }
    };
    return colores[nombre] || { bg: '#0f3460', color: '#ffffff' };
  };

  return (
    <div className="admin-main" style={{ padding: '30px 35px', flex: 1 }}>
      <header className="admin-header">
        <h1>📦 Gestión de Materiales</h1>
        <p className="admin-subtitle">Administra los materiales disponibles para los sprits</p>
      </header>

      {/* 🔵 FILTROS */}
      <div className="admin-filtros">
        <div className="filtros-group">
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

        <button className="btn-agregar-admin" onClick={abrirCrearModal}>
          ➕ Agregar Material
        </button>
      </div>

      {/* 🔵 ESTADÍSTICAS RÁPIDAS */}
      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-icon">📦</span>
          <div>
            <span className="stat-label">Total materiales</span>
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
              <th>Material</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">
                  {materiales.length === 0 ? 'No hay materiales en la base de datos' : 'No hay materiales que coincidan con los filtros'}
                </td>
              </tr>
            ) : (
              datosFiltrados.map((item) => {
                const colors = getMaterialColor(item.nombre);
                return (
                  <tr key={item.id}>
                    <td className="td-orden">{item.numeroOrden}</td>
                    <td>
                      <span 
                        className="detail-value material-normal"
                        style={{
                          background: colors.bg,
                          color: colors.color,
                          padding: '4px 16px',
                          borderRadius: '20px',
                          display: 'inline-block',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          border: '2px solid #0f3460'
                        }}
                      >
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 🔵 MODAL PARA CREAR/EDITAR */}
      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content modal-admin" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editando ? '✏️ Editar Material' : '➕ Nuevo Material'}</h2>
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
                  <label>Nombre del Material *</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Normal, Oro, Gomita..."
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
        message={`¿Estás seguro de eliminar el material "${registroAEliminar?.nombre}"?\nEsta acción no se puede deshacer.`}
        type="warning"
        confirmText="Eliminar"
        onConfirm={eliminarRegistro}
        showCancelButton={true}
      />
    </div>
  );
}

export default MaterialesAdmin;