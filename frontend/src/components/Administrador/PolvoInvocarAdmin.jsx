import React, { useState, useEffect } from 'react';
import { cantidadPolvoInvocarService, materialesService, spritsService } from '../../services/api';
import './Administrador.css';
import ConfirmModal from '../ConfirmModal';

function PolvoInvocarAdmin() {
  const [cantidades, setCantidades] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🔵 Estado para el botón de actualización
  const [actualizando, setActualizando] = useState(false);
  
  // 🔵 Filtros
  const [filtros, setFiltros] = useState({
    material: '',
    rareza: '',
    temporada: 'C7T4',
  });

  // 🔵 Estado para el modal de crear/editar
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    numeroOrden: '',
    temporada: '',
    material: '',
    rareza: '',
    cantidad: '',
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
  
  // 🔵 Estado para el modal de confirmación de actualización
  const [showActualizarConfirmModal, setShowActualizarConfirmModal] = useState(false);

  // 🔵 Rarezas disponibles
  const rarezas = ['Raro', 'Épico', 'Legendario', 'Mítico'];

  // Temporadas disponibles
  const temporadas = ['C7T3', 'C7T4'];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [cantidadesRes, materialesRes] = await Promise.all([
        cantidadPolvoInvocarService.getAll(),
        materialesService.getAll()
      ]);
      
      // Ordenar por numeroOrden
      const dataOrdenada = cantidadesRes.data.sort((a, b) => a.numeroOrden - b.numeroOrden);
      setCantidades(dataOrdenada);
      setMateriales(materialesRes.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
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
    }, 4000);
  };

  // 🔵 FUNCIÓN PARA ACTUALIZAR POLVOS EN SPRITS
  const actualizarPolvosEnSprits = async () => {
    setActualizando(true);
    try {
      const response = await spritsService.actualizarPolvos();
      
      const { sprits_actualizados, total_sprits, sprits_con_error, errores } = response.data;
      
      let mensaje = `✅ Se actualizaron ${sprits_actualizados} de ${total_sprits} sprits`;
      if (sprits_con_error > 0) {
        mensaje += ` (${sprits_con_error} con errores)`;
      }
      
      mostrarConfirmacion(
        '🔄 Actualización completada',
        mensaje,
        sprits_con_error > 0 ? 'warning' : 'success'
      );
      
      if (errores && errores.length > 0) {
        console.warn('Errores al actualizar:', errores);
      }
      
    } catch (err) {
      console.error('Error al actualizar polvos:', err);
      mostrarConfirmacion(
        '❌ Error',
        err.response?.data?.detail || 'Hubo un error al actualizar los polvos de los sprits',
        'error'
      );
    } finally {
      setActualizando(false);
      setShowActualizarConfirmModal(false);
    }
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
      material: '',
      rareza: '',
      temporada: 'C7T4'
    });
  };

  // 🔵 Función para obtener el siguiente número de orden disponible
  const obtenerSiguienteNumeroOrden = () => {
    if (cantidades.length === 0) return 1;
    
    const numerosExistentes = cantidades.map(item => item.numeroOrden).sort((a, b) => a - b);
    
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
      material: '',
      rareza: '',
      cantidad: ''
    });
    setEditando(false);
    setShowModal(true);
  };

  // 🔵 Abrir modal para editar
  const abrirEditarModal = (registro) => {
    setFormData({
      id: registro.id,
      numeroOrden: registro.numeroOrden,
      temporada: registro.temporada || '',  // 🔵 NUEVO
      material: registro.material,
      rareza: registro.rareza,
      cantidad: registro.cantidad
    });
    setEditando(true);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setFormData({
      id: null,
      numeroOrden: '',
      temporada: '',  // 🔵 NUEVO
      material: '',
      rareza: '',
      cantidad: ''
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
    if (!formData.numeroOrden || !formData.temporada || !formData.material || 
        !formData.rareza || !formData.cantidad) {  // 🔵 Agregar temporada a validación
      mostrarConfirmacion('⚠️ Campos incompletos', 'Todos los campos son obligatorios', 'warning');
      return;
    }

    // Verificar duplicado de número de orden en creación
    if (!editando) {
      const numeroExistente = cantidades.some(
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
        temporada: formData.temporada,  // 🔵 NUEVO
        material: formData.material,
        rareza: formData.rareza,
        cantidad: parseInt(formData.cantidad)
      };

      if (editando) {
        await cantidadPolvoInvocarService.update(formData.id, data);
        mostrarConfirmacion('✅ Actualizado', 'Registro actualizado correctamente', 'success');
      } else {
        await cantidadPolvoInvocarService.create(data);
        mostrarConfirmacion('✅ Creado', 'Registro creado correctamente', 'success');
      }
      
      cerrarModal();
      cargarDatos();
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

    try {
      await cantidadPolvoInvocarService.delete(registroAEliminar.id);
      setShowDeleteConfirmModal(false);
      setRegistroAEliminar(null);
      mostrarConfirmacion('🗑️ Eliminado', 'Registro eliminado correctamente', 'success');
      cargarDatos();
    } catch (err) {
      console.error('Error al eliminar:', err);
      mostrarConfirmacion('❌ Error', 'Error al eliminar el registro', 'error');
    }
  };

  // 🔵 Filtrar datos
  const datosFiltrados = cantidades.filter(item => {
    if (filtros.material && item.material !== filtros.material) return false;
    if (filtros.rareza && item.rareza !== filtros.rareza) return false;
    // 🔵 NUEVO FILTRO POR TEMPORADA
    if (filtros.temporada && item.temporada !== filtros.temporada) return false;
    return true;
  });

  const totalRegistros = cantidades.length;
  const totalFiltrados = datosFiltrados.length;

  if (loading) return <div className="loading">Cargando datos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-main" style={{ padding: '30px 35px', flex: 1 }}>
      <header className="admin-header">
        <img 
          src="/imagenesSprites/polvoEspiritu.png" 
          alt="Polvo de Espíritu"
          className="nav-icon-img"
        />
        <span className="titulo">
          Gestión de Polvo al Invocar
        </span>
        <p className="admin-subtitle">Cantidad de polvo necesaria para invocar sprits según material y rareza</p>
      </header>

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

          <select 
            name="material" 
            value={filtros.material} 
            onChange={handleFiltroChange}
            className="filtro-select"
          >
            <option value="">Todos los materiales</option>
            {materiales.map(m => (
              <option key={m.id} value={m.nombre}>{m.nombre}</option>
            ))}
          </select>

          <select 
            name="rareza" 
            value={filtros.rareza} 
            onChange={handleFiltroChange}
            className="filtro-select"
          >
            <option value="">Todas las rarezas</option>
            {rarezas.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
            Limpiar Filtros
          </button>
        </div>

        <div className="filtros-group" style={{ gap: '8px' }}>
          <button 
            className="btn-actualizar-sprits"
            onClick={() => setShowActualizarConfirmModal(true)}
            disabled={actualizando}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              background: '#FF9800',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap'
            }}
          >
            {actualizando ? '⏳ Actualizando...' : '🔄 Actualizar Valores en Sprites'}
          </button>
          
          <button className="btn-agregar-admin" onClick={abrirCrearModal}>
            ➕ Agregar registro
          </button>
        </div>
      </div>

      {/* 🔵 ESTADÍSTICAS */}
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
              <th>Material</th>
              <th>Rareza</th>
              <th>Cantidad de Polvo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                {/* 🔵 CORREGIDO: colSpan ahora es 6 */}
                <td colSpan="6" className="no-data">
                  {cantidades.length === 0 ? 'No hay registros en la base de datos' : 'No hay registros que coincidan con los filtros'}
                </td>
              </tr>
            ) : (
              datosFiltrados.map((item) => (
                <tr key={item.id}>
                  <td className="td-orden">{item.numeroOrden}</td>
                  {/* 🔵 NUEVA COLUMNA - Temporada */}
                  <td>
                    <span style={{ color: '#ffb74d', fontWeight: 'bold' }}>
                      {item.temporada || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={`detail-value material-${item.material.toLowerCase()}`}>
                      {item.material}
                    </span>
                  </td>
                  <td>
                    <span className={`rareza-badge-admin ${item.rareza.toLowerCase()}`}>
                      {item.rareza}
                    </span>
                  </td>
                  <td className="td-cantidad">
                    <span className="cantidad-valor">
                      {item.cantidad.toLocaleString()}
                    </span>
                    <img 
                      src="./imagenesSprites/polvoEspiritu.png" 
                      alt="Polvo"
                      className="polvo-icon-admin-small"
                    />
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
              <h2>{editando ? '✏️ Editar registro' : '➕ Nuevo registro'}</h2>
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
                    value={formData.temporada}
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
                  <label>Material *</label>
                  <select
                    name="material"
                    value={formData.material}
                    onChange={handleFormChange}
                  >
                    <option value="">Seleccionar material</option>
                    {materiales.map(m => (
                      <option key={m.id} value={m.nombre}>{m.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Rareza *</label>
                  <select
                    name="rareza"
                    value={formData.rareza}
                    onChange={handleFormChange}
                  >
                    <option value="">Seleccionar rareza</option>
                    {rarezas.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Cantidad de Polvo *</label>
                  <input
                    type="number"
                    name="cantidad"
                    placeholder="Ej: 4000"
                    value={formData.cantidad}
                    onChange={handleFormChange}
                    min="0"
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
        message={`¿Estás seguro de eliminar el registro?\nTemporada: ${registroAEliminar?.temporada}\nMaterial: ${registroAEliminar?.material}\nRareza: ${registroAEliminar?.rareza}\nEsta acción no se puede deshacer.`}
        type="warning"
        confirmText="Eliminar"
        onConfirm={eliminarRegistro}
        showCancelButton={true}
      />

      {/* 🔵 MODAL DE CONFIRMACIÓN PARA ACTUALIZAR SPRITS */}
      <ConfirmModal
        isOpen={showActualizarConfirmModal}
        onClose={() => setShowActualizarConfirmModal(false)}
        title="⚠️ Confirmar actualización"
        message={`¿Estás seguro de actualizar los valores de polvo en TODOS los sprits?\n\nEsto recalculará el polvo al invocar de cada sprit según su material y rareza.\n\nEsta acción puede tomar unos segundos.`}
        type="warning"
        confirmText="Sí, actualizar"
        onConfirm={actualizarPolvosEnSprits}
        showCancelButton={true}
      />
    </div>
  );
}

export default PolvoInvocarAdmin;