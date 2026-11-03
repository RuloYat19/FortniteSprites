import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Inicio from './components/Inicio';
import InicioSprites from './components/InicioSprites';
import SpritsList from './components/Sprites/SpritsList';
import CalculadoraPolvoEspiritu from './components/Sprites/CalculadoraPolvoEspiritu';
import Dominados from './components/Sprites/Dominados';
import Administrador from './components/Administrador/Administrador';

function InicioWrapper() {
  const navigate = useNavigate();
  
  const handleNavigate = (destino) => {
    switch(destino) {
      case 'battle_royale':
        navigate('/');
        break;
      case 'droid_tycoon':
        navigate('/');
        break;
      case 'sprites':
        navigate('/sprites');
        break;
      case 'notas':
        navigate('/');
        break;
      default:
        break;
    }
  };
  
  return <Inicio onNavigate={handleNavigate} />;
}

function InicioSpritesWarapper() {
  const navigate = useNavigate();
  
  const handleNavigate = (destino) => {
    switch(destino) {
      case 'administrador':
        navigate('/sprites/administrador');
        break;
      case 'lista':
        navigate('/sprites/sprits');
        break;
      case 'dominados':
        navigate('/sprites/dominados');
        break;
      case 'calculo':
        navigate('/sprites/calculadora');
        break;
      default:
        break;
    }
  };
  
  return <InicioSprites onNavigate={handleNavigate} />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<InicioWrapper />} />
          <Route path="/sprites" element={<InicioSpritesWarapper />} />
          <Route path="/sprites/sprits" element={<SpritsList />} />
          <Route path="/sprites/calculadora" element={<CalculadoraPolvoEspiritu />} />
          <Route path="/sprites/dominados" element={<Dominados />} />
          <Route path="/sprites/administrador" element={<Administrador />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;