const pacienteInput = document.querySelector('#paciente')
const telefonoInput = document.querySelector('#tel')
const obraSocialInput = document.querySelector('#obrasocial')
const emailInput = document.querySelector('#email')
const fechaIput = document.querySelector('#fecha')
const sintomasInput = document.querySelector('#sintomas')
const formulario = document.querySelector('#formulario-cita')
const formularioInput = document.querySelector('#formulario-cita button[type="submit"]')
const administradorCitas = document.querySelector('#citas')
// Eventos
pacienteInput.addEventListener('input', datosCita)
telefonoInput.addEventListener('input', datosCita)
obraSocialInput.addEventListener('input', datosCita)
emailInput.addEventListener('input', datosCita)
fechaIput.addEventListener('input', datosCita)
sintomasInput.addEventListener('input', datosCita)
formulario.addEventListener('submit', submitCita)

let editando = false


// objeto de Cita
const citaObjeto = {
    id: generarId(),
    paciente: '',
    tel: '',
    obrasocial: '',
    email: '',
    fecha: '',
    sintomas: ''

}

class Notificacion {
    constructor({ texto, tipo }) {
        this.texto = texto
        this.tipo = tipo

        this.mostrar();
    }

    mostrar() {
        // crerar la notificacion
        const alerta = document.createElement('DIV')
        alerta.classList.add('text-center', 'p-2', 'text-white', 'my-2', 'alert', 'uppercase', 'fond-bold', 'text-sm')

        // Eliminar alertas duplicadas
        const alertaPrevia = document.querySelector('.alert')
        if (alertaPrevia) {
            alertaPrevia.remove()
        }

        // Si es de tipo error, agrega una clase
        this.tipo === 'error' ? alerta.classList.add('bg-danger') : alerta.classList.add('bg-success')

        // Mensaje de error
        alerta.textContent = this.texto
        // insertar en el DOM
        formulario.parentElement.insertBefore(alerta, formulario)

        // quitar despues de 5 segundos
        setTimeout(() => {
            alerta.remove()
        }, 3000);


    }
}

class AdminCitas {
    constructor() {
        this.citas = []


    }

    agregar(cita) {
        this.citas = [...this.citas, cita]
        this.mostrar()

    }

    editar(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
        this.mostrar()
    }

    eliminar(id) {
       this.citas = this.citas.filter(cita => cita.id !== id)
       this.mostrar()
    }



    mostrar() {

        // Limpiar el thml previo
        while (administradorCitas.firstChild) {
            administradorCitas.removeChild(administradorCitas.firstChild)
        }

        // compruebo si hay citas 
        if(this.citas.length === 0) {
            administradorCitas.innerHTML =  '<p id="administra" class="text-center">No Hay Pacientes</p>'
            return
        }

        // Generando las citas  
        this.citas.forEach(cita => {
            const divCita = document.createElement('div')
            divCita.classList.add('mt-4', 'mb-3', 'me-3', 'bg-white', 'shadow-md', 'p-3', 'rounded-xl',);

            const paciente = document.createElement('p');
            paciente.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            paciente.innerHTML = `<span class="fw-semibold text-uppercase">Paciente: </span> ${cita.paciente}`;

            const tel = document.createElement('p');
            tel.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            tel.innerHTML = `<span class="fw-semibold text-uppercase">Telefono: </span> ${cita.tel}`

            const obrasocial = document.createElement('p');
            obrasocial.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            obrasocial.innerHTML = `<span class="fw-semibold text-uppercase">Obra Social: </span> ${cita.obrasocial}`;

            const email = document.createElement('p');
            email.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            email.innerHTML = `<span class="fw-semibold text-uppercase">E-mail: </span> ${cita.email}`;

            const fecha = document.createElement('p');
            fecha.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            fecha.innerHTML = `<span class="fw-semibold text-uppercase">Fecha: </span> ${cita.fecha}`;

            const sintomas = document.createElement('p');
            sintomas.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            sintomas.innerHTML = `<span class="fw-semibold text-uppercase">Síntomas: </span> ${cita.sintomas}`;

            // se agrega botón Editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-primary', 'px-4', 'text-center', 'text-uppercase', 'btn-editar');
            btnEditar.innerHTML = '<i class="bi bi-pen">Editar</i>';
            const clone = structuredClone(cita)
            btnEditar.onclick = () => cargarEdicion(clone)



            // se agrega botón Eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'text-center', 'text-uppercase');
            btnEliminar.innerHTML = '<i class="bi bi-pencil-square">Eliminar</i>'
            btnEliminar.onclick = () => this.eliminar(cita.id)

            const administradorBotones = document.createElement('DIV')
            administradorBotones.classList.add('d-flex', 'justify-content-around', 'mt-10')


            administradorBotones.appendChild(btnEditar)
            administradorBotones.appendChild(btnEliminar)
            // Agregar al HTML
            divCita.appendChild(paciente);
            divCita.appendChild(tel)
            divCita.appendChild(obrasocial);
            divCita.appendChild(email);
            divCita.appendChild(fecha);
            divCita.appendChild(sintomas);
            divCita.appendChild(administradorBotones)
            administradorCitas.appendChild(divCita);
        });








    }
}




// Funciones
function datosCita(e) {
    citaObjeto[e.target.name] = e.target.value

}

const citas = new AdminCitas()

function submitCita(e) {
    e.preventDefault();

    if (Object.values(citaObjeto).some(valor => valor.trim() === '')) {
        new Notificacion({
            texto: 'Todos los campos son obligatorios',
            tipo: 'error'
        })
        return
    }
    if (editando) {
        citas.editar({...citaObjeto})
        new Notificacion({
            texto: 'Guardado correctamente',
            tipo: 'exito'
        })
    } else {
        citas.agregar({ ...citaObjeto })
        new Notificacion({
            texto: 'paciente registrado',
            tipo: 'exito'
        })
    }
    formulario.reset()
    reiniciarObjetoCita()
    formularioInput.textContent = 'Registra Paciente';
    editando = false
}

function reiniciarObjetoCita() {
    // REINICIAR OBJETO
    citaObjeto.id = generarId();
    citaObjeto.paciente = '';
    citaObjeto.tel = '';
    citaObjeto.obrasocial = '';
    citaObjeto.email = '';
    citaObjeto.fecha = '';
    citaObjeto.sintomas = '';

}

function generarId() {
    return Math.random().toString(34).substring(2) + Date.now();
}


function cargarEdicion(cita) {
    Object.assign(citaObjeto, cita)

    pacienteInput.value = cita.paciente
    telefonoInput.value = cita.tel
    obraSocialInput.value = cita.obrasocial
    emailInput.value = cita.email
    fechaIput.value = cita.fecha
    sintomasInput.value = cita.sintomas

    editando = true

    formularioInput.textContent = 'Guardar Cambios';
}

