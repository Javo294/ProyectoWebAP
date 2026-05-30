// 1. Importamos el componente Register desde la carpeta pages con su ruta exacta
import Register from './pages/Trazabilidad';

function App() {
  return (
    <div>
      {/* 2. Quitamos el h1 de prueba y llamamos a tu componente */}
      <Register/>
    </div>
  );
}

export default App;