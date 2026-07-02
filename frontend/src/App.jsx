// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Inicio from './components/Inicio';
import SpritsList from './components/SpritsList';
import CalculadoraPolvoEspiritu from './components/CalculadoraPolvoEspiritu';
import Dominados from './components/Dominados';
import Administrador from './components/Administrador';

// Componente wrapper para manejar la navegación desde Inicio
function InicioWrapper() {
  const navigate = useNavigate();
  
  const handleNavigate = (destino) => {
    switch(destino) {
      case 'administrador':
        navigate('/administrador');
        break;
      case 'lista':
        navigate('/sprits');
        break;
      case 'dominados':
        navigate('/dominados');
        break;
      case 'calculo':
        navigate('/calculadora');
        break;
      default:
        break;
    }
  };
  
  return <Inicio onNavigate={handleNavigate} />;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<InicioWrapper />} />
          <Route path="/sprits" element={<SpritsList />} />
          <Route path="/calculadora" element={<CalculadoraPolvoEspiritu />} />
          <Route path="/dominados" element={<Dominados />} />
          <Route path="/administrador" element={<Administrador />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;