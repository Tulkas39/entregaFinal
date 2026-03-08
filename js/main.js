const profesores = [
  {
    id: 1,
    nombre: "Emiliano Miranda",
    materia: "Ciencias Sociales",
    alumnos: [
      {
        id: 101,
        nombre: "Victoria Stalloca",
        calificaciones: [8, 9, 7, 8]
      },
      {
        id: 102,
        nombre: "Altair Grifith",
        calificaciones: [9, 9, 10, 9]
      },
      {
        id: 103,
        nombre: "Juan Carlos",
        calificaciones: [7, 6, 8, 7]
      }
    ]
  },
  {
    id: 2,
    nombre: "Victor Díaz",
    materia: "Programación",
    alumnos: [
      {
        id: 101,
        nombre: "Ruben Ortega",
        calificaciones: [8, 8, 9]
      },
      {
        id: 104,
        nombre: "Vanina Díaz",
        calificaciones: [9, 8, 9]
      }
    ]
  }
];


//guardar 
function guardardocenteLS() { localStorage.setItem("profesores", JSON.stringify(profesores)); }

//cargar 
function cargarDatosLS() {
  const profesoresGuardados = localStorage.getItem("profesores");
  if (profesoresGuardados) {
    const datosCargados     = JSON.parse(profesoresGuardados);
          profesores.length = 0;
    profesores.push(...datosCargados);
    cargarDocentes();
  }
}

//Selectores de validadores
const alertaDocente      = document.getElementById("validadorDocente");
const alertaMateria      = document.getElementById("validadorMateria");
const alertaAlumno       = document.getElementById("validadorAlumno");
const alertaCalificacion = document.getElementById("validadorCalificaciónFinal");


//Función que valida los campos 
function validarCampo(input, alerta, nombreCampo){

  const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/; //Regex que solo permite letras
  const valor = input.value.trim();
  //No puede estar vacio
  if(valor === ""){
    alerta.textContent = `❌ ${nombreCampo} no puede estar vacío`;
    alerta.classList.remove("d-none");
    return false;
  }
  //Maximo de caracteres
  if(valor.length > 25){
    alerta.textContent = `❌ ${nombreCampo} no puede tener más de 25 caracteres`;
    alerta.classList.remove("d-none");
    return false;
  }

  //Solo puede contener letras
  if(!regex.test(valor)){
    alerta.textContent = `❌ ${nombreCampo} solo puede contener letras`;
    alerta.classList.remove("d-none");
    return false;
  }
  alerta.classList.add("d-none");
  return true;
}





//funcion agregar profesores
const formProfesores        = document.getElementById('formProfesores');
const inputProfesores       = document.getElementById('nombreDocente')
const inputMateria          = document.getElementById('materia')
const buttonAgregarProfesor = document.getElementById('registrarProfesor')

function agregarProfesor(event) {
  event.preventDefault();
  const nombreDocente  = inputProfesores.value;
  const materiaDocente = inputMateria.value;  
  const nombreValido   = validarCampo(inputProfesores, alertaDocente, "Nombre del Docente");
  const materiaValida  = validarCampo(inputMateria, alertaMateria, "Materia");
    if (nombreValido && materiaValida) {
    const nuevoProfesor = {
      id     : profesores.length > 0 ? Math.max(...profesores.map(p => p.id)) + 1: 1,
      nombre : nombreDocente,
      materia: materiaDocente,
      alumnos: []
    };
    profesores.push(nuevoProfesor);
    inputProfesores.value = '';
    inputMateria.value    = '';
    guardardocenteLS();
    cargarDocentes();
  }
}

buttonAgregarProfesor.addEventListener('click', agregarProfesor);

//agregar docentes al menú selector
function cargarDocentes() {
  const selectorDocentes = document.getElementById('selectorDocentes')
  selectorDocentes.innerHTML = '';
  profesores.forEach((profesor) => {
    const option             = document.createElement('option');
          option.value       = profesor.id;
          option.textContent = `${profesor.nombre} - ${profesor.materia}`;
    selectorDocentes.appendChild(option);
  });
}

//eliminar docente del menú selector

const buttonEliminarProfesor = document.getElementById ("eliminarProfesor")

function eliminarProfesor() {
  const selectorDocentes = document.getElementById ("selectorDocentes");
  const profesorId = parseInt(selectorDocentes.value)

  if (!profesorId) {
    alert('Por favor, selecciona un docente primero')
    return;
  }
  const profesor = profesores.find(profesor => profesor.id === profesorId);
  const confirmar = confirm(`Estás seguro de eliminar a ${profesor.nombre}?`)

  if (!confirmar) return;

  const index = profesores.findIndex (profesor => profesor.id === profesorId);
  profesores.splice (index, 1);

  alumnosTabla.innerHTML = '';
  mensajeVacio.classList.remove('d-none');

  guardardocenteLS();
  cargarDocentes();
}

buttonEliminarProfesor.addEventListener('click', eliminarProfesor);

//seleccionar docente
document.getElementById('selectorDocentes').addEventListener('change', function () {
  const profesorId = parseInt(this.value);
  if (profesorId) {
    const profesor = profesores.find(profesor => profesor.id === profesorId);
    renderTabla(profesor);
  }
}
);

const inputAlumnos = document.getElementById("alumnos")
const inputCalificacionFinal = document.getElementById("calificacionFinal");
const buttonEnviarCalificacion = document.getElementById("enviarCalificacion")

//agregaralumno
function agregarAlumno() {
  event.preventDefault();
  const selectorDocentes = document.getElementById('selectorDocentes');
  const profesorId = parseInt(selectorDocentes.value);
  const nombreAlumno = inputAlumnos.value.trim();
  const calificacion = parseFloat(inputCalificacionFinal.value);

  const profesor = profesores.find(profesor => profesor.id === profesorId);
  if (!profesorId) {
    alert('Por favor selecciona un docente primero');
    return;
  }
  const alumnoValido = validarCampo(inputAlumnos, alertaAlumno, "Nombre del Alumno");

  if (!alumnoValido) return
  
  if (isNaN(calificacion) || !Number.isInteger(Number(calificacion)) || calificacion < 1 || calificacion > 10) {
    alertaCalificacion.textContent = '❌ Por favor ingresa una calificación válida entre 1 y 10. Colocar solo números enteros';
    alertaCalificacion.classList.remove("d-none");
    return;
  }
  const alumnoCargado = profesor.alumnos.find(alumno => alumno.nombre === nombreAlumno);
  if (alumnoCargado) {
    alumnoCargado.calificaciones.push(calificacion);
    obtenerPromedio(alumnoCargado)
  }
  else {
    const nuevoAlumno = {
      id: profesor.alumnos.length > 0 ? Math.max(...profesor.alumnos.map(a => a.id)) + 1 : 1,
      nombre: nombreAlumno,
      calificaciones: [calificacion]
    }
    profesor.alumnos.push(nuevoAlumno);
    inputAlumnos.value = '';
    inputCalificacionFinal.value = '';
    alertaCalificacion.classList.add("d-none");
    obtenerPromedio(nuevoAlumno)
    guardardocenteLS()
    renderTabla(profesor)
  };

}

//alummnos a la tabla

function renderTabla(profesor) {
  const alumnosTabla = document.getElementById('alumnosTabla');
  const mensajeVacio = document.getElementById('mensajeVacio');
  alumnosTabla.innerHTML = '';

  if (profesor.alumnos.length === 0) {
    mensajeVacio.classList.remove('d-none');
    return;
  }

  mensajeVacio.classList.add('d-none');

  profesor.alumnos.forEach((alumno, i) => {
    const promedio = (alumno.calificaciones.reduce((sum, n) => sum + n, 0) / alumno.calificaciones.length).toFixed(2);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${alumno.nombre}</td>
      <td>${profesor.materia}</td>
      <td>${alumno.calificaciones.join(', ')}</td>  
      <td class= "text-center">${promedio}</td>
      <td class= "text-center">
        <button class="btn-icon btn-delete ms-1" title="Eliminar" data-id="${alumno.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tr.querySelector('.btn-delete').addEventListener('click', () => {
    const confirmar = confirm(`¿Estás seguro de borrar las calificaciones de ${alumno.nombre}?`);
    if (!confirmar) return;

    alumno.calificaciones = []; 

    guardardocenteLS();
    renderTabla(profesor);
});
    alumnosTabla.appendChild(tr);
  });
}

//funcion aprobar/desaprobar alumno

function obtenerPromedio(nuevoAlumno) {
  const mensajeCalificacionFinal = document.getElementById('mensajeCalificacionFinal');

  if (!mensajeCalificacionFinal) return;

  const promedioAlumno = nuevoAlumno.calificaciones.reduce((sum, nota) => sum + nota, 0) / nuevoAlumno.calificaciones.length;
  const promedioRedondeado = promedioAlumno.toFixed(2);
  if (promedioAlumno >= 7) {
    mensajeCalificacionFinal.innerHTML = nuevoAlumno.nombre + (" está APROBADO con una calificación promedio de " + promedioAlumno);


  } else {
    mensajeCalificacionFinal.innerHTML = nuevoAlumno.nombre + (" está DESAPROBADO con una calificación promedio de " + promedioAlumno);

  }
};
buttonEnviarCalificacion.addEventListener('click', agregarAlumno)

//editar calificaciones

const buttonEditarCalificaciones = document.getElementById('editarCalificaciones')
const menuAlumnos = document.getElementById('menuAlumnos')

function editarCalificaciones() {
  const selectorDocentes = document.getElementById('selectorDocentes');
  const profesorId = parseInt(selectorDocentes.value);

  if (!profesorId) {
    alert('Por favor selecciona un docente primero');
    return;
  }
  const profesor = profesores.find(profesor => profesor.id === profesorId);
  if (!profesor) {
    alert('Docente no encontrado');
    return;
  }
  menuAlumnos.innerHTML = '';

  if (profesor.alumnos.length === 0) {
    alert('Este docente no tiene alumnos cargados');
    return
  }

  profesor.alumnos.forEach((alumno, i) => {
    const optionAlumnos = document.createElement('option');
    optionAlumnos.value = alumno.id;
    optionAlumnos.textContent = alumno.nombre;
    menuAlumnos.appendChild(optionAlumnos);
  });
  const modal = new bootstrap.Modal(document.getElementById('alumnosModal'));
  modal.show();
}

buttonEditarCalificaciones.addEventListener('click', editarCalificaciones)

//eliminar alumno

const buttonEliminarAlumno = document.getElementById ("eliminarAlumno")

function eliminarAlumno() {
  const selectorDocentes = document.getElementById('selectorDocentes');
  const profesorId = parseInt(selectorDocentes.value);
  const profesor = profesores.find(profesor => profesor.id === profesorId);
  const menuAlumnos = document.getElementById('menuAlumnos');
  const alumnoId = parseInt(menuAlumnos.value);

  if (!alumnoId) {
    alert('Por favor, selecciona un alumno primero')
    return;
  }
  const alumno= profesor.alumnos.find(alumno => alumno.id === alumnoId);
  const confirmar = confirm(`Estás seguro de eliminar a ${alumno.nombre}?`)

  if (!confirmar) return;

  const index = profesor.alumnos.findIndex (alumno => alumno.id === alumnoId);
  profesor.alumnos.splice (index, 1);

  alumnosTabla.innerHTML = '';
  mensajeVacio.classList.remove('d-none');

  guardardocenteLS();
  renderTabla(profesor);
  
  const modal = bootstrap.Modal.getInstance(document.getElementById('alumnosModal'));
  if (modal) modal.hide();
}

buttonEliminarAlumno.addEventListener('click', eliminarAlumno);

//guardar calificacion del modal

const inputNotas = document.getElementById('notas')
const buttonGuardarCalificacion = document.getElementById('guardarCalificacion')


function guardarCalificacion() {
  const alumnoId = parseInt(menuAlumnos.value);
  const calificacion = parseFloat(inputNotas.value);

  const selectorDocentes = document.getElementById('selectorDocentes');
  const profesorId = parseInt(selectorDocentes.value);
  const profesor = profesores.find(p => p.id === profesorId);

  if (!profesor) {
    alert('Por favor selecciona un docente primero');
    const modal = bootstrap.Modal.getInstance(document.getElementById('alumnosModal'));
    if (modal) modal.hide();
    return;
  }

  const alumno = profesor.alumnos.find(alumno => alumno.id === alumnoId);
  if (isNaN(calificacion) || !Number.isInteger(Number(calificacion))|| calificacion < 1 || calificacion > 10) {
    alert('Por favor ingresa una calificación válida entre 1 y 10. Colocar números enteros.');
    return;
  }

  alumno.calificaciones.push(calificacion);
  inputNotas.value = '';
  guardardocenteLS();
  obtenerPromedio(alumno);
  renderTabla(profesor);

  const modal = bootstrap.Modal.getInstance(document.getElementById('alumnosModal'));
  modal.hide();
}

buttonGuardarCalificacion.addEventListener('click', guardarCalificacion)

cargarDatosLS();
cargarDocentes();




