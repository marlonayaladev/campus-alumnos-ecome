import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "./firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

// ==================== COMPONENTE TARJETA DE CURSO ====================
function CursoCard({ curso, notas, docenteNombre }) {
  const [expandida, setExpandida] = useState(false);

  const promedio = notas?.promedio || 0;
  const esAprobado = promedio >= 14;
  const colorPromedio = esAprobado ? "success" : "danger";
  const colorTextoPromedio = esAprobado ? "text-success" : "text-danger";

  return (
    <div className="card mb-3 shadow-sm border-0 h-100">
      <div
        className="card-header bg-white d-flex justify-content-between align-items-center"
        onClick={() => setExpandida(!expandida)}
        style={{ cursor: "pointer", borderBottom: "1px solid #e0e0e0" }}
      >
        <div className="flex-grow-1">
          <h5 className="mb-1 text-dark fw-bold">{curso.nombre}</h5>
          <small className="text-muted d-flex align-items-center gap-2">
            <span>👨‍🏫</span>
            <span>{docenteNombre || "Docente no disponible"}</span>
          </small>
        </div>
        <div className="text-end ms-3">
          <div
            className={`badge rounded-pill px-3 py-2 bg-${colorPromedio}`}
            style={{ fontSize: "1.1rem" }}
          >
            {promedio.toFixed(2)}
          </div>
          <small className="text-muted ms-3 d-block mt-2">
            {expandida ? "▼" : "▶"}
          </small>
        </div>
      </div>

      {expandida && (
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-sm table-borderless">
              <tbody>
                <tr>
                  <td className="fw-bold text-muted">Parcial 1 (Ind.)</td>
                  <td className="text-end">
                    <span className="badge bg-info">{(notas?.p1_ind || 0).toFixed(2)}</span>
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold text-muted">Parcial 1 (Gru.)</td>
                  <td className="text-end">
                    <span className="badge bg-info">{(notas?.p1_gru || 0).toFixed(2)}</span>
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold text-muted">Parcial 2 (Ind.)</td>
                  <td className="text-end">
                    <span className="badge bg-warning text-dark">
                      {(notas?.p2_ind || 0).toFixed(2)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold text-muted">Parcial 2 (Gru.)</td>
                  <td className="text-end">
                    <span className="badge bg-warning text-dark">
                      {(notas?.p2_gru || 0).toFixed(2)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold text-muted">Examen Final (Ind.)</td>
                  <td className="text-end">
                    <span className="badge bg-success">{(notas?.ef_ind || 0).toFixed(2)}</span>
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold text-muted">Examen Final (Gru.)</td>
                  <td className="text-end">
                    <span className="badge bg-success">{(notas?.ef_gru || 0).toFixed(2)}</span>
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold text-muted">Actitud</td>
                  <td className="text-end">
                    <span className="badge bg-secondary">{(notas?.act || 0).toFixed(2)}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="alert alert-light border-start border-primary border-4 mt-3 mb-0">
            <strong className="d-block mb-1">Promedio Final</strong>
            <h4 className={`mb-0 ${colorTextoPromedio}`}>
              {promedio.toFixed(2)} {esAprobado ? "✅" : "❌"}
            </h4>
          </div>
        </div>
      )}
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

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        // 1. Obtener los cursosVinculados del alumno
        const cursosVinculados = usuario.cursosVinculados || [];

        if (cursosVinculados.length === 0) {
          setCursos([]);
          setLoading(false);
          return;
        }

        // 2. Obtener datos de todos los cursos
        const cursosData = [];
        const docentesTemp = {};

        for (const cursoId of cursosVinculados) {
          const cursoDocRef = doc(db, "cursos", cursoId);
          const cursoDoc = await getDoc(cursoDocRef);

          if (cursoDoc.exists()) {
            const cursoData = {
              id: cursoId,
              ...cursoDoc.data(),
            };
            cursosData.push(cursoData);

            // 3a. Obtener datos del docente usando docente_id
            if (cursoData.docente_id) {
              const docenteDocRef = doc(db, "usuarios", cursoData.docente_id);
              const docenteDoc = await getDoc(docenteDocRef);

              if (docenteDoc.exists()) {
                docentesTemp[cursoData.docente_id] = docenteDoc.data().nombre;
              }
            }
          }
        }

        // 3b. Obtener notas del alumno
        const notasQuery = query(
          collection(db, "notas"),
          where("alumnoId", "==", usuario.id)
        );
        const notasSnapshot = await getDocs(notasQuery);

        const notasMapTemp = {};
        notasSnapshot.forEach((doc) => {
          notasMapTemp[doc.id] = doc.data();
        });

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
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border mb-3 text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted fw-semibold">Cargando tu información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      {/* HEADER */}
      <div className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
        <div className="container-lg">
          <div className="navbar-brand fw-bold d-flex align-items-center gap-2">
            <div style={{ fontSize: "28px" }}>🎓</div>
            <div>
              <div className="small text-light-emphasis" style={{ opacity: 0.9 }}>
                ECOME
              </div>
              <div className="fw-bold" style={{ fontSize: "1.1rem" }}>
                Portal de Estudiantes
              </div>
            </div>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <button
              className="btn btn-light btn-sm fw-semibold"
              onClick={onLogout}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="container-lg py-5">
        {/* TARJETA DE INFORMACIÓN DEL ALUMNO */}
        <div className="card mb-5 shadow-sm border-0 bg-white">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h3 className="mb-1 text-primary fw-bold">{usuario.nombre}</h3>
                <p className="mb-0 text-muted">
                  <strong>Grado:</strong> {usuario.grado} &nbsp;&nbsp;|&nbsp;&nbsp;
                  <strong>Arma:</strong> {usuario.arma}
                </p>
              </div>
              <div className="col-md-4 text-md-end mt-3 mt-md-0">
                <div className="badge bg-primary rounded-pill px-3 py-2" style={{ fontSize: "0.95rem" }}>
                  📖 {cursos.length} Curso{cursos.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MENSAJES DE ERROR */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            <strong>❌ Error:</strong> {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError("")}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* LISTADO DE CURSOS */}
        {cursos.length === 0 ? (
          <div className="alert alert-info border-0 shadow-sm">
            <strong>ℹ️ Información:</strong> No tienes cursos asignados aún.
          </div>
        ) : (
          <div>
            <h4 className="mb-4 text-dark fw-bold">
              📖 Mis Cursos ({cursos.length})
            </h4>
            <div className="row g-4">
              {cursos.map((curso) => {
                // Buscar las notas para este curso usando la key alumnoId_cursoId
                const notasKey = `${usuario.id}_${curso.id}`;
                const notasCurso = notasMap[notasKey] || {};
                const docenteNombre = docentesMap[curso.docente_id] || "Docente no disponible";

                return (
                  <div key={curso.id} className="col-lg-6 col-xl-4">
                    <CursoCard
                      curso={curso}
                      notas={notasCurso}
                      docenteNombre={docenteNombre}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-5 pt-4 border-top">
          <p className="text-center text-muted small">
            <strong>🔒 Seguridad:</strong> Este es un portal de <strong>solo lectura</strong>.
            No es posible modificar o eliminar calificaciones desde aquí.
          </p>
        </div>
      </div>
    </div>
  );
}
