import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SalesPage } from './routes/SalesPage';
import { startKeepAlive, stopKeepAlive } from './utils/keepAlive';
import './styles/index.css';

function App() {
  useEffect(() => {
    startKeepAlive();
    
    return () => {
      stopKeepAlive();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SalesPage />} />
      </Routes>
    </Router>
  );
}

export default App;


