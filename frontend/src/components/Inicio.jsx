import React from 'react';
import './Inicio.css';

function Inicio({ onNavigate }) {
  const cards = [
    {
      id: 'administrador',
      titulo: 'Módulo de Administrador',
      imagen: './imagenesSprites/administradorSprites.png',
      descripcion: 'Gestión de Ciertos Datos de los Sprites'
    },
    {
      id: 'dominados',
      titulo: 'Lista de Dominados',
      imagen: './imagenesSprites/dominado.png',
      descripcion: 'Control de Sprites que ya se han dominado'
    },
    {
      id: 'lista',
      titulo: 'Lista de Sprites',
      imagen: './imagenesSprites/puntoCeroGalaxia.png',
      descripcion: 'Explora y gestiona tu colección de sprits'
    },
    {
      id: 'calculo',
      titulo: 'Cálculo de Polvo de Espíritu',
      imagen: './imagenesSprites/polvoEspiritu.png',
      descripcion: 'Calcula el polvo necesario para invocar sprits'
    }
  ];

  const handleCardClick = (cardId) => {
    if (onNavigate) {
      onNavigate(cardId);
    }
  };

  return (
    <div className="inicio-container">
      <h1>Sprits de Fortnite</h1>
      
      <div className="inicio-cards">
        {cards.map((card) => (
          <div 
            key={card.id} 
            className="inicio-card"
            onClick={() => handleCardClick(card.id)}
          >
            <div className="inicio-card-image">
              <img 
                src={card.imagen} 
                alt={card.titulo}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/200/16213e/ffffff?text=Sin+imagen';
                }}
              />
            </div>
            <div className="inicio-card-content">
              <h3>{card.titulo}</h3>
              <p>{card.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inicio;