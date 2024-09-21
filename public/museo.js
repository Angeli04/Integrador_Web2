document.getElementById('filtrarBtn').addEventListener('click', async function() {
  const departamentoSeleccionado = document.getElementById('opciones').value;
  const paisSeleccionado = document.getElementById('paises').value;
  const pagina = 1; // Reiniciar siempre a la primera página cuando se cambia el filtro

  let url = '';

  if (departamentoSeleccionado !== "null" && departamentoSeleccionado !== "Opciones" && paisSeleccionado !== "paises") {
    url = `/filtrardepartamento/${encodeURIComponent(departamentoSeleccionado)}/pais/${encodeURIComponent(paisSeleccionado)}?page=${pagina}`;
  } else if (departamentoSeleccionado !== "null" && departamentoSeleccionado !== "Opciones") {
    url = `/filtrar/departamento/${encodeURIComponent(departamentoSeleccionado)}?page=${pagina}`;
  } else if (paisSeleccionado !== "paises") {
    url = `/filtrar/pais/${encodeURIComponent(paisSeleccionado)}?page=${pagina}`;
  }

  try {
    const response = await fetch(url);
    if (response.ok) {
      const html = await response.text();
      document.getElementById('obras').innerHTML = html;
      window.history.pushState({}, '', url);
    } else {
      console.error('Error en la respuesta del servidor:', response.statusText);
    }
  } catch (error) {
    console.error('Error al obtener las obras filtradas:', error);
  }
});



document.getElementById('paginaSiguiente').addEventListener('click', async function() {
  const departamentoSeleccionado = document.getElementById('opciones').value;
  const paisSeleccionado = document.getElementById('paises').value;
  const paginaActual = parseInt(new URLSearchParams(window.location.search).get('page') || '1');
  const nuevaPagina = paginaActual + 1;
  let url = '';

  if (departamentoSeleccionado !== "null" && departamentoSeleccionado !== "Opciones" && paisSeleccionado !== "paises") {
    url = `/filtrardepartamento/${encodeURIComponent(departamentoSeleccionado)}/pais/${encodeURIComponent(paisSeleccionado)}?page=${nuevaPagina}`;
  } else if (departamentoSeleccionado !== "null" && departamentoSeleccionado !== "Opciones") {
    url = `/filtrar/departamento/${encodeURIComponent(departamentoSeleccionado)}?page=${nuevaPagina}`;
  } else if (paisSeleccionado !== "paises") {
    url = `/filtrar/pais/${encodeURIComponent(paisSeleccionado)}?page=${nuevaPagina}`;
  } else {
    url = `/museo?page=${nuevaPagina}`; // Página principal si no hay filtros
  }

  try {
    const response = await fetch(url);
    if (response.ok) {
      const html = (await response.text());
      document.getElementById('obras').innerHTML = html;
      
      // Actualizar la URL en la barra de direcciones sin recargar la página
      window.history.pushState({}, '', url);
    } else {
      console.error('Error en la respuesta del servidor:', response.statusText);
    }
  } catch (error) {
    console.error('Error al obtener las obras filtradas:', error);
  }
});


document.getElementById('paginaAnterior').addEventListener('click', async function() {
  const departamentoSeleccionado = document.getElementById('opciones').value;
  const paisSeleccionado = document.getElementById('paises').value;
  const paginaActual = parseInt(new URLSearchParams(window.location.search).get('page') || '1');
  const nuevaPagina = paginaActual - 1;
  let url = '';

  if (departamentoSeleccionado !== "null" && departamentoSeleccionado !== "Opciones" && paisSeleccionado !== "paises") {
    url = `/filtrardepartamento/${encodeURIComponent(departamentoSeleccionado)}/pais/${encodeURIComponent(paisSeleccionado)}?page=${nuevaPagina}`;
  } else if (departamentoSeleccionado !== "null" && departamentoSeleccionado !== "Opciones") {
    url = `/filtrar/departamento/${encodeURIComponent(departamentoSeleccionado)}?page=${nuevaPagina}`;
  } else if (paisSeleccionado !== "paises") {
    url = `/filtrar/pais/${encodeURIComponent(paisSeleccionado)}?page=${nuevaPagina}`;
  } else {
    url = `/museo?page=${nuevaPagina}`; // Página principal si no hay filtros
  }

  try {
    const response = await fetch(url);
    if (response.ok) {
      const html = await response.text();
      document.getElementById('obras').innerHTML = html;
      
      // Actualizar la URL en la barra de direcciones sin recargar la página
      window.history.pushState({}, '', url);
    } else {
      console.error('Error en la respuesta del servidor:', response.statusText);
    }
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