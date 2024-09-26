document.getElementById('filtrarBtn').addEventListener('click', async function() {
  const departamentoSeleccionado = document.getElementById('opciones').value;
  const paisSeleccionado = document.getElementById('paises').value;
  const fraseSeleccionada = document.getElementById('buscador').value.trim();
  const pagina = 1; // Reiniciar siempre a la primera página cuando se cambia el filtro

  let url = '';

  if (departamentoSeleccionado !== "null" && departamentoSeleccionado !== "Opciones" && paisSeleccionado !== "paises" && fraseSeleccionada ==="") {
    url = `/filtrardepartamento/${encodeURIComponent(departamentoSeleccionado)}/pais/${encodeURIComponent(paisSeleccionado)}?page=${pagina}`;
  } else if (departamentoSeleccionado !== "null" && departamentoSeleccionado !== "Opciones" && paisSeleccionado === "paises" && fraseSeleccionada ==="") {
    url = `/filtrar/departamento/${encodeURIComponent(departamentoSeleccionado)}?page=${pagina}`;
  } else if (paisSeleccionado !== "paises" && departamentoSeleccionado === "null" || departamentoSeleccionado === "Opciones" && fraseSeleccionada ==="") {
    url = `/filtrar/pais/${encodeURIComponent(paisSeleccionado)}?page=${pagina}`;
  } else if(fraseSeleccionada != '' && departamentoSeleccionado === "Opciones" && paisSeleccionado === "paises"){
    url = `/filtrar/frase/${encodeURIComponent(fraseSeleccionada)}?page=${pagina}`;
  }else if (departamentoSeleccionado === "null" || departamentoSeleccionado === "Opciones" && paisSeleccionado === "paises" && fraseSeleccionada ===""){
    url = `/obras?page=${pagina}`
  }else if(departamentoSeleccionado === "null" || departamentoSeleccionado === "Opciones" && paisSeleccionado === "paises" && fraseSeleccionada != ""){
    url = `/filtrar/frase/${encodeURIComponent(fraseSeleccionada)}?page=${pagina}`
  }else if(departamentoSeleccionado === "null" || departamentoSeleccionado === "Opciones" && paisSeleccionado != "paises" && fraseSeleccionada !=""){
    url = `/filtrar/frase/${encodeURIComponent(fraseSeleccionada)}/pais/${encodeURIComponent(paisSeleccionado)}?page=${pagina}`
  } else if(paisSeleccionado === "paises" && departamentoSeleccionado != "null" && departamentoSeleccionado != "Opciones" && fraseSeleccionada !=""){
    url = `/filtrar/departamento/${encodeURIComponent(departamentoSeleccionado)}/frase/${encodeURIComponent(fraseSeleccionada)}?page=${pagina}`;
  } else if(departamentoSeleccionado != "null" && departamentoSeleccionado != "Opciones" && paisSeleccionado != "paises" && fraseSeleccionada !=""){
    url=`/filtrar/departamento/${encodeURIComponent(departamentoSeleccionado)}/frase/${encodeURIComponent(fraseSeleccionada)}/pais/${encodeURIComponent(paisSeleccionado)}?page=${pagina}`
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
  const fraseSeleccionada = document.getElementById('buscador').value.trim();
  let url = '';

  if (departamentoSeleccionado !== "null" && departamentoSeleccionado !== "Opciones" && paisSeleccionado !== "paises" && fraseSeleccionada ==="") {
    url = `/filtrardepartamento/${encodeURIComponent(departamentoSeleccionado)}/pais/${encodeURIComponent(paisSeleccionado)}?page=${nuevaPagina}`;
  } else if (departamentoSeleccionado !== "null" && departamentoSeleccionado !== "Opciones" && paisSeleccionado === "paises" && fraseSeleccionada ==="") {
    url = `/filtrar/departamento/${encodeURIComponent(departamentoSeleccionado)}?page=${nuevaPagina}`;
  } else if (paisSeleccionado !== "paises" && departamentoSeleccionado === "null" || departamentoSeleccionado === "Opciones" && fraseSeleccionada ==="") {
    url = `/filtrar/pais/${encodeURIComponent(paisSeleccionado)}?page=${nuevaPagina}`;
  } else if(fraseSeleccionada != '' && departamentoSeleccionado === "Opciones" && paisSeleccionado === "paises"){
    url = `/filtrar/frase/${encodeURIComponent(fraseSeleccionada)}?page=${nuevaPagina}`;
  }else if (departamentoSeleccionado === "null" || departamentoSeleccionado === "Opciones" && paisSeleccionado === "paises" && fraseSeleccionada ===""){
    url = `/obras?page=${nuevaPagina}`
  }else if(departamentoSeleccionado === "null" || departamentoSeleccionado === "Opciones" && paisSeleccionado === "paises" && fraseSeleccionada != ""){
    url = `/filtrar/frase/${encodeURIComponent(fraseSeleccionada)}?page=${nuevaPagina}`
  }else if(departamentoSeleccionado === "null" || departamentoSeleccionado === "Opciones" && paisSeleccionado != "paises" && fraseSeleccionada !=""){
    url = `/filtrar/frase/${encodeURIComponent(fraseSeleccionada)}/pais/${encodeURIComponent(paisSeleccionado)}?page=${nuevaPagina}`
  } else if(paisSeleccionado === "paises" && departamentoSeleccionado !== "null" || departamentoSeleccionado !== "Opciones" && fraseSeleccionada !=""){
    url = `/filtrar/departamento/${encodeURIComponent(departamentoSeleccionado)}/frase/${encodeURIComponent(fraseSeleccionada)}?page=${nuevaPagina}`;
  } else if(departamentoSeleccionado != "null" && departamentoSeleccionado != "Opciones" && paisSeleccionado != "paises" && fraseSeleccionada !=""){
    url=`/filtrar/departamento/${encodeURIComponent(departamentoSeleccionado)}/frase/${encodeURIComponent(fraseSeleccionada)}/pais/${encodeURIComponent(paisSeleccionado)}?page=${nuevaPagina}`
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
  const fraseSeleccionada = document.getElementById('buscador').value.trim();
  const paginaActual = parseInt(new URLSearchParams(window.location.search).get('page') || '1');
  const nuevaPagina = paginaActual - 1;
  let url = '';

  if(paginaActual === 1){
    alert("No se puede retroceder")
  }else{
    if (departamentoSeleccionado !== "null" && departamentoSeleccionado !== "Opciones" && paisSeleccionado !== "paises" && fraseSeleccionada ==="") {
      url = `/filtrardepartamento/${encodeURIComponent(departamentoSeleccionado)}/pais/${encodeURIComponent(paisSeleccionado)}?page=${nuevaPagina}`;
    } else if (departamentoSeleccionado !== "null" && departamentoSeleccionado !== "Opciones" && paisSeleccionado === "paises" && fraseSeleccionada ==="") {
      url = `/filtrar/departamento/${encodeURIComponent(departamentoSeleccionado)}?page=${nuevaPagina}`;
    } else if (paisSeleccionado !== "paises" && departamentoSeleccionado === "null" || departamentoSeleccionado === "Opciones" && fraseSeleccionada ==="") {
      url = `/filtrar/pais/${encodeURIComponent(paisSeleccionado)}?page=${nuevaPagina}`;
    } else if(fraseSeleccionada != '' && departamentoSeleccionado === "Opciones" && paisSeleccionado === "paises"){
      url = `/filtrar/frase/${encodeURIComponent(fraseSeleccionada)}?page=${nuevaPagina}`;
    }else if (departamentoSeleccionado === "null" || departamentoSeleccionado === "Opciones" && paisSeleccionado === "paises" && fraseSeleccionada ===""){
      url = `/obras?page=${nuevaPagina}`
    }else if(departamentoSeleccionado === "null" || departamentoSeleccionado === "Opciones" && paisSeleccionado === "paises" && fraseSeleccionada != ""){
      url = `/filtrar/frase/${encodeURIComponent(fraseSeleccionada)}?page=${nuevaPagina}`
    }else if(departamentoSeleccionado === "null" || departamentoSeleccionado === "Opciones" && paisSeleccionado != "paises" && fraseSeleccionada !=""){
      url = `/filtrar/frase/${encodeURIComponent(fraseSeleccionada)}/pais/${encodeURIComponent(paisSeleccionado)}?page=${nuevaPagina}`
    } else if(paisSeleccionado === "paises" && departamentoSeleccionado != "null" && departamentoSeleccionado != "Opciones" && fraseSeleccionada !=""){
      url = `/filtrar/departamento/${encodeURIComponent(departamentoSeleccionado)}/frase/${encodeURIComponent(fraseSeleccionada)}?page=${nuevaPagina}`;
    } else if(departamentoSeleccionado != "null" && departamentoSeleccionado != "Opciones" && paisSeleccionado != "paises" && fraseSeleccionada !=""){
      url=`/filtrar/departamento/${encodeURIComponent(departamentoSeleccionado)}/frase/${encodeURIComponent(fraseSeleccionada)}/pais/${encodeURIComponent(paisSeleccionado)}?page=${nuevaPagina}`
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
  }
});
