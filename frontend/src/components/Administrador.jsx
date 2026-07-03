// frontend/src/components/Administrador.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cantidadPolvoService } from '../services/api';
import './Administrador.css';
import ConfirmModal from './ConfirmModal';

function Administrador() {
  const navigate = useNavigate();
  const [cantidades, setCantidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🔵 Filtros
  const [filtros, setFiltros] = useState({
    rareza: '',
    nivelEspiritu: ''
  });

  // 🔵 Estado para el modal de crear/editar
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    numeroOrden: '',
    rareza: '',
    nivelEspiritu: '',
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

  // 🔵 Niveles y Rarezas disponibles
  const rarezas = ['Raro', 'Épico', 'Legendario', 'Mítico'];
  const niveles = [1, 2, 3, 4, 5];

  useEffect(() => {
    cargarCantidades();
  }, []);

  const cargarCantidades = async () => {
    try {
      setLoading(true);
      const response = await cantidadPolvoService.getAll();
      // Ordenar por numeroOrden ascendente
      const dataOrdenada = response.data.sort((a, b) => a.numeroOrden - b.numeroOrden);
      setCantidades(dataOrdenada);
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
      rareza: '',
      nivelEspiritu: ''
    });
  };

  // 🔵 Función para obtener el siguiente número de orden disponible
  const obtenerSiguienteNumeroOrden = () => {
    if (cantidades.length === 0) return 1;
    
    // Obtener todos los números de orden existentes y ordenarlos
    const numerosExistentes = cantidades.map(item => item.numeroOrden).sort((a, b) => a - b);
    
    // Buscar el primer número faltante
    let numeroEsperado = 1;
    for (let i = 0; i < numerosExistentes.length; i++) {
      if (numerosExistentes[i] > numeroEsperado) {
        return numeroEsperado; // Encontramos un hueco
      }
      numeroEsperado++;
    }
    
    // Si no hay huecos, devolver el siguiente número
    return numerosExistentes.length + 1;
  };

  // 🔵 Abrir modal para crear (con número de orden automático)
  const abrirCrearModal = () => {
    const siguienteNumero = obtenerSiguienteNumeroOrden();
    setFormData({
      id: null,
      numeroOrden: siguienteNumero.toString(),
      rareza: '',
      nivelEspiritu: '',
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
      rareza: registro.rareza,
      nivelEspiritu: registro.nivelEspiritu,
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
      rareza: '',
      nivelEspiritu: '',
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
    // Validaciones
    if (!formData.numeroOrden || !formData.rareza || 
        !formData.nivelEspiritu || !formData.cantidad) {
      mostrarConfirmacion('⚠️ Campos incompletos', 'Todos los campos son obligatorios', 'warning');
      return;
    }

    // 🔵 Validar que el número de orden no exista (solo para creación)
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
        rareza: formData.rareza,
        nivelEspiritu: parseInt(formData.nivelEspiritu),
        cantidad: parseInt(formData.cantidad)
      };

      if (editando) {
        await cantidadPolvoService.update(formData.id, data);
        mostrarConfirmacion('✅ Actualizado', 'Registro actualizado correctamente', 'success');
      } else {
        await cantidadPolvoService.create(data);
        //mostrarConfirmacion('✅ Creado', 'Registro creado correctamente', 'success');
      }
      
      cerrarModal();
      cargarCantidades();
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
      await cantidadPolvoService.delete(registroAEliminar.id);
      setShowDeleteConfirmModal(false);
      setRegistroAEliminar(null);
      mostrarConfirmacion('🗑️ Eliminado', 'Registro eliminado correctamente', 'success');
      cargarCantidades();
    } catch (err) {
      console.error('Error al eliminar:', err);
      mostrarConfirmacion('❌ Error', 'Error al eliminar el registro', 'error');
    }
  };

  // 🔵 Filtrar datos
  const datosFiltrados = cantidades.filter(item => {
    if (filtros.rareza && item.rareza !== filtros.rareza) return false;
    if (filtros.nivelEspiritu && item.nivelEspiritu !== parseInt(filtros.nivelEspiritu)) return false;
    return true;
  });

  // 🔵 Calcular estadísticas
  const totalRegistros = cantidades.length;
  const totalFiltrados = datosFiltrados.length;

  if (loading) return <div className="loading">Cargando datos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-container">
      {/* 🔵 BARRA LATERAL */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-icon">⚙️</span>
          <h2>Panel Admin</h2>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">📊 Módulos</div>
            <ul>
              <li className="active">
                <img 
                  src="./imagenesSprites/polvoEspiritu.png" 
                  alt="Polvo de Espíritu"
                  className="nav-icon-img"
                />
                <span>Polvo de Espíritu</span>
                <span className="nav-badge">{totalRegistros}</span>
              </li>
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button 
            className="btn-volver-sidebar"
            onClick={() => navigate('/')}
          >
            ← Regresar a Inicio
          </button>
        </div>
      </aside>

      {/* 🔵 CONTENIDO PRINCIPAL */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Módulo de Administrador</h1>
        </header>

        {/* 🔵 FILTROS */}
        <div className="admin-filtros">
          <div className="filtros-group">
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

            <select 
              name="nivelEspiritu" 
              value={filtros.nivelEspiritu} 
              onChange={handleFiltroChange}
              className="filtro-select"
            >
              <option value="">Todos los niveles</option>
              {niveles.map(n => (
                <option key={n} value={n}>Nivel {n}</option>
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
                <th>Rareza</th>
                <th>Nivel</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    {cantidades.length === 0 ? 'No hay registros en la base de datos' : 'No hay registros que coincidan con los filtros'}
                  </td>
                </tr>
              ) : (
                datosFiltrados.map((item) => (
                  <tr key={item.id}>
                    <td className="td-orden">{item.numeroOrden}</td>
                    <td>
                      <span className={`rareza-badge-admin ${item.rareza.toLowerCase()}`}>
                        {item.rareza}
                      </span>
                    </td>
                    <td className="td-nivel">✨ Nivel {item.nivelEspiritu}</td>
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
      </main>

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
                    disabled={!editando}  // 🔵 Deshabilitar en creación (es automático)
                  />
                  {!editando && (
                    <small style={{ color: '#888', display: 'block', marginTop: '4px' }}>
                      💡 Número asignado automáticamente
                    </small>
                  )}
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
                  <label>Nivel de Espíritu *</label>
                  <select
                    name="nivelEspiritu"
                    value={formData.nivelEspiritu}
                    onChange={handleFormChange}
                  >
                    <option value="">Seleccionar nivel</option>
                    {niveles.map(n => (
                      <option key={n} value={n}>Nivel {n}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Cantidad de Polvo *</label>
                  <input
                    type="number"
                    name="cantidad"
                    placeholder="Ej: 500"
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
        message={`¿Estás seguro de eliminar el registro Rareza: ${registroAEliminar?.rareza}\nEsta acción no se puede deshacer.`}
        type="warning"
        confirmText="Eliminar"
        onConfirm={eliminarRegistro}
        showCancelButton={true}
      />
    </div>
  );
}

export default Administrador;