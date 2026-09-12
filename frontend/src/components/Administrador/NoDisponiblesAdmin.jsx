import React, { useState, useEffect } from 'react';
import { spritsService, materialesService, nombresSpritesService, metodoSubidaNivelService } from '../../services/api';
import './Administrador.css';
import ConfirmModal from '../ConfirmModal';

function NoDisponiblesAdmin() {
  const [sprits, setSprits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🔵 Filtros
  const [filtros, setFiltros] = useState({
    nombre: '',
    rareza: '',
    temporada: 'C7T4'
  });

  // 🔵 Estado para el modal de crear/editar
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    rareza: '',
    material: '',
    temporada: 'C7T4',
    metodoSubidaNivel: '',
    nombreArchivoImagen: '',
    nivelEspiritu: 1,
    polvoAlExtraer: '',
    polvoAlInvocar: ''
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

  // 🔵 Estado para búsqueda de sprit existente
  const [spritExistente, setSpritExistente] = useState(null);
  const [buscandoSprit, setBuscandoSprit] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState(null);

  // 🔵 Opciones para selects
  const [opcionesNombres, setOpcionesNombres] = useState([]);
  const [opcionesNombresCompletos, setOpcionesNombresCompletos] = useState([]);
  const [nombresConTemporada, setNombresConTemporada] = useState([]);
  const [nombresFiltrados, setNombresFiltrados] = useState([]);
  const [materialesConTemporada, setMaterialesConTemporada] = useState([]);
  const [materialesFiltrados, setMaterialesFiltrados] = useState([]);
  const [opcionesMateriales, setOpcionesMateriales] = useState([]);
  const [opcionesMetodosSubida, setOpcionesMetodosSubida] = useState([]);
  const [cargandoOpciones, setCargandoOpciones] = useState(false);

  const rarezas = ['Raro', 'Épico', 'Legendario', 'Mítico'];
  const temporadas = ['C7T3', 'C7T4'];
  const niveles = [1, 2, 3, 4, 5];

  useEffect(() => {
    cargarSpritsNoDisponibles();
    cargarOpciones();
  }, []);

  // 🔵 Efecto para filtrar nombres cuando cambia la temporada en el formulario
  useEffect(() => {
    if (formData.temporada) {
        // Filtrar nombres
        const nombresFilt = nombresConTemporada
        .filter(item => item.temporada === formData.temporada)
        .map(item => item.nombre);
        setNombresFiltrados(nombresFilt);
        
        if (formData.nombre && !nombresFilt.includes(formData.nombre)) {
        setFormData(prev => ({ ...prev, nombre: '' }));
        }

        // 🔵 Filtrar materiales - INCLUIR los que tienen temporada NULL
        const materialesFilt = materialesConTemporada
        .filter(item => item.temporada === formData.temporada || item.temporada === null)
        .map(item => item.nombre);
        setMaterialesFiltrados(materialesFilt);
        
        if (formData.material && !materialesFilt.includes(formData.material)) {
        setFormData(prev => ({ ...prev, material: '' }));
        }
    } else {
        setNombresFiltrados(opcionesNombresCompletos);
        setMaterialesFiltrados(opcionesMateriales);
    }
    }, [formData.temporada, nombresConTemporada, materialesConTemporada]);

  // 🔵 Cargar sprits con estaEnElJuego = false
  const cargarSpritsNoDisponibles = async () => {
    try {
      setLoading(true);
      const response = await spritsService.getAll();
      const noDisponibles = response.data.filter(sprit => sprit.estaEnElJuego === false);
      setSprits(noDisponibles);
      setError(null);
    } catch (err) {
      setError('Error al cargar los sprits no disponibles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Cargar opciones para selects
  const cargarOpciones = async () => {
    setCargandoOpciones(true);
    try {
        const [nombresRes, materialesRes, metodosRes] = await Promise.all([
        nombresSpritesService.getAll(),
        materialesService.getAll(),
        metodoSubidaNivelService.getAll()
        ]);

        // 🔵 Nombres con temporada
        const nombresConTemp = nombresRes.data
            .sort((a, b) => a.numeroOrden - b.numeroOrden)
            .map(item => ({
                nombre: item.nombre,
                temporada: item.temporada
            }));
            
            setNombresConTemporada(nombresConTemp);
            
            const nombres = nombresConTemp.map(item => item.nombre);
            setOpcionesNombresCompletos(nombres);
            setOpcionesNombres(nombres);
            setNombresFiltrados(nombres);

            // 🔵 Materiales con temporada
            const materialesConTemp = materialesRes.data.map(item => ({
            nombre: item.nombre,
            temporada: item.temporada
            }));
            
            setMaterialesConTemporada(materialesConTemp);
            
            const materiales = materialesConTemp.map(item => item.nombre);
            setOpcionesMateriales(materiales);
            setMaterialesFiltrados(materiales);

            const metodos = metodosRes.data
            .sort((a, b) => a.numeroOrden - b.numeroOrden)
            .map(item => item.nombre);
            setOpcionesMetodosSubida(metodos);
        } catch (err) {
            console.error('Error al cargar opciones:', err);
        } finally {
            setCargandoOpciones(false);
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
        rareza: '',
        temporada: 'C7T4'
        });
    };

    // 🔵 BUSCAR SPRIT EXISTENTE por nombre, rareza y temporada
    const buscarSpritExistente = async () => {
    const { nombre, rareza, material, temporada } = formData;
    
    // 🔵 Agregar material a la validación
    if (!nombre || !rareza || !material || !temporada) {
        mostrarConfirmacion('⚠️ Campos incompletos', 'Debes seleccionar Nombre, Rareza, Material y Temporada', 'warning');
        return;
    }

    setBuscandoSprit(true);
    setErrorBusqueda(null);
    
    try {
        const response = await spritsService.getAll();
        const spritEncontrado = response.data.find(s => 
        s.nombre === nombre && 
        s.rareza === rareza && 
        s.material === material &&
        s.temporada === temporada
        );

        if (spritEncontrado) {
        setSpritExistente(spritEncontrado);
        setErrorBusqueda(null);
        
        if (spritEncontrado.estaEnElJuego === true) {
            mostrarConfirmacion(
            'ℹ️ Sprit encontrado',
            `El sprit "${nombre}" existe y está disponible en el juego. ¿Deseas marcarlo como NO disponible?`,
            'info'
            );
            cargarDatosSprit(spritEncontrado);
        } else if (spritEncontrado.estaEnElJuego === false) {
            mostrarConfirmacion(
            '⚠️ Ya está en la lista',
            `El sprit "${nombre}" ya está marcado como NO disponible.`,
            'warning'
            );
            setSpritExistente(null);
            cerrarModal();
        }
        } else {
        setErrorBusqueda(`❌ No se encontró un sprit con el nombre "${nombre}", rareza "${rareza}", material "${material}" y temporada "${temporada}".`);
        mostrarConfirmacion(
            '❌ Sprit no encontrado',
            `No se encontró un sprit con el nombre "${nombre}", rareza "${rareza}", material "${material}" y temporada "${temporada}".\n\nEste panel solo permite marcar sprits existentes como NO disponibles.\nPara crear un nuevo sprit, usa el panel de "Inventario de Sprites".`,
            'error'
        );
        setSpritExistente(null);
        }
    } catch (err) {
        console.error('Error al buscar sprit:', err);
        mostrarConfirmacion('❌ Error', 'Hubo un error al buscar el sprit', 'error');
    } finally {
        setBuscandoSprit(false);
    }
    };

  // 🔵 Cargar datos del sprit existente en el formulario
  const cargarDatosSprit = (sprit) => {
    setFormData({
      id: sprit.id,
      nombre: sprit.nombre,
      rareza: sprit.rareza,
      material: sprit.material || '',
      temporada: sprit.temporada || 'C7T4',
      metodoSubidaNivel: sprit.metodoSubidaNivel || '',
      nombreArchivoImagen: sprit.nombreArchivoImagen || '',
      nivelEspiritu: sprit.nivelEspiritu || 1,
      polvoAlExtraer: sprit.polvoAlExtraer || '',
      polvoAlInvocar: sprit.polvoAlInvocar || ''
    });
    setEditando(true);
  };

  // 🔵 Abrir modal para buscar/marcar
  const abrirCrearModal = () => {
    setFormData({
      id: null,
      nombre: '',
      rareza: '',
      material: '',
      temporada: 'C7T4',
      metodoSubidaNivel: '',
      nombreArchivoImagen: '',
      nivelEspiritu: 1,
      polvoAlExtraer: '',
      polvoAlInvocar: ''
    });
    setSpritExistente(null);
    setErrorBusqueda(null);
    setEditando(false);
    setShowModal(true);
  };

  // 🔵 Abrir modal para editar (desde la tabla)
  const abrirEditarModal = (registro) => {
    setFormData({
      id: registro.id,
      nombre: registro.nombre,
      rareza: registro.rareza,
      material: registro.material || '',
      temporada: registro.temporada || 'C7T4',
      metodoSubidaNivel: registro.metodoSubidaNivel || '',
      nombreArchivoImagen: registro.nombreArchivoImagen || '',
      nivelEspiritu: registro.nivelEspiritu || 1,
      polvoAlExtraer: registro.polvoAlExtraer || '',
      polvoAlInvocar: registro.polvoAlInvocar || ''
    });
    setSpritExistente(registro);
    setErrorBusqueda(null);
    setEditando(true);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setFormData({
      id: null,
      nombre: '',
      rareza: '',
      material: '',
      temporada: 'C7T4',
      metodoSubidaNivel: '',
      nombreArchivoImagen: '',
      nivelEspiritu: 1,
      polvoAlExtraer: '',
      polvoAlInvocar: ''
    });
    setSpritExistente(null);
    setErrorBusqueda(null);
    setEditando(false);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🔵 Guardar (SOLO actualizar sprit existente a no disponible)
  const guardarRegistro = async () => {
    if (!formData.id) {
        mostrarConfirmacion('❌ Error', 'No se puede crear un nuevo sprit desde este panel. Solo se pueden marcar sprits existentes.', 'error');
        return;
    }

    // 🔵 Agregar material a la validación
    if (!formData.nombre || !formData.rareza || !formData.temporada || !formData.material) {
        mostrarConfirmacion('⚠️ Campos incompletos', 'Nombre, Rareza, Material y Temporada son obligatorios', 'warning');
        return;
    }

    try {
        const data = {
        nombre: formData.nombre,
        rareza: formData.rareza,
        material: formData.material,
        temporada: formData.temporada,
        metodoSubidaNivel: formData.metodoSubidaNivel || null,
        nombreArchivoImagen: formData.nombreArchivoImagen || null,
        nivelEspiritu: parseInt(formData.nivelEspiritu) || 1,
        polvoAlExtraer: formData.polvoAlExtraer ? parseInt(formData.polvoAlExtraer) : null,
        polvoAlInvocar: formData.polvoAlInvocar ? parseInt(formData.polvoAlInvocar) : null,
        estaEnElJuego: false,
        yaFueDominado: formData.yaFueDominado || false,
        estaDominado: formData.estaDominado || false,
        estaEnInventario: formData.estaEnInventario || false,
        estaDesbloqueado: formData.estaDesbloqueado || false
        };

        await spritsService.update(formData.id, data);
        mostrarConfirmacion('✅ Actualizado', `Sprit "${formData.nombre}" marcado como NO disponible`, 'success');
        
        cerrarModal();
        cargarSpritsNoDisponibles();
    } catch (err) {
        console.error('Error al guardar:', err);
        mostrarConfirmacion('❌ Error', err.response?.data?.detail || 'Error al guardar el sprit', 'error');
    }
    };

  // 🔵 Confirmar eliminación (cambiar a estaEnElJuego = true)
  const confirmarEliminacion = (registro) => {
    setRegistroAEliminar(registro);
    setShowDeleteConfirmModal(true);
  };

  // 🔵 "Eliminar" = Cambiar estaEnElJuego a true (disponible)
  const eliminarRegistro = async () => {
    if (!registroAEliminar) return;

    try {
      await spritsService.update(registroAEliminar.id, {
        estaEnElJuego: true
      });
      
      setShowDeleteConfirmModal(false);
      setRegistroAEliminar(null);
      mostrarConfirmacion(
        '✅ Sprit disponible', 
        `El sprit "${registroAEliminar.nombre}" ahora está disponible en el juego`,
        'success'
      );
      cargarSpritsNoDisponibles();
    } catch (err) {
      console.error('Error al actualizar:', err);
      mostrarConfirmacion('❌ Error', err.response?.data?.detail || 'Error al actualizar el sprit', 'error');
    }
  };

  // 🔵 Filtrar datos
  const datosFiltrados = sprits.filter(item => {
    if (filtros.nombre && !item.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())) return false;
    if (filtros.rareza && item.rareza !== filtros.rareza) return false;
    if (filtros.temporada && item.temporada !== filtros.temporada) return false;
    return true;
  });

  const totalRegistros = sprits.length;
  const totalFiltrados = datosFiltrados.length;

  if (loading) return <div className="loading">Cargando sprits no disponibles...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-main" style={{ padding: '30px 35px', flex: 1 }}>
      <header className="admin-header">
        <span className="titulo" style={{ color: '#f44336' }}>
          🚫 Sprits No Disponibles en el Juego
        </span>
        <p className="admin-subtitle">Sprits que actualmente NO están disponibles (estaEnElJuego = false)</p>
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
          🔍 Buscar y Marcar No Disponible
        </button>
      </div>

      {/* 🔵 ESTADÍSTICAS RÁPIDAS */}
      <div className="admin-stats">
        <div className="stat-card" style={{ borderColor: '#f44336' }}>
          <span className="stat-icon">🚫</span>
          <div>
            <span className="stat-label">Total no disponibles</span>
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
              <th>Temporada</th>
              <th>Nombre</th>
              <th>Rareza</th>
              <th>Material</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  {totalRegistros === 0 
                    ? '✅ Todos los sprits están disponibles en el juego' 
                    : 'No hay sprits que coincidan con los filtros'}
                </td>
              </tr>
            ) : (
              datosFiltrados.map((item) => (
                <tr key={item.id}>
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
                  <td>
                    <span className={`rareza-badge-admin ${item.rareza.toLowerCase()}`}>
                      {item.rareza}
                    </span>
                  </td>
                  <td>
                    <span className={`detail-value material-${item.material?.toLowerCase() || 'normal'}`}>
                      {item.material || 'N/A'}
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
                      title="Marcar como disponible"
                      style={{ background: 'rgba(76, 175, 80, 0.2)', borderRadius: '4px' }}
                    >
                      ✅
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔵 MODAL PARA BUSCAR/MARCAR */}
      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content modal-admin" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editando ? '✏️ Editar Sprit No Disponible' : '🔍 Buscar y Marcar No Disponible'}</h2>
              <button className="modal-close" onClick={cerrarModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="admin-form">
                {/* 🔵 CAMPOS PARA BUSCAR */}
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
                  <label>Nombre *</label>
                  <select
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleFormChange}
                    disabled={cargandoOpciones || !formData.temporada}
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
                    <option value="">Seleccionar nombre</option>
                    {nombresFiltrados.map(nombre => (
                      <option key={nombre} value={nombre}>{nombre}</option>
                    ))}
                  </select>
                  {!formData.temporada && (
                    <small style={{ color: '#888' }}>💡 Selecciona una temporada primero</small>
                  )}
                  {formData.temporada && nombresFiltrados.length === 0 && (
                    <small style={{ color: '#ff9800' }}>⚠️ No hay nombres disponibles para esta temporada</small>
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
                    <label>Material *</label>
                    <select
                        name="material"
                        value={formData.material}
                        onChange={handleFormChange}
                        disabled={cargandoOpciones || !formData.temporada}
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
                        {materialesFiltrados.map(material => (
                        <option key={material} value={material}>{material}</option>
                        ))}
                    </select>
                    {!formData.temporada && (
                        <small style={{ color: '#888' }}>💡 Selecciona una temporada primero</small>
                    )}
                    {formData.temporada && materialesFiltrados.length === 0 && (
                        <small style={{ color: '#ff9800' }}>⚠️ No hay materiales disponibles para esta temporada</small>
                    )}
                </div>

                {/* 🔵 BOTÓN PARA BUSCAR SPRIT EXISTENTE */}
                <div className="form-group" style={{ marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={buscarSpritExistente}
                    disabled={buscandoSprit || !formData.nombre || !formData.rareza || !formData.material || !formData.temporada}
                    style={{
                        width: '100%',
                        padding: '10px',
                        border: 'none',
                        borderRadius: '6px',
                        background: '#2196f3',
                        color: '#fff',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        opacity: (!formData.nombre || !formData.rareza || !formData.material || !formData.temporada) ? 0.6 : 1
                    }}
                    >
                    {buscandoSprit ? '⏳ Buscando...' : '🔍 Buscar Sprit Existente'}
                  </button>
                </div>

                {/* 🔵 ERROR DE BÚSQUEDA */}
                {errorBusqueda && !editando && (
                  <div style={{
                    background: 'rgba(244, 67, 54, 0.15)',
                    border: '1px solid #f44336',
                    borderRadius: '6px',
                    padding: '10px',
                    marginBottom: '15px',
                    marginTop: '10px'
                  }}>
                    <p style={{ color: '#ef5350', margin: 0, fontSize: '0.9rem' }}>
                      {errorBusqueda}
                    </p>
                  </div>
                )}

                {/* 🔵 SPRIT ENCONTRADO - Mostrar información */}
                {spritExistente && editando && (
                  <div style={{
                    background: 'rgba(33, 150, 243, 0.1)',
                    border: '1px solid #2196f3',
                    borderRadius: '6px',
                    padding: '10px',
                    marginBottom: '15px',
                    marginTop: '10px'
                  }}>
                    <p style={{ color: '#64b5f6', margin: 0 }}>
                      ✅ Sprit encontrado: <strong>{spritExistente.nombre}</strong>
                      <br />
                      <small>ID: {spritExistente.id} | Material: {spritExistente.material || 'N/A'} | Nivel: {spritExistente.nivelEspiritu || 1}</small>
                    </p>
                  </div>
                )}

                {/* 🔵 CAMPOS ADICIONALES (solo visibles si hay sprit existente) */}
                {editando && spritExistente && (
                  <>
                    <div className="form-group">
                      <label>Material</label>
                      <select
                        name="material"
                        value={formData.material}
                        onChange={handleFormChange}
                        disabled={cargandoOpciones}
                      >
                        <option value="">Seleccionar material</option>
                        {opcionesMateriales.map(material => (
                          <option key={material} value={material}>{material}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Método de Subida de Nivel</label>
                      <select
                        name="metodoSubidaNivel"
                        value={formData.metodoSubidaNivel}
                        onChange={handleFormChange}
                        disabled={cargandoOpciones}
                      >
                        <option value="">Seleccionar método</option>
                        {opcionesMetodosSubida.map(metodo => (
                          <option key={metodo} value={metodo}>{metodo}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Nivel de Espíritu</label>
                      <select
                        name="nivelEspiritu"
                        value={formData.nivelEspiritu}
                        onChange={handleFormChange}
                      >
                        {niveles.map(n => (
                          <option key={n} value={n}>Nivel {n}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Ruta de la Imagen</label>
                      <input
                        type="text"
                        name="nombreArchivoImagen"
                        placeholder="Ej: ./imagenesSprites/miSprit.png"
                        value={formData.nombreArchivoImagen}
                        onChange={handleFormChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Polvo al Extraer</label>
                      <input
                        type="number"
                        name="polvoAlExtraer"
                        placeholder="Ej: 500"
                        value={formData.polvoAlExtraer}
                        onChange={handleFormChange}
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label>Polvo al Invocar</label>
                      <input
                        type="number"
                        name="polvoAlInvocar"
                        placeholder="Ej: 1000"
                        value={formData.polvoAlInvocar}
                        onChange={handleFormChange}
                        min="0"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarModal}>
                Cancelar
              </button>
              <button 
                className="btn-guardar" 
                onClick={guardarRegistro}
                disabled={!editando || !spritExistente || !formData.nombre || !formData.rareza || !formData.temporada}
                style={{
                  opacity: (!editando || !spritExistente || !formData.nombre || !formData.rareza || !formData.temporada) ? 0.6 : 1
                }}
              >
                {editando && spritExistente ? '💾 Marcar como NO Disponible' : '🔍 Buscar primero'}
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

      {/* 🔵 MODAL DE CONFIRMACIÓN PARA ELIMINAR (Marcar como disponible) */}
      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        title="✅ Marcar como disponible"
        message={`¿Estás seguro de marcar el sprit "${registroAEliminar?.nombre}" como disponible en el juego?\n\nEsto lo moverá a la lista de sprits disponibles.`}
        type="success"
        confirmText="✅ Marcar como disponible"
        onConfirm={eliminarRegistro}
        showCancelButton={true}
      />
    </div>
  );
}

export default NoDisponiblesAdmin;