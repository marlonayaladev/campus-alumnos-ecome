# 📚 Portal de Alumnos - Guía de Configuración

## ✅ Requisitos Firestore

Tu base de datos Firestore debe tener la siguiente estructura:

### 1. **Colección: `alumnos`**
```javascript
{
  id: "ALU001",
  nombre: "Juan Pérez",
  grado: "6to Grado",
  arma: "Infantería",
  clave: "T-0533",  // ← Extraído del email antes del @
  cursosVinculados: ["MAT101", "ESP101", "ING101"]
}
```

### 2. **Colección: `cursos`**
```javascript
{
  id: "MAT101",
  nombre: "Matemáticas",
  creditos: 4,
  docente_id: "DOC001"  // ← Debe coincidir con el ID del documento en usuarios
}
```

### 3. **Colección: `notas`**
- **Document ID:** `${alumno.id}_${curso.id}` (Ej: `ALU001_MAT101`)
```javascript
{
  alumnoId: "ALU001",
  cursoId: "MAT101",
  p1_ind: 8.5,      // Parcial 1 Individual
  p1_gru: 9.0,      // Parcial 1 Grupal
  p2_ind: 7.8,      // Parcial 2 Individual
  p2_gru: 8.5,      // Parcial 2 Grupal
  ef_ind: 8.2,      // Examen Final Individual
  ef_gru: 9.1,      // Examen Final Grupal
  act: 8.0,         // Actitud
  promedio: 8.4     // Promedio Final
}
```

### 4. **Colección: `usuarios`**
- **Document ID:** Debe ser igual al `docente_id` del curso (Ej: `DOC001`)
```javascript
{
  nombre: "Prof. Carlos López",
  rol: "docente"  // O "admin"
}
```

---

## 🚀 Pasos para Ejecutar

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

3. **Ingresar al portal:**
   - Email: `T-0533@ecome.com` (cambiar con tus datos reales)
   - Password: (tu contraseña registrada en Firebase Auth)

---

## 🔒 Seguridad

✅ **100% Solo Lectura**: No hay inputs de edición, ni botones de eliminar o actualizar  
✅ **Firebase Auth**: Protegido con email/password  
✅ **Firestore Rules**: (Asegúrate de configurar reglas de seguridad en Firestore)

### Reglas de Firestore Recomendadas:
```
match /alumnos/{document=**} {
  allow read: if request.auth != null;
  allow write: if false;
}
match /cursos/{document=**} {
  allow read: if request.auth != null;
  allow write: if false;
}
match /notas/{document=**} {
  allow read: if request.auth != null;
  allow write: if false;
}
match /usuarios/{document=**} {
  allow read: if request.auth != null;
  allow write: if false;
}
```

---

## 📋 Estructura de Datos Resume

| Colección | Document ID | Campos |
|-----------|-------------|--------|
| **alumnos** | Cualquiera (Ej: ALU001) | id, nombre, grado, arma, **clave**, cursosVinculados |
| **cursos** | Cualquiera (Ej: MAT101) | id, nombre, creditos, **docente_id** |
| **notas** | **${alumnoId}_${cursoId}** | alumnoId, cursoId, p1_ind, p1_gru, p2_ind, p2_gru, ef_ind, ef_gru, act, promedio |
| **usuarios** | **${docente_id}** (Ej: DOC001) | nombre, rol |

---

## 🎨 Funcionalidades del Portal

✨ **Login Inteligente**: Extrae automáticamente la `clave` del email  
✨ **Dashboard Responsivo**: Grid de cards adaptable a mobile/tablet/desktop  
✨ **Tarjetas Expandibles**: Click para ver detalles de notas  
✨ **Colores Dinámicos**: Verde (>= 14), Rojo (< 14)  
✨ **Nombres de Docentes**: Se cargan automáticamente desde la colección usuarios  
✨ **Sesión Segura**: Botón de cerrar sesión integrado  

---

## 🐛 Troubleshooting

**"Alumno no encontrado"** → Verifica que la `clave` en el documento coincida con el email antes del @  
**"Docente no disponible"** → Asegúrate que el `docente_id` del curso existe en la colección `usuarios`  
**"Error de autenticación"** → Revisa que el email/password están correctos en Firebase Auth  
