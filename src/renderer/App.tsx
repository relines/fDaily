import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import IndexCom from './pages/Index';

function Hello() {
  return (
    <div>
      <h1>electron-react-boilerplate</h1>
      <IndexCom />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
