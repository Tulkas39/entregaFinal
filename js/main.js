

// funcion constructora

class Profesor {
  static id = 0;
  constructor (nombre, materia, alumnos = []) {
    this.id = ++Profesor.id;
    this.nombre = nombre;
    this.materia = materia;
    this.alumnos = alumnos;
  }
}

class Alumno {
    static id = 0;
    constructor (nombre, calificaciones = []) {
    this.id = ++Alumno.id;
    this.nombre = nombre;
    this.calificaciones = calificaciones;
  }
}

const profesores = []
//guardar 
function guardardocenteLS() { localStorage.setItem("profesores", JSON.stringify(profesores)); }

//cargar 
function cargarDatosLS() {
  const profesoresGuardados = localStorage.getItem("profesores");
  if (profesoresGuardados) {
    const datosCargados = JSON.parse(profesoresGuardados);
    profesores.length = 0;

    datosCargados.forEach(dato => {
      const alumnos = (dato.alumnos || []).map(alumnoData => {
        const alumno = new Alumno(alumnoData.nombre, alumnoData.calificaciones);
        alumno.id = alumnoData.id;
        return alumno;
      });

      const profesor = new Profesor(dato.nombre, dato.materia, alumnos);
      profesor.id = dato.id;
      profesores.push(profesor);
    });
    Profesor.id = Math.max(...profesores.map(p => p.id), 0);
    Alumno.id = Math.max(...profesores.flatMap(p => p.alumnos.map(a => a.id)), 0);

    cargarDocentes();
  }
} 
const URL = "https://api.jsonbin.io/v3/b/69b219c6c3097a1dd51a3a4c"

function cargarDatosAPI() {
  fetch(URL, { 
    headers: {
      "X-Master-Key": "$2a$10$ZRxWBEGUkHqUPjnM8/nGAud1MH3gveDAUh.MN4Gp2nyzQdGawvJuK",
      "X-Access-Key": "$2a$10$FGiUPQ3Zi5e9jsJaLCE4LOVKj99zrqP5fXOqglblbjItcjPJMzUV."
    }
  })
  .then(response => response.json())
  .then(data => {
    try {                          
      renderProfesores(data)
    
    } catch (error) {             
        console.error("Error al procesar los datos de la API:", error);
        cargarDatosLS();
    }
})
.catch(error => {
    console.error("Error al conectar con la API:", error);
    cargarDatosLS();
});
}

function crearProfesor(dato) {
    const alumnos = dato.alumnos.map(crearAlumno);
    const profesor = new Profesor(dato.nombre, dato.materia, alumnos);
    profesor.id = dato.id;
    return profesor;
}

function crearAlumno(alumnoData) {
    const alumno = new Alumno(alumnoData.nombre, alumnoData.calificaciones);
    alumno.id = alumnoData.id;
    return alumno;
}



function renderProfesores(data) {
    const datosAPI = data.record;
    profesores.length = 0;

    profesores.push(...datosAPI.map(crearProfesor));

    Profesor.id = Math.max(...profesores.map(p => p.id), 0);
    Alumno.id   = Math.max(...profesores.flatMap(p => p.alumnos.map(a => a.id)), 0);
    cargarDocentes();
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
const inputProfesores       = document.getElementById('nombreDocente')
const inputMateria          = document.getElementById('materia')
const buttonAgregarProfesor = document.getElementById('registrarProfesor')

function agregarProfesor(event) {
  event.preventDefault();

  const nombreValido   = validarCampo(inputProfesores, alertaDocente, "Nombre del Docente");
  const materiaValida  = validarCampo(inputMateria, alertaMateria, "Materia");

    if (nombreValido && materiaValida) {
    const nuevoProfesor = new Profesor(
      inputProfesores.value.trim(),
      inputMateria.value.trim()
    );
    
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
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: 'Por favor selecciona un docente primero',
      customClass: {
      title: 'titulo-blanco'},
      confirmButtonText: 'Entendido',
      showClass: {
    popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
  },
  hideClass: {
    popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
  }
});
    return;
  }
  const profesor = profesores.find(profesor => profesor.id === profesorId);
  const confirmar = Swal.fire({
      title: `Estás seguro de eliminar a ${profesor.nombre}?`,
      text: "No se podrá revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, quiero borrarlo!"
    }).then((result) => {
    if (!result.isConfirmed) return;
    const index = profesores.findIndex (profesor => profesor.id === profesorId);
    profesores.splice (index, 1);
      
    document.getElementById('alumnosTabla').innerHTML = '';
    document.getElementById('mensajeVacio').classList.remove('d-none');

  guardardocenteLS();
  cargarDocentes();
    
    Swal.fire({
          title: "Borrado",
          text: "El profesor ha sido borrado",
          icon: "success"
        });
        });
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
function agregarAlumno(event) {
  event.preventDefault();

  const selectorDocentes = document.getElementById('selectorDocentes');
  const profesorId = parseInt(selectorDocentes.value);
  
  if (!profesorId) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: 'Por favor selecciona un docente primero',
      customClass: {
      title: 'titulo-blanco'},
      confirmButtonText: 'Entendido',
      showClass: {
    popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
  },
  hideClass: {
    popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
  }
});
    return;
  }
  const alumnoValido = validarCampo(inputAlumnos, alertaAlumno, "Nombre del Alumno");
  if (!alumnoValido) return
  
  const calificacion = parseFloat(inputCalificacionFinal.value)
  if (isNaN(calificacion) || !Number.isInteger(Number(calificacion)) || calificacion < 1 || calificacion > 10) {
    alertaCalificacion.textContent = '❌ Por favor ingresa una calificación válida entre 1 y 10. Colocar solo números enteros';
    alertaCalificacion.classList.remove("d-none");
    return;
  }
  const profesor = profesores.find (profesor => profesor.id === profesorId);
  const nombreAlumno = inputAlumnos.value.trim();
  const alumnoCargado = profesor.alumnos.find (alumno => alumno.nombre === nombreAlumno);

  if (alumnoCargado) {
    alumnoCargado.calificaciones.push(calificacion);
    obtenerPromedio(alumnoCargado);
  }
  
  else {
    const nuevoAlumno = new Alumno(nombreAlumno, [calificacion]);
    profesor.alumnos.push (nuevoAlumno);
    obtenerPromedio(nuevoAlumno);
  }
   
    inputAlumnos.value = '';
    inputCalificacionFinal.value = '';
    alertaCalificacion.classList.add("d-none");
    guardardocenteLS()
    renderTabla(profesor)
  }

buttonEnviarCalificacion.addEventListener('click', agregarAlumno)

//alummnos a la tabla

function renderTabla(profesor) {
  const alumnosTabla = document.getElementById('alumnosTabla');
  const mensajeVacio = document.getElementById('mensajeVacio');


  if (profesor.alumnos.length === 0) {
    mensajeVacio.classList.remove('d-none');
    alumnosTabla.innerHTML = '';
    return;
  }
    alumnosTabla.innerHTML = '';          
    mensajeVacio.classList.add('d-none');
 

  profesor.alumnos.forEach((alumno, i) => {
    
  const promedio = alumno.calificaciones.length === 0
  ? 'Sin calificaciones'
  : (alumno.calificaciones.reduce((sum, n) => sum + n, 0) / alumno.calificaciones.length).toFixed(2);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="Alumno">${alumno.nombre}</td>
      <td data-label="Materia">${profesor.materia}</td>
      <td data-label="Calificaciones">${alumno.calificaciones.length > 0 ? alumno.calificaciones.join(', ') : 'Sin calificaciones'}</td>
      <td data-label="Promedio" class="text-center">${promedio}</td>
      <td data-label="Acciones" class="text-left">
         <div class="d-flex gap-1">
            <button class="btn-icon btn-edit" title="Editar" data-id="${alumno.id}">
                <i class="bi-plus-lg text-success"></i>
            </button>
            <button class="btn-icon btn-delete" title="Eliminar" data-id="${alumno.id}">
                <i class="bi bi-eraser"></i>
            </button>
        </div>
      </td>
`;
  
    tr.querySelector('.btn-delete').addEventListener('click', () => {
    const confirmar = Swal.fire({
      title: `¿Estás seguro de borrar las calificaciones de ${alumno.nombre}?`,
      text: "No se podrá revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, quiero borrarlo!"
    }).then((result) => {
    if (!result.isConfirmed) return;

    alumno.calificaciones = [];
    guardardocenteLS();
    renderTabla(profesor);
    });
  }); 
    
    tr.querySelector('.btn-edit').addEventListener('click', () => {
  Swal.fire({
    title: `Agregar calificación a ${alumno.nombre}`,
    input: 'number',
    inputLabel: 'Ingresá una calificación entre 1 y 10',
    inputPlaceholder: 'Ej: 8',
    inputAttributes: {
      min: 1,
      max: 10,
      step: 1
    },
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    showClass: {
      popup: 'animate__animated animate__fadeInUp animate__faster'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutDown animate__faster'
    },
    inputValidator: (value) => {
      const num = Number(value);
      if (!value) return '❌ No puede estar vacío';
      if (!Number.isInteger(num) || num < 1 || num > 10) {
        return '❌ Ingresá un número entero entre 1 y 10';
      }
    }
  }).then((result) => {
    if (!result.isConfirmed) return;

    alumno.calificaciones.push(Number(result.value));
    
    obtenerPromedio(alumno);
    guardardocenteLS();
    renderTabla(profesor);
  });
});
      alumnosTabla.appendChild(tr);
});
}
//funcion aprobar/desaprobar alumno

function obtenerPromedio(alumno) {
  const mensajeCalificacionFinal = document.getElementById('mensajeCalificacionFinal');

  if (!mensajeCalificacionFinal) return;

  const promedio           = alumno.calificaciones.reduce((sum, n) => sum + n, 0) / alumno.calificaciones.length;
  const promedioRedondeado = promedio.toFixed(2);
  const estado             = promedio >= 7 ? 'APROBADO' : 'DESAPROBADO';
  
  mensajeCalificacionFinal.innerHTML =
    `${alumno.nombre} está <strong>${estado}</strong> con una calificación promedio de ${promedioRedondeado}`;
  }



//editar calificaciones

const buttonEditarCalificaciones = document.getElementById('editarCalificaciones')
const menuAlumnos = document.getElementById('menuAlumnos')

function editarCalificaciones() {
  const selectorDocentes = document.getElementById('selectorDocentes');
  const profesorId = parseInt(selectorDocentes.value);
  const profesor = profesores.find(p => p.id === profesorId);

  if (!profesorId) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: 'Por favor selecciona un docente primero',
      customClass: {
      title: 'titulo-blanco'},
      confirmButtonText: 'Entendido',
      showClass: {
    popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
  },
  hideClass: {
    popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
  }
});
    return;
  }

  menuAlumnos.innerHTML = '';

  if (profesor.alumnos.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: 'Este docente no tiene alumnos cargados',
      customClass: {
      title: 'titulo-blanco'},
      confirmButtonText: 'Entendido',
      showClass: {
    popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
  },
  hideClass: {
    popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
  }
});
    return
  }

  profesor.alumnos.forEach(alumno => {
    const option = document.createElement('option');
    option.value = alumno.id;
    option.textContent = alumno.nombre;
    menuAlumnos.appendChild(option);
  });
  new bootstrap.Modal(document.getElementById('alumnosModal')).show();
}

buttonEditarCalificaciones.addEventListener('click', editarCalificaciones)

//eliminar alumno

const buttonEliminarAlumno = document.getElementById ("eliminarAlumno")

function eliminarAlumno() {
  const selectorDocentes = document.getElementById('selectorDocentes');
  const profesorId = parseInt(selectorDocentes.value);
  const profesor = profesores.find(profesor => profesor.id === profesorId);
  const alumnoId = parseInt(menuAlumnos.value);

  if (!alumnoId) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: 'Por favor selecciona un alumno primero',
      customClass: {
      title: 'titulo-blanco'},
      confirmButtonText: 'Entendido',
      showClass: {
    popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
  },
  hideClass: {
    popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
  }
});
    return;
  }
  const alumno= profesor.alumnos.find(alumno => alumno.id === alumnoId);
  const confirmar =  Swal.fire({
      title: `Estás seguro de eliminar a ${alumno.nombre}?`,
      text: "No se podrá revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, quiero borrarlo!"
    }).then((result) => {
    if (!result.isConfirmed) return;

    const index = profesor.alumnos.findIndex (alumno => alumno.id === alumnoId);
    profesor.alumnos.splice (index, 1);

    guardardocenteLS();
    renderTabla(profesor);
    const modal = bootstrap.Modal.getInstance(document.getElementById('alumnosModal'));
    if (modal) modal.hide();
    });
    }

buttonEliminarAlumno.addEventListener('click', eliminarAlumno);

//guardar calificacion (modal)

const inputNotas = document.getElementById('notas')
const buttonGuardarCalificacion = document.getElementById('guardarCalificacion')


function guardarCalificacion() {
  
  const selectorDocentes = document.getElementById('selectorDocentes');
  const profesorId = parseInt(selectorDocentes.value);
  const profesor = profesores.find(p => p.id === profesorId);

   const alumnoId = parseInt(menuAlumnos.value);
  const calificacion = parseFloat(inputNotas.value);

  const alumno = profesor.alumnos.find(alumno => alumno.id === alumnoId);
  if (isNaN(calificacion) || !Number.isInteger(Number(calificacion))|| calificacion < 1 || calificacion > 10) {
    Swal.fire({
      icon: 'warning',
      title: 'Atención',
      text: 'Por favor coloca una cafalificación válida entre 1 y 10 (números enteros)',
      customClass: {
      title: 'titulo-blanco'},
      confirmButtonText: 'Entendido',
      showClass: {
    popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
  },
  hideClass: {
    popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
  }
});
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
if (localStorage.getItem("profesores") === null) {
  cargarDatosAPI();
}



