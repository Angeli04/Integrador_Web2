import translate from 'node-google-translate-skidz'
import { Obra } from './obra.js';

export async function getArt(id) {
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
  
  try{
    const response = await fetch(url);
    if(!response.ok){
      throw Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    
    const imagenes = {
      primaria: data.primaryImage || '/no-disponible.jpg',  // Imagen principal
      miniatura: data.primaryImageSmall || null,  // Imagen en miniatura
      adicionales: {
        primera: data.additionalImages?.[0] || null,
        segunda: data.additionalImages?.[1] || null,
        tercera: data.additionalImages?.[2] || null,
        cuarta: data.additionalImages?.[3] || null
      }
    };
    let cultura,departamento,pais,titulo,dinastia

    if(data.culture){
      cultura = await traducir(data.culture)
    }else{
      cultura=""
    }

    if(data.department){
      departamento = await traducir(data.department)
    }else{
      departamento =""
    }

    if (data.country) {
      pais = await traducir(data.country)    
    } else {
      pais = ""
    }
    
    if (data.title) {
      titulo = await traducir(data.title)   

    } else {
      titulo = ""
    }

    if (data.dynasty) {
      dinastia = await traducir(data.dynasty)

    } else {
      dinastia=""
    }


    let obraObtenida = new Obra(
      data.objectID,
      departamento,
      pais,
      imagenes,
      titulo,
      cultura,
      dinastia,
      data.objectBeginDate
    )

    return obraObtenida
  }catch (error) { 
    console.log(`Error obteniendo la data: ${error}`);
  }
}

function paginarObras(obrasPorPagina) {
  let ultID = 1;
  let obrasGuardadas = []; // Aquí se almacenarán todas las obras obtenidas

  return async function obtenerPagina(pagina) {
    let inicio = (pagina - 1) * obrasPorPagina;
    let final = pagina * obrasPorPagina;

    // Si ya tienes suficientes obras guardadas para cubrir la página solicitada
    if (obrasGuardadas.length >= final) {
      // Devuelve las obras ya guardadas de esa página
      return obrasGuardadas.slice(inicio, final);
    }

    // Si no tienes suficientes obras, sigue obteniendo hasta llenar la página
    while (obrasGuardadas.length < final) {
      const obraData = await getArt(ultID);

      if (obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)) {
        obrasGuardadas.push(obraData); // Guarda la obra en `obrasGuardadas`
        console.log(`${ultID} Conseguido`);
      } else {
        console.log(`${ultID} Duplicado o no disponible`);
      }
      ultID++;
    }

    console.log(`Ultimo ID guardado: ${ultID}`);
    return obrasGuardadas.slice(inicio, final); // Devuelve las obras de la página solicitada
  };
}



function traducir(frase) {
  return new Promise((resolve, reject) => {
    translate({
      text: frase,
      source: 'en',
      target: 'es'
    }, function(result) {
      if (result.error) {
        reject(result.error);
      } else {
        resolve(result.translation);
      }
    });
  });
}

export const obtenerPagina = paginarObras(20)