// 🔐 FLUJO DE AUTENTICACIÓN - Portal de Estudiantes ECOME

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                    SIN FIREBASE AUTH ✅                                 │
 * │              (Solo Firestore Query + localStorage)                      │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

// ==================== FLUJO INICIAL: App.jsx ====================

/*
┌─────────────────────┐
│   App.jsx monta     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────┐
│  useEffect → Cargar usuario     │
│  localStorage                   │
└──────────┬──────────────────────┘
           │
           ├─────────────────────────────────┐
           │                                 │
    SI existe usuario           NO existe usuario
           │                                 │
           ▼                                 ▼
    ┌──────────────┐        ┌────────────────────┐
    │ Dashboard ✅ │        │  Login.jsx render  │
    │ (data loaded)│        │  (empty form)      │
    └──────────────┘        └────────────────────┘
*/

// ==================== FLUJO DE LOGIN: Login.jsx ====================

/*
┌──────────────────────────┐
│  Usuario escribe código  │
│  (Ej: T-0533)            │
└──────────┬───────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  Click en "Ingresar"                 │
│  handleSubmit(e) llamado             │
└──────────┬──────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│  QUERY a Firestore:                      │
│  query(                                  │
│    collection(db, "alumnos"),            │
│    where("clave", "==", "T-0533")        │
│  )                                       │
│  getDocs(query)                          │
└──────────┬───────────────────────────────┘
           │
           ├─────────────────────────────────────┐
           │                                     │
     Documento ENCONTRADO           Documento NO ENCONTRADO
           │                                     │
           ▼                                     ▼
     ┌──────────────────────┐    ┌─────────────────────────┐
     │ snapshot.docs[0]     │    │ Mostrar error:          │
     │ EXISTE ✅            │    │ "❌ Código no encontrado│
     │                      │    │ Verifica tu clave."     │
     └──────────┬───────────┘    │ setLoading(false)       │
                │                └─────────────────────────┘
                ▼
     ┌────────────────────────────┐
     │ Extraer alumnoData:        │
     │ {                          │
     │   id: "ALU001",            │
     │   nombre: "Juan Pérez",    │
     │   grado: "6to Grado",      │
     │   arma: "Infantería",      │
     │   clave: "T-0533",         │
     │   cursosVinculados: [...]  │
     │ }                          │
     └──────────┬─────────────────┘
                │
                ▼
     ┌─────────────────────────────────────┐
     │ onLoginSuccess(alumnoData)          │
     │ (callback a App.jsx)                │
     └──────────┬────────────────────────┘
                │
                ▼
     ┌──────────────────────────────────────────┐
     │ handleLoginSuccess en App.jsx:           │
     │ 1. localStorage.setItem(...)            │
     │ 2. setUsuario(alumnoData)               │
     └──────────┬───────────────────────────────┘
                │
                ▼
     ┌──────────────────────────┐
     │ App.jsx re-renderiza     │
     │ usuario !== null → true  │
     └──────────┬───────────────┘
                │
                ▼
     ┌──────────────────────────┐
     │ <Dashboard /> renderizado│
     │ (con alumnoData)         │
     └──────────────────────────┘
*/

// ==================== FLUJO DE LOGOUT: Dashboard.jsx ====================

/*
┌──────────────────────────────┐
│  Usuario click "Cerrar Sesión"
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  handleLogout()              │
│  - localStorage.removeItem() │
│  - setUsuario(null)          │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  App.jsx re-renderiza        │
│  usuario === null → true     │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  <Login /> renderizado       │
│  (vacío, listo para nuevo)   │
└──────────────────────────────┘
*/

// ==================== localStorage ESTRUCTURA ====================

/*
ANTES DE LOGIN:
localStorage = {}

DESPUÉS DE LOGIN (en handleLoginSuccess):
localStorage = {
  "alumno_portal_usuario": '{"id":"ALU001","nombre":"Juan Pérez","grado":"6to Grado","arma":"Infantería","clave":"T-0533","cursosVinculados":["MAT101","ESP101","ING101","CIE101"]}'
}

AL RECARGAR LA PÁGINA:
1. App.jsx monta
2. useEffect lee localStorage
3. Si existe → JSON.parse y setUsuario
4. Dashboard carga automáticamente
5. NO se pierde la sesión ✅

AL LOGOUT:
1. localStorage.removeItem("alumno_portal_usuario")
2. localStorage queda vacío
3. setUsuario(null)
4. Vuelve a Login.jsx
*/

// ==================== COMPARATIVA: Firebase Auth vs Firestore Query ====================

/*
┌────────────────────┬──────────────────────────────┬──────────────────────────────┐
│ Aspecto            │ Firebase Auth                │ Firestore Query (Este código)│
├────────────────────┼──────────────────────────────┼──────────────────────────────┤
│ Método             │ signInWithEmailAndPassword() │ query + getDocs()            │
│ Requiere email?    │ SÍ, completo + password      │ NO, solo el código (clave)  │
│ Token JWT?         │ SÍ, generado automático      │ NO, sin autenticación       │
│ Security Rules     │ Integradas                   │ Deben configurarse           │
│ Recargar página    │ Sesión se mantiene           │ localStorage lo mantiene    │
│ Complejidad        │ Media-Alta                   │ Simple                      │
│ Configuración      │ Más pasos                    │ Mínima                      │
│ Google Auth        │ Disponible                   │ NO                          │
│ 2FA                │ Disponible                   │ NO                          │
│ Recuperar password │ Automático                   │ Manual                      │
└────────────────────┴──────────────────────────────┴──────────────────────────────┘

✅ Para este caso: Firestore Query es más apropiada (simple, directa, sin auth)
❌ Si necesitas seguridad avanzada: Usa Firebase Auth + Firestore
*/

// ==================== SEGURIDAD: Firestore Rules ====================

/*
Para asegurar que SOLO se lea (no se escriba):

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Cualquiera puede leer alumnos (pero en producción, restringir)
    match /alumnos/{document=**} {
      allow read: if true;
      allow write: if false;  // Bloquear escritura ✅
    }
    
    match /cursos/{document=**} {
      allow read: if true;
      allow write: if false;  // Bloquear escritura ✅
    }
    
    match /notas/{document=**} {
      allow read: if true;
      allow write: if false;  // Bloquear escritura ✅
    }
    
    match /usuarios/{document=**} {
      allow read: if true;
      allow write: if false;  // Bloquear escritura ✅
    }
  }
}

NOTA: En producción, considera restringir con request.auth:
  allow read: if request.auth != null;
*/

// ==================== FLUJO COMPLETO DE DATOS ====================

/*
1. INICIO
   App monta
   └─ localStorage vacío → Login.jsx

2. LOGIN
   Usuario ingresa "T-0533"
   └─ getDocs(where("clave", "==", "T-0533"))
      └─ Encuentra alumno
         └─ localStorage.setItem + setUsuario

3. DASHBOARD CARGA
   useEffect en Dashboard
   └─ Lee usuario.cursosVinculados: ["MAT101", "ESP101", ...]
      ├─ Por cada cursoId
      │  ├─ getDoc(cursos/MAT101) → Nombre del curso
      │  ├─ getDoc(usuarios/DOC001) → Nombre del docente
      │  └─ getDocs(where("alumnoId", "==", "ALU001")) → Notas
      │
      └─ Renderiza CursoCard x 4

4. DISPLAY
   Grid de tarjetas
   └─ Click → Expandir → Ver detalles

5. LOGOUT
   Usuario click "Cerrar Sesión"
   └─ localStorage.removeItem + setUsuario(null)
      └─ Vuelve a Login.jsx

6. RECARGAR PÁGINA
   App monta
   └─ localStorage tiene datos
      └─ Carga usuario automáticamente
         └─ Dashboard se ve directamente ✅
*/

// ==================== DIFERENCIAS: DOCUMENT ID vs CLAVE ====================

/*
En Firestore, cada documento tiene dos identificadores:

1. Document ID (generado por Firestore)
   ├─ Visible en la UI de Firestore
   ├─ Ej: "ALU001", "T-0533", etc.
   └─ Se usa en: doc(db, "alumnos", "ALU001")

2. Campo "clave" (dentro del documento)
   ├─ Es un campo como cualquier otro
   ├─ Ej: { clave: "T-0533", nombre: "Juan" }
   └─ Se usa en: where("clave", "==", "T-0533")

EN ESTE CÓDIGO:
✅ Buscamos por el campo "clave" (where clause)
✅ Devuelve el Document ID en querySnapshot.docs[0].id
✅ Guardamos ambos en el estado del usuario
*/

// ==================== CHECKLIST DE CONFIGURACIÓN ====================

/*
ANTES DE EJECUTAR npm run dev:

☐ 1. Firebase configurado (firebase.js con credenciales)
☐ 2. Firestore Database creada
☐ 3. Colecciones creadas:
     ☐ alumnos (con campo "clave")
     ☐ cursos (con campo "docente_id")
     ☐ notas (con structure ${alumnoId}_${cursoId})
     ☐ usuarios (con Document ID = docente_id)
☐ 4. Datos de prueba importados
☐ 5. Firestore Rules configuradas (solo read)
☐ 6. Dependencias instaladas: npm install
☐ 7. No hay errores en Login.jsx, Dashboard.jsx, App.jsx

LUEGO:
npm run dev
→ Acceder a http://localhost:5173
→ Ingresar código de alumno
→ Ver dashboard
*/

export default {};
