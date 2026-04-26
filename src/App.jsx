import { useState, useEffect } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==================== CARGAR USUARIO DESDE LOCALSTORAGE ====================
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("alumno_portal_usuario");
    
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (err) {
        console.error("Error al cargar usuario desde localStorage:", err);
        localStorage.removeItem("alumno_portal_usuario");
      }
    }
    
    setLoading(false);
  }, []);

  // ==================== MANEJAR LOGIN ====================
  const handleLoginSuccess = (usuarioData) => {
    // Guardar en localStorage para persistencia
    localStorage.setItem("alumno_portal_usuario", JSON.stringify(usuarioData));
    setUsuario(usuarioData);
  };

  // ==================== MANEJAR LOGOUT ====================
  const handleLogout = () => {
    // Eliminar de localStorage
    localStorage.removeItem("alumno_portal_usuario");
    setUsuario(null);
  };

  // ==================== MOSTRAR LOADING INICIAL ====================
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // ==================== RENDERIZAR LOGIN O DASHBOARD ====================
  return usuario ? (
    <Dashboard usuario={usuario} onLogout={handleLogout} />
  ) : (
    <Login onLoginSuccess={handleLoginSuccess} />
  );
}
