import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  chipsVentaDroideService,
  creditosPorSegundoService,
  kyberActivarDroideService,
  materialDroidTycoonService,
  nombresDroidesService,
  rarezasDroidesService,
} from '../../services/api';
import CatalogoDroidTycoonAdmin from './CatalogoDroidTycoonAdmin';
import '../Administrador/Administrador.css';
import './AdministradorDroidTycoon.css';

const catalogos = [
  {
    key: 'nombres',
    label: 'Nombres de Droides',
    titulo: 'Nombres de Droides',
    singular: 'nombre de droide',
    icon: '📝',
    servicio: nombresDroidesService,
    campos: [
      { key: 'numeroOrden', label: 'Número de orden', type: 'number', min: 1 },
      { key: 'nombre', label: 'Nombre', maxLength: 50 },
    ],
  },
  {
    key: 'materiales',
    label: 'Materiales',
    titulo: 'Materiales de Droid Tycoon',
    singular: 'material',
    icon: '📦',
    servicio: materialDroidTycoonService,
    campos: [
      { key: 'numeroOrden', label: 'Número de orden', type: 'number', min: 1 },
      { key: 'material', label: 'Material', maxLength: 50 },
    ],
  },
  {
    key: 'rarezas',
    label: 'Rarezas',
    titulo: 'Rarezas de Droides',
    singular: 'rareza',
    icon: '💎',
    servicio: rarezasDroidesService,
    campos: [
      { key: 'numeroOrden', label: 'Número de orden', type: 'number', min: 1 },
      { key: 'nombre', label: 'Rareza', maxLength: 50 },
    ],
  },
  {
    key: 'creditos',
    label: 'Créditos por Segundo',
    titulo: 'Créditos por Segundo',
    singular: 'registro de créditos',
    icon: '🪙',
    servicio: creditosPorSegundoService,
    campos: [
      { key: 'numeroOrden', label: 'Número de orden', type: 'number', min: 1 },
      { key: 'nombreDroide', label: 'Nombre del droide', maxLength: 50 },
      { key: 'cantidadPredeterminada', label: 'Créditos por segundo', type: 'number' },
    ],
  },
  {
    key: 'chips',
    label: 'Chips al Vender a X Droide',
    titulo: 'Chips al Vender a X Droide',
    singular: 'registro de chips',
    icon: '🔹',
    servicio: chipsVentaDroideService,
    campos: [
      { key: 'numeroOrden', label: 'Número de orden', type: 'number', min: 1 },
      { key: 'rareza', label: 'Rareza', maxLength: 50 },
      { key: 'material', label: 'Material', maxLength: 50 },
      { key: 'cantidad', label: 'Cantidad de chips', type: 'number' },
    ],
  },
  {
    key: 'kyber',
    label: 'Cristales Kyber para Activar un Droide',
    titulo: 'Cristales Kyber para Activar un Droide',
    singular: 'costo de cristales Kyber',
    icon: '🔮',
    servicio: kyberActivarDroideService,
    campos: [
      { key: 'numeroOrden', label: 'Número de orden', type: 'number', min: 1 },
      { key: 'rareza', label: 'Rareza', maxLength: 50 },
      { key: 'cantidad', label: 'Cantidad de cristales Kyber', type: 'number' },
    ],
  },
];

function AdministradorDroidTycoon() {
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState(catalogos[0].key);
  const catalogoActivo = catalogos.find((catalogo) => catalogo.key === seccionActiva);

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="sidebar-logo droid-admin-logo">
          <span className="sidebar-icon">⚙️</span>
          <h2>Admin Droid Tycoon</h2>
        </div>

        <nav className="sidebar-nav" aria-label="Catálogos de Droid Tycoon">
          <div className="nav-section">
            <div className="nav-section-title">📊 Catálogos</div>
            <ul>
              {catalogos.map((catalogo) => (
                <li
                  key={catalogo.key}
                  className={catalogoActivo.key === catalogo.key ? 'active' : ''}
                >
                  <button
                    type="button"
                    className="droid-admin-nav-button"
                    onClick={() => setSeccionActiva(catalogo.key)}
                    aria-current={catalogoActivo.key === catalogo.key ? 'page' : undefined}
                  >
                    <span className="nav-icon" aria-hidden="true">{catalogo.icon}</span>
                    <span>{catalogo.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button
            type="button"
            className="btn-volver-sidebar"
            onClick={() => navigate('/droid-tycoon')}
          >
            ← Regresar a Droid Tycoon
          </button>
        </div>
      </aside>

      <CatalogoDroidTycoonAdmin
        key={catalogoActivo.key}
        configuracion={catalogoActivo}
      />
    </div>
  );
}

export default AdministradorDroidTycoon;
