// SpritsList.jsx - Con formulario para agregar, editar y eliminar sprits

import React, { useState, useEffect } from 'react';
import { spritsService } from '../services/api';

function SpritsList() {
  const [sprits, setSprits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ 
    rareza: '', 
    material: '',
    nombre: ''
  });
  const [infoVisible, setInfoVisible] = useState({});
  
  // 🔵 Estado para el modal de agregar
  const [showModal, setShowModal] = useState(false);
  const [nuevoSprit, setNuevoSprit] = useState({
    nombre: '',
    rareza: '',
    material: '',
    nombreArchivoImagen: '',
    polvoAlExtraer: '',
    polvoAlInvocar: ''
  });
  const [guardando, setGuardando] = useState(false);

  // 🔵 Estado para el modal de editar
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSprit, setEditSprit] = useState({
    nombre: '',
    rareza: '',
    material: '',
    nombreArchivoImagen: '',
    polvoAlExtraer: '',
    polvoAlInvocar: ''
  });
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [editando, setEditando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  // 🔵 Estado para el modal de eliminar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nombreEliminar, setNombreEliminar] = useState('');
  const [eliminando, setEliminando] = useState(false);

  const nombresDisponibles = [
    'Espíritu de Agua',
    'Espíritu de Tierra',
    'Espíritu de Fuego',
    'Espíritu Pato',
    'Espíritu Fantasmal',
    'Espíritu Demoníaco',
    'Espíritu Rey',
    'Espíritu Dormilón',
    'Espíritu Punk',
    'Espíritu del Punto Cero',
    'Cacahuate Tostado'
  ];

  useEffect(() => {
    cargarSprits();
  }, []);

  const cargarSprits = async () => {
    try {
      setLoading(true);
      const response = await spritsService.getAll();
      setSprits(response.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los sprits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleInfo = (id) => {
    setInfoVisible(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleColeccionado = async (id) => {
    try {
      setSprits(prevSprits => 
        prevSprits.map(sprit => 
          sprit.id === id 
            ? { ...sprit, estaColeccionado: !sprit.estaColeccionado }
            : sprit
        )
      );
      
      await spritsService.toggleColeccionado(id);
    } catch (err) {
      console.error('Error al alternar coleccionado:', err);
      cargarSprits();
      alert('❌ Error al actualizar el estado');
    }
  };

  const toggleDominado = async (id) => {
    try {
      setSprits(prevSprits => 
        prevSprits.map(sprit => 
          sprit.id === id 
            ? { ...sprit, estaDominado: !sprit.estaDominado }
            : sprit
        )
      );
      
      await spritsService.toggleDominado(id);
    } catch (err) {
      console.error('Error al alternar dominado:', err);
      cargarSprits();
      alert('❌ Error al actualizar el estado');
    }
  };

  const resetSprit = async (id) => {
    try {
      const sprit = sprits.find(s => s.id === id);
      if (!sprit) return;
      
      if (!sprit.estaColeccionado && !sprit.estaDominado) {
        alert('⚠️ Este sprit ya está completamente reiniciado');
        return;
      }
      
      setSprits(prevSprits => 
        prevSprits.map(sprit => 
          sprit.id === id 
            ? { ...sprit, estaColeccionado: false, estaDominado: false }
            : sprit
        )
      );
      
      await spritsService.update(id, {
        estaColeccionado: false,
        estaDominado: false
      });
    } catch (err) {
      console.error('Error al resetear sprit:', err);
      cargarSprits();
      alert('❌ Error al resetear el sprit');
    }
  };

  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value
    });
  };

  const limpiarFiltros = () => {
    setFiltros({ 
      rareza: '', 
      material: '',
      nombre: ''
    });
  };

  // 🔵 Manejar cambios en el formulario de agregar
  const handleInputChange = (e) => {
    setNuevoSprit({
      ...nuevoSprit,
      [e.target.name]: e.target.value
    });
  };

  // 🔵 Manejar cambios en el formulario de editar
  const handleEditInputChange = (e) => {
    setEditSprit({
      ...editSprit,
      [e.target.name]: e.target.value
    });
  };

  // 🔵 Abrir el modal de agregar
  const abrirModal = () => {
    setNuevoSprit({
      nombre: '',
      rareza: '',
      material: '',
      nombreArchivoImagen: '',
      polvoAlExtraer: '',
      polvoAlInvocar: ''
    });
    setShowModal(true);
  };

  // 🔵 Cerrar el modal de agregar
  const cerrarModal = () => {
    setShowModal(false);
    setNuevoSprit({
      nombre: '',
      rareza: '',
      material: '',
      nombreArchivoImagen: '',
      polvoAlExtraer: '',
      polvoAlInvocar: ''
    });
  };

  // 🔵 Abrir el modal de editar
  const abrirEditModal = () => {
    setEditSprit({
      nombre: '',
      rareza: '',
      material: '',
      nombreArchivoImagen: '',
      polvoAlExtraer: '',
      polvoAlInvocar: ''
    });
    setNombreBusqueda('');
    setShowEditModal(true);
  };

  // 🔵 Cerrar el modal de editar
  const cerrarEditModal = () => {
    setShowEditModal(false);
    setEditSprit({
      nombre: '',
      rareza: '',
      material: '',
      nombreArchivoImagen: '',
      polvoAlExtraer: '',
      polvoAlInvocar: ''
    });
    setNombreBusqueda('');
    setCargandoDatos(false);
  };

  // 🔵 Abrir el modal de eliminar
  const abrirDeleteModal = () => {
    setNombreEliminar('');
    setShowDeleteModal(true);
  };

  // 🔵 Cerrar el modal de eliminar
  const cerrarDeleteModal = () => {
    setShowDeleteModal(false);
    setNombreEliminar('');
    setEliminando(false);
  };

  // 🔵 Buscar y rellenar datos del sprit por nombre
  const buscarYrellenarDatos = async () => {
    if (!nombreBusqueda.trim()) {
      alert('⚠️ Por favor ingresa un nombre para buscar');
      return;
    }

    setCargandoDatos(true);
    try {
      const response = await spritsService.getAll();
      const spritEncontrado = response.data.find(
        s => s.nombre.toLowerCase() === nombreBusqueda.trim().toLowerCase()
      );

      if (!spritEncontrado) {
        alert(`❌ No se encontró ningún sprit con el nombre "${nombreBusqueda}"`);
        setCargandoDatos(false);
        return;
      }

      setEditSprit({
        nombre: spritEncontrado.nombre,
        rareza: spritEncontrado.rareza,
        material: spritEncontrado.material,
        nombreArchivoImagen: spritEncontrado.nombreArchivoImagen || '',
        polvoAlExtraer: spritEncontrado.polvoAlExtraer || '',
        polvoAlInvocar: spritEncontrado.polvoAlInvocar || ''
      });

      alert(`✅ Sprit "${spritEncontrado.nombre}" encontrado. Puedes editar sus datos.`);
    } catch (err) {
      console.error('Error al buscar sprit:', err);
      alert('❌ Error al buscar el sprit');
    } finally {
      setCargandoDatos(false);
    }
  };

  // 🔵 Guardar los cambios del sprit editado
  const guardarSpritEditado = async () => {
    if (!editSprit.nombre || !editSprit.rareza || !editSprit.material) {
      alert('⚠️ Los campos Nombre, Rareza y Material son obligatorios');
      return;
    }

    setEditando(true);
    try {
      const response = await spritsService.getAll();
      const spritEncontrado = response.data.find(
        s => s.nombre.toLowerCase() === editSprit.nombre.trim().toLowerCase()
      );

      if (!spritEncontrado) {
        alert('❌ No se encontró el sprit a editar');
        setEditando(false);
        return;
      }

      const data = {
        nombre: editSprit.nombre,
        rareza: editSprit.rareza,
        material: editSprit.material,
        nombreArchivoImagen: editSprit.nombreArchivoImagen || null,
        polvoAlExtraer: editSprit.polvoAlExtraer ? parseInt(editSprit.polvoAlExtraer) : null,
        polvoAlInvocar: editSprit.polvoAlInvocar ? parseInt(editSprit.polvoAlInvocar) : null
      };

      await spritsService.update(spritEncontrado.id, data);
      await cargarSprits();
      cerrarEditModal();
      alert('✅ Sprit actualizado exitosamente');
    } catch (err) {
      console.error('Error al actualizar sprit:', err);
      alert('❌ Error al actualizar el sprit');
    } finally {
      setEditando(false);
    }
  };

  // 🔵 Guardar el nuevo sprit
  const guardarSprit = async () => {
    if (!nuevoSprit.nombre || !nuevoSprit.rareza || !nuevoSprit.material) {
      alert('⚠️ Los campos Nombre, Rareza y Material son obligatorios');
      return;
    }

    setGuardando(true);
    try {
      const data = {
        nombre: nuevoSprit.nombre,
        rareza: nuevoSprit.rareza,
        material: nuevoSprit.material,
        nombreArchivoImagen: nuevoSprit.nombreArchivoImagen || null,
        polvoAlExtraer: nuevoSprit.polvoAlExtraer ? parseInt(nuevoSprit.polvoAlExtraer) : null,
        polvoAlInvocar: nuevoSprit.polvoAlInvocar ? parseInt(nuevoSprit.polvoAlInvocar) : null,
        estaColeccionado: false,
        estaDominado: false
      };

      await spritsService.create(data);
      await cargarSprits();
      cerrarModal();
      alert('✅ Sprit agregado exitosamente');
    } catch (err) {
      console.error('Error al agregar sprit:', err);
      alert('❌ Error al agregar el sprit');
    } finally {
      setGuardando(false);
    }
  };

  // 🔵 Eliminar un sprit por nombre
  const eliminarSprit = async () => {
    if (!nombreEliminar.trim()) {
      alert('⚠️ Por favor ingresa el nombre del sprit a eliminar');
      return;
    }

    setEliminando(true);
    try {
      // Buscar el sprit por nombre
      const response = await spritsService.getAll();
      const spritEncontrado = response.data.find(
        s => s.nombre.toLowerCase() === nombreEliminar.trim().toLowerCase()
      );

      if (!spritEncontrado) {
        alert(`❌ No se encontró ningún sprit con el nombre "${nombreEliminar}"`);
        setEliminando(false);
        return;
      }

      // Confirmar eliminación
      const confirmar = window.confirm(
        `⚠️ ¿Estás seguro de eliminar el sprit "${spritEncontrado.nombre}"?\n\n` +
        `ID: ${spritEncontrado.id}\n` +
        `Rareza: ${spritEncontrado.rareza}\n` +
        `Material: ${spritEncontrado.material}\n\n` +
        `Esta acción no se puede deshacer.`
      );

      if (!confirmar) {
        setEliminando(false);
        return;
      }

      await spritsService.delete(spritEncontrado.id);
      await cargarSprits();
      cerrarDeleteModal();
      alert(`✅ Sprit "${spritEncontrado.nombre}" eliminado exitosamente`);
    } catch (err) {
      console.error('Error al eliminar sprit:', err);
      alert('❌ Error al eliminar el sprit');
    } finally {
      setEliminando(false);
    }
  };

  const spritsFiltrados = sprits.filter(sprit => {
    if (filtros.rareza && sprit.rareza !== filtros.rareza) return false;
    if (filtros.material && sprit.material !== filtros.material) return false;
    if (filtros.nombre && sprit.nombre !== filtros.nombre) return false;
    return true;
  });

  if (loading) return <div className="loading">Cargando sprits...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="sprits-container">
      <h1>Sprits de Fortnite</h1>
      
      <div className="filtros">
        <select 
          name="nombre" 
          value={filtros.nombre} 
          onChange={handleFiltroChange}
        >
          <option value="">Todos los nombres</option>
          {nombresDisponibles.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>

        <select name="rareza" value={filtros.rareza} onChange={handleFiltroChange}>
          <option value="">Todas las rarezas</option>
          <option value="Raro">Raro</option>
          <option value="Épico">Épico</option>
          <option value="Legendario">Legendario</option>
          <option value="Mítico">Mítico</option>
        </select>
        
        <select name="material" value={filtros.material} onChange={handleFiltroChange}>
          <option value="">Todos los materiales</option>
          <option value="Normal">Normal</option>
          <option value="Oro">Oro</option>
          <option value="Gomita">Gomita</option>
          <option value="Galaxia">Galaxia</option>
        </select>
        
        <button onClick={limpiarFiltros}>
          Limpiar filtros
        </button>

        {/* 🔵 Botón para agregar sprit */}
        <button className="btn-agregar" onClick={abrirModal}>
          ➕
        </button>

        {/* 🔵 Botón para editar sprit */}
        <button className="btn-editar" onClick={abrirEditModal}>
          ✏️
        </button>

        {/* 🔵 Botón para eliminar sprit */}
        <button className="btn-eliminar" onClick={abrirDeleteModal}>
          🗑️
        </button>
      </div>

      <div className="sprits-grid">
        {spritsFiltrados.map((sprit) => (
          <div key={sprit.id} className="sprit-card">
            <div className="sprit-header">
              <h4>{sprit.nombre}</h4>
              <div className="header-actions">
                <span className={`rareza ${sprit.rareza.toLowerCase()}`}>
                  {sprit.rareza}
                </span>
                <button 
                  className="btn-toggle-info"
                  onClick={() => toggleInfo(sprit.id)}
                  title="Mostrar/Ocultar información"
                >
                  {infoVisible[sprit.id] ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>
            
            {sprit.nombreArchivoImagen && (
              <div className={`sprit-image ${sprit.estaDominado ? 'dominado' : ''}`}>
                <img 
                  src={sprit.nombreArchivoImagen} 
                  alt={sprit.nombre}
                  className="sprit-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150/16213e/ffffff?text=Sin+imagen';
                  }}
                />
              </div>
            )}
            
            {infoVisible[sprit.id] && (
              <div className="sprit-info">
                <p><strong>Material:</strong> {sprit.material}</p>
                <div className="polvos">
                  <p>
                    <span className="polvo-emoji" style={{ backgroundImage: 'url(/imagenesSprites/polvoEspiritu.png)' }} />
                    <strong>Polvo al invocar:</strong> {sprit.polvoAlInvocar}
                  </p>
                  <p>
                    <span className="polvo-emoji" style={{ backgroundImage: 'url(/imagenesSprites/polvoEspiritu.png)' }} />
                    <strong>Polvo al extraer:</strong> {sprit.polvoAlExtraer || 0}
                  </p>
                </div>
              </div>
            )}
            
            <div className="sprit-actions">
              <button 
                className={`btn ${sprit.estaColeccionado ? 'active' : ''}`}
                onClick={() => toggleColeccionado(sprit.id)}
              >
                {sprit.estaColeccionado ? '✅ Coleccionado' : 'Aún no coleccionado'}
              </button>
              
              <button 
                className={`btn ${sprit.estaDominado ? 'active' : ''}`}
                onClick={() => toggleDominado(sprit.id)}
              >
                {sprit.estaDominado ? '👑 Dominado' : 'Aún no dominado'}
              </button>
              
              <button 
                className="btn btn-reset"
                onClick={() => resetSprit(sprit.id)}
                title="Restablecer coleccionado y dominado a false"
              >
                F
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {spritsFiltrados.length === 0 && (
        <p className="no-results">No hay sprits que coincidan con los filtros</p>
      )}

      {/* 🔵 Modal para agregar sprit */}
      {showModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Agregar Nuevo Sprit</h2>
              <button className="modal-close" onClick={cerrarModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej: Espíritu del Punto Cero"
                  value={nuevoSprit.nombre}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Rareza</label>
                <input
                  type="text"
                  name="rareza"
                  placeholder="Ej: Mítico"
                  value={nuevoSprit.rareza}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Material</label>
                <input
                  type="text"
                  name="material"
                  placeholder="Ej: Galaxia"
                  value={nuevoSprit.material}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Ruta de la Imagen</label>
                <input
                  type="text"
                  name="nombreArchivoImagen"
                  placeholder="Ej: ./imagenesSprites/puntoCeroGalaxia.jpg"
                  value={nuevoSprit.nombreArchivoImagen}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Polvo al Extraer</label>
                <input
                  type="number"
                  name="polvoAlExtraer"
                  placeholder="Ej: 800"
                  value={nuevoSprit.polvoAlExtraer}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Polvo al Invocar</label>
                <input
                  type="number"
                  name="polvoAlInvocar"
                  placeholder="Ej: 15000"
                  value={nuevoSprit.polvoAlInvocar}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-hint">
                <p>⚠️ Todos los campos son obligatorios</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarModal}>
                Cancelar
              </button>
              <button 
                className="btn-guardar" 
                onClick={guardarSprit}
                disabled={guardando}
              >
                {guardando ? '⏳ Guardando...' : '💾 Guardar Sprit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔵 Modal para editar sprit */}
      {showEditModal && (
        <div className="modal-overlay" onClick={cerrarEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Editar Sprit</h2>
              <button className="modal-close" onClick={cerrarEditModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="search-section">
                <div className="form-group search-group">
                  <label>🔍 Buscar Sprit por Nombre</label>
                  <div className="search-input-group">
                    <input
                      type="text"
                      placeholder="Ej: Espíritu del Punto Cero"
                      value={nombreBusqueda}
                      onChange={(e) => setNombreBusqueda(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && buscarYrellenarDatos()}
                    />
                    <button 
                      className="btn-buscar"
                      onClick={buscarYrellenarDatos}
                      disabled={cargandoDatos}
                    >
                      {cargandoDatos ? '⏳ Buscando...' : '🔍 Buscar'}
                    </button>
                  </div>
                </div>
                <div className="search-hint">
                  <p>💡 Ingresa el nombre exacto del sprit que deseas editar</p>
                </div>
              </div>

              <hr className="divider" />

              <div className="edit-form">
                <div className="form-group">
                  <label>Nombre (solo lectura)</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Espíritu del Punto Cero"
                    value={editSprit.nombre}
                    onChange={handleEditInputChange}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group">
                  <label>Rareza</label>
                  <input
                    type="text"
                    name="rareza"
                    placeholder="Ej: Mítico"
                    value={editSprit.rareza}
                    onChange={handleEditInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Material</label>
                  <input
                    type="text"
                    name="material"
                    placeholder="Ej: Galaxia"
                    value={editSprit.material}
                    onChange={handleEditInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Ruta de la Imagen</label>
                  <input
                    type="text"
                    name="nombreArchivoImagen"
                    placeholder="Ej: ./imagenesSprites/puntoCeroGalaxia.jpg"
                    value={editSprit.nombreArchivoImagen}
                    onChange={handleEditInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Polvo al Extraer</label>
                  <input
                    type="number"
                    name="polvoAlExtraer"
                    placeholder="Ej: 800"
                    value={editSprit.polvoAlExtraer}
                    onChange={handleEditInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>Polvo al Invocar</label>
                  <input
                    type="number"
                    name="polvoAlInvocar"
                    placeholder="Ej: 15000"
                    value={editSprit.polvoAlInvocar}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarEditModal}>
                Cancelar
              </button>
              <button 
                className="btn-guardar" 
                onClick={guardarSpritEditado}
                disabled={editando || !editSprit.nombre}
              >
                {editando ? '⏳ Guardando...' : '💾 Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔵 Modal para eliminar sprit */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={cerrarDeleteModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🗑️ Eliminar Sprit</h2>
              <button className="modal-close" onClick={cerrarDeleteModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Nombre del Sprit a eliminar</label>
                <input
                  type="text"
                  placeholder="Ej: Espíritu del Punto Cero"
                  value={nombreEliminar}
                  onChange={(e) => setNombreEliminar(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && eliminarSprit()}
                />
              </div>
              
              <div className="form-hint">
                <p>⚠️ Ingresa el nombre exacto del sprit que deseas eliminar</p>
                <p>⚠️ Esta acción es <strong>permanente</strong> y no se puede deshacer</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarDeleteModal}>
                Cancelar
              </button>
              <button 
                className="btn-eliminar-confirmar" 
                onClick={eliminarSprit}
                disabled={eliminando || !nombreEliminar.trim()}
              >
                {eliminando ? '⏳ Eliminando...' : '🗑️ Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpritsList;