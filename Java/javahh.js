document.getElementById('producto').addEventListener('change', function () {
    const precio = this.options[this.selectedIndex].dataset.precio;
    document.getElementById('precio').value = precio || '';
});
document.getElementById('formCotizacion').addEventListener('submit', function (e) {
    e.preventDefault();
    const producto = document.getElementById('producto').value;
    const cantidad = parseFloat(document.getElementById('cantidad').value);
    const precio = parseFloat(document.getElementById('precio').value);
    const total = cantidad * precio;

    const tableBody = document.querySelector('#tablaCotizacion tbody');
    let encontrado = false;
    const rows = document.querySelectorAll('#tablaCotizacion tbody tr');
    rows.forEach(row => {
        if (row.cells[0].textContent === producto) {
            encontrado = true;
            if (confirm(`El producto "${producto}" ya está en la cotización. ¿Deseas actualizar la cantidad?`)) {
                const nuevaCantidad = prompt(`Cantidad actual: ${row.cells[1].textContent}. Ingresa la nueva cantidad:`);
                if (nuevaCantidad && !isNaN(nuevaCantidad) && parseFloat(nuevaCantidad) > 0) {
                    const cantidadNueva = parseFloat(nuevaCantidad);
                    row.cells[1].textContent = cantidadNueva;
                    row.cells[3].textContent = (cantidadNueva * precio).toFixed(2);
                    actualizarTotal();
                }
            }
        }
    });

    if (!encontrado) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto}</td>
            <td>${cantidad}</td>
            <td>${precio.toFixed(2)}</td>
            <td>${total.toFixed(2)}</td>
            <td><button class="eliminar">Eliminar</button></td>`;
        tableBody.appendChild(row);
        document.getElementById('formCotizacion').reset();
        document.getElementById('precio').value = '';
        actualizarTotal();
    }
});
document.querySelector('#tablaCotizacion').addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('eliminar')) {
        e.target.parentElement.parentElement.remove();
        actualizarTotal();
    }
});

function actualizarTotal() {
    let total = 0;
    const rows = document.querySelectorAll('#tablaCotizacion tbody tr');
    rows.forEach(row => {
        const totalCelda = parseFloat(row.cells[3].textContent);
        total += totalCelda;
    });
    document.getElementById('totalCotizacion').textContent = total.toFixed(2);
}


function comprobarHorario() {
    const ahora = new Date();
    const diaSemana = ahora.getDay();
    const horaActual = ahora.getHours();
    const minutoActual = ahora.getMinutes();


    const horarioLunesAViernes = [
        { inicio: 7, fin: 12 }, // 8 AM - 12 PM
        { inicio: 14, fin: 18 } // 2 PM - 6 PM
    ];
    const horarioSabados = [
        { inicio: 7, fin: 12 } // 8 AM - 12 PM
    ];


    let estaAbierto = false;

    if (diaSemana >= 1 && diaSemana <= 5) {
        estaAbierto = horarioLunesAViernes.some(rango => {
            return (horaActual > rango.inicio || (horaActual === rango.inicio && minutoActual >= 0)) &&
                (horaActual < rango.fin || (horaActual === rango.fin && minutoActual === 0));
        });
    } else if (diaSemana === 6) { // Sábado
        estaAbierto = horarioSabados.some(rango => {
            return (horaActual > rango.inicio || (horaActual === rango.inicio && minutoActual >= 0)) &&
                (horaActual < rango.fin || (horaActual === rango.fin && minutoActual === 0));
        });
    }


    const estadoElemento = document.getElementById("estado");
    if (estaAbierto) {
        estadoElemento.textContent = "¡Estamos Abiertos!";
        estadoElemento.classList.remove("cerrado");
        estadoElemento.classList.add("abierto");
    } else {
        estadoElemento.textContent = "Nuestra tienda  esta Cerrada";
        estadoElemento.classList.remove("abierto");
        estadoElemento.classList.add("cerrado");
        let horario_mostrar = "Lunes a Viernes de 8am a 12M - de 2pm a 6pm; sabado de 8am a 12M"
        document.getElementById("horario").innerHTML = horario_mostrar;
    }
}
window.onload = comprobarHorario;