import React, { useState, useEffect } from 'react';
import { ordenDefaultService, ordenRarezaService, nombresSpritesService } from '../../services/api';
import './Administrador.css';
import ConfirmModal from '../ConfirmModal';
const temporadaActual = import.meta.env.VITE_TEMPORADA_ACTUAL;
const temporadas = JSON.parse(import.meta.env.VITE_TEMPORADAS || "[]");

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

  // 🔵 Filtros (independientes del formulario)
  const [filtros, setFiltros] = useState({
    nombre: '',
    temporada: temporadaActual
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

  // 🔵 Opciones para FILTROS (dependen del filtro de temporada)
  const [opcionesNombresFiltros, setOpcionesNombresFiltros] = useState([]);
  const [cargandoOpcionesFiltros, setCargandoOpcionesFiltros] = useState(false);
  
  // 🔵 Opciones para FORMULARIO (dependen de la temporada seleccionada en el formulario)
  const [opcionesNombresForm, setOpcionesNombresForm] = useState([]);
  const [cargandoOpcionesForm, setCargandoOpcionesForm] = useState(false);
  
  // 🔵 Estado para datos completos con temporada (para filtros)
  const [nombresConTemporada, setNombresConTemporada] = useState([]);

  // 🔵 Estado para el modal de mover posiciones
  const [showMoverModal, setShowMoverModal] = useState(false);
  const [moverData, setMoverData] = useState({
    item: null,
    direccion: null,
    cantidad: ''
  });

  // 🔵 Cargar datos según la pestaña activa
  useEffect(() => {
    if (tabActiva === 'default') {
      cargarOrdenDefault();
    } else {
      cargarOrdenRareza();
    }
    cargarOpcionesFiltros();
  }, [tabActiva]);

  // 🔵 Efecto para filtrar opciones de FILTROS según temporada seleccionada en filtros
  useEffect(() => {
    const temporada = filtros.temporada;
    
    if (temporada) {
      const nombresFilt = nombresConTemporada
        .filter(item => item.temporada === temporada)
        .map(item => item.nombre);
      setOpcionesNombresFiltros(nombresFilt.length > 0 ? nombresFilt : []);
      
      if (filtros.nombre && !nombresFilt.includes(filtros.nombre)) {
        setFiltros(prev => ({ ...prev, nombre: '' }));
      }
    } else {
      setOpcionesNombresFiltros(opcionesNombresFiltros);
    }
  }, [filtros.temporada, nombresConTemporada]);

  // 🔵 Efecto para cargar opciones del FORMULARIO cuando cambia la temporada en el formData
  useEffect(() => {
    if (formData.temporada) {
      cargarOpcionesForm(formData.temporada);
    } else {
      setOpcionesNombresForm([]);
    }
  }, [formData.temporada]);

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

  // 🔵 Cargar opciones para FILTROS (nombres con temporada)
  const cargarOpcionesFiltros = async () => {
    setCargandoOpcionesFiltros(true);
    try {
      const nombresRes = await nombresSpritesService.getAll();
      const nombresConTemp = nombresRes.data.map(item => ({
        nombre: item.nombre,
        temporada: item.temporada
      }));
      setNombresConTemporada(nombresConTemp);
      
      const todosNombres = nombresConTemp.map(item => item.nombre);
      setOpcionesNombresFiltros(todosNombres);
      
    } catch (err) {
      console.error('Error al cargar opciones para filtros:', err);
    } finally {
      setCargandoOpcionesFiltros(false);
    }
  };

  // 🔵 Cargar opciones del FORMULARIO según temporada (solo nombres)
  const cargarOpcionesForm = async (temporada) => {
    if (!temporada) {
      setOpcionesNombresForm([]);
      return;
    }
    
    setCargandoOpcionesForm(true);
    try {
      const nombresRes = await nombresSpritesService.getAll();
      const nombresFilt = nombresRes.data
        .filter(item => item.temporada === temporada)
        .map(item => item.nombre);
      setOpcionesNombresForm(nombresFilt);
      
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
      temporada: temporadaActual
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
      temporada: '',
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

  // 🔵 Abrir modal para mover posiciones
  const abrirMoverModal = (item, direccion) => {
    setMoverData({
      item,
      direccion,
      cantidad: '1'
    });
    setShowMoverModal(true);
  };

  const cerrarMoverModal = () => {
    setShowMoverModal(false);
    setMoverData({ item: null, direccion: null, cantidad: '' });
  };

  // 🔵 Ejecutar el reordenamiento de posiciones
  const ejecutarMovimiento = async () => {
    const { item, direccion, cantidad } = moverData;
    const numPosiciones = parseInt(cantidad);

    if (!numPosiciones || numPosiciones <= 0) {
      mostrarConfirmacion('⚠️ Valor inválido', 'Ingresa un número válido de posiciones mayor a 0', 'warning');
      return;
    }

    const datos = getDatos();
    const ordenActual = item.numeroOrden;
    let nuevoOrden;

    if (direccion === 'arriba') {
      nuevoOrden = ordenActual - numPosiciones;
    } else {
      nuevoOrden = ordenActual + numPosiciones;
    }

    // Validar límites
    const minOrden = 1;
    const maxOrden = datos.length;

    if (nuevoOrden < minOrden) nuevoOrden = minOrden;
    if (nuevoOrden > maxOrden) nuevoOrden = maxOrden;

    if (nuevoOrden === ordenActual) {
      cerrarMoverModal();
      return;
    }

    const servicio = getServicio();

    try {
      const elementosTemporada = datos
        .filter(d => d.temporada === item.temporada)
        .sort((a, b) => a.numeroOrden - b.numeroOrden);
      
      // Usamos un número temporal seguro (el total de elementos + 1) para no romper validaciones del backend
      const TEMP_ORDEN = maxOrden + 1;

      // 1. Mover primero el elemento principal al número temporal para liberar su espacio
      await servicio.update(item.id, {
        numeroOrden: TEMP_ORDEN,
        temporada: item.temporada,
        nombre: item.nombre
      });

      // 2. Actualizar los demás elementos de forma SECUENCIAL (uno por uno)
      // para evitar que la base de datos rechace peticiones concurrentes por duplicidad.
      for (const el of elementosTemporada) {
        if (el.id === item.id) continue;

        let nOrden = el.numeroOrden;
        if (direccion === 'abajo') {
          // Si bajamos, los que están entre el antiguo y el nuevo suben 1 posición (restan 1)
          if (el.numeroOrden > ordenActual && el.numeroOrden <= nuevoOrden) {
            nOrden = el.numeroOrden - 1;
          }
        } else if (direccion === 'arriba') {
          // Si subimos, los que están entre el nuevo y el antiguo bajan 1 posición (suman 1)
          if (el.numeroOrden >= nuevoOrden && el.numeroOrden < ordenActual) {
            nOrden = el.numeroOrden + 1;
          }
        }

        if (nOrden !== el.numeroOrden) {
          await servicio.update(el.id, {
            numeroOrden: nOrden,
            temporada: el.temporada,
            nombre: el.nombre
          });
        }
      }

      // 3. Colocar el elemento principal en su posición definitiva
      await servicio.update(item.id, {
        numeroOrden: nuevoOrden,
        temporada: item.temporada,
        nombre: item.nombre
      });

      mostrarConfirmacion('✅ Reordenado', `El espíritu se movió ${numPosiciones} posiciones hacia ${direccion}`, 'success');
      cerrarMoverModal();

      // Recargar la tabla según la pestaña activa
      if (tabActiva === 'default') {
        cargarOrdenDefault();
      } else {
        cargarOrdenRareza();
      }
    } catch (err) {
      console.error('Error al reordenar:', err);
      mostrarConfirmacion('❌ Error', err.response?.data?.detail || 'Error al mover las posiciones', 'error');
    }
  };

  // 🔵 Filtrar datos
  const datosFiltrados = getDatos().filter(item => {
    if (filtros.nombre && !item.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())) return false;
    if (filtros.temporada && item.temporada !== filtros.temporada) return false;
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

          <select
            name="nombre"
            value={filtros.nombre}
            onChange={handleFiltroChange}
            className="filtro-select"
            disabled={cargandoOpcionesFiltros}
            style={{ minWidth: '200px' }}
          >
            <option value="">Todos los nombres</option>
            {opcionesNombresFiltros.map((nombre, index) => (
              <option key={index} value={nombre}>{nombre}</option>
            ))}
          </select>

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
                      onClick={() => abrirMoverModal(item, 'arriba')}
                      title="Mover hacia arriba"
                      //style={{ background: '#008cff', marginRight: '4px' }}
                    >
                      ⬆️
                    </button>
                    <button 
                      className="btn-editar"
                      onClick={() => abrirMoverModal(item, 'abajo')}
                      title="Mover hacia abajo"
                     //style={{ background: '#008cff', marginRight: '4px' }}
                    >
                      ⬇️
                    </button>
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
                  <select
                    name="nombre"
                    value={formData.nombre}
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
                    <option value="">Seleccionar nombre</option>
                    {opcionesNombresForm.map((nombre, index) => (
                      <option key={index} value={nombre}>{nombre}</option>
                    ))}
                  </select>
                  {!formData.temporada && (
                    <small style={{ color: '#888' }}>💡 Selecciona una temporada primero</small>
                  )}
                  {cargandoOpcionesForm && (
                    <small style={{ color: '#888' }}>⏳ Cargando nombres...</small>
                  )}
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

      {/* 🔵 MODAL PARA MOVER POSICIONES */}
      {showMoverModal && (
        <div className="modal-overlay" onClick={cerrarMoverModal}>
          <div className="modal-content modal-admin" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>
                {moverData.direccion === 'arriba' ? '⬆️ Mover Hacia Arriba' : '⬇️ Mover Hacia Abajo'}
              </h2>
              <button className="modal-close" onClick={cerrarMoverModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="admin-form">
                <p style={{ color: '#ccc', marginBottom: '15px' }}>
                  Espíritu seleccionado: <strong style={{ color: '#35cf35' }}>{moverData.item?.nombre}</strong> (Orden actual: {moverData.item?.numeroOrden})
                </p>
                <div className="form-group">
                  <label>¿Cuántas posiciones deseas moverlo? *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej: 15"
                    value={moverData.cantidad}
                    onChange={(e) => setMoverData({ ...moverData, cantidad: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '2px solid #0f3460',
                      borderRadius: '6px',
                      background: '#1a1a2e',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarMoverModal}>
                Cancelar
              </button>
              <button className="btn-guardar" onClick={ejecutarMovimiento}>
                🚀 Aplicar Movimiento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdenesAdmin;