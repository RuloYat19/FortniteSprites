import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spritsService, cantidadPolvoExtraerService, cantidadPolvoInvocarService, ordenDefaultService, ordenRarezaService, materialesService, nombresSpritesService } from '../../services/api';
import './SpritsList.css';
import ConfirmModal from '../ConfirmModal';

function SpritsList() {
  const navigate = useNavigate();
  const [sprits, setSprits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cantidadesPolvo, setCantidadesPolvo] = useState({});
  const [cantidadesPolvoInvocar, setCantidadesPolvoInvocar] = useState({});
  const [loadingPolvo, setLoadingPolvo] = useState(false);
  
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({ 
    rareza: '', 
    material: '',
    nombre: '',
    orden: 'default'
  });
  const [flippedCards, setFlippedCards] = useState({});

  // 🔵 ESTADOS PARA LOS ÓRDENES
  const [ordenDefault, setOrdenDefault] = useState({});
  const [ordenRareza, setOrdenRareza] = useState({});
  const [ordenMaterial, setOrdenMaterial] = useState({});
  const [ordenesCargados, setOrdenesCargados] = useState(false);

  // 🔵 ESTADOS PARA FILTROS DINÁMICOS
  const [nombresDisponibles, setNombresDisponibles] = useState([]);
  const [materialesDisponibles, setMaterialesDisponibles] = useState([]);
  const [filtrosCargados, setFiltrosCargados] = useState(false);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSprit, setEditSprit] = useState({
    id: null,
    nombre: '',
    rareza: '',
    material: '',
    nombreArchivoImagen: '',
    nivelEspiritu: '',
    polvoAlExtraer: '',
    polvoAlInvocar: ''
  });
  const [editando, setEditando] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newSprit, setNewSprit] = useState({
    nombre: '',
    rareza: '',
    material: '',
    nombreArchivoImagen: '',
    nivelEspiritu: '',
    polvoAlExtraer: '',
    polvoAlInvocar: ''
  });
  const [agregando, setAgregando] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState({
    title: '',
    message: '',
    type: 'success'
  });

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [spritAEliminar, setSpritAEliminar] = useState(null);

  // 🔵 Cargar órdenes desde el backend
  const cargarOrdenes = async () => {
    try {
      const [defaultRes, rarezaRes, materialRes] = await Promise.all([
        ordenDefaultService.getAll(),
        ordenRarezaService.getAll(),
        materialesService.getAll()
      ]);

      const defaultObj = {};
      defaultRes.data.forEach(item => {
        defaultObj[item.nombre] = item.numeroOrden;
      });

      const rarezaObj = {};
      rarezaRes.data.forEach(item => {
        rarezaObj[item.nombre] = item.numeroOrden;
      });

      const materialObj = {};
      materialRes.data.forEach(item => {
        materialObj[item.nombre] = item.numeroOrden;
      });

      setOrdenDefault(defaultObj);
      setOrdenRareza(rarezaObj);
      setOrdenMaterial(materialObj);
      setOrdenesCargados(true);
    } catch (err) {
      console.error('Error al cargar órdenes:', err);
      setOrdenesCargados(true);
    }
  };

  // 🔵 Cargar nombres y materiales para los filtros
  const cargarFiltros = async () => {
    try {
      const [nombresRes, materialesRes] = await Promise.all([
        nombresSpritesService.getAll(),
        materialesService.getAll()
      ]);

      // 🔵 ORDENAR POR numeroOrden (si existe) o por ID
      const nombresOrdenados = nombresRes.data
        .sort((a, b) => (a.numeroOrden || a.id) - (b.numeroOrden || b.id))
        .map(item => item.nombre);
      
      const materiales = materialesRes.data.map(item => item.nombre);

      setNombresDisponibles(nombresOrdenados);
      setMaterialesDisponibles(materiales);
      setFiltrosCargados(true);
    } catch (err) {
      console.error('Error al cargar filtros:', err);
      setFiltrosCargados(true);
    }
  };

  // 🔵 Función de ordenamiento que usa los datos del backend
  const ordenarSprits = (spritsList) => {
    const orden = filtros.orden || 'default';

    const obtenerOrdenDefault = (sprit) => {
      const nombreA = ordenDefault[sprit.nombre] || 999;
      const materialA = ordenMaterial[sprit.material] || 999;
      return { nombreA, materialA };
    };
    
    switch(orden) {
      case 'material':
        return [...spritsList].sort((a, b) => {
          const ordenA = ordenMaterial[a.material] || 999;
          const ordenB = ordenMaterial[b.material] || 999;
          if (ordenA !== ordenB) return ordenA - ordenB;
          const nombreA = ordenDefault[a.nombre] || 999;
          const nombreB = ordenDefault[b.nombre] || 999;
          return nombreA - nombreB;
        });
      
      case 'rareza':
        return [...spritsList].sort((a, b) => {
          const rarezaA = ordenRareza[a.nombre] || 999;
          const rarezaB = ordenRareza[b.nombre] || 999;
          if (rarezaA !== rarezaB) return rarezaA - rarezaB;
          const materialA = ordenMaterial[a.material] || 999;
          const materialB = ordenMaterial[b.material] || 999;
          return materialA - materialB;
        });
      
      case 'no-inventario':
        return [...spritsList].sort((a, b) => {
          if (a.estaEnInventario !== b.estaEnInventario) {
            return a.estaEnInventario ? 1 : -1;
          }
          
          const ordenA = obtenerOrdenDefault(a);
          const ordenB = obtenerOrdenDefault(b);
          
          if (ordenA.nombreA !== ordenB.nombreA) {
            return ordenA.nombreA - ordenB.nombreA;
          }
          return ordenA.materialA - ordenB.materialA;
        });

      case 'no-dominado':
        return [...spritsList].sort((a, b) => {
          if (a.estaDominado !== b.estaDominado) {
            return a.estaDominado ? 1 : -1;
          }
          
          if (!a.estaDominado && !b.estaDominado) {
            if (a.estaEnInventario !== b.estaEnInventario) {
              return a.estaEnInventario ? -1 : 1;
            }
          }
          
          const ordenA = obtenerOrdenDefault(a);
          const ordenB = obtenerOrdenDefault(b);
          
          if (ordenA.nombreA !== ordenB.nombreA) {
            return ordenA.nombreA - ordenB.nombreA;
          }
          return ordenA.materialA - ordenB.materialA;
        });
        
      case 'default':
      default:
        return [...spritsList].sort((a, b) => {
          const nombreA = ordenDefault[a.nombre] || 999;
          const nombreB = ordenDefault[b.nombre] || 999;
          if (nombreA !== nombreB) return nombreA - nombreB;
          const materialA = ordenMaterial[a.material] || 999;
          const materialB = ordenMaterial[b.material] || 999;
          return materialA - materialB;
        });
    }
  };

  const calcularPolvoNecesario = () => {
    return sprits
      .filter(sprit => !sprit.estaEnInventario)
      .reduce((total, sprit) => total + (sprit.polvoAlInvocar || 0), 0);
  };

  const obtenerPolvoAlExtraer = async (rareza, nivelEspiritu) => {
    if (!rareza || !nivelEspiritu) return 0;
    
    const clave = `${rareza}-${nivelEspiritu}`;
    
    if (cantidadesPolvo[clave] !== undefined) {
      return cantidadesPolvo[clave];
    }
    
    try {
      const response = await cantidadPolvoExtraerService.getByCombinacion(rareza, nivelEspiritu);
      const cantidad = response.data?.cantidad || 0;
      
      setCantidadesPolvo(prev => ({
        ...prev,
        [clave]: cantidad
      }));
      
      return cantidad;
    } catch (error) {
      console.error(`Error al obtener polvo para ${rareza} - Nivel ${nivelEspiritu}:`, error);
      return 0;
    }
  };

  const actualizarPolvoAlExtraer = async (spritId, rareza, nivelEspiritu) => {
    if (!rareza || !nivelEspiritu) return;
    
    const polvo = await obtenerPolvoAlExtraer(rareza, nivelEspiritu);
    
    setSprits(prevSprits => 
      prevSprits.map(sprit => 
        sprit.id === spritId 
          ? { ...sprit, polvoAlExtraer: polvo }
          : sprit
      )
    );
    
    try {
      await spritsService.update(spritId, { polvoAlExtraer: polvo });
    } catch (error) {
      console.error('Error al actualizar polvoAlExtraer en el backend:', error);
    }
  };

  const obtenerPolvoAlInvocar = async (material, rareza) => {
    if (!material || !rareza) return 0;
    
    const clave = `${material}-${rareza}`;
    
    // Verificar si ya está en caché
    if (cantidadesPolvoInvocar[clave] !== undefined) {
      return cantidadesPolvoInvocar[clave];
    }
    
    try {
      const response = await cantidadPolvoInvocarService.getByCombinacion(material, rareza);
      const cantidad = response.data?.cantidad || 0;
      
      // Guardar en caché
      setCantidadesPolvoInvocar(prev => ({
        ...prev,
        [clave]: cantidad
      }));
      
      return cantidad;
    } catch (error) {
      console.error(`Error al obtener polvo al invocar para ${material} - ${rareza}:`, error);
      return 0;
    }
  };

  const actualizarPolvoAlInvocar = async (spritId, material, rareza) => {
    if (!material || !rareza) return;
    
    const polvo = await obtenerPolvoAlInvocar(material, rareza);
    
    // Actualizar estado local
    setSprits(prevSprits => 
      prevSprits.map(sprit => 
        sprit.id === spritId 
          ? { ...sprit, polvoAlInvocar: polvo }
          : sprit
      )
    );
    
    // Actualizar en el backend
    try {
      await spritsService.update(spritId, { polvoAlInvocar: polvo });
    } catch (error) {
      console.error('Error al actualizar polvoAlInvocar en el backend:', error);
    }
  };

  const calcularProgreso = (condicion) => {
    const total = sprits.length;
    const completados = sprits.filter(condicion).length;
    const porcentaje = total > 0 ? (completados / total) * 100 : 0;
    return { completados, total, porcentaje };
  };

  // 🔵 EFECTO PRINCIPAL - Cargar sprits, órdenes y filtros
  useEffect(() => {
    cargarSprits();
    cargarOrdenes();
    cargarFiltros(); // 🔵 NUEVO: Cargar nombres y materiales para filtros
  }, []);

  // Para editar el Sprite
  useEffect(() => {
    const cargarPolvoEdicion = async () => {
      if (showEditModal && editSprit.rareza && editSprit.nivelEspiritu) {
        const polvo = await obtenerPolvoAlExtraer(editSprit.rareza, parseInt(editSprit.nivelEspiritu));
        if (polvo > 0) {
          setEditSprit(prev => ({
            ...prev,
            polvoAlExtraer: polvo.toString()
          }));
        }
      }
    };
    cargarPolvoEdicion();
  }, [showEditModal, editSprit.rareza, editSprit.nivelEspiritu]);

  useEffect(() => {
    const cargarPolvos = async () => {
      if (newSprit.rareza && newSprit.nivelEspiritu && !editando) {
        // Polvo al Extraer
        const polvoExtraer = await obtenerPolvoAlExtraer(
          newSprit.rareza, 
          parseInt(newSprit.nivelEspiritu)
        );
        if (polvoExtraer > 0) {
          setNewSprit(prev => ({
            ...prev,
            polvoAlExtraer: polvoExtraer.toString()
          }));
        }
      }
      
      // 🔵 NUEVO: Polvo al Invocar para creación
      if (newSprit.material && newSprit.rareza && !editando) {
        const polvoInvocar = await obtenerPolvoAlInvocar(
          newSprit.material,
          newSprit.rareza
        );
        if (polvoInvocar > 0) {
          setNewSprit(prev => ({
            ...prev,
            polvoAlInvocar: polvoInvocar.toString()
          }));
        }
      }
    };
    cargarPolvos();
  }, [newSprit.rareza, newSprit.nivelEspiritu, newSprit.material, editando]);

  useEffect(() => {
    const cargarPolvos = async () => {
      if (showEditModal) {
        // Polvo al Extraer (si tiene rareza y nivel)
        if (editSprit.rareza && editSprit.nivelEspiritu) {
          const polvoExtraer = await obtenerPolvoAlExtraer(
            editSprit.rareza, 
            parseInt(editSprit.nivelEspiritu)
          );
          if (polvoExtraer > 0) {
            setEditSprit(prev => ({
              ...prev,
              polvoAlExtraer: polvoExtraer.toString()
            }));
          }
        }
        
        // 🔵 NUEVO: Polvo al Invocar (si tiene material y rareza)
        if (editSprit.material && editSprit.rareza) {
          const polvoInvocar = await obtenerPolvoAlInvocar(
            editSprit.material,
            editSprit.rareza
          );
          if (polvoInvocar > 0) {
            setEditSprit(prev => ({
              ...prev,
              polvoAlInvocar: polvoInvocar.toString()
            }));
          }
        }
      }
    };
    cargarPolvos();
  }, [showEditModal, editSprit.rareza, editSprit.nivelEspiritu, editSprit.material]);

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

  const mostrarConfirmacion = (title, message, type = 'success') => {
    setConfirmModalData({ title, message, type });
    setShowConfirmModal(true);
    
    setTimeout(() => {
      setShowConfirmModal(false);
    }, 2500);
  };

  const confirmarEliminacion = (sprit) => {
    setSpritAEliminar(sprit);
    setShowDeleteConfirmModal(true);
  };

  const eliminarSprit = async () => {
    if (!spritAEliminar) return;

    try {
      await spritsService.delete(spritAEliminar.id);
      await cargarSprits();
      setShowDeleteConfirmModal(false);
      setSpritAEliminar(null);
      mostrarConfirmacion(
        '🗑️ Sprit eliminado',
        `El sprit "${spritAEliminar.nombre}" se eliminó correctamente`,
        'success'
      );
    } catch (err) {
      console.error('Error al eliminar sprit:', err);
      setShowDeleteConfirmModal(false);
      mostrarConfirmacion(
        '❌ Error',
        'Hubo un error al eliminar el sprit',
        'error'
      );
    }
  };

  const handleImageClick = async (id) => {
    try {
      const spritActual = sprits.find(s => s.id === id);
      
      if (spritActual?.estaDominado) {
        const polvoNivel1 = await obtenerPolvoAlExtraer(spritActual.rareza, 1);

        setSprits(prevSprits => 
          prevSprits.map(sprit => 
            sprit.id === id 
              ? { ...sprit, estaDominado: false, estaEnInventario: false, nivelEspiritu: 1, polvoAlExtraer: polvoNivel1 }
              : sprit
          )
        );
        
        await spritsService.update(id, {
          estaDominado: false,
          estaEnInventario: false,
          nivelEspiritu: 1,
          polvoAlExtraer: polvoNivel1
        });
        return;
      }
      
      const nuevoEstadoInventario = !spritActual.estaEnInventario;
      const nuevoNivel = nuevoEstadoInventario ? (spritActual.nivelEspiritu || 1) : 1;
      
      let nuevoPolvo = spritActual.polvoAlExtraer || 0;
      if (!nuevoEstadoInventario) {
        nuevoPolvo = await obtenerPolvoAlExtraer(spritActual.rareza, 1);
      } else if (spritActual.nivelEspiritu) {
        nuevoPolvo = await obtenerPolvoAlExtraer(spritActual.rareza, spritActual.nivelEspiritu);
      }
      
      setSprits(prevSprits => 
        prevSprits.map(sprit => 
          sprit.id === id 
            ? { 
                ...sprit, 
                estaEnInventario: nuevoEstadoInventario,
                nivelEspiritu: nuevoNivel,
                polvoAlExtraer: nuevoPolvo
              }
            : sprit
        )
      );
      
      await spritsService.toggleInventario(id);
      
      if (!nuevoEstadoInventario) {
        await spritsService.update(id, { 
          nivelEspiritu: 1,
          polvoAlExtraer: nuevoPolvo
        });
      } else if (spritActual.nivelEspiritu) {
        await spritsService.update(id, { 
          polvoAlExtraer: nuevoPolvo 
        });
      }
    } catch (err) {
      console.error('Error al manejar clic en imagen:', err);
      cargarSprits();
    }
  };

  const toggleDominado = async (id, e) => {
    e.stopPropagation();
    
    try {
      const spritActual = sprits.find(s => s.id === id);
      if (!spritActual) return;
      
      if (spritActual.yaFueDominado && spritActual.estaDominado) {
        alert('💪 Este sprit ya fue dominado y no se puede desmarcar');
        return;
      }
      
      const nuevoEstadoDominado = !spritActual.estaDominado;
      const nuevoNivel = nuevoEstadoDominado ? 5 : 1;
      
      const nuevoPolvo = await obtenerPolvoAlExtraer(spritActual.rareza, nuevoNivel);
      
      setSprits(prevSprits => 
        prevSprits.map(sprit => 
          sprit.id === id 
            ? { 
                ...sprit, 
                estaDominado: nuevoEstadoDominado,
                yaFueDominado: nuevoEstadoDominado ? true : sprit.yaFueDominado,
                nivelEspiritu: nuevoNivel,
                polvoAlExtraer: nuevoPolvo
              }
            : sprit
        )
      );
      
      if (nuevoEstadoDominado) {
        await spritsService.update(id, {
          estaDominado: true,
          yaFueDominado: true,
          nivelEspiritu: 5,
          polvoAlExtraer: nuevoPolvo
        });
      } else {
        await spritsService.update(id, {
          estaDominado: false,
          nivelEspiritu: 1,
          polvoAlExtraer: nuevoPolvo
        });
      }
      
    } catch (err) {
      console.error('Error al alternar dominado:', err);
      cargarSprits();
    }
  };

  const toggleFlip = (id, e) => {
    e.stopPropagation();
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const abrirEditModal = (sprit, e) => {
    e.stopPropagation();
    
    if (sprit.rareza && sprit.nivelEspiritu) {
      actualizarPolvoAlExtraer(sprit.id, sprit.rareza, sprit.nivelEspiritu);
    }
    
    setEditSprit({
      id: sprit.id,
      nombre: sprit.nombre,
      rareza: sprit.rareza,
      material: sprit.material,
      nombreArchivoImagen: sprit.nombreArchivoImagen || '',
      nivelEspiritu: sprit.nivelEspiritu || '',
      polvoAlExtraer: sprit.polvoAlExtraer || '',
      polvoAlInvocar: sprit.polvoAlInvocar || ''
    });
    setShowEditModal(true);
  };

  const cerrarEditModal = () => {
    setShowEditModal(false);
    setEditSprit({
      id: null,
      nombre: '',
      rareza: '',
      material: '',
      nombreArchivoImagen: '',
      nivelEspiritu: '',
      polvoAlExtraer: '',
      polvoAlInvocar: ''
    });
    setEditando(false);
  };

  const handleEditChange = (e) => {
    setEditSprit({
      ...editSprit,
      [e.target.name]: e.target.value
    });
  };

  const guardarSpritEditado = async () => {
    if (!editSprit.nombre || !editSprit.rareza || !editSprit.material) {
      mostrarConfirmacion('⚠️ Campos incompletos', 'Los campos Nombre, Rareza y Material son obligatorios', 'warning');
      return;
    }

    setEditando(true);
    try {
      let polvoAlExtraer = editSprit.polvoAlExtraer ? parseInt(editSprit.polvoAlExtraer) : null;
      let polvoAlInvocar = editSprit.polvoAlInvocar ? parseInt(editSprit.polvoAlInvocar) : null;
      
      // 🔵 Calcular polvo al extraer si es necesario
      if (editSprit.rareza && editSprit.nivelEspiritu) {
        const polvoCalculado = await obtenerPolvoAlExtraer(editSprit.rareza, parseInt(editSprit.nivelEspiritu));
        if (polvoCalculado > 0) {
          polvoAlExtraer = polvoCalculado;
        }
      }
      
      // 🔵 NUEVO: Calcular polvo al invocar si es necesario
      if (editSprit.material && editSprit.rareza) {
        const polvoCalculado = await obtenerPolvoAlInvocar(editSprit.material, editSprit.rareza);
        if (polvoCalculado > 0) {
          polvoAlInvocar = polvoCalculado;
        }
      }
      
      let nivel = editSprit.nivelEspiritu ? parseInt(editSprit.nivelEspiritu) : 1;
      if (nivel < 1) nivel = 1;
      if (nivel > 5) nivel = 5;
      
      const data = {
        nombre: editSprit.nombre,
        rareza: editSprit.rareza,
        material: editSprit.material,
        nombreArchivoImagen: editSprit.nombreArchivoImagen || null,
        nivelEspiritu: nivel,
        polvoAlExtraer: polvoAlExtraer,
        polvoAlInvocar: polvoAlInvocar  // 🔵 Incluir polvo al invocar
      };

      await spritsService.update(editSprit.id, data);
      await cargarSprits();
      cerrarEditModal();
      mostrarConfirmacion('✅ Sprit actualizado', `El sprit "${editSprit.nombre}" se actualizó correctamente`, 'success');
    } catch (err) {
      console.error('Error al actualizar sprit:', err);
      mostrarConfirmacion('❌ Error', 'Hubo un error al actualizar el sprit', 'error');
    } finally {
      setEditando(false);
    }
  };

  const abrirAddModal = () => {
    setNewSprit({
      nombre: '',
      rareza: '',
      material: '',
      nombreArchivoImagen: '',
      nivelEspiritu: '',
      polvoAlExtraer: '',
      polvoAlInvocar: ''
    });
    setShowAddModal(true);
  };

  const cerrarAddModal = () => {
    setShowAddModal(false);
    setNewSprit({
      nombre: '',
      rareza: '',
      material: '',
      nombreArchivoImagen: '',
      nivelEspiritu: '',
      polvoAlExtraer: '',
      polvoAlInvocar: ''
    });
    setAgregando(false);
  };

  const handleAddChange = (e) => {
    setNewSprit({
      ...newSprit,
      [e.target.name]: e.target.value
    });
  };

  const guardarNuevoSprit = async () => {
    if (!newSprit.nombre || !newSprit.rareza || !newSprit.material) {
      mostrarConfirmacion('⚠️ Campos incompletos', 'Los campos Nombre, Rareza y Material son obligatorios', 'warning');
      return;
    }

    setAgregando(true);
    try {
      let polvoAlExtraer = newSprit.polvoAlExtraer ? parseInt(newSprit.polvoAlExtraer) : null;
      let polvoAlInvocar = newSprit.polvoAlInvocar ? parseInt(newSprit.polvoAlInvocar) : null;
      
      // Calcular polvo al extraer si es necesario
      if (newSprit.rareza && newSprit.nivelEspiritu) {
        const polvoCalculado = await obtenerPolvoAlExtraer(newSprit.rareza, parseInt(newSprit.nivelEspiritu));
        if (polvoCalculado > 0) {
          polvoAlExtraer = polvoCalculado;
        }
      }
      
      // 🔵 NUEVO: Calcular polvo al invocar si es necesario
      if (newSprit.material && newSprit.rareza) {
        const polvoCalculado = await obtenerPolvoAlInvocar(newSprit.material, newSprit.rareza);
        if (polvoCalculado > 0) {
          polvoAlInvocar = polvoCalculado;
        }
      }
      
      const nivel = newSprit.nivelEspiritu ? parseInt(newSprit.nivelEspiritu) : 1;
      
      const data = {
        nombre: newSprit.nombre,
        rareza: newSprit.rareza,
        material: newSprit.material,
        nombreArchivoImagen: newSprit.nombreArchivoImagen || null,
        nivelEspiritu: nivel,
        polvoAlExtraer: polvoAlExtraer,
        polvoAlInvocar: polvoAlInvocar,  // 🔵 Incluir polvo al invocar
        yaFueDominado: false,
        estaDominado: false,
        estaEnInventario: false,
        estaDesbloqueado: false
      };

      await spritsService.create(data);
      await cargarSprits();
      cerrarAddModal();
      mostrarConfirmacion('✅ Sprit agregado', `Se ha creado correctamente el sprit "${newSprit.nombre}"`, 'success');
    } catch (err) {
      console.error('Error al agregar sprit:', err);
      mostrarConfirmacion('❌ Error', 'Hubo un error al agregar el sprit', 'error');
    } finally {
      setAgregando(false);
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
      nombre: '',
      orden: 'default'
    });
  };

  const spritsFiltrados = sprits.filter(sprit => {
    if (filtros.rareza && sprit.rareza !== filtros.rareza) return false;
    if (filtros.material && sprit.material !== filtros.material) return false;
    if (filtros.nombre && sprit.nombre !== filtros.nombre) return false;
    return true;
  });

  // 🔵 Solo ordenar cuando los órdenes estén cargados
  const spritsOrdenados = ordenesCargados ? ordenarSprits(spritsFiltrados) : spritsFiltrados;

  if (loading) return <div className="loading">Cargando sprits...</div>;
  if (error) return <div className="error">{error}</div>;

  const polvoNecesario = calcularPolvoNecesario();
  
  const progresoInventario = calcularProgreso(s => s.estaEnInventario);
  const progresoDominadosInventario = calcularProgreso(s => s.estaDominado);
  const progresoDominadosGeneral = calcularProgreso(s => s.yaFueDominado);

  return (
    <div className="sprits-container">
      <h1>Sprits de Fortnite</h1>
      
      <div className="filtros">
        <select 
          name="orden" 
          value={filtros.orden} 
          onChange={handleFiltroChange}
          className="filtro-orden"
        >
          <option value="default">Por Orden (Default)</option>
          <option value="material">Por Orden (Material)</option>
          <option value="rareza">Por Orden (Rareza)</option>
          <option value="no-inventario">Faltan en Inventario</option>
          <option value="no-dominado">Faltan por Dominar</option>
        </select>

        <select 
          name="nombre" 
          value={filtros.nombre} 
          onChange={handleFiltroChange}
          className="filtro-nombres"
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
          {materialesDisponibles.map((material) => (
            <option key={material} value={material}>
              {material}
            </option>
          ))}
        </select>
        
        <div className="filtros-botones">
          <button className="btn-limpiar-filtros" onClick={limpiarFiltros}>
            🗑️ Limpiar filtros
          </button>
          <button className="btn-agregar" onClick={abrirAddModal}>
            ➕ Agregar Sprit
          </button>
          <button 
            className="btn-volver"
            onClick={() => navigate('/')}
            title="Volver al inicio"
          >
            ←
          </button>
        </div>
      </div>

      <div className="polvo-info">
        <div className="polvo-info-content">
          <img 
            src="./imagenesSprites/polvoEspiritu.png" 
            alt="Polvo de Espíritu"
            className="polvo-info-icon"
          />
          <span className="polvo-info-text">
            Polvo de Espíritu necesario para tener en el inventario a todos:
          </span>
          <span className="polvo-info-cantidad">{polvoNecesario.toLocaleString()}</span>
        </div>
      </div>

      <div className="progresos-container">
        <div className="progreso-item">
          <div className="progreso-header">
            <span className="progreso-titulo">📦 Progreso de Inventario</span>
            <span className="progreso-numero">
              {progresoInventario.completados}/{progresoInventario.total}
            </span>
          </div>
          <div className="progreso-barra">
            <div 
              className="progreso-llenado" 
              style={{ width: `${progresoInventario.porcentaje}%` }}
            />
          </div>
          <span className="progreso-porcentaje">
            {progresoInventario.porcentaje.toFixed(1)}%
          </span>
        </div>

        <div className="progreso-item">
          <div className="progreso-header">
            <span className="progreso-titulo">👑 Dominados en Inventario</span>
            <span className="progreso-numero">
              {progresoDominadosInventario.completados}/{progresoDominadosInventario.total}
            </span>
          </div>
          <div className="progreso-barra">
            <div 
              className="progreso-llenado dorado" 
              style={{ width: `${progresoDominadosInventario.porcentaje}%` }}
            />
          </div>
          <span className="progreso-porcentaje">
            {progresoDominadosInventario.porcentaje.toFixed(1)}%
          </span>
        </div>

        <div className="progreso-item">
          <div className="progreso-header">
            <span className="progreso-titulo">🏆 Dominados en General</span>
            <span className="progreso-numero">
              {progresoDominadosGeneral.completados}/{progresoDominadosGeneral.total}
            </span>
          </div>
          <div className="progreso-barra">
            <div 
              className="progreso-llenado mitico" 
              style={{ width: `${progresoDominadosGeneral.porcentaje}%` }}
            />
          </div>
          <span className="progreso-porcentaje">
            {progresoDominadosGeneral.porcentaje.toFixed(1)}%
          </span>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={confirmModalData.title}
        message={confirmModalData.message}
        type={confirmModalData.type}
        confirmText="Aceptar"
      />

      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        title="⚠️ Confirmar eliminación"
        message={`¿Estás seguro de eliminar el sprit "${spritAEliminar?.nombre}"?\nEsta acción no se puede deshacer.`}
        type="warning"
        confirmText="Eliminar"
        onConfirm={eliminarSprit}
        showCancelButton={true}
      />

      <div className="sprits-grid">
        {spritsOrdenados.map((sprit) => (
          <div 
            key={sprit.id} 
            className={`sprit-card ${sprit.estaEnInventario ? 'inventario' : ''} ${sprit.estaDominado ? 'dominado' : ''} ${flippedCards[sprit.id] ? 'flipped' : ''}`}
          >
            <div className="sprit-card-inner">
              <div className="sprit-card-front">
                <div 
                  className="sprit-image-wrapper"
                  onClick={() => handleImageClick(sprit.id)}
                >
                  {sprit.nombreArchivoImagen ? (
                    <img 
                      src={sprit.nombreArchivoImagen} 
                      alt={sprit.nombre}
                      className="sprit-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/200/16213e/ffffff?text=Sin+imagen';
                      }}
                    />
                  ) : (
                    <div className="sprit-img-placeholder">
                      🖼️ Sin imagen
                    </div>
                  )}
                  
                  {sprit.estaDominado && (
                    <div className="corona-overlay">
                      <span className="corona-dominada">👑</span>
                    </div>
                  )}
                </div>

                <div className="sprit-rareza-wrapper">
                  {/* 🔵 Mostrar icono de dominado general si yaFueDominado es true */}
                  {/* {sprit.yaFueDominado && (
                    <span className="ya-dominado-icon" title="Ya fue dominado alguna vez">🏆</span>
                  )} */}
                  <span className="nivel-badge">
                    ✨ Nv. {sprit.nivelEspiritu || 1}
                  </span>
                  <span className={`rareza-badge ${sprit.rareza.toLowerCase()}`}>
                    {sprit.rareza}
                  </span>
                </div>

                <div className="sprit-nombre">
                  {/* 🔵 Corona antes del nombre */}
                  {sprit.estaEnInventario && !sprit.estaDominado && (
                    <span 
                      className="corona-icon clickable nombre-corona"
                      onClick={(e) => toggleDominado(sprit.id, e)}
                      title={sprit.yaFueDominado ? '✅ Ya fue dominado (no se puede desmarcar)' : 'Haz clic para dominar este sprit'}
                    >
                      👑
                    </span>
                  )}
                  <h4 className={`nombre-material-${sprit.material.toLowerCase()}`}>
                    {sprit.nombre}
                  </h4>
                  <span 
                    className="eye-icon clickable"
                    onClick={(e) => toggleFlip(sprit.id, e)}
                    title="Ver detalles del sprit"
                  >
                    👁️
                  </span>
                </div>
              </div>

              <div className="sprit-card-back">
                <div className="back-details">
                  {/**/}
                  {sprit.yaFueDominado && (
                    <div className="detail-item ya-dominado-detail">
                      <span className="detail-label">🏆 Ya fue dominado</span>
                      <span className="detail-value">✅</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-label">📦 Material:</span>
                    <span className={`detail-value material-${sprit.material.toLowerCase()}`}>
                      {sprit.material}
                    </span>
                  </div>
                  <div className="detail-item">
                    <img
                      src="./imagenesSprites/polvoEspiritu.png"
                      alt="Polvo al extraer"
                      className="polvo-icon-small"
                    />
                    <span className="detail-label">Polvo al Extraer para el Nivel {sprit.nivelEspiritu || 1}:</span>
                    <span className="detail-value">{sprit.polvoAlExtraer || 0}</span>
                  </div>
                  <div className="detail-item">
                    <img 
                      src="./imagenesSprites/polvoEspiritu.png" 
                      alt="Polvo al invocar"
                      className="polvo-icon-small"
                    />
                    <span className="detail-label">Polvo al Invocar:</span>
                    <span className="detail-value">{sprit.polvoAlInvocar || 0}</span>
                  </div>
                  
                </div>

                <div className="back-actions">
                  <span 
                    className="action-icon"
                    title="Editar"
                    onClick={(e) => abrirEditModal(sprit, e)}
                  >
                    ✏️
                  </span>
                  <span 
                    className="action-icon"
                    title="Eliminar"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmarEliminacion(sprit);
                    }}
                  >
                    🗑️
                  </span>
                  <span 
                    className="action-icon"
                    title="Volver"
                    onClick={(e) => toggleFlip(sprit.id, e)}
                  >
                    🔄
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {spritsOrdenados.length === 0 && (
        <p className="no-results">No hay sprits que coincidan con los filtros</p>
      )}

      {/* MODALES DE AGREGAR Y EDITAR */}
      {showAddModal && (
        <div className="modal-overlay" onClick={cerrarAddModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>➕ Agregar Nuevo Sprit</h2>
              <button className="modal-close" onClick={cerrarAddModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="edit-form">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Espíritu del Punto Cero"
                    value={newSprit.nombre}
                    onChange={handleAddChange}
                  />
                </div>

                <div className="form-group">
                  <label>Rareza *</label>
                  <input
                    type="text"
                    name="rareza"
                    placeholder="Ej: Mítico"
                    value={newSprit.rareza}
                    onChange={handleAddChange}
                  />
                </div>

                <div className="form-group">
                  <label>Material *</label>
                  <input
                    type="text"
                    name="material"
                    placeholder="Ej: Galaxia"
                    value={newSprit.material}
                    onChange={handleAddChange}
                  />
                </div>

                <div className="form-group">
                  <label>Ruta de la Imagen</label>
                  <input
                    type="text"
                    name="nombreArchivoImagen"
                    placeholder="Ej: ./imagenesSprites/puntoCeroGalaxia.jpg"
                    value={newSprit.nombreArchivoImagen}
                    onChange={handleAddChange}
                  />
                </div>

                <div className="form-group">
                  <label>Nivel de Espíritu</label>
                  <input
                    type="number"
                    name="nivelEspiritu"
                    placeholder="Ej: 1"
                    value={newSprit.nivelEspiritu}
                    onChange={handleAddChange}
                  />
                </div>

                <div className="form-group">
                  <label>Polvo al Extraer</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      name="polvoAlExtraer"
                      placeholder="Se calcula automáticamente"
                      value={newSprit.polvoAlExtraer || ''}
                      readOnly
                      style={{ 
                        flex: 1, 
                        cursor: 'not-allowed',
                        opacity: 0.8,
                        backgroundColor: '#1a1a2e',
                        borderColor: '#35cf35'
                      }}
                    />
                  </div>
                  <small style={{ color: '#666' }}>
                    💡 Se calcula automáticamente según Rareza y Nivel de Espíritu
                  </small>
                </div>

                <div className="form-group">
                <label>Polvo al Invocar</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    name="polvoAlInvocar"
                    placeholder="Se calcula automáticamente"
                    value={newSprit.polvoAlInvocar || ''}
                    readOnly
                    style={{ 
                      flex: 1, 
                      cursor: 'not-allowed',
                      opacity: 0.8,
                      backgroundColor: '#1a1a2e',
                      borderColor: '#9c27b0'
                    }}
                  />
                  <img 
                    src="./imagenesSprites/polvoEspiritu.png" 
                    alt="Polvo"
                    style={{ width: '24px', height: '24px' }}
                  />
                </div>
                <small style={{ color: '#888' }}>
                  💡 Se calcula automáticamente según Material y Rareza
                </small>
              </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarAddModal}>
                Cancelar
              </button>
              <button 
                className="btn-guardar" 
                onClick={guardarNuevoSprit}
                disabled={agregando}
              >
                {agregando ? '⏳ Guardando...' : '💾 Agregar Sprit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay" onClick={cerrarEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Editar Sprit</h2>
              <button className="modal-close" onClick={cerrarEditModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="edit-form">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: Espíritu del Punto Cero"
                    value={editSprit.nombre}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Rareza *</label>
                  <input
                    type="text"
                    name="rareza"
                    placeholder="Ej: Mítico"
                    value={editSprit.rareza}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Material *</label>
                  <input
                    type="text"
                    name="material"
                    placeholder="Ej: Galaxia"
                    value={editSprit.material}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Ruta de la Imagen</label>
                  <input
                    type="text"
                    name="nombreArchivoImagen"
                    placeholder="Ej: ./imagenesSprites/puntoCeroGalaxia.jpg"
                    value={editSprit.nombreArchivoImagen}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Nivel de Espíritu</label>
                  <input
                    type="number"
                    name="nivelEspiritu"
                    placeholder="Ej: 1"
                    value={editSprit.nivelEspiritu}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="form-group">
                  <label>Polvo al Extraer</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      name="polvoAlExtraer"
                      placeholder="Se calcula automáticamente"
                      value={editSprit.polvoAlExtraer || ''}
                      readOnly
                      style={{ 
                        flex: 1, 
                        cursor: 'not-allowed',
                        opacity: 0.8,
                        backgroundColor: '#1a1a2e',
                        borderColor: '#35cf35'
                      }}
                    />
                  </div>
                  <small style={{ color: '#666' }}>
                    💡 Se calcula automáticamente según Rareza y Nivel de Espíritu
                  </small>
                </div>

                <div className="form-group">
                <label>Polvo al Invocar</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    name="polvoAlInvocar"
                    placeholder="Se calcula automáticamente"
                    value={editSprit.polvoAlInvocar || ''}
                    readOnly
                    style={{ 
                      flex: 1, 
                      cursor: 'not-allowed',
                      opacity: 0.8,
                      backgroundColor: '#1a1a2e',
                      borderColor: '#9c27b0'
                    }}
                  />
                  <img 
                    src="./imagenesSprites/polvoEspiritu.png" 
                    alt="Polvo"
                    style={{ width: '24px', height: '24px' }}
                  />
                </div>
                <small style={{ color: '#888' }}>
                  💡 Se calcula automáticamente según Material y Rareza
                </small>
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
                disabled={editando}
              >
                {editando ? '⏳ Guardando...' : '💾 Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpritsList;