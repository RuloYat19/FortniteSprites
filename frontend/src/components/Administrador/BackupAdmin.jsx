import React, { useState, useEffect } from 'react';
import { backupService } from '../../services/api';
import './Administrador.css';
import ConfirmModal from '../ConfirmModal';

function BackupAdmin() {
  const [loading, setLoading] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [error, setError] = useState(null);
  const [tablasInfo, setTablasInfo] = useState([]);
  const [totalTablas, setTotalTablas] = useState(0);
  
  // 🔵 Estado para el modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({
    title: '',
    message: '',
    type: 'success'
  });
  
  // 🔵 Estado para el modal de selección de tabla
  const [showTablaModal, setShowTablaModal] = useState(false);
  const [tablaSeleccionada, setTablaSeleccionada] = useState('');
  const [incluirId, setIncluirId] = useState(false);

  useEffect(() => {
    cargarInfoBackup();
  }, []);

  const cargarInfoBackup = async () => {
    try {
      setLoadingInfo(true);
      const response = await backupService.getInfo();
      setTablasInfo(response.data.tablas);
      setTotalTablas(response.data.total_tablas);
      setError(null);
    } catch (err) {
      console.error('Error al cargar información de backup:', err);
      setError('Error al cargar la información de las tablas');
    } finally {
      setLoadingInfo(false);
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

  // 🔵 Descargar archivo
  const descargarArchivo = (blob, nombreArchivo) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // 🔵 Generar backup completo
  const generarBackupCompleto = async (incluirId = false) => {
    setLoading(true);
    try {
      const response = await backupService.generarBackup(incluirId);
      
      // Extraer el nombre del archivo del header Content-Disposition
      const contentDisposition = response.headers['content-disposition'];
      let nombreArchivo = `002_backup_completo.sql`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) nombreArchivo = match[1];
      }
      
      descargarArchivo(response.data, nombreArchivo);
      mostrarConfirmacion(
        '✅ Backup generado',
        `Se ha generado el backup completo correctamente`,
        'success'
      );
    } catch (err) {
      console.error('Error al generar backup:', err);
      mostrarConfirmacion(
        '❌ Error',
        'Hubo un error al generar el backup',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Generar backup de una tabla específica
  const generarBackupTabla = async () => {
    if (!tablaSeleccionada) {
      mostrarConfirmacion(
        '⚠️ Selecciona una tabla',
        'Por favor selecciona una tabla para generar el backup',
        'warning'
      );
      return;
    }

    setLoading(true);
    try {
      const response = await backupService.generarBackupTabla(tablaSeleccionada, incluirId);
      
      // Extraer el nombre del archivo
      const contentDisposition = response.headers['content-disposition'];
      let nombreArchivo = `002_backup_${tablaSeleccionada}.sql`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) nombreArchivo = match[1];
      }
      
      descargarArchivo(response.data, nombreArchivo);
      mostrarConfirmacion(
        '✅ Backup generado',
        `Se ha generado el backup de la tabla "${tablaSeleccionada}" correctamente`,
        'success'
      );
      setShowTablaModal(false);
      setTablaSeleccionada('');
    } catch (err) {
      console.error('Error al generar backup de tabla:', err);
      mostrarConfirmacion(
        '❌ Error',
        'Hubo un error al generar el backup de la tabla',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔵 Abrir modal de selección de tabla
  const abrirTablaModal = () => {
    setTablaSeleccionada('');
    setIncluirId(false);
    setShowTablaModal(true);
  };

  // 🔵 Cerrar modal de selección de tabla
  const cerrarTablaModal = () => {
    setShowTablaModal(false);
    setTablaSeleccionada('');
    setIncluirId(false);
  };

  // 🔵 Obtener el nombre legible de la tabla
  const getNombreTablaLegible = (nombre) => {
    const nombres = {
      'sprits': 'Sprits',
      'cantidadPolvoEspiritu': 'Cantidad de Polvo',
      'material': 'Materiales',
      'nombresSprites': 'Nombres de Sprites',
      'ordenDefault': 'Orden Default',
      'ordenRareza': 'Orden por Rareza'
    };
    return nombres[nombre] || nombre;
  };

  // 🔵 Obtener el ícono de la tabla
  const getIconoTabla = (nombre) => {
    const iconos = {
      'sprits': '🃏',
      'cantidadPolvoEspiritu': '⚗️',
      'material': '📦',
      'nombresSprites': '📝',
      'ordenDefault': '📋',
      'ordenRareza': '🏷️'
    };
    return iconos[nombre] || '📊';
  };

  if (loadingInfo) {
    return (
      <div className="admin-main" style={{ padding: '30px 35px', flex: 1 }}>
        <div className="loading">Cargando información del backup...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-main" style={{ padding: '30px 35px', flex: 1 }}>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-main" style={{ padding: '30px 35px', flex: 1 }}>
      <header className="admin-header">
        <span className="titulo">
          💾 Gestión de Backup
        </span>
        <p className="admin-subtitle">Genera backups de tu base de datos en formato SQL</p>
      </header>

      {/* 🔵 ESTADÍSTICAS */}
      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <div>
            <span className="stat-label">Total tablas</span>
            <span className="stat-value">{totalTablas}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📝</span>
          <div>
            <span className="stat-label">Registros totales</span>
            <span className="stat-value">
              {tablasInfo.reduce((acc, t) => acc + t.registros, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 🔵 BOTONES DE ACCIÓN */}
      <div className="admin-filtros" style={{ marginBottom: '25px' }}>
        <div className="filtros-group">
          <button 
            className="btn-agregar-admin" 
            onClick={() => generarBackupCompleto(false)}
            disabled={loading}
            style={{ background: '#9c27b0' }}
          >
            {loading ? '⏳ Generando...' : '💾 Backup Completo'}
          </button>
          <button 
            className="btn-agregar-admin" 
            onClick={() => generarBackupCompleto(true)}
            disabled={loading}
            style={{ background: '#7b1fa2' }}
          >
            {loading ? '⏳ Generando...' : '💾 Backup con IDs'}
          </button>
          <button 
            className="btn-agregar-admin" 
            onClick={abrirTablaModal}
            disabled={loading}
            style={{ background: '#4CAF50' }}
          >
            📋 Backup por Tabla
          </button>
        </div>
      </div>

      {/* 🔵 TABLA DE INFORMACIÓN */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tabla</th>
              <th>Descripción</th>
              <th>Registros</th>
            </tr>
          </thead>
          <tbody>
            {tablasInfo.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No hay información de tablas disponibles
                </td>
              </tr>
            ) : (
              tablasInfo.map((tabla, index) => (
                <tr key={tabla.nombre}>
                  <td className="td-orden">{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.5rem' }}>{getIconoTabla(tabla.nombre)}</span>
                  </td>
                  <td style={{ textAlign: 'left', paddingLeft: '20px' }}>
                    <span style={{ fontWeight: 500 }}>
                      {getNombreTablaLegible(tabla.nombre)}
                    </span>
                    <br />
                    <small style={{ color: '#666' }}>Tabla: {tabla.nombre}</small>
                  </td>
                  <td className="td-cantidad">
                    {tabla.registros.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔵 FOOTER DE TABLA */}
      <div className="admin-table-footer">
        <span>Total de tablas: {totalTablas}</span>
        <span className="footer-hint">
          💡 Los backups se generan en formato SQL con INSERTs
        </span>
      </div>

      {/* 🔵 MODAL DE SELECCIÓN DE TABLA */}
      {showTablaModal && (
        <div className="modal-overlay" onClick={cerrarTablaModal}>
          <div className="modal-content modal-admin" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📋 Seleccionar Tabla</h2>
              <button className="modal-close" onClick={cerrarTablaModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="admin-form">
                <div className="form-group">
                  <label>Tabla a respaldar *</label>
                  <select
                    value={tablaSeleccionada}
                    onChange={(e) => setTablaSeleccionada(e.target.value)}
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
                    <option value="">Seleccionar tabla...</option>
                    {tablasInfo.map((tabla) => (
                      <option key={tabla.nombre} value={tabla.nombre}>
                        {getIconoTabla(tabla.nombre)} {getNombreTablaLegible(tabla.nombre)} ({tabla.registros} registros)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={incluirId}
                      onChange={(e) => setIncluirId(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span>Incluir columna ID en los INSERTs</span>
                  </label>
                  <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
                    💡 Si marcas esta opción, se incluirá el ID en los INSERTs. Útil para mantener los mismos IDs.
                  </small>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarTablaModal}>
                Cancelar
              </button>
              <button 
                className="btn-guardar" 
                onClick={generarBackupTabla}
                disabled={loading || !tablaSeleccionada}
                style={{ background: '#4CAF50' }}
              >
                {loading ? '⏳ Generando...' : '💾 Generar Backup'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔵 MODAL DE CONFIRMACIÓN */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={confirmModalData.title}
        message={confirmModalData.message}
        type={confirmModalData.type}
        confirmText="Aceptar"
      />
    </div>
  );
}

export default BackupAdmin;