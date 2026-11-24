import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  droidesService,
  materialDroidTycoonService,
  materialesDroideService,
  nombresDroidesService,
  rarezasDroidesService,
} from '../../services/api';
import iconoAstromecanico from '../../../imagenesDroides/iconoAstromecanico.png';
import iconoBatalla from '../../../imagenesDroides/iconoBatalla.png';
import iconoProtocolo from '../../../imagenesDroides/iconoProtocolo.png';
import iconoTrabajador from '../../../imagenesDroides/iconoTrabajador.png';
import './Droidex.css';

const TAMANO_PAGINA = 1000;
const ICONOS_CLASE_DROIDTYCOON = {
  Trabajador: iconoTrabajador,
  Batalla: iconoBatalla,
  Astromecánico: iconoAstromecanico,
  Protocolo: iconoProtocolo,
};
const CLASES_DROIDTYCOON = JSON.parse(
  import.meta.env.VITE_CLASES_DROIDTYCOON || '[]',
);
const NUEVO_DROIDE = {
  nombre: '',
  clase: '',
  rareza: '',
  nombreArchivoImagen: '',
  estaImpecable: false,
};

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

async function obtenerDatosDroidex() {
  const [droides, materiales, materialesAsignados, nombres, rarezas] = await Promise.all([
    cargarTodosLosRegistros(droidesService.getAll),
    cargarTodosLosRegistros(materialDroidTycoonService.getAll),
    cargarTodosLosRegistros(materialesDroideService.getAll),
    cargarTodosLosRegistros(nombresDroidesService.getAll),
    cargarTodosLosRegistros(rarezasDroidesService.getAll),
  ]);

  return { droides, materiales, materialesAsignados, nombres, rarezas };
}

function obtenerUrlImagen(ruta) {
  if (!ruta) return null;
  if (/^(https?:|data:)/i.test(ruta)) return ruta;
  return `/${ruta.replace(/^\.?\//, '')}`;
}

function ImagenDroide({ droide }) {
  const [imagenFallida, setImagenFallida] = useState(false);
  const url = obtenerUrlImagen(droide.nombreArchivoImagen);

  return (
    <div className="droidex-card-image">
      {url && !imagenFallida ? (
        <img
          src={url}
          alt={droide.nombre}
          loading="lazy"
          onError={() => setImagenFallida(true)}
        />
      ) : (
        <span aria-hidden="true">🤖</span>
      )}
    </div>
  );
}

function Droidex() {
  const navigate = useNavigate();
  const [droides, setDroides] = useState([]);
  const [materialesDisponibles, setMaterialesDisponibles] = useState([]);
  const [materialesAsignados, setMaterialesAsignados] = useState([]);
  const [nombresDisponibles, setNombresDisponibles] = useState([]);
  const [rarezasDisponibles, setRarezasDisponibles] = useState([]);
  const [seccionActiva, setSeccionActiva] = useState('droidex');
  const [busqueda, setBusqueda] = useState('');
  const [rarezaFiltro, setRarezaFiltro] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizandoId, setActualizandoId] = useState(null);
  const [materialActualizando, setMaterialActualizando] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoDroide, setNuevoDroide] = useState(NUEVO_DROIDE);
  const [creandoDroide, setCreandoDroide] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    setError('');

    try {
      const datos = await obtenerDatosDroidex();
      setDroides(datos.droides);
      setMaterialesDisponibles(datos.materiales);
      setMaterialesAsignados(datos.materialesAsignados);
      setNombresDisponibles(datos.nombres);
      setRarezasDisponibles(datos.rarezas);
    } catch (requestError) {
      console.error('Error al cargar Droidex:', requestError);
      setError('No se pudieron cargar los datos de Droidex. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    let componenteActivo = true;

    obtenerDatosDroidex()
      .then((datos) => {
        if (!componenteActivo) return;
        setDroides(datos.droides);
        setMaterialesDisponibles(datos.materiales);
        setMaterialesAsignados(datos.materialesAsignados);
        setNombresDisponibles(datos.nombres);
        setRarezasDisponibles(datos.rarezas);
      })
      .catch((requestError) => {
        console.error('Error al cargar Droidex:', requestError);
        if (componenteActivo) {
          setError('No se pudieron cargar los datos de Droidex. Intenta de nuevo.');
        }
      })
      .finally(() => {
        if (componenteActivo) setCargando(false);
      });

    return () => {
      componenteActivo = false;
    };
  }, []);

  const materialesOrdenados = useMemo(
    () => [...materialesDisponibles].sort((a, b) => a.numeroOrden - b.numeroOrden),
    [materialesDisponibles],
  );

  const nombresOrdenados = useMemo(
    () => [...nombresDisponibles].sort((a, b) => a.numeroOrden - b.numeroOrden),
    [nombresDisponibles],
  );

  const rarezasOrdenadas = useMemo(
    () => [...rarezasDisponibles].sort((a, b) => a.numeroOrden - b.numeroOrden),
    [rarezasDisponibles],
  );

  const rarezas = useMemo(
    () => [...new Set(droides.map((droide) => droide.rareza).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'es')),
    [droides],
  );

  const droidesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase('es');

    return droides.filter((droide) => {
      const coincideTexto = !texto
        || droide.nombre.toLocaleLowerCase('es').includes(texto)
        || droide.clase.toLocaleLowerCase('es').includes(texto);
      const coincideRareza = !rarezaFiltro || droide.rareza === rarezaFiltro;
      const coincideSeccion = seccionActiva !== 'scourgedex' || droide.estaEnScourgedex;

      return coincideTexto && coincideRareza && coincideSeccion;
    });
  }, [busqueda, droides, rarezaFiltro, seccionActiva]);

  const totales = useMemo(
    () => ({
      droidex: droides.length,
      scourgedex: droides.filter((droide) => droide.estaEnScourgedex).length,
      impecables: droides.filter((droide) => droide.estaImpecable).length,
    }),
    [droides],
  );

  const alternarEstado = async (droide, campo) => {
    setActualizandoId(droide.id);
    setError('');
    const actualizado = { ...droide, [campo]: !droide[campo] };
    setDroides((actuales) => actuales.map((item) => (
      item.id === droide.id ? actualizado : item
    )));

    try {
      const response = await droidesService.update(droide.id, {
        [campo]: actualizado[campo],
      });
      setDroides((actuales) => actuales.map((item) => (
        item.id === droide.id ? response.data : item
      )));
    } catch (requestError) {
      console.error(`Error al actualizar ${campo} del droide:`, requestError);
      setDroides((actuales) => actuales.map((item) => (
        item.id === droide.id ? droide : item
      )));
      setError(`No se pudo actualizar "${droide.nombre}". Intenta de nuevo.`);
    } finally {
      setActualizandoId(null);
    }
  };

  const alternarMaterial = async (droide, material) => {
    const registro = materialesAsignados.find((item) => (
      item.droide_id === droide.id && item.material === material.material
    ));
    const estaSeleccionado = Boolean(registro?.estaEnInventario);
    const claveActualizacion = `${droide.id}-${material.id}`;

    setMaterialActualizando(claveActualizacion);
    setError('');

    try {
      const response = registro
        ? await materialesDroideService.update(registro.id, {
          estaEnInventario: !estaSeleccionado,
        })
        : await materialesDroideService.create({
          droide_id: droide.id,
          numeroOrden: material.numeroOrden,
          material: material.material,
          multiplicador: 1,
          estaEnInventario: true,
        });

      setMaterialesAsignados((actuales) => {
        const indice = actuales.findIndex((item) => item.id === response.data.id);
        if (indice === -1) return [...actuales, response.data];

        return actuales.map((item, index) => (
          index === indice ? response.data : item
        ));
      });
    } catch (requestError) {
      console.error(`Error al actualizar el material ${material.material}:`, requestError);
      setError(`No se pudo actualizar el material ${material.material} de ${droide.nombre}.`);
    } finally {
      setMaterialActualizando(null);
    }
  };

  const manejarCambioNuevoDroide = (event) => {
    const { name, value, type, checked } = event.target;
    setNuevoDroide((actual) => ({
      ...actual,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const guardarNuevoDroide = async (event) => {
    event.preventDefault();
    setCreandoDroide(true);
    setError('');

    try {
      const response = await droidesService.create({
        ...nuevoDroide,
        nombre: nuevoDroide.nombre.trim(),
        clase: nuevoDroide.clase.trim(),
        rareza: nuevoDroide.rareza.trim(),
        nombreArchivoImagen: nuevoDroide.nombreArchivoImagen.trim() || null,
      });
      setDroides((actuales) => [...actuales, response.data]);
      setNuevoDroide(NUEVO_DROIDE);
      setModalAbierto(false);
    } catch (requestError) {
      console.error('Error al crear el droide:', requestError);
      setError('No se pudo guardar el droide. Revisa los datos e intenta de nuevo.');
    } finally {
      setCreandoDroide(false);
    }
  };

  return (
    <div className="droidex-layout">
      <aside className="droidex-sidebar">
        <div className="droidex-sidebar-header">
          <img src="/imagenesGeneral/LogoDroidTycoon.png" alt="" />
          <div>
            <h2>Droid Tycoon</h2>
            <span>Tu colección</span>
          </div>
        </div>

        <nav className="droidex-sidebar-nav" aria-label="Secciones de Droid Tycoon">
          <span className="droidex-nav-heading">Colecciones</span>
          <button
            type="button"
            className={seccionActiva === 'droidex' ? 'active' : ''}
            onClick={() => setSeccionActiva('droidex')}
          >
            <span aria-hidden="true">🤖</span>
            <span>Droidex</span>
            <span className="droidex-nav-count">{totales.droidex}</span>
          </button>
          <button
            type="button"
            className={seccionActiva === 'scourgedex' ? 'active' : ''}
            onClick={() => setSeccionActiva('scourgedex')}
          >
            <span aria-hidden="true">🏆</span>
            <span>Scourgedex</span>
            <span className="droidex-nav-count">{totales.scourgedex}</span>
          </button>
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
            <h1>{seccionActiva === 'droidex' ? 'Droidex' : 'Scourgedex'}</h1>
            <p className="droidex-subtitle">
              {seccionActiva === 'droidex'
                ? 'Explora y completa tu colección de droides.'
                : 'Droides que ya forman parte de tu Scourgedex.'}
            </p>
          </div>
          <div className="droidex-header-stat">
            <span>{totales.impecables}</span>
            <small>Impecables</small>
          </div>
        </header>

        <section className="droidex-filters" aria-label="Filtros de droides">
          <label className="droidex-search">
            <span aria-hidden="true">🔎</span>
            <input
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por nombre o clase..."
              aria-label="Buscar por nombre o clase"
            />
          </label>
          <select
            value={rarezaFiltro}
            onChange={(event) => setRarezaFiltro(event.target.value)}
            aria-label="Filtrar por rareza"
          >
            <option value="">Todas las rarezas</option>
            {rarezas.map((rareza) => (
              <option key={rareza} value={rareza}>{rareza}</option>
            ))}
          </select>
          <button
            type="button"
            className="droidex-add-button"
            onClick={() => setModalAbierto(true)}
          >
            + Agregar droide
          </button>
          <span className="droidex-results-count">
            {droidesFiltrados.length} {droidesFiltrados.length === 1 ? 'droide' : 'droides'}
          </span>
        </section>

        {error && (
          <div className="droidex-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={cargarDatos}>Reintentar</button>
          </div>
        )}

        {cargando ? (
          <div className="droidex-message" role="status">Cargando droides...</div>
        ) : droidesFiltrados.length === 0 ? (
          <div className="droidex-message">
            {droides.length === 0
              ? 'Todavía no hay droides registrados.'
              : 'No se encontraron droides con esos filtros.'}
          </div>
        ) : (
          <section className="droidex-grid" aria-label="Droides">
            {droidesFiltrados.map((droide) => (
              <article className="droidex-card" key={droide.id}>
                <div className="droidex-card-visual">
                  <ImagenDroide droide={droide} />
                  {ICONOS_CLASE_DROIDTYCOON[droide.clase] && (
                    <img
                      className="droidex-class-icon"
                      src={ICONOS_CLASE_DROIDTYCOON[droide.clase]}
                      alt={`Clase ${droide.clase}`}
                    />
                  )}
                  <button
                    type="button"
                    className={`droidex-perfect-toggle ${droide.estaImpecable ? 'selected perfect' : ''}`}
                    aria-label={droide.estaImpecable
                      ? `Quitar estado impecable de ${droide.nombre}`
                      : `Marcar ${droide.nombre} como impecable`}
                    aria-pressed={Boolean(droide.estaImpecable)}
                    title={droide.estaImpecable ? 'Impecable' : 'Marcar impecable'}
                    disabled={actualizandoId === droide.id}
                    onClick={() => alternarEstado(droide, 'estaImpecable')}
                  >
                    ✦
                  </button>
                </div>
                <div className="droidex-card-content">
                  <div className="droidex-card-title">
                    <h2>{droide.nombre}</h2>
                    <span className={`droidex-rarity ${droide.rareza.toLowerCase()}`}>
                      {droide.clase} - {droide.rareza}
                    </span>
                  </div>

                  <div className="droidex-materials">
                    <div className="droidex-material-buttons">
                      {materialesOrdenados.map((material) => {
                        const asignacion = materialesAsignados.find((item) => (
                          item.droide_id === droide.id
                          && item.material === material.material
                        ));
                        const seleccionado = Boolean(asignacion?.estaEnInventario);
                        const clave = `${droide.id}-${material.id}`;

                        return (
                          <button
                            type="button"
                            key={material.id}
                            className={seleccionado ? 'selected' : ''}
                            aria-pressed={seleccionado}
                            disabled={materialActualizando === clave}
                            onClick={() => alternarMaterial(droide, material)}
                          >
                            {material.material}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {modalAbierto && (
          <div
            className="droidex-modal-overlay"
            onClick={() => setModalAbierto(false)}
          >
            <form
              className="droidex-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="droidex-modal-title"
              onSubmit={guardarNuevoDroide}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="droidex-modal-header">
                <div>
                  <p className="droidex-eyebrow">Droid Tycoon</p>
                  <h2 id="droidex-modal-title">Agregar droide</h2>
                </div>
                <button
                  type="button"
                  className="droidex-modal-close"
                  onClick={() => setModalAbierto(false)}
                  aria-label="Cerrar formulario"
                >
                  ×
                </button>
              </div>

              <label>
                Nombre *
                <select
                  name="nombre"
                  value={nuevoDroide.nombre}
                  onChange={manejarCambioNuevoDroide}
                  required
                >
                  <option value="" disabled>
                    {nombresOrdenados.length ? 'Selecciona un nombre' : 'No hay nombres registrados'}
                  </option>
                  {nombresOrdenados.map((registro) => (
                    <option key={registro.id} value={registro.nombre}>
                      {registro.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Clase *
                <select
                  name="clase"
                  value={nuevoDroide.clase}
                  onChange={manejarCambioNuevoDroide}
                  required
                >
                  <option value="" disabled>Selecciona una clase</option>
                  {CLASES_DROIDTYCOON.map((clase) => (
                    <option key={clase} value={clase}>{clase}</option>
                  ))}
                </select>
              </label>
              <label>
                Rareza *
                <select
                  name="rareza"
                  value={nuevoDroide.rareza}
                  onChange={manejarCambioNuevoDroide}
                  required
                >
                  <option value="" disabled>
                    {rarezasOrdenadas.length ? 'Selecciona una rareza' : 'No hay rarezas registradas'}
                  </option>
                  {rarezasOrdenadas.map((registro) => (
                    <option key={registro.id} value={registro.nombre}>
                      {registro.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Ruta de imagen
                <input
                  name="nombreArchivoImagen"
                  value={nuevoDroide.nombreArchivoImagen}
                  onChange={manejarCambioNuevoDroide}
                  maxLength={255}
                  placeholder="/imagenesDroides/nombre.png"
                />
              </label>

              <label className="droidex-checkbox">
                <input
                  type="checkbox"
                  name="estaImpecable"
                  checked={nuevoDroide.estaImpecable}
                  onChange={manejarCambioNuevoDroide}
                />
                Droide impecable
              </label>
              <div className="droidex-modal-actions">
                <button
                  type="button"
                  className="droidex-cancel-button"
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="droidex-save-button"
                  disabled={creandoDroide}
                >
                  {creandoDroide ? 'Guardando...' : 'Guardar droide'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default Droidex;
