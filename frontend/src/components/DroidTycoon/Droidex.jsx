import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../ConfirmModal';
import {
  droidesService,
  fusionesService,
  materialDroidTycoonService,
  materialesDroideService,
  nombresDroidesService,
  rarezasDroidesService,
} from '../../services/api';
import ComboboxFiltrable from './ComboboxFiltrable';
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
  esDroideFusion: false,
};

function normalizarNombreDroide(nombre) {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return '';

  return palabras[0].toLowerCase() + palabras
    .slice(1)
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join('');
}

function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');
}

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

function ImagenDroideFusion({ etiqueta, nombre, droide }) {
  const [imagenFallida, setImagenFallida] = useState(false);
  const url = obtenerUrlImagen(droide?.nombreArchivoImagen);

  return (
    <div className="droidex-fusion-modal-droid">
      <small>{etiqueta}</small>
      {url && !imagenFallida ? (
        <img
          src={url}
          alt={nombre}
          loading="lazy"
          onError={() => setImagenFallida(true)}
        />
      ) : (
        <span className="droidex-fusion-modal-fallback" aria-hidden="true">🤖</span>
      )}
      <strong>{nombre}</strong>
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
  const [recetasFusion, setRecetasFusion] = useState([]);
  const [cargandoRecetasFusion, setCargandoRecetasFusion] = useState(true);
  const [errorRecetasFusion, setErrorRecetasFusion] = useState('');
  const [intentoRecargarRecetas, setIntentoRecargarRecetas] = useState(0);
  const [droideRecetaAbierta, setDroideRecetaAbierta] = useState(null);
  const [seccionActiva, setSeccionActiva] = useState('droidex');
  const [busqueda, setBusqueda] = useState('');
  const [rarezaFiltro, setRarezaFiltro] = useState('');
  const [ordenScourgedex, setOrdenScourgedex] = useState('vista-droidex');
  const [materialesFiltro, setMaterialesFiltro] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizandoId, setActualizandoId] = useState(null);
  const [materialActualizando, setMaterialActualizando] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoDroide, setNuevoDroide] = useState(NUEVO_DROIDE);
  const [droideEditando, setDroideEditando] = useState(null);
  const [droideAEliminar, setDroideAEliminar] = useState(null);
  const [errorFormulario, setErrorFormulario] = useState('');
  const [creandoDroide, setCreandoDroide] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [confirmarLimpiarScourgedex, setConfirmarLimpiarScourgedex] = useState(false);
  const [limpiandoScourgedex, setLimpiandoScourgedex] = useState(false);

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

  useEffect(() => {
    let componenteActivo = true;

    cargarTodosLosRegistros(fusionesService.getAll)
      .then((registros) => {
        if (componenteActivo) setRecetasFusion(registros);
      })
      .catch((requestError) => {
        console.error('Error al cargar las recetas de fusión de Droidex:', requestError);
        if (componenteActivo) {
          setErrorRecetasFusion('No se pudieron cargar las recetas de fusión.');
        }
      })
      .finally(() => {
        if (componenteActivo) setCargandoRecetasFusion(false);
      });

    return () => {
      componenteActivo = false;
    };
  }, [intentoRecargarRecetas]);

  useEffect(() => {
    if (!droideRecetaAbierta) return undefined;

    const cerrarConEscape = (event) => {
      if (event.key === 'Escape') setDroideRecetaAbierta(null);
    };

    window.addEventListener('keydown', cerrarConEscape);
    return () => window.removeEventListener('keydown', cerrarConEscape);
  }, [droideRecetaAbierta]);

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

  const nombreOpciones = useMemo(() => {
    const opciones = nombresOrdenados.map((registro) => ({
      id: `nombre-${registro.id}`,
      value: registro.nombre,
      label: registro.nombre,
    }));
    if (droideEditando && !opciones.some((opcion) => opcion.value === droideEditando.nombre)) {
      opciones.push({
        id: `nombre-actual-${droideEditando.id}`,
        value: droideEditando.nombre,
        label: droideEditando.nombre,
      });
    }
    return opciones;
  }, [droideEditando, nombresOrdenados]);

  const claseOpciones = useMemo(() => {
    const opciones = CLASES_DROIDTYCOON.map((clase) => ({
      id: `clase-${clase}`,
      value: clase,
      label: clase,
    }));
    if (droideEditando && !opciones.some((opcion) => opcion.value === droideEditando.clase)) {
      opciones.push({
        id: `clase-actual-${droideEditando.id}`,
        value: droideEditando.clase,
        label: droideEditando.clase,
      });
    }
    return opciones;
  }, [droideEditando]);

  const rarezaOpciones = useMemo(() => {
    const opciones = rarezasOrdenadas.map((registro) => ({
      id: `rareza-${registro.id}`,
      value: registro.nombre,
      label: registro.nombre,
    }));
    if (droideEditando && !opciones.some((opcion) => opcion.value === droideEditando.rareza)) {
      opciones.push({
        id: `rareza-actual-${droideEditando.id}`,
        value: droideEditando.rareza,
        label: droideEditando.rareza,
      });
    }
    return opciones;
  }, [droideEditando, rarezasOrdenadas]);

  const obtenerMaterialesVisibles = (rareza) => materialesOrdenados.filter((material) => {
    const esIconico = normalizarTexto(rareza) === 'iconico';
    const materialNormalizado = normalizarTexto(material.material);
    const esMaterialVisibleParaIconico = ['pred'].includes(materialNormalizado);
    const coincideRareza = !esIconico || esMaterialVisibleParaIconico;
    const coincideFiltro = materialesFiltro.length === 0
      || materialesFiltro.includes(material.material);

    return coincideRareza && coincideFiltro;
  });

  const droidesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase('es');
    const mostrarVistaDroidex = seccionActiva === 'scourgedex'
      && ordenScourgedex === 'vista-droidex';

    const filtrados = droides.filter((droide) => {
      const coincideTexto = !texto
        || droide.nombre.toLocaleLowerCase('es').includes(texto)
        || droide.clase.toLocaleLowerCase('es').includes(texto);
      const coincideRareza = !rarezaFiltro || droide.rareza === rarezaFiltro;
      const coincideSeccion = seccionActiva !== 'scourgedex'
        || mostrarVistaDroidex
        || normalizarTexto(droide.rareza) !== 'iconico';

      return coincideTexto && coincideRareza && coincideSeccion;
    });

    if (seccionActiva !== 'scourgedex' || mostrarVistaDroidex) return filtrados;

    const marcadosPrimero = ordenScourgedex === 'marcados';
    return filtrados.sort((droideA, droideB) => {
      const droideAMarcado = Boolean(droideA.estaEnScourgedex);
      const droideBMarcado = Boolean(droideB.estaEnScourgedex);
      if (droideAMarcado === droideBMarcado) return 0;
      return droideAMarcado === marcadosPrimero ? -1 : 1;
    });
  }, [busqueda, droides, ordenScourgedex, rarezaFiltro, seccionActiva]);

  const recetasPorDroideResultante = useMemo(() => {
    const recetasOrdenadas = [...recetasFusion].sort(
      (a, b) => a.numeroOrden - b.numeroOrden || a.id - b.id,
    );

    return recetasOrdenadas.reduce((recetas, receta) => {
      const nombreNormalizado = normalizarTexto(receta.droideResultante.trim());
      const actuales = recetas.get(nombreNormalizado) || [];
      recetas.set(nombreNormalizado, [...actuales, receta]);
      return recetas;
    }, new Map());
  }, [recetasFusion]);

  const droidesPorNombreNormalizado = useMemo(
    () => new Map(droides.map((droide) => [
      normalizarTexto(droide.nombre.trim()),
      droide,
    ])),
    [droides],
  );

  const recetasDroideSeleccionado = droideRecetaAbierta
    ? recetasPorDroideResultante.get(
      normalizarTexto(droideRecetaAbierta.nombre.trim()),
    ) || []
    : [];

  const totales = useMemo(
    () => ({
      droidex: droides.length,
      scourgedex: droides.filter((droide) => (
        droide.estaEnScourgedex && normalizarTexto(droide.rareza) !== 'iconico'
      )).length,
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

  const deseleccionarScourgedex = async () => {
    const seleccionados = droides.filter((droide) => (
      droide.estaEnScourgedex && normalizarTexto(droide.rareza) !== 'iconico'
    ));
    setConfirmarLimpiarScourgedex(false);

    if (seleccionados.length === 0) return;

    setLimpiandoScourgedex(true);
    setError('');

    try {
      const resultados = await Promise.allSettled(
        seleccionados.map((droide) => droidesService.update(droide.id, {
          estaEnScourgedex: false,
        })),
      );
      let totalFallidos = 0;
      const resultadosPorId = new Map(
        seleccionados.map((droide, indice) => [droide.id, resultados[indice]]),
      );

      resultados.forEach((resultado, indice) => {
        if (resultado.status === 'rejected') {
          totalFallidos += 1;
          console.error(
            `Error al deseleccionar "${seleccionados[indice].nombre}" del Scourgedex:`,
            resultado.reason,
          );
        }
      });

      setDroides((actuales) => actuales.map((droide) => {
        const resultado = resultadosPorId.get(droide.id);
        if (!resultado) return droide;
        return resultado.status === 'fulfilled' ? resultado.value.data : droide;
      }));

      if (totalFallidos > 0) {
        setError(`No se pudieron deseleccionar ${totalFallidos} droides. Intenta de nuevo.`);
      }
    } finally {
      setLimpiandoScourgedex(false);
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

  const actualizarCampoNuevoDroide = (name, value, type = 'text', checked = false) => {
    setNuevoDroide((actual) => ({
      ...actual,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'nombre'
        ? {
          nombreArchivoImagen: value
            ? `./imagenesDroides/${normalizarNombreDroide(value)}.png`
            : '',
        }
        : {}),
    }));
  };

  const manejarCambioNuevoDroide = (event) => {
    const { name, value, type, checked } = event.target;
    actualizarCampoNuevoDroide(name, value, type, checked);
  };

  const manejarCambioComboboxDroide = (name, option) => {
    actualizarCampoNuevoDroide(name, option?.value || '');
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setRarezaFiltro('');
    setMaterialesFiltro([]);
  };

  const abrirFormularioNuevo = () => {
    setDroideEditando(null);
    setNuevoDroide(NUEVO_DROIDE);
    setErrorFormulario('');
    setModalAbierto(true);
  };

  const abrirFormularioEdicion = (droide) => {
    setDroideEditando(droide);
    setErrorFormulario('');
    setNuevoDroide({
      nombre: droide.nombre,
      clase: droide.clase,
      rareza: droide.rareza,
      nombreArchivoImagen: droide.nombreArchivoImagen || '',
      estaImpecable: Boolean(droide.estaImpecable),
      esDroideFusion: Boolean(droide.esDroideFusion),
    });
    setModalAbierto(true);
  };

  const cerrarFormulario = () => {
    setModalAbierto(false);
    setDroideEditando(null);
    setNuevoDroide(NUEVO_DROIDE);
    setErrorFormulario('');
  };

  const guardarNuevoDroide = async (event) => {
    event.preventDefault();
    if (
      !nombreOpciones.some((opcion) => opcion.value === nuevoDroide.nombre)
      || !claseOpciones.some((opcion) => opcion.value === nuevoDroide.clase)
      || !rarezaOpciones.some((opcion) => opcion.value === nuevoDroide.rareza)
    ) {
      setErrorFormulario('Selecciona un nombre, clase y rareza de las opciones disponibles.');
      return;
    }

    setCreandoDroide(true);
    setErrorFormulario('');
    setError('');

    try {
      const datos = {
        ...nuevoDroide,
        nombre: nuevoDroide.nombre.trim(),
        clase: nuevoDroide.clase.trim(),
        rareza: nuevoDroide.rareza.trim(),
        nombreArchivoImagen: nuevoDroide.nombreArchivoImagen.trim() || null,
      };

      if (droideEditando) {
        const response = await droidesService.update(droideEditando.id, datos);
        setDroides((actuales) => actuales.map((droide) => (
          droide.id === droideEditando.id ? response.data : droide
        )));
      } else {
        const response = await droidesService.create(datos);
        setDroides((actuales) => [...actuales, response.data]);
      }

      cerrarFormulario();
    } catch (requestError) {
      console.error(
        droideEditando ? 'Error al actualizar el droide:' : 'Error al crear el droide:',
        requestError,
      );
      setError(
        droideEditando
          ? 'No se pudieron guardar los cambios del droide.'
          : 'No se pudo guardar el droide. Revisa los datos e intenta de nuevo.',
      );
      setErrorFormulario(
        droideEditando
          ? 'No se pudieron guardar los cambios. Revisa los datos e intenta de nuevo.'
          : 'No se pudo guardar el droide. Revisa los datos e intenta de nuevo.',
      );
    } finally {
      setCreandoDroide(false);
    }
  };

  const eliminarDroide = async () => {
    if (!droideAEliminar) return;

    setEliminandoId(droideAEliminar.id);
    setError('');

    try {
      await droidesService.delete(droideAEliminar.id);
      setDroides((actuales) => actuales.filter((droide) => (
        droide.id !== droideAEliminar.id
      )));
      setMaterialesAsignados((actuales) => actuales.filter((material) => (
        material.droide_id !== droideAEliminar.id
      )));
      setDroideAEliminar(null);
    } catch (requestError) {
      console.error('Error al eliminar el droide:', requestError);
      setError(`No se pudo eliminar "${droideAEliminar.nombre}". Intenta de nuevo.`);
      setDroideAEliminar(null);
    } finally {
      setEliminandoId(null);
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
                : 'Selecciona los droides que ya forman parte de tu Scourgedex.'}
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
            {rarezasOrdenadas.map((rareza) => (
              <option key={rareza.id} value={rareza.nombre}>{rareza.nombre}</option>
            ))}
          </select>
          {seccionActiva === 'scourgedex' ? (
            <button
              type="button"
              className="droidex-scourgedex-clear-button"
              onClick={() => setConfirmarLimpiarScourgedex(true)}
              disabled={limpiandoScourgedex || actualizandoId !== null || totales.scourgedex === 0}
            >
              {limpiandoScourgedex ? 'Deseleccionando...' : 'Deseleccionar todos'}
            </button>
          ) : (
            <details className="droidex-material-filter">
              <summary>
                Materiales{materialesFiltro.length > 0 ? ` (${materialesFiltro.length})` : ''}
              </summary>
              <div className="droidex-material-filter-options" role="group" aria-label="Filtrar materiales">
                {materialesOrdenados.length > 0 ? materialesOrdenados.map((material) => (
                  <label key={material.id}>
                    <input
                      type="checkbox"
                      checked={materialesFiltro.includes(material.material)}
                      onChange={() => setMaterialesFiltro((actuales) => (
                        actuales.includes(material.material)
                          ? actuales.filter((nombre) => nombre !== material.material)
                          : [...actuales, material.material]
                      ))}
                    />
                    {material.material}
                  </label>
                )) : (
                  <span>No hay materiales registrados.</span>
                )}
              </div>
            </details>
          )}
          <button
            type="button"
            className="droidex-clear-filters-button"
            onClick={limpiarFiltros}
            disabled={!busqueda && !rarezaFiltro && materialesFiltro.length === 0}
          >
            Limpiar filtros
          </button>
          {seccionActiva === 'scourgedex' ? (
            <select
              className="droidex-scourgedex-sort"
              value={ordenScourgedex}
              onChange={(event) => setOrdenScourgedex(event.target.value)}
              aria-label="Ordenar droides del Scourgedex"
            >
              <option value="vista-droidex">Vista Droidex</option>
              <option value="marcados">Está en Scourgedex</option>
              <option value="faltantes">Hacen falta en Scourgedex</option>
            </select>
          ) : (
            <button
              type="button"
              className="droidex-add-button"
              onClick={abrirFormularioNuevo}
            >
              + Agregar droide
            </button>
          )}
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
            {droidesFiltrados.map((droide) => {
              const esScourgedex = seccionActiva === 'scourgedex';
              const recetaAbierta = droideRecetaAbierta?.id === droide.id;

              if (esScourgedex) {
                const seleccionado = Boolean(droide.estaEnScourgedex);
                const actualizando = limpiandoScourgedex || actualizandoId !== null;

                return (
                  <article
                    className={`droidex-card droidex-scourgedex-card${seleccionado ? ' selected' : ''}`}
                    key={droide.id}
                    role="button"
                    tabIndex={actualizando ? -1 : 0}
                    aria-label={`${droide.nombre}, clase ${droide.clase}, rareza ${droide.rareza}${droide.esDroideFusion ? ', droide de fusión' : ''}`}
                    aria-pressed={seleccionado}
                    aria-disabled={actualizando}
                    onClick={() => {
                      if (!actualizando) alternarEstado(droide, 'estaEnScourgedex');
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        if (!actualizando) alternarEstado(droide, 'estaEnScourgedex');
                      }
                    }}
                  >
                    <div className="droidex-card-visual">
                      <ImagenDroide droide={droide} />
                      {ICONOS_CLASE_DROIDTYCOON[droide.clase] && (
                        <img
                          className="droidex-class-icon"
                          src={ICONOS_CLASE_DROIDTYCOON[droide.clase]}
                          alt={`Clase ${droide.clase}`}
                        />
                      )}
                      {droide.esDroideFusion && (
                        <span
                          className="droidex-fusion-badge droidex-fusion-indicator"
                          aria-label="Droide de fusión"
                        >
                          F
                        </span>
                      )}
                    </div>
                    <div className="droidex-card-content">
                      <div className="droidex-card-title">
                        <h2>{droide.nombre}</h2>
                        <div className="droidex-scourgedex-meta">
                          <span className={`droidex-rarity ${droide.rareza.toLowerCase()}`}>
                            {droide.rareza}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }

              return (
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
                  {droide.esDroideFusion && (
                    <button
                      type="button"
                      className="droidex-fusion-badge"
                      aria-label={recetaAbierta
                        ? `Ocultar receta de fusión de ${droide.nombre}`
                        : `Mostrar receta de fusión de ${droide.nombre}`}
                      aria-expanded={recetaAbierta}
                      title={recetaAbierta ? 'Ocultar receta de fusión' : 'Mostrar receta de fusión'}
                      onClick={() => setDroideRecetaAbierta((actual) => (
                        actual?.id === droide.id ? null : droide
                      ))}
                    >
                      F
                    </button>
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
                    <div className="droidex-card-meta">
                      <span className={`droidex-rarity ${droide.rareza.toLowerCase()}`}>
                        {droide.rareza}
                      </span>
                      <div className="droidex-card-management">
                        <button
                          type="button"
                          className="droidex-card-management-button"
                          aria-label={`Editar ${droide.nombre}`}
                          title={`Editar ${droide.nombre}`}
                          disabled={eliminandoId === droide.id}
                          onClick={() => abrirFormularioEdicion(droide)}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="droidex-card-management-button delete"
                          aria-label={`Eliminar ${droide.nombre}`}
                          title={`Eliminar ${droide.nombre}`}
                          disabled={eliminandoId === droide.id}
                          onClick={() => setDroideAEliminar(droide)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="droidex-materials">
                    <div className="droidex-material-buttons">
                      {obtenerMaterialesVisibles(droide.rareza).map((material) => {
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
              );
            })}
          </section>
        )}

        {droideRecetaAbierta && (
          <div
            className="droidex-modal-overlay"
            onClick={() => setDroideRecetaAbierta(null)}
          >
            <section
              className="droidex-fusion-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="droidex-fusion-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="droidex-fusion-modal-header">
                <div>
                  <p className="droidex-eyebrow">Receta de fusión</p>
                  <h2 id="droidex-fusion-modal-title">{droideRecetaAbierta.nombre}</h2>
                </div>
                <button
                  type="button"
                  className="droidex-modal-close"
                  onClick={() => setDroideRecetaAbierta(null)}
                  aria-label="Cerrar receta"
                >
                  ×
                </button>
              </header>

              {cargandoRecetasFusion ? (
                <div className="droidex-message" role="status">Cargando receta...</div>
              ) : errorRecetasFusion ? (
                <div className="droidex-error" role="alert">
                  <span>{errorRecetasFusion}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCargandoRecetasFusion(true);
                      setErrorRecetasFusion('');
                      setIntentoRecargarRecetas((intento) => intento + 1);
                    }}
                  >
                    Reintentar
                  </button>
                </div>
              ) : recetasDroideSeleccionado.length > 0 ? (
                <div className="droidex-fusion-modal-recipes">
                  {recetasDroideSeleccionado.map((receta) => (
                    <section className="droidex-fusion-modal-entry" key={receta.id}>
                      {recetasDroideSeleccionado.length > 1 && (
                        <h3>Receta #{receta.numeroOrden}</h3>
                      )}
                      <div className="droidex-fusion-modal-components">
                        <ImagenDroideFusion
                          nombre={receta.droide1}
                          droide={droidesPorNombreNormalizado.get(normalizarTexto(receta.droide1.trim()))}
                        />
                        <span className="droidex-fusion-modal-plus" aria-hidden="true">+</span>
                        <ImagenDroideFusion
                          nombre={receta.droide2}
                          droide={droidesPorNombreNormalizado.get(normalizarTexto(receta.droide2.trim()))}
                        />
                        <span className="droidex-fusion-modal-plus" aria-hidden="true">+</span>
                        <ImagenDroideFusion
                          nombre={receta.droide3}
                          droide={droidesPorNombreNormalizado.get(normalizarTexto(receta.droide3.trim()))}
                        />
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="droidex-message">
                  No se encontró una receta para este droide.
                </div>
              )}
            </section>
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
              aria-labelledby="droidex-modal-title"
              onSubmit={guardarNuevoDroide}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="droidex-modal-header">
                <div>
                  <p className="droidex-eyebrow">Droid Tycoon</p>
                  <h2 id="droidex-modal-title">
                    {droideEditando ? 'Editar droide' : 'Agregar droide'}
                  </h2>
                </div>
                <button
                  type="button"
                  className="droidex-modal-close"
                  onClick={cerrarFormulario}
                  aria-label="Cerrar formulario"
                >
                  ×
                </button>
              </div>

              {errorFormulario && (
                <p className="droidex-form-error" role="alert">{errorFormulario}</p>
              )}

              <ComboboxFiltrable
                id="droidex-nombre"
                label="Nombre *"
                value={nuevoDroide.nombre}
                options={nombreOpciones}
                noOptionsText="No hay nombres que coincidan."
                onChange={(option) => manejarCambioComboboxDroide('nombre', option)}
              />
              <ComboboxFiltrable
                id="droidex-clase"
                label="Clase *"
                value={nuevoDroide.clase}
                options={claseOpciones}
                noOptionsText="No hay clases que coincidan."
                onChange={(option) => manejarCambioComboboxDroide('clase', option)}
              />
              <ComboboxFiltrable
                id="droidex-rareza"
                label="Rareza *"
                value={nuevoDroide.rareza}
                options={rarezaOpciones}
                noOptionsText="No hay rarezas que coincidan."
                onChange={(option) => manejarCambioComboboxDroide('rareza', option)}
              />
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
              <label className="droidex-checkbox">
                <input
                  type="checkbox"
                  name="esDroideFusion"
                  checked={nuevoDroide.esDroideFusion}
                  onChange={manejarCambioNuevoDroide}
                />
                Droide de fusión
              </label>
              <div className="droidex-modal-actions">
                <button
                  type="button"
                  className="droidex-cancel-button"
                  onClick={cerrarFormulario}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="droidex-save-button"
                  disabled={creandoDroide}
                >
                  {creandoDroide
                    ? 'Guardando...'
                    : droideEditando
                      ? 'Guardar cambios'
                      : 'Guardar droide'}
                </button>
              </div>
            </form>
          </div>
        )}
        <ConfirmModal
          isOpen={confirmarLimpiarScourgedex}
          onClose={() => setConfirmarLimpiarScourgedex(false)}
          title="⚠️ Limpiar Scourgedex"
          message={`¿Deseleccionar los ${totales.scourgedex} droides actualmente marcados en el Scourgedex? Esta acción no se puede deshacer automáticamente.`}
          type="warning"
          confirmText="Deseleccionar todos"
          onConfirm={deseleccionarScourgedex}
          showCancelButton
        />
        <ConfirmModal
          isOpen={Boolean(droideAEliminar)}
          onClose={() => setDroideAEliminar(null)}
          title="🗑️ Confirmar eliminación"
          message={`¿Eliminar "${droideAEliminar?.nombre ?? ''}"? También se eliminarán sus materiales asociados. Esta acción no se puede deshacer.`}
          type="warning"
          confirmText="Eliminar"
          onConfirm={eliminarDroide}
          showCancelButton
        />
      </main>
    </div>
  );
}

export default Droidex;
