import React, { useState, useEffect } from 'react';
import { ordenDefaultService, ordenRarezaService } from '../../services/api';
import './Administrador.css';
import ConfirmModal from '../ConfirmModal';

function OrdenesAdmin() {
  // 🔵 Estado para la pestaña activa
  const [tabActiva, setTabActiva] = useState('default');

  // 🔵 Estado para Orden Default
  const [ordenDefault, setOrdenDefault] = useState([]);
  const [loadingDefault, setLoadingDefault] = useState(true);
  const [errorDefault, setErrorDefault] = useState(null);

  // 🔵 Estado para Orden Rareza
  const [ordenRareza, setOrdenRareza] = useState([]);
  const [loadingRareza, setLoadingRareza] = useState(true);
  const [errorRareza, setErrorRareza] = useState(null);

  // 🔵 Filtros
  const [filtros, setFiltros] = useState({
    nombre: '',
    temporada: ''
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

  // 🔵 Temporadas disponibles
  const temporadas = ['C7T3', 'C7T4'];

  // 🔵 Cargar datos según la pestaña activa
  useEffect(() => {
    if (tabActiva === 'default') {
      cargarOrdenDefault();
    } else {
      cargarOrdenRareza();
    }
  }, [tabActiva]);

  // 🔵 Cargar Orden Default
  const cargarOrdenDefault = async () => {
    try {
      setLoadingDefault(true);
      const response = await ordenDefaultService.getAll();
      const dataOrdenada = response.data.sort((a, b) => a.numeroOrden - b.numeroOrden);
      setOrdenDefault(dataOrdenada);
      setErrorDefault(null);
    } catch (err) {
      setErrorDefault('Error al cargar el orden default');
      console.error(err);
    } finally {
      setLoadingDefault(false);
    }
  };

  // 🔵 Cargar Orden Rareza
  const cargarOrdenRareza = async () => {
    try {
      setLoadingRareza(true);
      const response = await ordenRarezaService.getAll();
      const dataOrdenada = response.data.sort((a, b) => a.numeroOrden - b.numeroOrden);
      setOrdenRareza(dataOrdenada);
      setErrorRareza(null);
    } catch (err) {
      setErrorRareza('Error al cargar el orden por rareza');
      console.error(err);
    } finally {
      setLoadingRareza(false);
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
      temporada: ''
    });
  };

  // 🔵 Obtener datos según pestaña activa
  const getDatos = () => {
    if (tabActiva === 'default') {
      return ordenDefault;
    }
    return ordenRareza;
  };

  // 🔵 Obtener servicio según pestaña activa
  const getServicio = () => {
    if (tabActiva === 'default') {
      return ordenDefaultService;
    }
    return ordenRarezaService;
  };

  // 🔵 Obtener título según pestaña activa
  const getTitulo = () => {
    if (tabActiva === 'default') {
      return 'Orden Default';
    }
    return 'Orden por Rareza';
  };

  // 🔵 Obtener loading según pestaña activa
  const getLoading = () => {
    if (tabActiva === 'default') {
      return loadingDefault;
    }
    return loadingRareza;
  };

  // 🔵 Obtener error según pestaña activa
  const getError = () => {
    if (tabActiva === 'default') {
      return errorDefault;
    }
    return errorRareza;
  };

  // 🔵 Función para obtener el siguiente número de orden disponible
  const obtenerSiguienteNumeroOrden = () => {
    const datos = getDatos();
    if (datos.length === 0) return 1;
    
    const numerosExistentes = datos.map(item => item.numeroOrden).sort((a, b) => a - b);
    
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
      temporada: '',  // 🔵 NUEVO
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

  // 🔵 Guardar (crear o actualizar)
  const guardarRegistro = async () => {
    if (!formData.numeroOrden || !formData.temporada || !formData.nombre.trim()) {
      mostrarConfirmacion('⚠️ Campos incompletos', 'Todos los campos son obligatorios', 'warning');
      return;
    }

    const servicio = getServicio();
    const datos = getDatos();

    if (!editando) {
      const numeroExistente = datos.some(
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
        temporada: formData.temporada,
        nombre: formData.nombre.trim()
      };

      if (editando) {
        await servicio.update(formData.id, data);
        mostrarConfirmacion('✅ Actualizado', `${getTitulo()} actualizado correctamente`, 'success');
      } else {
        await servicio.create(data);
        mostrarConfirmacion('✅ Creado', `${getTitulo()} creado correctamente`, 'success');
      }
      
      cerrarModal();
      if (tabActiva === 'default') {
        cargarOrdenDefault();
      } else {
        cargarOrdenRareza();
      }
    } catch (err) {
      console.error('Error al guardar:', err);
      mostrarConfirmacion('❌ Error', err.response?.data?.detail || 'Error al guardar el registro', 'error');
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

    const servicio = getServicio();

    try {
      await servicio.delete(registroAEliminar.id);
      setShowDeleteConfirmModal(false);
      setRegistroAEliminar(null);
      mostrarConfirmacion('🗑️ Eliminado', `${getTitulo()} eliminado correctamente`, 'success');
      if (tabActiva === 'default') {
        cargarOrdenDefault();
      } else {
        cargarOrdenRareza();
      }
    } catch (err) {
      console.error('Error al eliminar:', err);
      const mensaje = err.response?.data?.detail || 'Error al eliminar el registro';
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
      const servicio = getServicio();
      const response = await servicio.createBatch(nombresArray);
      const creados = response.data.length;
      mostrarConfirmacion('✅ Batch creado', `${creados} ${getTitulo()} creados correctamente`, 'success');
      cerrarBatchModal();
      if (tabActiva === 'default') {
        cargarOrdenDefault();
      } else {
        cargarOrdenRareza();
      }
    } catch (err) {
      console.error('Error al crear batch:', err);
      mostrarConfirmacion('❌ Error', err.response?.data?.detail || 'Error al crear los registros', 'error');
    }
  };

  // 🔵 Filtrar datos
  const datosFiltrados = getDatos().filter(item => {
    if (filtros.nombre && !item.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())) return false;
    if (filtros.temporada && item.temporada !== filtros.temporada) return false;  // 🔵 NUEVO
    return true;
  });

  const totalRegistros = getDatos().length;
  const totalFiltrados = datosFiltrados.length;

  if (getLoading()) return <div className="loading">Cargando {getTitulo()}...</div>;
  if (getError()) return <div className="error">{getError()}</div>;

  return (
    <div className="admin-main" style={{ padding: '30px 35px', flex: 1 }}>
      <header className="admin-header">
        <span className="titulo">
          📋 Gestión de Órdenes
        </span>
      </header>

      {/* 🔵 TABS */}
      <div className="admin-tabs" style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'rgba(15, 52, 96, 0.3)', borderRadius: '12px', padding: '4px' }}>
        <button
          className={`admin-tab ${tabActiva === 'default' ? 'active' : ''}`}
          onClick={() => setTabActiva('default')}
          style={{
            flex: 1,
            padding: '12px 20px',
            border: 'none',
            borderRadius: '8px',
            background: tabActiva === 'default' ? '#35cf35' : 'transparent',
            color: tabActiva === 'default' ? '#1a1a2e' : '#aaa',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}
        >
          📌 Orden Default
        </button>
        <button
          className={`admin-tab ${tabActiva === 'rareza' ? 'active' : ''}`}
          onClick={() => setTabActiva('rareza')}
          style={{
            flex: 1,
            padding: '12px 20px',
            border: 'none',
            borderRadius: '8px',
            background: tabActiva === 'rareza' ? '#35cf35' : 'transparent',
            color: tabActiva === 'rareza' ? '#1a1a2e' : '#aaa',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s ease'
          }}
        >
          🏷️ Orden por Rareza
        </button>
      </div>

      {/* 🔵 FILTROS */}
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
            ➕ Agregar
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
          <span className="stat-icon">📊</span>
          <div>
            <span className="stat-label">Total registros</span>
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
              <th>Temporada</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  {totalRegistros === 0 ? `No hay registros en ${getTitulo()}` : 'No hay registros que coincidan con los filtros'}
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

      {/* 🔵 MODAL PARA CREAR/EDITAR */}
      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content modal-admin" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editando ? `✏️ Editar ${getTitulo()}` : `➕ Nuevo ${getTitulo()}`}</h2>
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

      {/* 🔵 MODAL PARA BATCH */}
      {showBatchModal && (
        <div className="modal-overlay" onClick={cerrarBatchModal}>
          <div className="modal-content modal-admin" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h2>📋 Crear Múltiples {getTitulo()}</h2>
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
        message={`¿Estás seguro de eliminar el registro?\nTemporada: ${registroAEliminar?.temporada}\nNombre: ${registroAEliminar?.nombre}\nEsta acción no se puede deshacer.`}
        type="warning"
        confirmText="Eliminar"
        onConfirm={eliminarRegistro}
        showCancelButton={true}
      />
    </div>
  );
}

export default OrdenesAdmin;