import { useMemo, useState } from 'react';
import './ComboboxFiltrable.css';

function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');
}

function ComboboxFiltrable({
  id,
  label,
  value,
  options,
  onChange,
  noOptionsText = 'No hay opciones que coincidan.',
}) {
  const [consulta, setConsulta] = useState(value);
  const [abierto, setAbierto] = useState(false);
  const [opcionActiva, setOpcionActiva] = useState(-1);
  const opcionesFiltradas = useMemo(() => {
    const texto = normalizarTexto(consulta.trim());
    return options.filter((option) => normalizarTexto(option.label).includes(texto));
  }, [consulta, options]);

  const seleccionarOpcion = (option) => {
    setConsulta(option.value);
    setAbierto(false);
    setOpcionActiva(-1);
    onChange(option);
  };

  const manejarTeclado = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setAbierto(true);
      setOpcionActiva((actual) => Math.min(actual + 1, opcionesFiltradas.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setAbierto(true);
      setOpcionActiva((actual) => Math.max(actual - 1, 0));
    } else if (event.key === 'Enter' && abierto) {
      event.preventDefault();
      if (opcionActiva >= 0) {
        seleccionarOpcion(opcionesFiltradas[opcionActiva]);
      } else if (opcionesFiltradas.length === 1) {
        seleccionarOpcion(opcionesFiltradas[0]);
      }
    } else if (event.key === 'Escape') {
      setAbierto(false);
      setOpcionActiva(-1);
    }
  };

  return (
    <label className="combobox-filtrable-label">
      {label}
      <div className="combobox-filtrable">
        <input
          id={id}
          type="text"
          value={consulta}
          onChange={(event) => {
            setConsulta(event.target.value);
            setOpcionActiva(-1);
            setAbierto(true);
            onChange(null);
          }}
          onFocus={() => setAbierto(true)}
          onBlur={() => setAbierto(false)}
          onKeyDown={manejarTeclado}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={abierto}
          aria-controls={`${id}-opciones`}
          aria-activedescendant={
            abierto && opcionActiva >= 0 && opcionesFiltradas[opcionActiva]
              ? `${id}-opcion-${opcionActiva}`
              : undefined
          }
          autoComplete="off"
          required
        />
        {abierto && (
          <ul
            id={`${id}-opciones`}
            className="combobox-filtrable-options"
            role="listbox"
          >
            {opcionesFiltradas.length > 0 ? opcionesFiltradas.map((option, index) => (
              <li
                id={`${id}-opcion-${index}`}
                key={option.id}
                role="option"
                aria-selected={value === option.value}
                className={opcionActiva === index ? 'active' : ''}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => seleccionarOpcion(option)}
              >
                <span>{option.label}</span>
                {option.secondary && <small>{option.secondary}</small>}
              </li>
            )) : (
              <li className="combobox-filtrable-empty">{noOptionsText}</li>
            )}
          </ul>
        )}
      </div>
    </label>
  );
}

export default ComboboxFiltrable;
