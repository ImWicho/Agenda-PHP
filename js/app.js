const formularioContactos = document.querySelector('#contacto');
const listadoContactos = document.querySelector('#listado-contactos tbody');
const inputBuscador = document.querySelector('#buscar');
eventListeners();

function eventListeners(){
    //Cuando el formulario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit',leerFormulario);
    
    if(listadoContactos){
        listadoContactos.addEventListener('click', eliminarContacto);
    }

    inputBuscador.addEventListener('input', buscarContactos);
    numeroContactos();
}

function leerFormulario(e){
    e.preventDefault();

    //Leer datos de los inputs//
    const nombre = document.querySelector('#nombre').value;
    const empresa = document.querySelector('#empresa').value;
    const telefono = document.querySelector('#telefono').value;
    const accion = document.querySelector('#accion').value;

    if(nombre === '' || empresa === '' || telefono === ''){
        //Dos parametros texto y clase
        mostrarNotificacion('Todos los campos son obligatorios', 'error');
    }else{
        //Pasa la validacion, crear llamada ajax
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);

        if(accion === 'crear'){
            //crear nuevo elemento
            insertarBD(infoContacto);
        }else{
            //editar el contacto
            // leer id
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id',idRegistro);
            actualizarRegistro(infoContacto);
        }
    }
}
//Insertar en la base de datos via ajax
function insertarBD(infoContacto){
    //llamado a ajax
    //crear el objeto
    const peticion = new XMLHttpRequest();
    //abrir conexion
    peticion.open('POST', 'inc/modelos/modelos-contacto.php',true);
    //pasar los datos
    peticion.onload = function(){
        if(this.status === 200){
            //console.log(JSON.parse(peticion.responseText));
            // Leemos la respuesta de php

            const respuesta = JSON.parse(peticion.responseText);
            //Inserta un nuevo elemento a la tabla
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;

            // crear contenedor para los botones
            const contenedorAcciones = document.createElement('td');

            // crear el icono
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas','fa-pen-square');

            // crear el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');

            // agregarlo al padre
            contenedorAcciones.appendChild(btnEditar);

            // crear el icono de eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas','fa-trash-alt');

            // crear el boton de eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id',respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            // agregar al padre
            contenedorAcciones.appendChild(btnEliminar);

            //  agregarlo al tr
            nuevoContacto.appendChild(contenedorAcciones);

            //Agregar con los contactos
            listadoContactos.appendChild(nuevoContacto);

            // Resetear el formulario
            document.querySelector('form').reset();
            // Mostrar notificacion

            mostrarNotificacion('Contacto Creado Correctamente','correcto')
            numeroContactos();
        }
    }
    //enviar los datos
    peticion.send(infoContacto);
}

// Eliminar contacto
function eliminarContacto(e){
    if(e.target.parentElement.classList.contains('btn-borrar')){

        // Tomar el id
        const id = e.target.parentElement.getAttribute('data-id');
        //console.log(id);
        const respuesta = confirm("¿Estas seguro (a) de eliminar?");

        if(respuesta){
            const peticion = new XMLHttpRequest();
            peticion.open('GET', `inc/modelos/modelos-contacto.php?id=${id}&accion=borrar`,true);
            peticion.onload = function(){
                if(this.status === 200){
                    const resultado = (JSON.parse(peticion.responseText));

                    if(resultado.respuesta == 'correcto'){
                        //Eliminar el registro
                        e.target.parentElement.parentElement.parentElement.remove();
                        //Mostrar notificacion
                        mostrarNotificacion('Contacto Eliminado','correcto');
                        numeroContactos();
                    }else{
                        mostrarNotificacion('Hubo un error...','error');
                    }
                }
            }

            peticion.send();
        }
         
    }
}

//Notificacion
function mostrarNotificacion(mensaje, clase){
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;
    
    //formulario
    formularioContactos.insertBefore(notificacion,document.querySelector('form legend'));

    //Ocultar y Mostrar Notificacion//
    setTimeout(() => {
        notificacion.classList.add('visible');
        setTimeout(() => {
        notificacion.classList.remove('visible');
        setTimeout(() => {
        notificacion.remove();
        },500);
        },3000);
    },100);
}

// Editar
function actualizarRegistro(datos){
    const peticion = new XMLHttpRequest();

    peticion.open('POST', 'inc/modelos/modelos-contacto.php', true);

    peticion.onload = function(){
        if(this.status === 200){
            const respuesta = JSON.parse(peticion.responseText);
            
            if(respuesta.respuesta === 'correcto'){
                mostrarNotificacion('Actualizado con exito','correcto');
            }else{
                mostrarNotificacion('Hubo un error','error');
            }

            setTimeout(() => {
                window.location.href = 'index.php'
            },3000)

        }
    }

    peticion.send(datos);
}

// buscador
function buscarContactos(e){
    const expresion =  new RegExp(e.target.value, "i");
    const registros = document.querySelectorAll('tbody tr');
    console.log(e.target.value);

    registros.forEach(registro => {
        registro.style.display = 'none';

        $nombre = registro.childNodes[1].textContent.replace(/ /g," ").search(expresion);
        $empresa = registro.childNodes[3].textContent.replace(/ /g," ").search(expresion);
        $telefono = registro.childNodes[5].textContent.replace(/ /g," ").search(expresion);
        if($nombre!=-1 || $empresa!=-1 || $telefono!=-1){
            registro.style.display='table-row';
        }
        numeroContactos();
    })
}

// Numero contactos
function numeroContactos(){
    const totalContactos = document.querySelectorAll('tbody tr');
    const contenedornumero = document.querySelector('.total-contactos span');
    let total = 0;

    totalContactos.forEach(contacto => {
        if(contacto.style.display === '' || contacto.style.display === 'table-row'){
            total++;
        }
    })

    contenedornumero.textContent = total;
}