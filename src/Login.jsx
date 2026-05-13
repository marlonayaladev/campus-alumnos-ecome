import { signInAnonymously } from "firebase/auth";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { db, auth } from "./firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

// ─── ESTILOS ────────────────────────────────────────────────────────────────
const loginStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

  .login-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    font-family: 'Inter', sans-serif;
    z-index: 9999;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    box-shadow: 0 25px 50px -12px rgba(30, 64, 175, 0.15);
    width: 100%;
    max-width: 440px;
    padding: 35px;
    border: 1px solid rgba(30, 64, 175, 0.1);
  }

  .logo-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 25px;
    padding-bottom: 25px;
    border-bottom: 2px solid #e5e7eb;
  }

  .custom-input {
    height: 55px;
    font-size: 1.15rem;
    border-radius: 12px;
    border: 2px solid #e5e7eb;
    text-align: center;
    font-weight: 600;
    letter-spacing: 2px;
    color: #111827;
    transition: all 0.3s ease;
    background: #f8fafc;
    width: 100%;
    outline: none;
  }

  .custom-input:focus {
    border-color: #1e40af;
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(30, 64, 175, 0.15);
  }

  .btn-premium {
    height: 55px;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 1px;
    background: #1e40af;
    color: white;
    border: none;
    transition: all 0.3s;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
  }

  .btn-premium:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(30, 64, 175, 0.3);
  }

  .btn-premium:disabled { background: #6b7280; cursor: not-allowed; }

  .icon-circle {
    width: 70px;
    height: 70px;
    background: #dbeafe;
    color: #1e40af;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    margin: 0 auto 15px;
  }

  .help-text { color: #6b7280; font-size: 0.85rem; line-height: 1.5; }

  .qr-container {
    background: white;
    padding: 10px;
    border-radius: 16px;
    display: inline-block;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    border: 1px solid #e5e7eb;
  }

  .alert-box {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 0.875rem;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

// ─── COMPONENTE ──────────────────────────────────────────────────────────────
export default function Login({ onLoginSuccess }) {
  const [codigo, setCodigo]         = useState("");
  const [paso, setPaso]             = useState("IDENTIFICACION");
  const [token, setToken]           = useState("");
  const [qrUrl, setQrUrl]           = useState("");
  const [secretoTemp, setSecretoTemp] = useState("");
  const [alumnoRef, setAlumnoRef]   = useState(null); // referencia doc Firestore
  const [alumnoData, setAlumnoData] = useState(null); // datos del alumno
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  // ── PASO 1: Buscar alumno por código ────────────────────────────────────
  const buscarAlumno = async () => {
    if (!codigo.trim()) return;
    setError("");
    setLoading(true);

    try {
      await signInAnonymously(auth);

      const q = query(
        collection(db, "alumnos"),
        where("clave", "==", codigo.toUpperCase())
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setError("❌ Código no encontrado. Verifica tu clave.");
        setLoading(false);
        return;
      }

      const docSnap  = snap.docs[0];
      const data     = docSnap.data();
      const ref      = doc(db, "alumnos", docSnap.id);

      setAlumnoRef(ref);
      setAlumnoData({ id: docSnap.id, ...data });

      if (data.secreto_2fa && data.secreto_2fa.trim() !== "") {
        setSecretoTemp(data.secreto_2fa);
        setPaso("VERIFICAR");
      } else {
        await generarSecreto(data.nombre || codigo.toUpperCase(), docSnap.id);
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor.");
    }

    setLoading(false);
  };

  // ── Generar secreto TOTP y QR ────────────────────────────────────────────
  const generarSecreto = async (nombre, id) => {
    const secret = new OTPAuth.Secret({ size: 20 });
    const totp = new OTPAuth.TOTP({
      issuer: "CAMPUS ECOME",
      label: `${id}`,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret,
    });
    const urlImagen = await QRCode.toDataURL(totp.toString(), {
      width: 180, margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
    });
    setSecretoTemp(secret.base32);
    setQrUrl(urlImagen);
    setPaso("VINCULAR");
  };

  // ── PASO 2/3: Verificar código OTP ──────────────────────────────────────
  const verificarCodigo = async () => {
    const tokenLimpio = token.replace(/\s/g, "");
    if (tokenLimpio.length !== 6) return;
    setError("");

    const totp = new OTPAuth.TOTP({
      algorithm: "SHA1", digits: 6, period: 30,
      secret: OTPAuth.Secret.fromBase32(secretoTemp),
    });

    const delta = totp.validate({ token: tokenLimpio, window: 6 });

    if (delta !== null) {
      setLoading(true);
      try {
        // Si estaba vinculando, guardar secreto en Firestore
        if (paso === "VINCULAR") {
          await updateDoc(alumnoRef, { secreto_2fa: secretoTemp });
        }
        onLoginSuccess(alumnoData);
      } catch (err) {
        console.error(err);
        setError("Error al guardar vinculación: " + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setError("❌ Código incorrecto o expirado. Intenta de nuevo.");
      setToken("");
    }
  };

  // ── Resetear QR ──────────────────────────────────────────────────────────
  const resetearQR = async () => {
    if (!window.confirm("⚠️ ¿Perdiste acceso a tu Authenticator? Se generará un nuevo QR.")) return;
    try {
      await updateDoc(alumnoRef, { secreto_2fa: "" });
      setToken("");
      await generarSecreto(alumnoData?.nombre || codigo, alumnoData?.id || codigo);
    } catch (err) {
      setError("Error al resetear: " + err.message);
    }
  };

  const volverInicio = () => {
    setPaso("IDENTIFICACION");
    setToken("");
    setCodigo("");
    setError("");
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{loginStyles}</style>
      <div className="login-wrapper">
        <div className="glass-card text-center">

          {/* ── PASO: IDENTIFICACION ── */}
          {paso === "IDENTIFICACION" && (
            <div>
              <div className="logo-area">
                <img
                  src="/logo.svg"
                  alt="ECOME"
                  style={{ width: "160px", height: "auto", marginBottom: "8px" }}
                  onError={(e) => e.target.style.display = "none"}
                />
                <h2 className="fw-bold text-primary mb-0" style={{ fontSize: "1.4rem" }}>CAMPUS ECOME</h2>
                <p className="text-muted small mb-0">Portal de Estudiantes</p>
              </div>

              <h5 className="fw-bold text-dark mb-1">ACCESO RESTRINGIDO</h5>
              <p className="help-text mb-4">
                Ingresa el código de alumno que te asignó tu docente.
              </p>

              {error && <div className="alert-box"><span>{error}</span></div>}

              <input
                type="text"
                className="custom-input mb-4"
                placeholder="Ej: T-0000 o GE-0000"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && buscarAlumno()}
                autoFocus
              />

              <button className="btn-premium" onClick={buscarAlumno} disabled={loading || !codigo.trim()}>
                {loading
                  ? <span className="spinner-border spinner-border-sm" />
                  : <><i className="bi bi-box-arrow-in-right fs-5" /> INGRESAR</>
                }
              </button>
            </div>
          )}

          {/* ── PASO: VINCULAR (primer ingreso → escanear QR) ── */}
          {paso === "VINCULAR" && (
            <div>
              <div className="icon-circle"><i className="bi bi-qr-code" /></div>
              <h4 className="fw-bold text-dark mb-2">Vincular Google Authenticator</h4>
              <p className="help-text text-start bg-light p-3 rounded-3 mb-3 border">
                <strong>1.</strong> Instala <strong>Google Authenticator</strong> en tu celular.<br />
                <strong>2.</strong> Toca el <strong>+</strong> y escanea el código QR de abajo.<br />
                <strong>3.</strong> Ingresa el código de 6 dígitos que te genera la app.
              </p>

              <div className="qr-container">
                <img src={qrUrl} alt="QR Code" style={{ width: "180px", height: "180px", display: "block" }} />
              </div>

              {error && <div className="alert-box"><span>{error}</span></div>}

              <input
                type="number"
                className="custom-input mb-3"
                placeholder="000000"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  if (e.target.value.length === 6) verificarCodigo();
                }}
                autoFocus
              />

              <button className="btn-premium mb-3" onClick={verificarCodigo} disabled={loading}>
                {loading
                  ? <span className="spinner-border spinner-border-sm" />
                  : <><i className="bi bi-check-circle-fill fs-5" /> VERIFICAR Y ENTRAR</>
                }
              </button>

              <button
                className="btn btn-link text-muted text-decoration-none fw-bold p-0 small d-block mx-auto"
                onClick={volverInicio}
              >
                <i className="bi bi-arrow-left" /> Volver
              </button>
            </div>
          )}

          {/* ── PASO: VERIFICAR (ya tiene OTP vinculado) ── */}
          {paso === "VERIFICAR" && (
            <div>
              <div className="icon-circle"><i className="bi bi-shield-lock-fill" /></div>
              <h4 className="fw-bold text-dark mb-1">Verificación 2FA</h4>
              <p className="help-text mb-4">
                Abre <strong>Google Authenticator</strong> e ingresa el código de 6 dígitos.
              </p>

              {error && <div className="alert-box"><span>{error}</span></div>}

              <input
                type="number"
                className="custom-input mb-4"
                placeholder="• • • • • •"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  if (e.target.value.length === 6) verificarCodigo();
                }}
                onKeyDown={(e) => e.key === "Enter" && verificarCodigo()}
                autoFocus
              />

              <button className="btn-premium mb-4" onClick={verificarCodigo} disabled={loading}>
                {loading
                  ? <span className="spinner-border spinner-border-sm" />
                  : <><i className="bi bi-check-circle-fill fs-5" /> VALIDAR ACCESO</>
                }
              </button>

              <div className="d-flex justify-content-between align-items-center border-top pt-3">
                <button
                  className="btn btn-link text-muted text-decoration-none fw-bold p-0 small"
                  onClick={volverInicio}
                >
                  <i className="bi bi-arrow-left" /> Volver
                </button>
                <button
                  className="btn btn-link text-danger text-decoration-none fw-bold p-0 small"
                  onClick={resetearQR}
                >
                  <i className="bi bi-arrow-clockwise" /> Perdí mi Authenticator
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}