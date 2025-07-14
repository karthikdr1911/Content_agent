import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Script from './pages/Script';
import About from './pages/About';
import Voiceover from './pages/Voiceover';
import Editing from './pages/Editing';
import MainLayout from './layout/MainLayout';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/script" element={<Script />} />
        <Route path="/about" element={<About />} />
        <Route path="/voiceover" element={<Voiceover />} />
        <Route path="/editing" element={<Editing />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
