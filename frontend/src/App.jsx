// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Inicio from './components/Inicio';
import SpritsList from './components/SpritsList';
import CalculadoraPolvoEspiritu from './components/CalculadoraPolvoEspiritu';

// Componente wrapper para manejar la navegación desde Inicio
function InicioWrapper() {
  const navigate = useNavigate();
  
  const handleNavigate = (destino) => {
    switch(destino) {
      case 'lista':
        navigate('/sprits');
        break;
      case 'admin':
        // Por ahora, redirige a sprits o muestra un mensaje
        alert('🔧 Sección de Administrador en construcción');
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;