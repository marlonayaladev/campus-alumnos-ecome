// 📋 INTEGRACIÓN DE LOGIN + localStorage EN App.jsx

// ==================== ANTES (Código antiguo) ====================

/*
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  return (
    <> ... componente simple ... </>
  )
}

export default App
*/

// ==================== DESPUÉS (Código nuevo) ====================

// src/App.jsx

import { useState, useEffect } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // ========== 1. CARGAR USUARIO DESDE localStorage EN MOUNT ==========
  useEffect(() => {
    // Al montar el componente, verifica si hay usuario guardado
    const usuarioGuardado = localStorage.getItem("alumno_portal_usuario");
    
    if (usuarioGuardado) {
      try {
        // Convertir string JSON a objeto
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (err) {
        console.error("Error al cargar usuario desde localStorage:", err);
        // Si hay error, limpiar localStorage
        localStorage.removeItem("alumno_portal_usuario");
      }
    }
    
    // Indicar que terminó la carga inicial
    setLoading(false);
  }, []);  // Solo corre UNA VEZ al montar

  // ========== 2. MANEJAR LOGIN ==========
  const handleLoginSuccess = (usuarioData) => {
    // Guardar en localStorage (convertir objeto a JSON string)
    localStorage.setItem("alumno_portal_usuario", JSON.stringify(usuarioData));
    // Actualizar estado
    setUsuario(usuarioData);
  };

  // ========== 3. MANEJAR LOGOUT ==========
  const handleLogout = () => {
    // Eliminar de localStorage
    localStorage.removeItem("alumno_portal_usuario");
    // Limpiar estado
    setUsuario(null);
  };

  // ========== 4. MOSTRAR LOADING INICIAL ==========
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // ========== 5. RENDERIZAR LOGIN O DASHBOARD ==========
  return usuario ? (
    <Dashboard usuario={usuario} onLogout={handleLogout} />
  ) : (
    <Login onLoginSuccess={handleLoginSuccess} />
  );
}

// ==================== ESTRUCTURA DE ESTADOS ====================

/*
usuario: null | { id, nombre, grado, arma, clave, cursosVinculados }
loading: true | false

Estado inicial (primera carga):
  usuario = null
  loading = true

Después de useEffect (sin localStorage):
  usuario = null
  loading = false
  Renderiza: <Login />

Después de login exitoso:
  usuario = { id: "ALU001", nombre: "Juan", ... }
  loading = false
  Renderiza: <Dashboard />

Después de logout:
  usuario = null
  loading = false
  Renderiza: <Login />
*/

// ==================== localStorage OPERACIONES ====================

/*
GUARDAR:
  localStorage.setItem("alumno_portal_usuario", JSON.stringify(alumnoData))
  Ej: '{"id":"ALU001","nombre":"Juan Pérez","grado":"6to Grado"}'

LEER:
  const stored = localStorage.getItem("alumno_portal_usuario")
  if (stored) {
    const data = JSON.parse(stored)  // Convertir string → objeto
  }

ELIMINAR:
  localStorage.removeItem("alumno_portal_usuario")

LIMPIAR TODO:
  localStorage.clear()
*/

// ==================== FLUJO PASO A PASO ====================

/*
1. Usuario abre http://localhost:5173
   ├─ App.jsx monta
   ├─ useState(usuario) = null
   ├─ useState(loading) = true
   ├─ useEffect corre
   │  ├─ localStorage.getItem("alumno_portal_usuario")
   │  ├─ Si NO existe → usuario sigue null
   │  ├─ Si existe → JSON.parse() y setUsuario()
   │  └─ setLoading(false)
   └─ Renderiza <Loading /> o <Login />

2. Usuario ingresa código en Login.jsx
   ├─ getDoc(query(...)) a Firestore
   ├─ Si encuentra → onLoginSuccess(alumnoData)
   ├─ En App: handleLoginSuccess(alumnoData)
   │  ├─ localStorage.setItem(...)
   │  └─ setUsuario(alumnoData)
   ├─ usuario !== null → true
   └─ Renderiza <Dashboard />

3. Usuario recarga la página F5
   ├─ App.jsx monta AGAIN
   ├─ useEffect corre AGAIN
   ├─ localStorage.getItem("alumno_portal_usuario") → existe ✅
   ├─ JSON.parse() y setUsuario()
   ├─ setLoading(false)
   ├─ usuario !== null → true
   └─ Renderiza <Dashboard /> directamente (sin login) ✅

4. Usuario click "Cerrar Sesión"
   ├─ handleLogout() en App
   ├─ localStorage.removeItem(...)
   ├─ setUsuario(null)
   ├─ usuario === null → true
   └─ Renderiza <Login />
*/

// ==================== MANEJO DE ERRORES ====================

/*
try {
  const stored = localStorage.getItem("alumno_portal_usuario")
  if (stored) {
    setUsuario(JSON.parse(stored))
  }
} catch (err) {
  // JSON.parse() falla si el contenido no es JSON válido
  console.error("Error al parsear usuario:", err)
  localStorage.removeItem("alumno_portal_usuario")  // Limpiar
}
*/

// ==================== COMPATIBILIDAD NAVEGADOR ====================

/*
localStorage está disponible en:
✅ Chrome, Firefox, Safari, Edge (todos los modernos)
✅ Mobile (iOS Safari, Chrome Mobile)
❌ Navegación privada puede limitarlo
❌ IE antiguo (< IE8)

Límite de espacio:
≈ 5-10 MB por origen (suficiente para un usuario)

Sincronización:
localStorage es LOCAL al navegador/máquina
NO se sincroniza entre máquinas/navegadores
*/

// ==================== DEBUGGING ====================

/*
Ver lo que está en localStorage:
  console.log(localStorage)
  console.log(JSON.parse(localStorage.getItem("alumno_portal_usuario")))

En DevTools (F12):
  Application → Local Storage → http://localhost:5173
  Busca "alumno_portal_usuario"

Limpiar en consola:
  localStorage.clear()
  localStorage.removeItem("alumno_portal_usuario")
*/

// ==================== ALTERNATIVAS ====================

/*
1. sessionStorage (en lugar de localStorage)
   - Se borra al cerrar el navegador
   - Misma API que localStorage
   
2. IndexedDB
   - Para datos más complejos
   - Más espacio (> 50 MB)
   - Más complejo de usar
   
3. Firebase Realtime Database
   - Sincronización en tiempo real
   - Requiere más configuración
   
4. Context API + useState
   - Solo en memoria
   - Se pierde al recargar
*/

export default {};
