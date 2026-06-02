import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Protfolio from './Components/Protfolio';
import ProjectDetail from './Components/ProjectDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Protfolio />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
