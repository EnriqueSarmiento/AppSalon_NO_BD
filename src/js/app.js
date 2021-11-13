let pagina = 1;

const cita = {

    nombre: '',
    fecha: '',
    hora: '',
    servicios: []



}


document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
})

function iniciarApp() {
    mostrarServicios();

    //resalta el div actual segun el tab al que se presion
    mostrarSeccion();

    //oculta o muestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    //paginacion siguiente y anterior
    paginaSiguiente();
    paginaAnterior(); 

    //comprueba la pg actual para ocultar o mostrar la paginacion
    botonesPaginador();

    //muestra el resumen de la cita (o mensaje de error en caso de no pasar la validacion)
    mostrarResumen();

    //almacenar el nombre de la cita
    nombreCita();

    //almacena fecha de la cita en el objeto
    fechaCita();

    //desabilitae dias pasados
    deshabilitarFechaAnterior();

    //Almacena la hora de la cita en el objeto
    horaCita();
    
}

function botonesPaginador(params) {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if(pagina === 1){
        paginaAnterior.classList.add('ocultar');
        
    }else if(pagina === 3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); //estamos en la pg 3, carga el resumen de la cita 
    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');

    }

    mostrarSeccion();

}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;

       

       botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

       

       botonesPaginador();
    });
}

function mostrarSeccion() {

    //eliminar smostrar seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');

    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

        //eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual')
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    
    //resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button')

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);


           //llamar funcion de mostrar seccion
           mostrarSeccion();

           botonesPaginador();
        })
    });
}



async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const {servicios} = db;

        //generar html
        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;

            //DOM scripting
                //nombre
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

                //precio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$${precio}`;
            precioServicio.classList.add('precio-servicio');

                //generar div contenedor de servicios
            const serviciosDiv = document.createElement('DIV');
            serviciosDiv.classList.add('servicio');
            serviciosDiv.dataset.idServicio = id;

                //selecciona un servicio para la cita
            serviciosDiv.onclick = seleccionarServicio;


                //inyectar precio y nombre a div de servicio
            serviciosDiv.appendChild(nombreServicio);
            serviciosDiv.appendChild(precioServicio);
            
            
                //inyectarlo en el html
            document.querySelector('#servicios').appendChild(serviciosDiv);

        });

    } catch (error) {
        console.log(error)
    }

}

function seleccionarServicio(e) {
    let elemento;

    //forzar el elemento al cual le damos click sea el div
    if(e.target.tagName === "P"){
        elemento = e.target.parentElement;
       
    }else{
        elemento = e.target;
    }
    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');

        const id = parseInt( elemento.dataset.idServicio );

        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }

        

        agregarServicio(servicioObj);
    }

    
}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);

    console.log(cita)
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj]; // los tres punto significa tomar una copia 

    console.log(cita)

}


function mostrarResumen() {
    //destructing
    const { nombre, fecha, hora, servicios } = cita;

    //seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //limpia el HTML previo
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild( resumenDiv.firstChild ); 
    }

    
    //validacion de objeto 
    if (Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');

        //agregar a resumenDiv

        resumenDiv.appendChild(noServicios);
        
        return;
    }

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de cita';

    //mostrar resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre: <span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: <span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora: <span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0; //esto es para acumular la cant a pagar de cada servicio
    
    
    //iterar sobre el arreglo de servicios

    servicios.forEach( servicio => {

        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

         const totalServicio = precio.split('$');
        
        cantidad += parseInt(totalServicio[1]);
        
        //colocar texto y precio en el div

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);


    })

    

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span> Total a pagar: </span> $${cantidad} `;
    resumenDiv.appendChild(cantidadPagar);


}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim(); // trim elimina el espacio antes y despues de escribir. 
        

        //validacion de que nombre texto debe tener algo
        if (nombreTexto ==='' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre no valido', 'error')
            
        }else{
            const alerta = document.querySelector('.alerta');
                if (alerta) {
                alerta.remove();
        }
            cita.nombre = nombreTexto;

            console.log(cita);
        }
    });
}


function mostrarAlerta(mensaje, tipo) {
    console.log('el mensaje es', mensaje);

    //si hay una alaerta previa, no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        
        alerta.classList.add('error')
    }

    //insertar en el html

    const formulario = document.querySelector('.formulario');
    formulario.appendChild( alerta )

    //eliminar alerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);

}

function fechaCita(params) {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
       
        const dia = new Date(e.target.value).getUTCDay();
        
       
        if ([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de Semana no son validos', 'error')
        }else{
            cita.fecha = fechaInput.value
        }
        console.log(cita);

    })
}

function deshabilitarFechaAnterior(params) {
    const inputFecha = document.querySelector('#fecha');


    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDay()+ 1;

    //formato deseado AAAA-MM-DD
    //  const fechaDeshabilitar = `${year}-${mes}-${dia}`;


    const fechaDeshabilitar = `${year}-${mes < 10 ?  `0${mes}`: mes }-${dia <10 ? `0${dia}`:dia}`;

    inputFecha.min = fechaDeshabilitar;

    
}

function horaCita(params) {
    const inputHora = document.querySelector('#hora');

    inputHora.addEventListener('input', e =>{
        
        const horaCita = e.target.value; 
        const hora = horaCita.split(':'); //asi se separa el valor de la hora y da dos elementos, (11:00), dara 11 y 00

        if (hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta('Hora no valida', "error")
            setTimeout(() => {
                inputHora.value = ';'
            }, 3000);
            
        } else{
            cita.hora = horaCita;

        }

    })
}