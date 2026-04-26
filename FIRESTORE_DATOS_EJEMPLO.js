// 📚 DATOS DE EJEMPLO PARA FIRESTORE
// Copia y pega esta estructura en tu Firestore para hacer pruebas

// ==================== COLECCIÓN: alumnos ====================
// Documento: ALU001
{
  id: "ALU001",
  nombre: "Juan Pérez García",
  grado: "6to Grado A",
  arma: "Infantería",
  clave: "T-0533",
  cursosVinculados: ["MAT101", "ESP101", "ING101", "CIE101"]
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

// ==================== COLECCIÓN: usuarios ====================
// Documento: DOC001
{
  nombre: "Prof. Carlos López",
  rol: "docente"
}

// Documento: DOC002
{
  nombre: "Profa. María Rodríguez",
  rol: "docente"
}

// Documento: DOC003
{
  nombre: "Prof. David Martínez",
  rol: "docente"
}

// ==================== FIREBASE AUTH ====================
// En la sección Authentication de tu Firebase:
// Email: T-0533@ecome.com
// Password: Tu_Password_Fuerte_123
