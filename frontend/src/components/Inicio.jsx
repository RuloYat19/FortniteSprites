import React from 'react';
import './Inicio.css';

function Inicio({ onNavigate }) {
  const cards = [
    {
      id: 'battle_royale',
      titulo: 'Battle Royale',
      imagen: './imagenesGeneral/LogoFortnite.png',
      descripcion: 'Gestión de Ciertos Datos de los Sprites'
    },
    {
      id: 'droid_tycoon',
      titulo: 'Droid Tycoon',
      imagen: './imagenesGeneral/LogoDroidTycoon.png',
      descripcion: 'Control de Sprites que ya se han dominado'
    },
    {
      id: 'sprites',
      titulo: 'Sprites',
      imagen: './imagenesGeneral/dominado.png',
      descripcion: 'Explora y gestiona tu colección de sprits'
    },
    {
      id: 'notas',
      titulo: 'Notas',
      imagen: './imagenesGeneral/Notas.png',
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
      <h1>Programas de Fortnite</h1>
      
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