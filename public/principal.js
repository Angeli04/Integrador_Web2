if (window.obrasDeArte) {
  console.log(window.obrasDeArte);
} else {
  console.log("obrasDeArte no está disponible.");
}

document.getElementById('filtrarBtn').addEventListener('click', async function() {
const departamentoSeleccionado = document.getElementById('opciones').value;
const pagina = 1; // Reiniciar la página a 1 cuando cambies de departamento

if (departamentoSeleccionado) {
  try {
    // Hacer una petición al servidor para obtener las obras filtradas
    const response = await fetch(`/filtrar?departamentoId=${departamentoSeleccionado}&page=${pagina}`);
    const html = await response.text();
    document.querySelector('body').innerHTML = html; // Reemplaza el contenido del body con la nueva página renderizada
  } catch (error) {
    console.error('Error al obtener las obras filtradas:', error);
  }
}
});

// Si el botón de limpiar filtro es presionado, reseteamos a la página general sin filtros
document.getElementById('limpiarFiltroBtn').addEventListener('click', async function() {
  try {
    const response = await fetch(`/`);  // Llamamos a la ruta sin filtro
    const html = await response.text();
    document.querySelector('body').innerHTML = html;
  } catch (error) {
    console.error('Error al limpiar el filtro:', error);
  }
});