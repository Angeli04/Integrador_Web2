if (window.obrasDeArte) {
  console.log(window.obrasDeArte);
} else {
  console.log("obrasDeArte no está disponible.");
}

document.getElementById('filtrarBtn').addEventListener('click', async function() {
  const departamentoSeleccionado = document.getElementById('opciones').value;
  const paisSeleccionado = document.getElementById('paises').value;
  const pagina = 1; // Reiniciar la página a 1 cuando cambies de filtro

  let url = '/filtrar?page=' + pagina;

  if (departamentoSeleccionado != null) {
    url += `&departamentoId=${departamentoSeleccionado}`;
  }

  if (paisSeleccionado != null) {
    url += `&pais=${paisSeleccionado}`;
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    document.getElementById('obras').innerHTML = ''
    console.log(html)
    // Aquí simplemente insertas el HTML en el contenedor de las obras sin parsearlo como JSON
    document.getElementById('obras').innerHTML = html;
  } catch (error) {
    console.error('Error al obtener las obras filtradas:', error);
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