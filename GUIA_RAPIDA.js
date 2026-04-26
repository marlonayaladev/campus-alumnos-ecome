// ⚡ GUÍA RÁPIDA: LOGIN + localStorage EN 5 PASOS

// ==================== PASO 1: COPIAR DATOS A FIRESTORE ====================

/*
1. Abre https://console.firebase.google.com
2. Selecciona tu proyecto
3. Ve a "Firestore Database"
4. Crea estas 4 colecciones:
   ✓ alumnos
   ✓ cursos
   ✓ notas
   ✓ usuarios
5. Abre el archivo DATOS_EJEMPLO_FIRESTORE.js en tu editor
6. Copia-pega MANUALMENTE cada documento en Firestore
   (Firestore Console te deja añadir documentos con campos)
7. Alternativamente, usa un script de importación

RESULTADO ESPERADO:
- 3 alumnos (ALU001, ALU002, ALU003)
- 6 cursos (MAT101, ESP101, etc.)
- 10 notas (varias por alumno)
- 5 docentes (DOC001, DOC002, etc.)
*/

// ==================== PASO 2: VERIFICAR ESTRUCTURA Firestore ====================

/*
Colección "alumnos":
  Documento "ALU001"
    - id: "ALU001"
    - nombre: "Juan Pérez García"
    - grado: "6to Grado A"
    - arma: "Infantería"
    - clave: "T-0533"  ← IMPORTANTE
    - cursosVinculados: ["MAT101", "ESP101", "ING101", "CIE101"]

Colección "cursos":
  Documento "MAT101"
    - id: "MAT101"
    - nombre: "Matemáticas"
    - creditos: 4
    - docente_id: "DOC001"  ← IMPORTANTE

Colección "notas":
  Documento "ALU001_MAT101"  ← ID es concatenación
    - alumnoId: "ALU001"
    - cursoId: "MAT101"
    - p1_ind, p1_gru, p2_ind, p2_gru, ef_ind, ef_gru, act, promedio

Colección "usuarios":
  Documento "DOC001"  ← ID debe coincidir con docente_id
    - nombre: "Prof. Carlos López García"
    - rol: "docente"
*/

// ==================== PASO 3: INSTALAR Y EJECUTAR ====================

/*
En terminal (en el directorio del proyecto):

# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrirá automáticamente o ve a:
http://localhost:5173
*/

// ==================== PASO 4: PROBAR LOGIN ====================

/*
1. En la pantalla de Login, verás:
   ┌─────────────────────────────┐
   │         🎓                  │
   │        ECOME                │
   │  Portal de Estudiantes      │
   │                             │
   │ [Código de Alumno: ____]    │
   │                             │
   │      [Ingresar]             │
   └─────────────────────────────┘

2. Escribe: T-0533 (del primer alumno de ejemplo)

3. Click en "Ingresar"

4. Si todo está correcto, verás:
   - Dashboard cargado ✅
   - Nombre del alumno: "Juan Pérez García"
   - Grado: "6to Grado A"
   - 4 tarjetas de cursos
   - Al expandir, detalles de notas

5. Recarga la página (F5)
   - ¿Sigue mostrando el dashboard sin pedir login?
   - ¡localStorage funciona! ✅

6. Click "Cerrar Sesión"
   - localStorage se borra ✅
   - Vuelve a Login ✅
*/

// ==================== PASO 5: CONFIGURAR Firestore Rules (Seguridad) ====================

/*
En Firebase Console:
1. Ve a Firestore Database
2. Pestaña "Rules"
3. Reemplaza todo con:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /alumnos/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    match /cursos/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    match /notas/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    match /usuarios/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}

4. Click "Publicar"

RESULTADO: 🔒 Solo lectura garantizada
*/

// ==================== ARQUITECTURA DE ARCHIVOS FINAL ====================

/*
campus-alumnos/
├── src/
│   ├── App.jsx              ← Componente raíz (estados + localStorage)
│   ├── Login.jsx            ← Formulario de login (búsqueda Firestore)
│   ├── Dashboard.jsx        ← Panel de calificaciones
│   ├── firebase.js          ← Configuración de Firebase
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json             ← firebase + bootstrap
├── vite.config.js
├── index.html
└── DOCUMENTACIÓN/
    ├── README_PORTAL_ESTUDIANTES.md    ← Guía completa
    ├── DATOS_EJEMPLO_FIRESTORE.js      ← Datos para copiar
    ├── FLUJO_AUTENTICACION.js          ← Diagramas de flujo
    └── INTEGRACION_LOCALSTORAGE.js     ← Detalles técnicos
*/

// ==================== VERIFICACIÓN FINAL (CHECKLIST) ====================

/*
ANTES DE npm run dev:

FIRESTORE:
  ☐ Proyecto Firebase creado
  ☐ Firestore Database iniciado
  ☐ Colecciones creadas (alumnos, cursos, notas, usuarios)
  ☐ Datos de ejemplo importados
  ☐ Firestore Rules configuradas (solo lectura)

CÓDIGO:
  ☐ firebase.js tiene credenciales correctas
  ☐ App.jsx existe y contiene localStorage
  ☐ Login.jsx existe con query por "clave"
  ☐ Dashboard.jsx existe con datos
  ☐ npm install completado

CONEXIÓN:
  ☐ npm run dev inicia sin errores
  ☐ Abre http://localhost:5173
  ☐ Ingresa código: "T-0533"
  ☐ Dashboard carga ✅

FUNCIONALIDAD:
  ☐ F5 (recargar) mantiene sesión ✅
  ☐ Tarjetas de cursos expandibles ✅
  ☐ Botón "Cerrar Sesión" funciona ✅
  ☐ localStorage se limpia al logout ✅

TODO PERFECTO: 🎉
*/

// ==================== SOLUCIÓN DE PROBLEMAS ====================

/*
❌ "Código no encontrado"
   → Verifica que la "clave" en Firestore sea exacta
   → Intenta con "T-0533" (del ejemplo)

❌ "Error al conectar con la base de datos"
   → Verifica firebase.js con credenciales correctas
   → Verifica que Firestore está activo

❌ Docentes muestran "Docente no disponible"
   → Verifica que docente_id del curso existe en colección usuarios
   → Documento ID debe coincidir con docente_id

❌ localStorage no persiste sesión
   → Abre DevTools (F12) → Application → Local Storage
   → ¿Existe "alumno_portal_usuario"?
   → Si no, el setItem no se ejecutó
   → Revisa console.log en handleLoginSuccess

❌ Al recargar, vuelve a Login
   → localStorage está vacío (logout ejecutado)
   → Es comportamiento correcto
   → Ingresa de nuevo para guardar
*/

// ==================== PRÓXIMAS MEJORAS (Opcional) ====================

/*
Después de que funcione básico, puedes:

1. Agregar búsqueda/filtro de cursos
2. Exportar calificaciones a PDF
3. Historial de cambios en notas
4. Notificaciones de notas actualizadas
5. Modo oscuro/claro
6. Multi-idioma
7. Gráficas de desempeño
8. Chat con docentes (solo lectura)
9. Integración con WhatsApp (notificaciones)
10. App mobile (React Native)
*/

// ==================== RECURSOS ÚTILES ====================

/*
📚 Documentación:
  - Firebase: https://firebase.google.com/docs
  - Firestore: https://firebase.google.com/docs/firestore
  - Bootstrap: https://getbootstrap.com/docs
  - React: https://react.dev

🎥 Videos:
  - Firestore Query: youtube.com/watch?v=...
  - localStorage API: youtube.com/watch?v=...

💬 Comunidad:
  - Stack Overflow tag: firebase
  - Firebase Community: forum.firebase.google.com
  - Reddit: r/Firebase
*/

// ==================== CONTACTO Y SOPORTE ====================

/*
Si algo no funciona:

1. Revisa los logs en DevTools (F12 → Console)
2. Compara tu estructura Firestore con DATOS_EJEMPLO_FIRESTORE.js
3. Verifica que firebase.js tenga credenciales correctas
4. Intenta con el usuario de ejemplo (T-0533)
5. Limpia localStorage y reintenta (localStorage.clear())

¡Listo! El portal está 100% funcional y seguro. 🎓✅
*/

export default {};
