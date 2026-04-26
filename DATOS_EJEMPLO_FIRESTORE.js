// 🎓 DATOS DE EJEMPLO PARA FIRESTORE - Portal de Estudiantes
// Copia y pega esta estructura en tu Firestore Console

// ==================== COLECCIÓN: alumnos ====================

// Documento: ALU001
{
  id: "ALU001",
  nombre: "Juan Pérez García",
  grado: "6to Grado A",
  arma: "Infantería",
  clave: "T-0533",  // ← Lo que ingresa el estudiante en el login
  cursosVinculados: ["MAT101", "ESP101", "ING101", "CIE101"]
}

// Documento: ALU002
{
  id: "ALU002",
  nombre: "María Rodríguez López",
  grado: "6to Grado B",
  arma: "Apoyo",
  clave: "GE-0924",
  cursosVinculados: ["MAT101", "ESP101", "SOC101"]
}

// Documento: ALU003
{
  id: "ALU003",
  nombre: "Carlos Martínez Silva",
  grado: "5to Grado",
  arma: "Ingeniería",
  clave: "T-0156",
  cursosVinculados: ["MAT101", "ING101", "CIE101", "COM101"]
}

// ==================== COLECCIÓN: cursos ====================

// Documento: MAT101
{
  id: "MAT101",
  nombre: "Matemáticas",
  creditos: 4,
  docente_id: "DOC001"
}

// Documento: ESP101
{
  id: "ESP101",
  nombre: "Español",
  creditos: 3,
  docente_id: "DOC002"
}

// Documento: ING101
{
  id: "ING101",
  nombre: "Inglés",
  creditos: 3,
  docente_id: "DOC003"
}

// Documento: CIE101
{
  id: "CIE101",
  nombre: "Ciencias Naturales",
  creditos: 4,
  docente_id: "DOC001"
}

// Documento: SOC101
{
  id: "SOC101",
  nombre: "Sociales",
  creditos: 3,
  docente_id: "DOC004"
}

// Documento: COM101
{
  id: "COM101",
  nombre: "Computación",
  creditos: 3,
  docente_id: "DOC005"
}

// ==================== COLECCIÓN: notas ====================

// Documento: ALU001_MAT101
{
  alumnoId: "ALU001",
  cursoId: "MAT101",
  p1_ind: 8.5,
  p1_gru: 9.0,
  p2_ind: 7.8,
  p2_gru: 8.5,
  ef_ind: 8.2,
  ef_gru: 9.1,
  act: 8.0,
  promedio: 8.5
}

// Documento: ALU001_ESP101
{
  alumnoId: "ALU001",
  cursoId: "ESP101",
  p1_ind: 9.2,
  p1_gru: 9.5,
  p2_ind: 8.9,
  p2_gru: 9.0,
  ef_ind: 9.1,
  ef_gru: 9.3,
  act: 9.0,
  promedio: 9.2
}

// Documento: ALU001_ING101
{
  alumnoId: "ALU001",
  cursoId: "ING101",
  p1_ind: 7.0,
  p1_gru: 7.5,
  p2_ind: 6.8,
  p2_gru: 7.2,
  ef_ind: 6.9,
  ef_gru: 7.1,
  act: 7.0,
  promedio: 7.1
}

// Documento: ALU001_CIE101
{
  alumnoId: "ALU001",
  cursoId: "CIE101",
  p1_ind: 8.8,
  p1_gru: 9.2,
  p2_ind: 8.5,
  p2_gru: 8.9,
  ef_ind: 8.7,
  ef_gru: 9.0,
  act: 8.5,
  promedio: 8.8
}

// Documento: ALU002_MAT101
{
  alumnoId: "ALU002",
  cursoId: "MAT101",
  p1_ind: 9.0,
  p1_gru: 9.3,
  p2_ind: 8.8,
  p2_gru: 9.1,
  ef_ind: 9.2,
  ef_gru: 9.4,
  act: 9.0,
  promedio: 9.1
}

// Documento: ALU002_ESP101
{
  alumnoId: "ALU002",
  cursoId: "ESP101",
  p1_ind: 8.5,
  p1_gru: 8.8,
  p2_ind: 8.2,
  p2_gru: 8.5,
  ef_ind: 8.3,
  ef_gru: 8.6,
  act: 8.4,
  promedio: 8.5
}

// Documento: ALU002_SOC101
{
  alumnoId: "ALU002",
  cursoId: "SOC101",
  p1_ind: 7.8,
  p1_gru: 8.2,
  p2_ind: 7.5,
  p2_gru: 7.9,
  ef_ind: 7.6,
  ef_gru: 8.0,
  act: 7.7,
  promedio: 7.8
}

// Documento: ALU003_MAT101
{
  alumnoId: "ALU003",
  cursoId: "MAT101",
  p1_ind: 6.5,
  p1_gru: 7.0,
  p2_ind: 6.2,
  p2_gru: 6.8,
  ef_ind: 6.3,
  ef_gru: 6.9,
  act: 6.5,
  promedio: 6.6
}

// Documento: ALU003_ING101
{
  alumnoId: "ALU003",
  cursoId: "ING101",
  p1_ind: 8.0,
  p1_gru: 8.3,
  p2_ind: 7.9,
  p2_gru: 8.2,
  ef_ind: 8.1,
  ef_gru: 8.4,
  act: 8.0,
  promedio: 8.1
}

// Documento: ALU003_CIE101
{
  alumnoId: "ALU003",
  cursoId: "CIE101",
  p1_ind: 9.0,
  p1_gru: 9.3,
  p2_ind: 8.8,
  p2_gru: 9.1,
  ef_ind: 8.9,
  ef_gru: 9.2,
  act: 9.0,
  promedio: 9.0
}

// Documento: ALU003_COM101
{
  alumnoId: "ALU003",
  cursoId: "COM101",
  p1_ind: 9.5,
  p1_gru: 9.7,
  p2_ind: 9.3,
  p2_gru: 9.6,
  ef_ind: 9.4,
  ef_gru: 9.7,
  act: 9.5,
  promedio: 9.5
}

// ==================== COLECCIÓN: usuarios ====================

// Documento: DOC001
{
  nombre: "Prof. Carlos López García",
  rol: "docente"
}

// Documento: DOC002
{
  nombre: "Profa. María Rodríguez Pérez",
  rol: "docente"
}

// Documento: DOC003
{
  nombre: "Prof. David Martínez Silva",
  rol: "docente"
}

// Documento: DOC004
{
  nombre: "Profa. Ana Flores Gutiérrez",
  rol: "docente"
}

// Documento: DOC005
{
  nombre: "Prof. Roberto Sánchez Moreno",
  rol: "docente"
}

// ==================== INSTRUCCIONES PARA IMPORTAR ====================

/*
OPCIÓN 1: Copiar-Pegar Manual en Firebase Console
1. Abre https://console.firebase.google.com
2. Selecciona tu proyecto
3. Ve a Firestore Database
4. Crea las colecciones manualmente:
   - Colección "alumnos"
   - Colección "cursos"
   - Colección "notas"
   - Colección "usuarios"
5. Para cada colección, añade los documentos desde este archivo

OPCIÓN 2: Importar con Script Node.js
- Usa la librería firebase-admin para importar masivamente
- Crea un archivo import.js con la lógica

PRUEBA DE LOGIN:
- En el Portal: Ingresa "T-0533" (código del primer alumno)
- Deberías ver los cursos y calificaciones de Juan Pérez García

URLS ÚTILES:
- Firebase Console: https://console.firebase.google.com
- Documentación Firestore: https://firebase.google.com/docs/firestore
*/
