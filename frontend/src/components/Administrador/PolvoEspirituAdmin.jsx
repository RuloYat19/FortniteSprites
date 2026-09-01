import React, { useState, useEffect } from 'react';
import { cantidadPolvoExtraerService, spritsService, materialesService } from '../../services/api';
import './Administrador.css';
import ConfirmModal from '../ConfirmModal';

function PolvoEspirituAdmin() {
  const [cantidades, setCantidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🔵 Estado para el botón de actualización
  const [actualizando, setActualizando] = useState(false);
  
  // 🔵 Filtros (independientes del formulario)
  const [filtros, setFiltros] = useState({
    material: '',
    rareza: '',
    nivelEspiritu: '',
    temporada: 'C7T4'
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
  
  // 🔵 Estado para el modal de confirmación de actualización
  const [showActualizarConfirmModal, setShowActualizarConfirmModal] = useState(false);

  // 🔵 Opciones para FILTROS (dependen del filtro de temporada)
  const [opcionesMaterialesFiltros, setOpcionesMaterialesFiltros] = useState([]);
  const [opcionesRarezasFiltros, setOpcionesRarezasFiltros] = useState([]);
  const [cargandoOpcionesFiltros, setCargandoOpcionesFiltros] = useState(false);
  
  // 🔵 Opciones para FORMULARIO (dependen de la temporada seleccionada en el formulario)
  const [opcionesMaterialesForm, setOpcionesMaterialesForm] = useState([]);
  const [opcionesRarezasForm, setOpcionesRarezasForm] = useState([]);
  const [cargandoOpcionesForm, setCargandoOpcionesForm] = useState(false);
  
  // 🔵 Estado para datos completos con temporada (para filtros)
  const [materialesConTemporada, setMaterialesConTemporada] = useState([]);

  // 🔵 Niveles y Temporadas disponibles
  const niveles = [1, 2, 3, 4, 5];
  const temporadas = ['C7T3', 'C7T4'];

  useEffect(() => {
    cargarCantidades();
    cargarOpcionesFiltros();
  }, []);

  // 🔵 Efecto para filtrar opciones de FILTROS según temporada seleccionada en filtros
  useEffect(() => {
    const temporada = filtros.temporada;
    const opcionesFijas = ['Variantes', 'Todos Los Materiales'];
    
    if (temporada) {
      const materialesFilt = materialesConTemporada
        .filter(item => item.temporada === temporada)
        .map(item => item.nombre);
      
      const materialesConFijas = [...materialesFilt, ...opcionesFijas];
      setOpcionesMaterialesFiltros(materialesConFijas.length > 0 ? materialesConFijas : []);
      
      if (filtros.material && !materialesFilt.includes(filtros.material) && !opcionesFijas.includes(filtros.material)) {
        setFiltros(prev => ({ ...prev, material: '' }));
      }
      if (filtros.rareza && !rarezasFilt.includes(filtros.rareza)) {
        setFiltros(prev => ({ ...prev, rareza: '' }));
      }
    } else {
      setOpcionesMaterialesFiltros(opcionesMaterialesFiltros);
      setOpcionesRarezasFiltros(opcionesRarezasFiltros);
    }
  }, [filtros.temporada, materialesConTemporada]);

  // 🔵 Efecto para cargar opciones del FORMULARIO cuando cambia la temporada en el formData
  useEffect(() => {
    if (formData.temporada) {
      cargarOpcionesForm(formData.temporada);
    } else {
      setOpcionesMaterialesForm([]);
      setOpcionesRarezasForm([]);
    }
  }, [formData.temporada]);

  // 🔵 Cargar cantidades
  const cargarCantidades = async () => {
    try {
      setLoading(true);
      const response = await cantidadPolvoExtraerService.getAll();
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

  // 🔵 Cargar opciones para FILTROS (materiales y rarezas con temporada)
  const cargarOpcionesFiltros = async () => {
    setCargandoOpcionesFiltros(true);
    try {
      const materialesRes = await materialesService.getAll();
      const materialesConTemp = materialesRes.data.map(item => ({
        nombre: item.nombre,
        temporada: item.temporada
      }));
      setMaterialesConTemporada(materialesConTemp);
      
      const opcionesFijas = ['Variantes', 'Todos Los Materiales'];
      const todosMateriales = [...materialesConTemp.map(item => item.nombre), ...opcionesFijas];
      setOpcionesMaterialesFiltros(todosMateriales);

      const cantidadesRes = await cantidadPolvoExtraerService.getAll();
      const rarezasUnicas = [...new Set(cantidadesRes.data.map(item => item.rareza))];
      setOpcionesRarezasFiltros(rarezasUnicas);
      
    } catch (err) {
      console.error('Error al cargar opciones para filtros:', err);
    } finally {
      setCargandoOpcionesFiltros(false);
    }
  };

  // 🔵 Cargar opciones del FORMULARIO según temporada
  const cargarOpcionesForm = async (temporada) => {
    if (!temporada) {
      setOpcionesMaterialesForm([]);
      return;
    }
    
    setCargandoOpcionesForm(true);
    try {
      const materialesRes = await materialesService.getAll();
      const materialesFilt = materialesRes.data
        .filter(item => item.temporada === temporada)
        .map(item => item.nombre);
      setOpcionesMaterialesForm(materialesFilt);
      
    } catch (err) {
      console.error('Error al cargar opciones del formulario:', err);
    } finally {
      setCargandoOpcionesForm(false);
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
      nivelEspiritu: '',
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
    setFormData({
      id: null,
      numeroOrden: obtenerSiguienteNumeroOrden().toString(),
      temporada: '',
      material: '',
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
      temporada: registro.temporada || '',
      material: registro.material || '',
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
      temporada: '',
      material: '',
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
    if (!formData.numeroOrden || !formData.temporada || !formData.material || 
        !formData.rareza || !formData.nivelEspiritu || !formData.cantidad) {
      mostrarConfirmacion('⚠️ Campos incompletos', 'Todos los campos son obligatorios', 'warning');
      return;
    }

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
        temporada: formData.temporada,
        material: formData.material,
        rareza: formData.rareza,
        nivelEspiritu: parseInt(formData.nivelEspiritu),
        cantidad: parseInt(formData.cantidad)
      };

      if (editando) {
        await cantidadPolvoExtraerService.update(formData.id, data);
        mostrarConfirmacion('✅ Actualizado', 'Registro actualizado correctamente', 'success');
      } else {
        await cantidadPolvoExtraerService.create(data);
        mostrarConfirmacion('✅ Creado', 'Registro creado correctamente', 'success');
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
      await cantidadPolvoExtraerService.delete(registroAEliminar.id);
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
    if (filtros.material && item.material !== filtros.material) return false;
    if (filtros.rareza && item.rareza !== filtros.rareza) return false;
    if (filtros.nivelEspiritu && item.nivelEspiritu !== parseInt(filtros.nivelEspiritu)) return false;
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
          Gestión de Polvo al Extraer
        </span>
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
            disabled={cargandoOpcionesFiltros}
          >
            <option value="">Materiales en General</option>
            {opcionesMaterialesFiltros.map((material, index) => (
              <option key={index} value={material}>{material}</option>
            ))}
          </select>

          <select 
            name="rareza" 
            value={filtros.rareza} 
            onChange={handleFiltroChange}
            className="filtro-select"
            disabled={cargandoOpcionesFiltros}
          >
            <option value="">Todas las rarezas</option>
            {opcionesRarezasFiltros.map((rareza, index) => (
              <option key={index} value={rareza}>{rareza}</option>
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
              <th>Nivel</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  {cantidades.length === 0 ? 'No hay registros en la base de datos' : 'No hay registros que coincidan con los filtros'}
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
                  <td>
                    <span className={`detail-value material-${item.material?.toLowerCase() || 'normal'}`}>
                      {item.material || 'N/A'}
                    </span>
                  </td>
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
                    disabled={cargandoOpcionesForm || !formData.temporada}
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
                    <option value="">Seleccionar material</option>
                    {opcionesMaterialesForm.map((material, index) => (
                      <option key={index} value={material}>{material}</option>
                    ))}
                  </select>
                  {!formData.temporada && (
                    <small style={{ color: '#888' }}>💡 Selecciona una temporada primero</small>
                  )}
                  {cargandoOpcionesForm && (
                    <small style={{ color: '#888' }}>⏳ Cargando materiales...</small>
                  )}
                </div>

                <div className="form-group">
                  <label>Rareza *</label>
                  <select
                    name="rareza"
                    value={formData.rareza}
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
                    <option value="">Seleccionar rareza</option>
                    {opcionesRarezasFiltros.map((rareza, index) => (
                      <option key={index} value={rareza}>{rareza}</option>
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
        message={`¿Estás seguro de eliminar el registro?\nTemporada: ${registroAEliminar?.temporada}\nMaterial: ${registroAEliminar?.material}\nRareza: ${registroAEliminar?.rareza}\nNivel: ${registroAEliminar?.nivelEspiritu}\nEsta acción no se puede deshacer.`}
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
        message={`¿Estás seguro de actualizar los valores de polvo en TODOS los sprits?\n\nEsto recalculará el polvo al extraer de cada sprit según la rareza y nivel.\n\nEsta acción puede tomar unos segundos.`}
        type="warning"
        confirmText="Sí, actualizar"
        onConfirm={actualizarPolvosEnSprits}
        showCancelButton={true}
      />
    </div>
  );
}

export default PolvoEspirituAdmin;