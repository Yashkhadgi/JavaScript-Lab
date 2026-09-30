// src/App.jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTaskStore } from './store/taskStore';
import { Landing } from './pages/Landing';
import { IndividualApp } from './pages/IndividualApp';
import { EnterpriseApp } from './pages/EnterpriseApp';
import './styles/index.css';

function AppContent() {
  const mode = useTaskStore((s) => s.mode);
  const theme = useTaskStore((s) => s.theme);

  // Apply theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/individual/*"
          element={mode === 'individual' ? <IndividualApp /> : <Navigate to="/" />}
        />
        <Route
          path="/enterprise/*"
          element={mode === 'enterprise' ? <EnterpriseApp /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppContent />;
}
