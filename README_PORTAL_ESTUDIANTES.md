# 🎓 Portal de Estudiantes ECOME

Portal de solo lectura para que los estudiantes consulten sus calificaciones desde la base de datos Firestore.

---

## 📁 Estructura de Archivos

```
src/
├── App.jsx              ← Componente raíz (maneja Login/Dashboard + localStorage)
├── Login.jsx            ← Formulario de login (búsqueda por clave)
├── Dashboard.jsx        ← Panel de calificaciones
├── firebase.js          ← Configuración de Firebase
└── App.css
```

---

## 🔑 Flujo de Autenticación

### **SIN Firebase Auth** ✅
- No usa email/password de Firebase Auth
- No usa Google Sign-in
- **Solo busca directamente en Firestore**

### **Proceso de Login:**

1. El estudiante ingresa su **Código de Alumno** (clave)
   - Ejemplo: `T-0533` o `GE-0924`

2. Login.jsx hace un query a Firestore:
   ```javascript
   query(collection(db, "alumnos"), where("clave", "==", codigoIngresado.toUpperCase()))
   ```

3. Si encuentra el documento:
   - Extrae los datos del alumno
   - Guarda en `localStorage` con clave `alumno_portal_usuario`
   - Renderiza el Dashboard

4. Si no encuentra:
   - Muestra error: "❌ Código no encontrado. Verifica tu clave."

---

## 💾 localStorage

El usuario se persiste en localStorage bajo la clave: **`alumno_portal_usuario`**

```javascript
// Guardar (Login.jsx → App.jsx)
localStorage.setItem("alumno_portal_usuario", JSON.stringify(usuarioData))

// Cargar (App.jsx en useEffect)
const usuarioGuardado = localStorage.getItem("alumno_portal_usuario")

// Eliminar (Logout)
localStorage.removeItem("alumno_portal_usuario")
```

**Beneficio:** El estudiante no pierde la sesión al recargar la página.

---

## 📊 Estructura Firestore Requerida

### **Colección: `alumnos`**
```javascript
{
  id: "ALU001",
  nombre: "Juan Pérez García",
  grado: "6to Grado A",
  arma: "Infantería",
  clave: "T-0533",  // ← Campo de búsqueda
  cursosVinculados: ["MAT101", "ESP101", "ING101"]
}
```

### **Colección: `cursos`**
```javascript
{
  id: "MAT101",
  nombre: "Matemáticas",
  creditos: 4,
  docente_id: "DOC001"
}
```

### **Colección: `notas`**
- Document ID: `${alumnoId}_${cursoId}` (Ej: `ALU001_MAT101`)
```javascript
{
  alumnoId: "ALU001",
  cursoId: "MAT101",
  p1_ind: 8.5,   // Parcial 1 Individual
  p1_gru: 9.0,   // Parcial 1 Grupal
  p2_ind: 7.8,   // Parcial 2 Individual
  p2_gru: 8.5,   // Parcial 2 Grupal
  ef_ind: 8.2,   // Examen Final Individual
  ef_gru: 9.1,   // Examen Final Grupal
  act: 8.0,      // Actitud
  promedio: 8.5  // Promedio Final
}
```

### **Colección: `usuarios`**
- Document ID: Debe coincidir con `docente_id` (Ej: `DOC001`)
```javascript
{
  nombre: "Prof. Carlos López",
  rol: "docente"
}
```

---

## 🚀 Ejecutar el Proyecto

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en modo desarrollo
npm run dev

# 3. Abrir en navegador
# http://localhost:5173
```

---

## 🎯 Flujo de Componentes

```
App.jsx
├─ useEffect: Cargar usuario desde localStorage
│
├─ Si usuario === null
│  └─ Renderizar <Login onLoginSuccess={handleLoginSuccess} />
│     └─ Login.jsx
│        └─ Query a Firestore por clave
│           └─ Si OK: handleLoginSuccess → localStorage + setUsuario
│           └─ Si ERROR: mostrar mensaje
│
└─ Si usuario !== null
   └─ Renderizar <Dashboard usuario={usuario} onLogout={handleLogout} />
      └─ Dashboard.jsx
         ├─ useEffect: Fetch cursos + docentes + notas
         └─ Mostrar tarjetas expandibles con calificaciones
            └─ CursoCard.jsx
```

---

## 🎨 Características de UI

### **Login.jsx**
- 🎓 Logo ECOME
- 📝 Input único para código de alumno
- ✅ Validación en tiempo real
- ⏳ Estado de loading mientras busca
- ❌ Mensajes de error amigables

### **Dashboard.jsx**
- 📌 Header sticky con nombre del alumno
- 🎯 Grid responsivo de cursos (móvil, tablet, desktop)
- 📚 Cada card muestra:
  - Nombre del curso
  - Profesor asignado (👨‍🏫)
  - Promedio final (🟢 Verde ≥14 | 🔴 Rojo <14)
- 🔽 Click para expandir y ver detalles de notas

---

## 🔒 Seguridad

✅ **100% Solo Lectura**
- Sin inputs de edición
- Sin botones para modificar
- Sin acceso a CRUD (Create, Update, Delete)
- Firestore Rules deben permitir solo `read`

### **Reglas de Firestore Recomendadas:**
```
match /alumnos/{document=**} {
  allow read: if true;  // O: request.auth != null
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
```

---

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| "Código no encontrado" | Verifica que la `clave` en Firestore coincida exactamente con lo ingresado (mayúsculas/minúsculas) |
| "Docente no disponible" | Asegúrate que `docente_id` del curso existe como Document ID en colección `usuarios` |
| Usuario se cierra al recargar | Implementar localStorage (ya incluido en App.jsx) |
| Errores de Firestore | Verifica las Firestore Rules permitan `read` a las colecciones |

---

## 📦 Dependencias

```json
{
  "react": "^19.2.5",
  "react-dom": "^19.2.5",
  "firebase": "^10.14.0",
  "bootstrap": "^5.3.0"
}
```

---

## 📝 Notas Importantes

1. **Sin Email/Password:** El sistema NO usa Firebase Auth, solo Firestore queries
2. **localStorage:** Automáticamente persiste la sesión
3. **CORS:** Firebase está configurado en `firebase.js`
4. **Responsive:** Funciona en mobile, tablet y desktop
5. **Read-Only:** No hay forma de modificar datos desde el frontend

---

## 💡 Personalización

Para cambiar estilos, edita:
- **Colores:** Modifica las clases de Bootstrap en Login.jsx y Dashboard.jsx
- **Textos:** Edita los strings en los componentes
- **Logo:** Cambia el emoji 🎓 por tu logo

---

**¡Listo para usar!** 🚀
