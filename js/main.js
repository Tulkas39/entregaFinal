const profesores = [
  {
    id: 1,
    nombre: "Emiliano Miranda",
    materia: "Ciencias Sociales",
    alumnos: [
      {
        id: 101,
        nombre: "Victoria Stalloca",
        calificaciones: [8.5, 9.0, 7.5, 8.0]
      },
      {
        id: 102,
        nombre: "Altair Grifith",
        calificaciones: [9.5, 9.0, 10, 9.5]
      },
      {
        id: 103,
        nombre: "Juan Carlos",
        calificaciones: [7.0, 6.5, 8.0, 7.5]
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
        calificaciones: [8.0, 8.5, 9.0]
      },
      {
        id: 104,
        nombre: "Vanina Díaz",
        calificaciones: [9.0, 8.5, 9.5]
      }
    ]
  }
];


//guardar 
function guardardocenteLS() {
    localStorage.setItem("profesores", JSON.stringify(profesores));
    
}

//cargar 
function cargarDatosLS() {
    const profesoresGuardados = localStorage.getItem("profesores");
    if (profesoresGuardados) {
        const datosCargados = JSON.parse(profesoresGuardados);
        profesores.length = 0; 
        profesores.push(...datosCargados); 
        cargarDocentes(); 
    }
}

//funcion agregar profesores
const formProfesores = document.getElementById ('formProfesores');
const inputProfesores = document.getElementById ('nombreDocente')
const inputMateria = document.getElementById ('materia')
const buttonAgregarProfesor = document.getElementById ('registrarProfesor')

function agregarProfesor(event) {
    event.preventDefault();
    const nombreDocente = inputProfesores.value;
    const materiaDocente = inputMateria.value;
        if (nombreDocente !== '' && materiaDocente !== '') {
            const nuevoProfesor = {
                id: profesores.length > 0 ? Math.max(...profesores.map(p => p.id)) + 1 : 1,
                nombre: nombreDocente,
                materia: materiaDocente, 
                alumnos: []
        };
            profesores.push(nuevoProfesor);
            inputProfesores.value = '';
            inputMateria.value = '';
            guardardocenteLS();
            cargarDocentes();
}
            else {
                alert('Por favor completa nombre y materia');
}
}
buttonAgregarProfesor.addEventListener('click', agregarProfesor);

//agregar docentes al menú selector
function cargarDocentes() {
    const selectordocentes = document.getElementById ('selectordocentes')
    selectordocentes.innerHTML = '';
    profesores.forEach((profesor) => {
        const option = document.createElement('option');
        option.value = profesor.id;
        option.textContent = `${profesor.nombre} - ${profesor.materia}`;
        selectordocentes.appendChild(option);
    });
}

//seleccionar docente
document.getElementById('selectordocentes').addEventListener('change', function() {
    const profesorId = parseInt(this.value);
    if (profesorId) {
        const profesor = profesores.find(p => p.id === profesorId);
        renderTabla(profesor);


        }
    }    
);        
  
const inputAlumnos = document.getElementById("alumnos")
const inputCalificacionFinal = document.getElementById("calificacionFinal");
const buttonEnviarCalificacion = document.getElementById("enviarCalificacion")

//agregaralumno
function agregarAlumno(){
    event.preventDefault();
    const selectordocentes = document.getElementById ('selectordocentes');
    const profesorId = parseInt(selectordocentes.value);
    const nombreAlumno = inputAlumnos.value.trim();
    const calificacion = parseFloat (inputCalificacionFinal.value);
    
    const profesor = profesores.find(profesor => profesor.id === profesorId);
    if (!profesorId){
        alert('Por favor selecciona un docente primero');
        return;
    }
    if (nombreAlumno === '') {
        alert('Por favor ingresa el nombre del alumno');
        return;
    }
    if (isNaN(calificacion) || calificacion < 0 || calificacion > 10) {
        alert('Por favor ingresa una calificación válida entre 1 y 10');
        return;
    }
    const alumnoCargado = profesor.alumnos.find (alumno => alumno.nombre === nombreAlumno);
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

    profesor.alumnos.forEach ((alumno, i) => {
      const promedio = (alumno.calificaciones.reduce((sum, n) => sum + n, 0) / alumno.calificaciones.length).toFixed(2);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${alumno.nombre}</td>
      <td>${profesor.materia}</td>
      <td>${alumno.calificaciones.join(', ')}</td>  
      <td class= "text-center">${promedio}</td>
      <td class= "text-center">
        <button class="btn-icon btn-delete ms-1" title="Eliminar">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    alumnosTabla.appendChild(tr);
    });    
}

//funcion aprobar/desaprobar alumno

function obtenerPromedio (nuevoAlumno) {
    const mensajeCalificacionFinal = document.getElementById('mensajeCalificacionFinal');

    if (!mensajeCalificacionFinal) return;

    const promedioAlumno = nuevoAlumno.calificaciones.reduce ((sum, nota) => sum + nota, 0) / nuevoAlumno.calificaciones.length;
    const promedioRedondeado = promedioAlumno.toFixed(2);
    if (promedioAlumno >= 7) {
    mensajeCalificacionFinal.innerHTML = nuevoAlumno.nombre + (" está aprobada con una calificación promedio de " + promedioAlumno);
   
    
} else {
    mensajeCalificacionFinal.innerHTML = nuevoAlumno.nombre + (" está DESAPROBADO con una calificación promedio de " + promedioAlumno);
    
}
};
buttonEnviarCalificacion.addEventListener ('click', agregarAlumno)

//editar calificaciones

const buttonEditarCalificaciones = document.getElementById ('editarCalificaciones')
const menuAlumnos = document.getElementById ('menuAlumnos')

function editarCalificaciones () {
  const selectordocentes = document.getElementById ('selectordocentes');
  const profesorId = parseInt(selectordocentes.value);

    if (!profesorId){
        alert('Por favor selecciona un docente primero');
        return;
    }
    const profesor = profesores.find (profesor => profesor.id === profesorId);
    if (!profesor) {
      alert('Docente no encontrado');
      return;
    }
    menuAlumnos.innerHTML = '';
    
    if (profesor.alumnos.length === 0) {
      alert('Este docente no tiene alumnos cargados');
      return
    }
     
    profesor.alumnos.forEach ((alumno, i) => {
      const optionAlumnos = document.createElement('option');
      optionAlumnos.value = alumno.id;
      optionAlumnos.textContent = alumno.nombre;
      menuAlumnos.appendChild(optionAlumnos);
  });
  const modal = new bootstrap.Modal(document.getElementById('alumnosModal'));
modal.show();
}

buttonEditarCalificaciones.addEventListener ('click', editarCalificaciones)

//guardar calificacion del modal

const inputNotas = document.getElementById ('notas')
const buttonGuardarCalificacion = document.getElementById ('guardarCalificacion')


function guardarCalificacion () {
    const alumnoId = parseInt(menuAlumnos.value);
    const calificacion = parseFloat(inputNotas.value);
    
    const selectordocentes = document.getElementById('selectordocentes');
    const profesorId = parseInt(selectordocentes.value);
    const profesor = profesores.find(p => p.id === profesorId);

    if (!profesor) {
        alert('Por favor selecciona un docente primero');
        const modal = bootstrap.Modal.getInstance(document.getElementById('alumnosModal'));
        if (modal) modal.hide();
        return;
    }

    const alumno = profesor.alumnos.find (alumno => alumno.id === alumnoId);
    if (isNaN(calificacion) || calificacion < 1 || calificacion > 10) {
        alert('Por favor ingresa una calificación válida entre 1 y 10');
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

buttonGuardarCalificacion.addEventListener ('click', guardarCalificacion)

cargarDatosLS(); 
cargarDocentes();




