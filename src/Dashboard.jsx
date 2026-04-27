import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "./firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
// Importamos los iconos mágicos de Lucide
import { 
  ShieldCheck, Home, FolderOpen, CalendarDays, Bell, 
  Globe, Library, HeadphonesIcon, LogOut, FileText, 
  Settings, User, CheckCircle2, Circle, Menu 
} from "lucide-react";

// ==================== ESTILOS PERSONALIZADOS ====================
const styles = `
  body { background-color: #f4f6f9; overflow: hidden; font-family: 'Inter', 'Segoe UI', sans-serif; }
  .dashboard-container { display: flex; height: 100vh; width: 100vw; }
  
  /* Sidebar */
  .sidebar { width: 260px; background-color: #162436; color: #94a3b8; display: flex; flex-direction: column; transition: 0.3s; z-index: 1040; }
  .sidebar-header { background-color: #0f172a; padding: 24px 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #1e293b; }
  .menu-item { padding: 14px 24px; cursor: pointer; display: flex; align-items: center; gap: 14px; font-size: 0.85rem; font-weight: 500; transition: all 0.2s; border-left: 3px solid transparent; }
  .menu-item:hover { color: #f8fafc; background-color: #1e293b; }
  .menu-item.active { background-color: #1e293b; color: #ffffff; border-left: 3px solid #3b82f6; font-weight: 600; }
  
  /* Main Content */
  .main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; background-color: #f1f5f9; }
  
  /* Top Header */
  .top-header { background: #ffffff; border-bottom: 1px solid #e2e8f0; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); padding: 12px 30px; display: flex; justify-content: space-between; align-items: center; z-index: 10; }
  .header-title { font-size: 1.25rem; font-weight: 700; color: #0f172a; margin: 0; letter-spacing: 0.5px; }
  
  /* Profile Pill */
  .user-profile { display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 6px 16px; border-radius: 50px; border: 1px solid #e2e8f0; }
  .avatar-circle { width: 36px; height: 36px; border-radius: 50%; background: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; letter-spacing: 1px; }
  
  /* Scrollable Area */
  .content-area { flex: 1; overflow-y: auto; padding: 30px; }
  
  /* Cards */
  .curso-card { border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); background: #ffffff; transition: transform 0.2s, box-shadow 0.2s; }
  .curso-card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border-color: #cbd5e1; }
  .notas-list { list-style: none; padding: 0; margin: 0; font-size: 0.8rem; }
  .notas-list li { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid #f1f5f9; }
  .notas-list li:last-child { border-bottom: none; }
  
  /* Util */
  .text-xs { font-size: 0.75rem; }
  
  @media (max-width: 768px) {
    .sidebar { position: absolute; left: -260px; height: 100%; }
    .sidebar.open { left: 0; box-shadow: 10px 0 15px rgba(0,0,0,0.1); }
    .header-title { font-size: 1rem; }
    .user-profile .user-info { display: none; }
  }
`;

// ==================== GENERADOR DE INICIALES ====================
// Toma el nombre "Ponce Rios Edward" y devuelve "PR"
const getInitials = (name) => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// ==================== COMPONENTE MEDIDOR CIRCULAR ====================
const CircularGauge = ({ valor, maximo = 20 }) => {
  const radio = 32;
  const circunferencia = 2 * Math.PI * radio;
  const porcentaje = (valor / maximo) * 100;
  const offset = circunferencia - (porcentaje / 100) * circunferencia;
  
  const esAprobado = valor >= 14;
  const colorBase = esAprobado ? "#dcfce7" : "#fee2e2";
  const colorProgreso = esAprobado ? "#22c55e" : "#ef4444";
  const colorTexto = esAprobado ? "#166534" : "#991b1b";

  return (
    <div className="d-flex flex-column align-items-center">
      <small className="text-slate-500 fw-bold mb-2 text-center text-xs" style={{ color: "#64748b" }}>
        Promedio<br/>Acumulado
      </small>
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={radio} stroke={colorBase} strokeWidth="6" fill="none" />
        <circle 
          cx="42" cy="42" r={radio} 
          stroke={colorProgreso} strokeWidth="6" fill="none" 
          strokeDasharray={circunferencia} strokeDashoffset={offset} 
          strokeLinecap="round" transform="rotate(-90 42 42)" 
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
        <text x="42" y="48" textAnchor="middle" fontSize="16" fontWeight="800" fill={colorTexto}>
          {valor.toFixed(2)}
        </text>
      </svg>
    </div>
  );
};

// ==================== COMPONENTE TARJETA DE CURSO ====================
function CursoCard({ curso, notas, docenteNombre }) {
  const promedio = notas?.promedio || 0;

  const evaluaciones = [
    { label: "Parcial 1 (Ind)", valor: notas?.p1_ind },
    { label: "Parcial 1 (Gru)", valor: notas?.p1_gru },
    { label: "Parcial 2 (Ind)", valor: notas?.p2_ind },
    { label: "Parcial 2 (Gru)", valor: notas?.p2_gru },
    { label: "Examen Final (Ind)", valor: notas?.ef_ind },
    { label: "Examen Final (Gru)", valor: notas?.ef_gru },
    { label: "Actitud", valor: notas?.act },
  ];

  return (
    <div className="curso-card h-100 p-4">
      {/* Cabecera */}
      <div className="d-flex justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h6 className="fw-bold text-dark mb-1 text-uppercase" style={{ fontSize: "0.95rem" }}>
            {curso.nombre}
          </h6>
          <div className="text-muted text-xs d-flex align-items-center gap-1">
            <User size={12} /> {docenteNombre}
          </div>
        </div>
        <div className="text-primary d-flex align-items-center gap-1" style={{ fontSize: "0.75rem", cursor: "pointer", fontWeight: "600" }}>
          <FileText size={14} /> Silabo
        </div>
      </div>

      <div className="row g-0">
        {/* Columna Izquierda: Gauge */}
        <div className="col-4 d-flex flex-column align-items-center justify-content-start border-end pe-3">
          <CircularGauge valor={promedio} maximo={20} />
          <button className="btn btn-link btn-sm text-decoration-none text-primary mt-3 p-0 text-xs fw-medium">
            Ver Detalle
          </button>
        </div>

        {/* Columna Derecha: Notas */}
        <div className="col-8 ps-3">
          <div className="d-flex justify-content-between align-items-center mb-2 bg-slate-50 px-2 py-1 rounded" style={{ backgroundColor: "#f8fafc" }}>
            <span className="fw-bold text-slate-700 text-xs" style={{ color: "#334155" }}>Calificaciones</span>
            <Settings size={14} className="text-muted" />
          </div>
          
          <ul className="notas-list">
            {evaluaciones.map((evaluacion, index) => {
              const valor = evaluacion.valor || 0;
              const estaCalificado = valor > 0;
              return (
                <li key={index}>
                  <span className="d-flex align-items-center gap-2 text-muted" style={{ color: "#475569" }}>
                    {estaCalificado ? (
                      <CheckCircle2 size={12} color="#22c55e" />
                    ) : (
                      <Circle size={12} color="#cbd5e1" />
                    )}
                    {evaluacion.label}
                  </span>
                  <div className="text-end">
                    <span className="fw-bold me-2 text-dark">{valor.toFixed(2)}</span>
                    <span className={estaCalificado ? "text-success text-xs" : "text-muted text-xs"}>
                      {estaCalificado ? "Calificado" : "Pendiente"}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ==================== COMPONENTE DASHBOARD ====================
export default function Dashboard({ usuario, onLogout }) {
  const [cursos, setCursos] = useState([]);
  const [docentesMap, setDocentesMap] = useState({});
  const [notasMap, setNotasMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lógica original de Firebase
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const cursosVinculados = usuario.cursosVinculados || [];

        if (cursosVinculados.length === 0) {
          setCursos([]);
          setLoading(false);
          return;
        }

        const cursosData = [];
        const docentesTemp = {};

        for (const cursoId of cursosVinculados) {
          const cursoDocRef = doc(db, "cursos", cursoId);
          const cursoDoc = await getDoc(cursoDocRef);

          if (cursoDoc.exists()) {
            const cursoData = { id: cursoId, ...cursoDoc.data() };
            cursosData.push(cursoData);

            if (cursoData.docente_id) {
              const docenteDocRef = doc(db, "usuarios", cursoData.docente_id);
              const docenteDoc = await getDoc(docenteDocRef);
              if (docenteDoc.exists()) docentesTemp[cursoData.docente_id] = docenteDoc.data().nombre;
            }
          }
        }

        const notasQuery = query(collection(db, "notas"), where("alumnoId", "==", usuario.id));
        const notasSnapshot = await getDocs(notasQuery);
        const notasMapTemp = {};
        notasSnapshot.forEach((doc) => { notasMapTemp[doc.id] = doc.data(); });

        setCursos(cursosData);
        setDocentesMap(docentesTemp);
        setNotasMap(notasMapTemp);
        setError("");
      } catch (err) {
        setError("Error al cargar datos: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [usuario]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center bg-light" style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 9999 }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  // Definición del Menú para evitar repetir HTML
  const menuItems = [
    { icon: Home, label: "Inicio" },
    { icon: FolderOpen, label: "Mis Cursos", active: true },
    { icon: CalendarDays, label: "Calendario" },
    { icon: Bell, label: "Notificaciones" },
    { icon: Globe, label: "Recursos" },
    { icon: Library, label: "Biblioteca" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        
        {/* ==================== SIDEBAR ==================== */}
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <ShieldCheck size={36} className="text-primary" />
            <div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: '600', letterSpacing: '0.5px' }}>ESCUELA DE COMUNICACIONES</div>
              <div className="fw-bold text-white fs-5" style={{ letterSpacing: '1px' }}>ECOME</div>
            </div>
          </div>
          
          <div className="mt-4 flex-grow-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className={`menu-item ${item.active ? 'active' : ''}`}>
                  <Icon size={20} />
                  {item.label}
                </div>
              );
            })}
          </div>

          <div className="menu-item border-top pt-4 mb-4" style={{ borderColor: '#1e293b' }}>
            <HeadphonesIcon size={20} /> Soporte
          </div>
        </div>

        {/* ==================== CONTENIDO PRINCIPAL ==================== */}
        <div className="main-content">
          
          {/* TOP HEADER */}
          <header className="top-header">
            <div className="d-flex align-items-center">
              <button className="btn btn-sm btn-light d-md-none me-3 border-0 shadow-sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <Menu size={20} />
              </button>
              <h1 className="header-title d-none d-md-block text-slate-800">PORTAL DEL OFICIAL ALUMNO</h1>
            </div>
            
            {/* Perfil de Usuario */}
            <div className="user-profile shadow-sm">
              <div className="text-end user-info">
                <div className="fw-bold text-dark text-uppercase" style={{ fontSize: '0.8rem' }}>
                  {usuario.grado || 'TTE.'} {usuario.nombre}
                </div>
                <div className="text-muted" style={{ fontSize: '0.65rem', fontWeight: '500' }}>
                  {usuario.arma || 'COMUNICACIONES'} | COD: {usuario.id.slice(0,6).toUpperCase()}
                </div>
              </div>
              <div className="avatar-circle">
                {getInitials(usuario.nombre)}
              </div>
              <button 
                className="btn btn-sm btn-link text-danger ms-1 p-1" 
                onClick={onLogout} 
                title="Cerrar Sesión"
                style={{ textDecoration: 'none' }}
              >
                <LogOut size={18} />
              </button>
            </div>
          </header>

          {/* ÁREA DE SCROLL CON TARJETAS */}
          <main className="content-area">
            {error && <div className="alert alert-danger shadow-sm border-0">{error}</div>}

            <div className="d-flex align-items-center mb-4 p-3 rounded shadow-sm bg-white" style={{ borderLeft: "4px solid #3b82f6" }}>
              <FileText className="text-primary me-3" size={24} />
              <h5 className="mb-0 text-dark fw-bold" style={{ letterSpacing: '-0.3px' }}>
                MIS ASIGNATURAS <span className="fw-normal text-muted mx-2"></span> 
                <span className="fw-medium text-secondary" style={{ fontSize: '0.9rem' }}></span>
              </h5>
            </div>

            {cursos.length === 0 ? (
              <div className="alert alert-info shadow-sm bg-white border-0 d-flex align-items-center gap-2">
                 <FolderOpen size={20}/> No tienes cursos asignados aún.
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                {cursos.map((curso) => {
                  const notasKey = `${usuario.id}_${curso.id}`;
                  const notasCurso = notasMap[notasKey] || {};
                  const docenteNombre = docentesMap[curso.docente_id] || "No asignado";

                  return (
                    <div key={curso.id} className="col">
                      <CursoCard curso={curso} notas={notasCurso} docenteNombre={docenteNombre} />
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}