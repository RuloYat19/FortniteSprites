import React, { useState, useEffect } from 'react';
import { cantidadPolvoInvocarService, materialesService } from '../../services/api';
import './Administrador.css';
import ConfirmModal from '../ConfirmModal';

function PolvoInvocarAdmin() {
  const [cantidades, setCantidades] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🔵 Filtros
  const [filtros, setFiltros] = useState({
    material: '',
    rareza: ''
  });

  // 🔵 Estado para el modal de crear/editar
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    numeroOrden: '',
    material: '',
    rareza: '',
    cantidad: ''
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

  // 🔵 Rarezas disponibles
  const rarezas = ['Raro', 'Épico', 'Legendario', 'Mítico'];

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
      material: '',
      rareza: ''
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
    if (!formData.numeroOrden || !formData.material || 
        !formData.rareza || !formData.cantidad) {
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

        <button className="btn-agregar-admin" onClick={abrirCrearModal}>
          ➕ Agregar registro
        </button>
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
              <th>Material</th>
              <th>Rareza</th>
              <th>Cantidad de Polvo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  {cantidades.length === 0 ? 'No hay registros en la base de datos' : 'No hay registros que coincidan con los filtros'}
                </td>
              </tr>
            ) : (
              datosFiltrados.map((item) => (
                <tr key={item.id}>
                  <td className="td-orden">{item.numeroOrden}</td>
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
        message={`¿Estás seguro de eliminar el registro?\nMaterial: ${registroAEliminar?.material}\nRareza: ${registroAEliminar?.rareza}\nEsta acción no se puede deshacer.`}
        type="warning"
        confirmText="Eliminar"
        onConfirm={eliminarRegistro}
        showCancelButton={true}
      />
    </div>
  );
}

export default PolvoInvocarAdmin;