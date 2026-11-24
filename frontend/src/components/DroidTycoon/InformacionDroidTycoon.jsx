import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { droidesService, fusionesService, reglasFusionService } from '../../services/api';
import ComboboxFiltrable from './ComboboxFiltrable';
import ConfirmModal from '../ConfirmModal';
import './Droidex.css';
import './InformacionDroidTycoon.css';

const TAMANO_PAGINA = 1000;

async function cargarTodosLosRegistros(servicio) {
  const registros = [];
  let skip = 0;

  while (true) {
    const response = await servicio({ skip, limit: TAMANO_PAGINA });
    registros.push(...response.data);

    if (response.data.length < TAMANO_PAGINA) return registros;
    skip += TAMANO_PAGINA;
  }
}

function normalizarNombre(nombre) {
  return nombre.trim().toLocaleLowerCase('es');
}

function obtenerUrlImagen(ruta) {
  if (!ruta) return null;
  if (/^(https?:|data:)/i.test(ruta)) return ruta;
  return `/${ruta.replace(/^\.?\//, '')}`;
}

function ImagenDroide({ droide, nombre }) {
  const [imagenFallida, setImagenFallida] = useState(false);
  const url = obtenerUrlImagen(droide?.nombreArchivoImagen);

  return (
    <span className="informacion-fusion-droid-image">
      {url && !imagenFallida ? (
        <img
          src={url}
          alt={nombre}
          loading="lazy"
          onError={() => setImagenFallida(true)}
        />
      ) : (
        <span aria-hidden="true">🤖</span>
      )}
      <small>{nombre}</small>
    </span>
  );
}

function InformacionDroidTycoon() {
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('fusiones');
  const [vistaFusion, setVistaFusion] = useState('recetas');
  const [fusiones, setFusiones] = useState([]);
  const [reglas, setReglas] = useState([]);
  const [droides, setDroides] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [intentoCarga, setIntentoCarga] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState('recetas');
  const [nuevoRegistro, setNuevoRegistro] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState('');
  const [registroEditando, setRegistroEditando] = useState(null);
  const [registroAEliminar, setRegistroAEliminar] = useState(null);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [errorOperacion, setErrorOperacion] = useState('');
  const [movimientoPendiente, setMovimientoPendiente] = useState(null);
  const [cantidadMovimiento, setCantidadMovimiento] = useState('1');
  const [moviendo, setMoviendo] = useState(false);
  const [errorMovimiento, setErrorMovimiento] = useState('');

  const cargarDatos = useCallback(async () => {
    try {
      const [registrosFusion, registrosReglas, registrosDroides] = await Promise.all([
        cargarTodosLosRegistros(fusionesService.getAll),
        cargarTodosLosRegistros(reglasFusionService.getAll),
        cargarTodosLosRegistros(droidesService.getAll),
      ]);
      setFusiones(registrosFusion);
      setReglas(registrosReglas);
      setDroides(registrosDroides);
    } catch (errorCarga) {
      console.error('Error al cargar la información de Droid Tycoon:', errorCarga);
      setError('No se pudo cargar la información de fusiones. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos, intentoCarga]);

  const droidesPorNombre = useMemo(
    () => new Map(droides.map((droide) => [normalizarNombre(droide.nombre), droide])),
    [droides],
  );

  const fusionesOrdenadas = useMemo(
    () => [...fusiones].sort((a, b) => a.numeroOrden - b.numeroOrden || a.id - b.id),
    [fusiones],
  );

  const reglasOrdenadas = useMemo(
    () => [...reglas].sort((a, b) => a.numeroOrden - b.numeroOrden || a.id - b.id),
    [reglas],
  );

  const droidesOrdenados = useMemo(
    () => [...droides].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')),
    [droides],
  );

  const droidesOpciones = useMemo(
    () => droidesOrdenados.map((droide) => ({
      id: `droide-${droide.id}`,
      value: droide.nombre,
      label: droide.nombre,
      secondary: droide.rareza,
      item: droide,
    })),
    [droidesOrdenados],
  );

  const secciones = [
    { id: 'ventajas', etiqueta: 'Ventajas', icono: '✨' },
    { id: 'renacimientos', etiqueta: 'Renacimientos', icono: '♻️' },
    { id: 'fusiones', etiqueta: 'Fusiones', icono: '🔗' },
  ];

  const abrirFormulario = () => {
    const registros = vistaFusion === 'recetas' ? fusiones : reglas;
    const siguienteNumeroOrden = registros.reduce(
      (mayor, registro) => Math.max(mayor, Number(registro.numeroOrden) || 0),
      0,
    ) + 1;

    setTipoRegistro(vistaFusion);
    setNuevoRegistro(vistaFusion === 'recetas'
      ? {
        numeroOrden: String(siguienteNumeroOrden),
        droide1: '',
        droide2: '',
        droide3: '',
        droideResultante: '',
        rarezaResultante: '',
      }
      : { numeroOrden: String(siguienteNumeroOrden), descripcion: '' });
    setRegistroEditando(null);
    setErrorFormulario('');
    setErrorOperacion('');
    setModalAbierto(true);
  };

  const abrirEdicion = (tipo, registro) => {
    setTipoRegistro(tipo);
    setRegistroEditando({ id: registro.id, tipo });
    setNuevoRegistro(tipo === 'recetas'
      ? {
        numeroOrden: String(registro.numeroOrden),
        droide1: registro.droide1,
        droide2: registro.droide2,
        droide3: registro.droide3,
        droideResultante: registro.droideResultante,
        rarezaResultante: registro.rarezaResultante,
      }
      : {
        numeroOrden: String(registro.numeroOrden),
        descripcion: registro.descripcion,
      });
    setErrorFormulario('');
    setErrorOperacion('');
    setModalAbierto(true);
  };

  const cerrarFormulario = () => {
    if (guardando) return;
    setModalAbierto(false);
    setRegistroEditando(null);
    setErrorFormulario('');
  };

  const manejarCambioFormulario = (event) => {
    const { name, value } = event.target;
    setNuevoRegistro((actual) => ({ ...actual, [name]: value }));
  };

  const guardarRegistro = async (event) => {
    event.preventDefault();
    setErrorFormulario('');

    const camposTexto = tipoRegistro === 'recetas'
      ? ['droide1', 'droide2', 'droide3', 'droideResultante', 'rarezaResultante']
      : ['descripcion'];

    if (camposTexto.some((campo) => !nuevoRegistro[campo]?.trim())) {
      setErrorFormulario(tipoRegistro === 'recetas'
        ? 'Selecciona los droides de la lista y completa todos los campos antes de guardar.'
        : 'Completa todos los campos antes de guardar.');
      return;
    }

    const numeroOrden = Number(nuevoRegistro.numeroOrden);
    if (!Number.isInteger(numeroOrden) || numeroOrden < 0) {
      setErrorFormulario('El número de orden debe ser un entero igual o mayor que cero.');
      return;
    }

    setGuardando(true);
    try {
      if (tipoRegistro === 'recetas') {
        const datos = {
          numeroOrden,
          droide1: nuevoRegistro.droide1.trim(),
          droide2: nuevoRegistro.droide2.trim(),
          droide3: nuevoRegistro.droide3.trim(),
          droideResultante: nuevoRegistro.droideResultante.trim(),
          rarezaResultante: nuevoRegistro.rarezaResultante.trim(),
        };
        const response = registroEditando
          ? await fusionesService.update(registroEditando.id, datos)
          : await fusionesService.create(datos);
        setFusiones((actuales) => registroEditando
          ? actuales.map((registro) => (
            registro.id === registroEditando.id ? response.data : registro
          ))
          : [...actuales, response.data]);
      } else {
        const datos = {
          numeroOrden,
          descripcion: nuevoRegistro.descripcion.trim(),
        };
        const response = registroEditando
          ? await reglasFusionService.update(registroEditando.id, datos)
          : await reglasFusionService.create(datos);
        setReglas((actuales) => registroEditando
          ? actuales.map((registro) => (
            registro.id === registroEditando.id ? response.data : registro
          ))
          : [...actuales, response.data]);
      }
      setModalAbierto(false);
      setRegistroEditando(null);
      setErrorFormulario('');
    } catch (errorGuardado) {
      console.error(
        registroEditando ? 'Error al actualizar un registro de fusión:' : 'Error al agregar un registro de fusión:',
        errorGuardado,
      );
      const detalle = errorGuardado.response?.data?.detail;
      setErrorFormulario(
        typeof detalle === 'string'
          ? detalle
          : 'No se pudo guardar el registro. Revisa los datos e intenta de nuevo.',
      );
    } finally {
      setGuardando(false);
    }
  };

  const eliminarRegistro = async () => {
    if (!registroAEliminar) return;

    const registro = registroAEliminar;
    const clave = `${registro.tipo}-${registro.id}`;
    setRegistroAEliminar(null);
    setEliminandoId(clave);
    setErrorOperacion('');

    try {
      if (registro.tipo === 'recetas') {
        await fusionesService.delete(registro.id);
        setFusiones((actuales) => actuales.filter((fusion) => fusion.id !== registro.id));
      } else {
        await reglasFusionService.delete(registro.id);
        setReglas((actuales) => actuales.filter((regla) => regla.id !== registro.id));
      }
    } catch (errorEliminacion) {
      console.error('Error al eliminar un registro de fusión:', errorEliminacion);
      setErrorOperacion(
        `No se pudo eliminar ${registro.tipo === 'recetas' ? 'la receta' : 'la regla'} de fusión. Intenta de nuevo.`,
      );
    } finally {
      setEliminandoId(null);
    }
  };

  const abrirMovimiento = (tipo, registro, direccion) => {
    setMovimientoPendiente({ tipo, registro, direccion });
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

    const { tipo, registro, direccion } = movimientoPendiente;
    const registros = [...(tipo === 'recetas' ? fusiones : reglas)]
      .sort((a, b) => a.numeroOrden - b.numeroOrden || a.id - b.id);
    const posicionActual = registros.findIndex((item) => item.id === registro.id);
    if (posicionActual < 0) {
      setErrorMovimiento('No se encontró el registro que deseas mover. Cierra y vuelve a intentarlo.');
      return;
    }

    const nuevaPosicion = direccion === 'arriba'
      ? Math.max(0, posicionActual - cantidad)
      : Math.min(registros.length - 1, posicionActual + cantidad);

    if (nuevaPosicion === posicionActual) {
      cerrarMovimiento();
      return;
    }

    const ordenados = [...registros];
    const [registroMovido] = ordenados.splice(posicionActual, 1);
    ordenados.splice(nuevaPosicion, 0, registroMovido);
    const servicio = tipo === 'recetas' ? fusionesService : reglasFusionService;

    setMoviendo(true);
    setErrorMovimiento('');
    try {
      for (const [indice, item] of ordenados.entries()) {
        const numeroOrden = indice + 1;
        if (item.numeroOrden !== numeroOrden) {
          await servicio.update(item.id, { numeroOrden });
        }
      }

      const actualizados = ordenados.map((item, indice) => ({
        ...item,
        numeroOrden: indice + 1,
      }));
      if (tipo === 'recetas') {
        setFusiones(actualizados);
      } else {
        setReglas(actualizados);
      }
      setMovimientoPendiente(null);
    } catch (errorReordenamiento) {
      console.error('Error al reordenar un registro de fusión:', errorReordenamiento);
      try {
        const registrosRecargados = await cargarTodosLosRegistros(servicio.getAll);
        if (tipo === 'recetas') {
          setFusiones(registrosRecargados);
        } else {
          setReglas(registrosRecargados);
        }
        const registroRecargado = registrosRecargados.find((item) => item.id === registro.id);
        if (registroRecargado) {
          setMovimientoPendiente((actual) => (
            actual ? { ...actual, registro: registroRecargado } : actual
          ));
        }
        setErrorMovimiento('El movimiento no se completó por completo; se actualizó la lista con el orden guardado.');
      } catch (errorRecarga) {
        console.error('Error al recargar el orden de fusiones:', errorRecarga);
        setErrorMovimiento('No se pudo completar ni recargar el movimiento. Intenta de nuevo.');
      }
    } finally {
      setMoviendo(false);
    }
  };

  return (
    <div className="droidex-layout">
      <aside className="droidex-sidebar">
        <div className="droidex-sidebar-header">
          <img src="/imagenesGeneral/LogoDroidTycoon.png" alt="" />
          <div>
            <h2>Droid Tycoon</h2>
            <span>Información</span>
          </div>
        </div>

        <nav className="droidex-sidebar-nav" aria-label="Secciones de Droid Tycoon">
          <span className="droidex-nav-heading">Información</span>
          {secciones.map((seccion) => (
            <button
              type="button"
              key={seccion.id}
              className={seccionActiva === seccion.id ? 'active' : ''}
              aria-current={seccionActiva === seccion.id ? 'page' : undefined}
              onClick={() => setSeccionActiva(seccion.id)}
            >
              <span aria-hidden="true">{seccion.icono}</span>
              <span>{seccion.etiqueta}</span>
              {seccion.id === 'fusiones' && (
                <span className="droidex-nav-count">{fusiones.length + reglas.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="droidex-sidebar-footer">
          <button type="button" onClick={() => navigate('/droid-tycoon')}>
            ← Menú Droid Tycoon
          </button>
        </div>
      </aside>

      <main className="droidex-main">
        <header className="droidex-header">
          <div>
            <p className="droidex-eyebrow">Droid Tycoon</p>
            <h1>
              {seccionActiva === 'fusiones'
                ? 'Fusiones'
                : secciones.find((seccion) => seccion.id === seccionActiva)?.etiqueta}
            </h1>
            <p className="droidex-subtitle">
              {seccionActiva === 'fusiones'
                ? 'Consulta las recetas y reglas disponibles para fusionar droides.'
                : `La información de ${secciones.find((seccion) => seccion.id === seccionActiva)?.etiqueta.toLowerCase()} estará disponible próximamente.`}
            </p>
          </div>
          {seccionActiva === 'fusiones' && (
            <div className="droidex-header-stat">
              <span>{fusiones.length}</span>
              <small>Recetas</small>
            </div>
          )}
        </header>

        {seccionActiva === 'fusiones' ? (
          <>
            <div className="informacion-fusion-controls">
              <div className="informacion-fusion-tabs" role="tablist" aria-label="Información de fusiones">
                <button
                  type="button"
                  role="tab"
                  id="tab-recetas-fusion"
                  aria-selected={vistaFusion === 'recetas'}
                  aria-controls="panel-fusion"
                  className={vistaFusion === 'recetas' ? 'active' : ''}
                  onClick={() => setVistaFusion('recetas')}
                >
                  🔗 Recetas de Fusión
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-reglas-fusion"
                  aria-selected={vistaFusion === 'reglas'}
                  aria-controls="panel-fusion"
                  className={vistaFusion === 'reglas' ? 'active' : ''}
                  onClick={() => setVistaFusion('reglas')}
                >
                  📜 Reglas de Fusión
                </button>
              </div>
              <button
                type="button"
                className="informacion-fusion-add-button"
                onClick={abrirFormulario}
                disabled={cargando || Boolean(error)}
              >
                + Agregar {vistaFusion === 'recetas' ? 'receta' : 'regla'}
              </button>
            </div>

            <section
              id="panel-fusion"
              role="tabpanel"
              aria-labelledby={vistaFusion === 'recetas' ? 'tab-recetas-fusion' : 'tab-reglas-fusion'}
            >
              {errorOperacion && (
                <div className="droidex-error" role="alert">
                  <span>{errorOperacion}</span>
                  <button type="button" onClick={() => setErrorOperacion('')}>
                    Cerrar
                  </button>
                </div>
              )}
              {error ? (
                <div className="droidex-error" role="alert">
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setCargando(true);
                      setIntentoCarga((intento) => intento + 1);
                    }}
                  >
                    Reintentar
                  </button>
                </div>
              ) : cargando ? (
                <div className="droidex-message" role="status">Cargando información de fusiones...</div>
              ) : vistaFusion === 'recetas' ? (
                fusionesOrdenadas.length === 0 ? (
                  <div className="droidex-message">Todavía no hay recetas de fusión registradas.</div>
                ) : (
                  <div className="informacion-fusion-list" aria-label="Recetas de fusión">
                    {fusionesOrdenadas.map((fusion, indice) => (
                      <article className="informacion-fusion-row" key={fusion.id}>
                        <div className="informacion-fusion-order">
                          <span>#{fusion.numeroOrden}</span>
                          <small>Receta</small>
                          <div className="informacion-fusion-row-actions">
                            <button
                              type="button"
                              aria-label={`Mover receta ${fusion.numeroOrden} hacia arriba`}
                              title="Mover hacia arriba"
                              disabled={indice === 0 || eliminandoId === `recetas-${fusion.id}`}
                              onClick={() => abrirMovimiento('recetas', fusion, 'arriba')}
                            >
                              ⬆️
                            </button>
                            <button
                              type="button"
                              aria-label={`Mover receta ${fusion.numeroOrden} hacia abajo`}
                              title="Mover hacia abajo"
                              disabled={indice === fusionesOrdenadas.length - 1 || eliminandoId === `recetas-${fusion.id}`}
                              onClick={() => abrirMovimiento('recetas', fusion, 'abajo')}
                            >
                              ⬇️
                            </button>
                            <button
                              type="button"
                              aria-label={`Editar receta ${fusion.numeroOrden}`}
                              title="Editar receta"
                              disabled={eliminandoId === `recetas-${fusion.id}`}
                              onClick={() => abrirEdicion('recetas', fusion)}
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              className="delete"
                              aria-label={`Eliminar receta ${fusion.numeroOrden}`}
                              title="Eliminar receta"
                              disabled={eliminandoId === `recetas-${fusion.id}`}
                              onClick={() => setRegistroAEliminar({ ...fusion, tipo: 'recetas' })}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <div className="informacion-fusion-components">
                          {[fusion.droide1, fusion.droide2, fusion.droide3].map((nombre, indiceDroide) => (
                            <ImagenDroide
                              key={`${fusion.id}-${indiceDroide}`}
                              nombre={nombre}
                              droide={droidesPorNombre.get(normalizarNombre(nombre))}
                            />
                          ))}
                        </div>
                        <span className="informacion-fusion-arrow" aria-hidden="true">→</span>
                        <div className="informacion-fusion-result">
                          <ImagenDroide
                            nombre={fusion.droideResultante}
                            droide={droidesPorNombre.get(normalizarNombre(fusion.droideResultante))}
                          />
                          <span className="droidex-rarity informacion-fusion-rarity">
                            {fusion.rarezaResultante}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                )
              ) : reglasOrdenadas.length === 0 ? (
                <div className="droidex-message">Todavía no hay reglas de fusión registradas.</div>
              ) : (
                <ol className="informacion-reglas-list" aria-label="Reglas de fusión">
                  {reglasOrdenadas.map((regla, indice) => (
                    <li key={regla.id}>
                      <div className="informacion-regla-meta">
                        <span className="informacion-regla-order">#{regla.numeroOrden}</span>
                        <div className="informacion-fusion-row-actions">
                          <button
                            type="button"
                            aria-label={`Mover regla ${regla.numeroOrden} hacia arriba`}
                            title="Mover hacia arriba"
                            disabled={indice === 0 || eliminandoId === `reglas-${regla.id}`}
                            onClick={() => abrirMovimiento('reglas', regla, 'arriba')}
                          >
                            ⬆️
                          </button>
                          <button
                            type="button"
                            aria-label={`Mover regla ${regla.numeroOrden} hacia abajo`}
                            title="Mover hacia abajo"
                            disabled={indice === reglasOrdenadas.length - 1 || eliminandoId === `reglas-${regla.id}`}
                            onClick={() => abrirMovimiento('reglas', regla, 'abajo')}
                          >
                            ⬇️
                          </button>
                          <button
                            type="button"
                            aria-label={`Editar regla ${regla.numeroOrden}`}
                            title="Editar regla"
                            disabled={eliminandoId === `reglas-${regla.id}`}
                            onClick={() => abrirEdicion('reglas', regla)}
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="delete"
                            aria-label={`Eliminar regla ${regla.numeroOrden}`}
                            title="Eliminar regla"
                            disabled={eliminandoId === `reglas-${regla.id}`}
                            onClick={() => setRegistroAEliminar({ ...regla, tipo: 'reglas' })}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <p>{regla.descripcion}</p>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </>
        ) : (
          <div className="droidex-message">
            Esta sección todavía no cuenta con información disponible.
          </div>
        )}

        {modalAbierto && (
          <div
            className="droidex-modal-overlay"
            onClick={cerrarFormulario}
          >
            <form
              className="droidex-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="informacion-fusion-modal-title"
              onSubmit={guardarRegistro}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="droidex-modal-header">
                <div>
                  <p className="droidex-eyebrow">Droid Tycoon</p>
                  <h2 id="informacion-fusion-modal-title">
                    {registroEditando ? 'Editar' : 'Agregar'}{' '}
                    {tipoRegistro === 'recetas' ? 'receta de fusión' : 'regla de fusión'}
                  </h2>
                </div>
                <button
                  type="button"
                  className="droidex-modal-close"
                  onClick={cerrarFormulario}
                  disabled={guardando}
                  aria-label="Cerrar formulario"
                >
                  ×
                </button>
              </div>

              <label>
                Número de orden
                <input
                  type="number"
                  name="numeroOrden"
                  min="0"
                  step="1"
                  value={nuevoRegistro.numeroOrden || ''}
                  onChange={manejarCambioFormulario}
                  required
                />
              </label>

              {tipoRegistro === 'recetas' ? (
                <>
                  {[
                    ['droide1', 'Droide 1'],
                    ['droide2', 'Droide 2'],
                    ['droide3', 'Droide 3'],
                    ['droideResultante', 'Droide resultante'],
                  ].map(([campo, etiqueta]) => (
                    <ComboboxFiltrable
                      key={campo}
                      id={`informacion-fusion-${campo}`}
                      label={etiqueta}
                      value={nuevoRegistro[campo] || ''}
                      options={droidesOpciones}
                      noOptionsText="No hay droides que coincidan."
                      onChange={(opcion) => {
                        const droide = opcion?.item;
                        setNuevoRegistro((actual) => ({
                          ...actual,
                          [campo]: droide?.nombre || '',
                          ...(campo === 'droideResultante'
                            ? { rarezaResultante: droide?.rareza || '' }
                            : {}),
                        }));
                      }}
                    />
                  ))}
                  <label>
                    Rareza resultante
                    <input
                      type="text"
                      name="rarezaResultante"
                      value={nuevoRegistro.rarezaResultante || ''}
                      readOnly
                    />
                  </label>
                </>
              ) : (
                <label>
                  Descripción de la regla
                  <textarea
                    name="descripcion"
                    value={nuevoRegistro.descripcion || ''}
                    onChange={manejarCambioFormulario}
                    maxLength="350"
                    rows="5"
                    required
                  />
                </label>
              )}

              {errorFormulario && (
                <p className="droidex-form-error" role="alert">{errorFormulario}</p>
              )}

              <div className="droidex-modal-actions">
                <button
                  type="button"
                  className="droidex-cancel-button"
                  onClick={cerrarFormulario}
                  disabled={guardando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="droidex-save-button"
                  disabled={guardando}
                >
                  {guardando ? 'Guardando...' : registroEditando ? 'Guardar cambios' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        )}
        {movimientoPendiente && (
          <div
            className="droidex-modal-overlay"
            onClick={cerrarMovimiento}
          >
            <form
              className="droidex-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="informacion-mover-modal-title"
              onSubmit={ejecutarMovimiento}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="droidex-modal-header">
                <div>
                  <p className="droidex-eyebrow">Droid Tycoon</p>
                  <h2 id="informacion-mover-modal-title">
                    {movimientoPendiente.direccion === 'arriba' ? '⬆️ Mover hacia arriba' : '⬇️ Mover hacia abajo'}
                  </h2>
                </div>
                <button
                  type="button"
                  className="droidex-modal-close"
                  onClick={cerrarMovimiento}
                  disabled={moviendo}
                  aria-label="Cerrar formulario"
                >
                  ×
                </button>
              </div>

              <p className="informacion-mover-summary">
                Registro seleccionado:{' '}
                <strong>
                  {movimientoPendiente.tipo === 'recetas'
                    ? movimientoPendiente.registro.droideResultante
                    : `Regla #${movimientoPendiente.registro.numeroOrden}`}
                </strong>
                {' '}(orden actual: {movimientoPendiente.registro.numeroOrden})
              </p>
              <label>
                ¿Cuántas posiciones deseas moverlo?
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={cantidadMovimiento}
                  onChange={(event) => setCantidadMovimiento(event.target.value)}
                  required
                />
              </label>

              {errorMovimiento && (
                <p className="droidex-form-error" role="alert">{errorMovimiento}</p>
              )}

              <div className="droidex-modal-actions">
                <button
                  type="button"
                  className="droidex-cancel-button"
                  onClick={cerrarMovimiento}
                  disabled={moviendo}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="droidex-save-button"
                  disabled={moviendo}
                >
                  {moviendo ? 'Moviendo...' : '🚀 Aplicar movimiento'}
                </button>
              </div>
            </form>
          </div>
        )}
        <ConfirmModal
          isOpen={Boolean(registroAEliminar)}
          onClose={() => setRegistroAEliminar(null)}
          title="🗑️ Confirmar eliminación"
          message={registroAEliminar?.tipo === 'recetas'
            ? `¿Eliminar la receta de "${registroAEliminar.droideResultante}"? Esta acción no se puede deshacer.`
            : `¿Eliminar la regla "${registroAEliminar?.descripcion ?? ''}"? Esta acción no se puede deshacer.`}
          type="warning"
          confirmText="Eliminar"
          onConfirm={eliminarRegistro}
          showCancelButton
        />
      </main>
    </div>
  );
}

export default InformacionDroidTycoon;
