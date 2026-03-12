El objetivo del trabajo fue hacer un sistema de carga de calificaciones:

- Donde cada profesor pueda visualizarse en un selector.
- Que cada profesor pueda obtener una libreta de sus alumnos con un promedio de sus calificaciones.

A partir de lo presentado en la Segunda Entrega traté de mejorar:
    - Utilizar función constructora, usando class y new.
    - Las validaciones tanto como con un texto de advertencia en los formularios como alertas en los botones (con sweetalert2)
    - Traté de agregar funciones para que se pudiesen manipular los datos del sistema: eliminar profesores, eliminar alumnos, eliminar calificaciones. Me faltó agregar una edición de profesores por falta de tiempo. La única forma en la que se pueden editar los profesores es borrando y creando uno nuevo. En el entretanto se perderían todos los alumnos. Reconozco que eso es una falla a corregir del sistemita.

Para esta entrega utilicé una api para cargar datos iniciales de profesores y alumnos. La alertas y los pedidos de confirmación fueron trabajados con sweetalert2. 