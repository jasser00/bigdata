import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Machines from './pages/Machines';
import MachineDetail from './pages/MachineDetail';
import Predict from './pages/Predict';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/history" element={<History />} />
            <Route path="/machines" element={<Machines />} />
            <Route path="/machine/:id" element={<MachineDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;