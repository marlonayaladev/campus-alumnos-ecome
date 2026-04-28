import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Login({ onLoginSuccess }) {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validar que el código no esté vacío
      if (!codigo.trim()) {
        setError("Por favor ingresa tu código de alumno.");
        setLoading(false);
        return;
      }

      // Query a Firestore: buscar alumno por clave (convertida a mayúsculas)
      const alumnosQuery = query(
        collection(db, "alumnos"),
        where("clave", "==", codigo.toUpperCase())
      );

      const querySnapshot = await getDocs(alumnosQuery);

      // Si no encuentra resultados
      if (querySnapshot.empty) {
        setError("❌ Código no encontrado. Verifica tu clave.");
        setLoading(false);
        return;
      }

      // Si encuentra, obtener el primer documento
      const alumnoData = querySnapshot.docs[0].data();
      const alumnoId = querySnapshot.docs[0].id;

      // Ejecutar callback con los datos del alumno
      onLoginSuccess({
        id: alumnoId,
        ...alumnoData,
      });
    } catch (err) {
      console.error("Error de login:", err);
      setError("Error al conectar con la base de datos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      // 🔥 FIX: Se agregó 'w-100' para obligar a ocupar todo el ancho del #root
      className="min-vh-100 w-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#f0f2f5" }}
    >
      <div className="card shadow-lg" style={{ maxWidth: "450px", width: "100%", margin: "0 auto" }}>
        <div className="card-body p-5">
          {/* LOGO Y TÍTULO */}
          <div className="text-center mb-4">
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎓</div>
            <h2 className="text-primary fw-bold mb-1">ECOME</h2>
            <p className="text-muted small mb-4">Portal de Estudiantes</p>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="codigo" className="form-label fw-semibold mb-2">
                Código de Alumno
              </label>
              <input
                type="text"
                className="form-control form-control-lg border-2"
                id="codigo"
                placeholder="Ej: T-0000 o GE-0000"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                disabled={loading}
                autoFocus
              />
            </div>

            {/* MENSAJE DE ERROR */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                {error}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setError("")}
                  aria-label="Close"
                ></button>
              </div>
            )}

            {/* BOTÓN DE SUBMIT */}
            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 fw-semibold"
              disabled={loading || !codigo.trim()}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Buscando...
                </>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>

          {/* SEPARADOR */}
          <hr className="my-4" />

          {/* INFORMACIÓN ADICIONAL */}
          <p className="text-center text-muted small mb-0">
            <strong>🔒 Seguridad:</strong> Google Authenticator 
            <br />
          </p>
        </div>
      </div>
    </div>
  );
}