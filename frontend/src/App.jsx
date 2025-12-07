import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SalesPage } from './routes/SalesPage';
import './styles/index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SalesPage />} />
      </Routes>
    </Router>
  );
}

export default App;


