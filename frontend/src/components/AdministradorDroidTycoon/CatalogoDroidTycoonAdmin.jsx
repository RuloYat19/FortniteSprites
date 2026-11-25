import { useEffect, useMemo, useState } from 'react';
import ConfirmModal from '../ConfirmModal';
import './AdministradorDroidTycoon.css';

function ordenarRegistros(registros) {
  return [...registros].sort((a, b) => a.numeroOrden - b.numeroOrden);
}

function crearFormularioVacio(campos, numeroOrden = '') {
  return Object.fromEntries(
    campos.map((campo) => [
      campo.key,
      campo.key === 'numeroOrden' ? String(numeroOrden) : '',
    ]),
  );
}

function CatalogoDroidTycoonAdmin({ configuracion }) {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [registroEditado, setRegistroEditado] = useState(null);
  const [formulario, setFormulario] = useState(() => crearFormularioVacio(configuracion.campos));
  const [guardando, setGuardando] = useState(false);
  const [registroAEliminar, setRegistroAEliminar] = useState(null);
  const [movimientoPendiente, setMovimientoPendiente] = useState(null);
  const [cantidadMovimiento, setCantidadMovimiento] = useState('1');
  const [moviendo, setMoviendo] = useState(false);
  const [errorMovimiento, setErrorMovimiento] = useState('');
  const permiteReordenar = configuracion.key === 'nombres';

  const cargarRegistros = async () => {
    setCargando(true);
    setError('');

    try {
      const response = await configuracion.servicio.getAll();
      setRegistros(ordenarRegistros(response.data));
    } catch (requestError) {
      console.error(`Error al cargar ${configuracion.titulo}:`, requestError);
      setError(`No se pudieron cargar ${configuracion.titulo.toLowerCase()}.`);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    let componenteActivo = true;

    configuracion.servicio.getAll()
      .then((response) => {
        if (componenteActivo) setRegistros(ordenarRegistros(response.data));
      })
      .catch((requestError) => {
        console.error(`Error al cargar ${configuracion.titulo}:`, requestError);
        if (componenteActivo) {
          setError(`No se pudieron cargar ${configuracion.titulo.toLowerCase()}.`);
        }
      })
      .finally(() => {
        if (componenteActivo) setCargando(false);
      });

    return () => {
      componenteActivo = false;
    };
  }, [configuracion]);

  const registrosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase('es');
    if (!texto) return registros;

    return registros.filter((registro) => configuracion.campos.some((campo) => (
      String(registro[campo.key] ?? '').toLocaleLowerCase('es').includes(texto)
    )));
  }, [busqueda, configuracion.campos, registros]);

  const abrirCrear = () => {
    const siguienteOrden = registros.reduce(
      (maximo, registro) => Math.max(maximo, registro.numeroOrden || 0),
      0,
    ) + 1;
    setRegistroEditado(null);
    setFormulario(crearFormularioVacio(configuracion.campos, siguienteOrden));
    setMensaje(null);
    setModalAbierto(true);
  };

  const abrirEditar = (registro) => {
    setRegistroEditado(registro);
    setFormulario(Object.fromEntries(
      configuracion.campos.map((campo) => [
        campo.key,
        String(registro[campo.key] ?? ''),
      ]),
    ));
    setMensaje(null);
    setModalAbierto(true);
  };

  const cerrarFormulario = () => {
    setModalAbierto(false);
    setRegistroEditado(null);
    setFormulario(crearFormularioVacio(configuracion.campos));
  };

  const cambiarCampo = (event) => {
    setFormulario((actual) => ({
      ...actual,
      [event.target.name]: event.target.value,
    }));
  };

  const guardarRegistro = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setMensaje(null);

    const datos = Object.fromEntries(configuracion.campos.map((campo) => {
      const valor = formulario[campo.key];
      return [
        campo.key,
        campo.type === 'number' ? Number.parseInt(valor, 10) : valor.trim(),
      ];
    }));

    try {
      if (registroEditado) {
        await configuracion.servicio.update(registroEditado.id, datos);
        setMensaje({ texto: 'Registro actualizado correctamente.', error: false });
      } else {
        await configuracion.servicio.create(datos);
        setMensaje({ texto: 'Registro agregado correctamente.', error: false });
      }

      cerrarFormulario();
      await cargarRegistros();
    } catch (requestError) {
      console.error(`Error al guardar ${configuracion.singular}:`, requestError);
      const detalle = requestError.response?.data?.detail;
      setMensaje({
        texto: typeof detalle === 'string'
          ? detalle
          : `No se pudo guardar ${configuracion.singular}.`,
        error: true,
      });
    } finally {
      setGuardando(false);
    }
  };

  const eliminarRegistro = async () => {
    if (!registroAEliminar) return;

    try {
      await configuracion.servicio.delete(registroAEliminar.id);
      setRegistroAEliminar(null);
      setMensaje({ texto: `${configuracion.singular} eliminado correctamente.`, error: false });
      await cargarRegistros();
    } catch (requestError) {
      console.error(`Error al eliminar ${configuracion.singular}:`, requestError);
      setRegistroAEliminar(null);
      const detalle = requestError.response?.data?.detail;
      setMensaje({
        texto: typeof detalle === 'string'
          ? detalle
          : `No se pudo eliminar ${configuracion.singular}.`,
        error: true,
      });
    }
  };

  const abrirMovimiento = (registro, direccion) => {
    setMovimientoPendiente({ registro, direccion });
    setCantidadMovimiento('1');
    setErrorMovimiento('');
  };

  const cerrarMovimiento = () => {
    if (moviendo) return;
    setMovimientoPendiente(null);
    setErrorMovimiento('');
  };

  const ejecutarMovimiento = async (event) => {
    event.preventDefault();
    if (!movimientoPendiente) return;

    const cantidad = Number(cantidadMovimiento);
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      setErrorMovimiento('Ingresa una cantidad de posiciones mayor que cero.');
      return;
    }

    const ordenados = [...registros].sort(
      (a, b) => a.numeroOrden - b.numeroOrden || a.id - b.id,
    );
    const posicionActual = ordenados.findIndex(
      (item) => item.id === movimientoPendiente.registro.id,
    );
    if (posicionActual < 0) {
      setErrorMovimiento('No se encontró el nombre que deseas mover. Cierra y vuelve a intentarlo.');
      return;
    }

    const nuevaPosicion = movimientoPendiente.direccion === 'arriba'
      ? Math.max(0, posicionActual - cantidad)
      : Math.min(ordenados.length - 1, posicionActual + cantidad);

    if (nuevaPosicion === posicionActual) {
      cerrarMovimiento();
      return;
    }

    const [registroMovido] = ordenados.splice(posicionActual, 1);
    ordenados.splice(nuevaPosicion, 0, registroMovido);

    setMoviendo(true);
    setErrorMovimiento('');
    try {
      for (const [indice, registro] of ordenados.entries()) {
        const numeroOrden = indice + 1;
        if (registro.numeroOrden !== numeroOrden) {
          await configuracion.servicio.update(registro.id, { numeroOrden });
        }
      }

      setRegistros(ordenados.map((registro, indice) => ({
        ...registro,
        numeroOrden: indice + 1,
      })));
      setMovimientoPendiente(null);
    } catch (errorReordenamiento) {
      console.error(`Error al reordenar ${configuracion.titulo.toLowerCase()}:`, errorReordenamiento);
      try {
        const response = await configuracion.servicio.getAll();
        const registrosRecargados = ordenarRegistros(response.data);
        setRegistros(registrosRecargados);
        const registroRecargado = registrosRecargados.find(
          (registro) => registro.id === movimientoPendiente.registro.id,
        );
        if (registroRecargado) {
          setMovimientoPendiente((actual) => (
            actual ? { ...actual, registro: registroRecargado } : actual
          ));
        }
        setErrorMovimiento('El movimiento no se completó por completo; se actualizó la lista con el orden guardado.');
      } catch (errorRecarga) {
        console.error(`Error al recargar ${configuracion.titulo.toLowerCase()}:`, errorRecarga);
        setErrorMovimiento('No se pudo completar ni recargar el movimiento. Intenta de nuevo.');
      }
    } finally {
      setMoviendo(false);
    }
  };

  const obtenerNombreRegistro = (registro) => configuracion.campos
    .filter((campo) => campo.key !== 'numeroOrden')
    .map((campo) => registro[campo.key])
    .filter(Boolean)
    .join(' - ');

  return (
    <main className="admin-main droid-admin-main">
      <header className="admin-header">
        <h1 className="titulo">{configuracion.icon} {configuracion.titulo}</h1>
        <p className="admin-subtitle">Administra los datos disponibles para Droid Tycoon.</p>
      </header>

      <section className="admin-filtros">
        <div className="filtros-group">
          <input
            type="search"
            className="filtro-select"
            placeholder={`Buscar ${configuracion.titulo.toLowerCase()}...`}
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            aria-label={`Buscar ${configuracion.titulo}`}
          />
        </div>
        <button type="button" className="btn-agregar-admin" onClick={abrirCrear}>
          ➕ Agregar {configuracion.singular}
        </button>
      </section>

      {mensaje && (
        <p className={`droid-admin-notice ${mensaje.error ? 'error' : ''}`} role={mensaje.error ? 'alert' : 'status'}>
          {mensaje.texto}
          <button type="button" onClick={() => setMensaje(null)} aria-label="Cerrar aviso">×</button>
        </p>
      )}

      <section className="admin-stats">
        <div className="stat-card">
          <span className="stat-icon">{configuracion.icon}</span>
          <div>
            <span className="stat-label">Total de registros</span>
            <span className="stat-value">{registros.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔎</span>
          <div>
            <span className="stat-label">Mostrando</span>
            <span className="stat-value">{registrosFiltrados.length}</span>
          </div>
        </div>
      </section>

      {cargando ? (
        <div className="droid-admin-state" role="status">Cargando {configuracion.titulo.toLowerCase()}...</div>
      ) : error ? (
        <div className="droid-admin-state droid-admin-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={cargarRegistros}>Reintentar</button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                {configuracion.campos.map((campo) => (
                  <th key={campo.key}>{campo.label}</th>
                ))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={configuracion.campos.length + 1} className="no-data">
                    {registros.length === 0
                      ? `No hay registros de ${configuracion.titulo.toLowerCase()}.`
                      : 'No hay registros que coincidan con la búsqueda.'}
                  </td>
                </tr>
              ) : registrosFiltrados.map((registro) => {
                const indiceRegistro = registros.findIndex((item) => item.id === registro.id);
                const nombreRegistro = obtenerNombreRegistro(registro);

                return (
                  <tr key={registro.id}>
                    {configuracion.campos.map((campo) => (
                      <td
                        key={campo.key}
                        className={campo.key === 'numeroOrden' ? 'td-orden' : undefined}
                      >
                        {registro[campo.key]}
                      </td>
                    ))}
                    <td className="td-acciones">
                      <button
                        type="button"
                        className="btn-editar"
                        title="Editar"
                        aria-label={`Editar ${nombreRegistro}`}
                        onClick={() => abrirEditar(registro)}
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        className="btn-eliminar"
                        title="Eliminar"
                        aria-label={`Eliminar ${nombreRegistro}`}
                        onClick={() => setRegistroAEliminar(registro)}
                      >
                        🗑️
                      </button>
                      {permiteReordenar && (
                        <>
                          <button
                            type="button"
                            className="btn-mover-orden"
                            title="Mover hacia arriba"
                            aria-label={`Mover ${nombreRegistro} hacia arriba`}
                            disabled={indiceRegistro <= 0 || moviendo}
                            onClick={() => abrirMovimiento(registro, 'arriba')}
                          >
                            ⬆️
                          </button>
                          <button
                            type="button"
                            className="btn-mover-orden"
                            title="Mover hacia abajo"
                            aria-label={`Mover ${nombreRegistro} hacia abajo`}
                            disabled={indiceRegistro === registros.length - 1 || moviendo}
                            onClick={() => abrirMovimiento(registro, 'abajo')}
                          >
                            ⬇️
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarFormulario}>
          <div className="modal-content modal-admin" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{registroEditado ? '✏️ Editar' : '➕ Agregar'} {configuracion.singular}</h2>
              <button type="button" className="modal-close" onClick={cerrarFormulario}>✕</button>
            </div>
            <form onSubmit={guardarRegistro}>
              <div className="modal-body">
                <div className="admin-form">
                  {configuracion.campos.map((campo) => (
                    <div className="form-group" key={campo.key}>
                      <label htmlFor={`droid-admin-${campo.key}`}>{campo.label} *</label>
                      <input
                        id={`droid-admin-${campo.key}`}
                        type={campo.type || 'text'}
                        name={campo.key}
                        value={formulario[campo.key] ?? ''}
                        onChange={cambiarCampo}
                        min={campo.min ?? (campo.type === 'number' ? 0 : undefined)}
                        step={campo.type === 'number' ? 1 : undefined}
                        maxLength={campo.maxLength}
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={cerrarFormulario}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar" disabled={guardando}>
                  {guardando ? 'Guardando...' : registroEditado ? 'Guardar cambios' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {movimientoPendiente && permiteReordenar && (
        <div className="modal-overlay" onClick={cerrarMovimiento}>
          <form
            className="modal-content modal-admin"
            role="dialog"
            aria-modal="true"
            aria-labelledby="droid-admin-mover-title"
            onSubmit={ejecutarMovimiento}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="droid-admin-mover-title">
                {movimientoPendiente.direccion === 'arriba'
                  ? '⬆️ Mover hacia arriba'
                  : '⬇️ Mover hacia abajo'}
              </h2>
              <button
                type="button"
                className="modal-close"
                onClick={cerrarMovimiento}
                disabled={moviendo}
                aria-label="Cerrar formulario"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="droid-admin-move-summary">
                Nombre seleccionado: <strong>{obtenerNombreRegistro(movimientoPendiente.registro)}</strong>
                {' '}(orden actual: {movimientoPendiente.registro.numeroOrden})
              </p>
              <div className="admin-form">
                <div className="form-group">
                  <label htmlFor="droid-admin-cantidad-movimiento">
                    ¿Cuántas posiciones deseas moverlo?
                  </label>
                  <input
                    id="droid-admin-cantidad-movimiento"
                    type="number"
                    min="1"
                    step="1"
                    value={cantidadMovimiento}
                    onChange={(event) => setCantidadMovimiento(event.target.value)}
                    required
                  />
                </div>
              </div>
              {errorMovimiento && (
                <p className="droid-admin-move-error" role="alert">{errorMovimiento}</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-cancelar"
                onClick={cerrarMovimiento}
                disabled={moviendo}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-guardar" disabled={moviendo}>
                {moviendo ? 'Moviendo...' : '🚀 Aplicar movimiento'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(registroAEliminar)}
        onClose={() => setRegistroAEliminar(null)}
        title="⚠️ Confirmar eliminación"
        message={`¿Eliminar "${registroAEliminar ? obtenerNombreRegistro(registroAEliminar) : ''}"? Esta acción no se puede deshacer.`}
        type="warning"
        confirmText="Eliminar"
        onConfirm={eliminarRegistro}
        showCancelButton
      />
    </main>
  );
}

export default CatalogoDroidTycoonAdmin;
