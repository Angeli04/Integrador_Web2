import translate from 'node-google-translate-skidz'
import { Obra } from './obra.js';

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

async function getArt(id) {
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

export function paginarObras(obrasPorPagina, idDepartment) {
    
    let indiceID = 0;  // Índice que mantendremos a través del closure
    let obrasGuardadas = []; // Aquí se almacenarán todas las obras obtenidas

    // Este closure mantiene el estado de `indiceID` y `obrasGuardadas`
    return async function obtenerPaginaDpto(pagina) {
        const aver = await obtenerIdsDepartamento(idDepartment); // Obtiene los IDs del departamento
        let inicio = (pagina - 1) * obrasPorPagina;
        let final = pagina * obrasPorPagina;

        // Si ya tienes suficientes obras guardadas para cubrir la página solicitada
        if (obrasGuardadas.length >= final) {
            // Devuelve las obras ya guardadas de esa página
            return obrasGuardadas.slice(inicio, final);
        }

        // Si no tienes suficientes obras, sigue obteniendo hasta llenar la página
        while (obrasGuardadas.length < final && indiceID < aver.length) {
            const obraData = await getArt(aver[indiceID]);  // Obtén la obra usando el ID actual del array

            if (obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)) {
                obrasGuardadas.push(obraData); // Guarda la obra en `obrasGuardadas`
                console.log(`${aver[indiceID]} Conseguido`);
            } else {
                console.log(`${aver[indiceID]} Duplicado o no disponible`);
            }
            indiceID++;  // Incrementa el índice para obtener el siguiente ID
        }

        if (indiceID >= aver.length) {
            console.log('No hay más obras disponibles.');
        }

        return obrasGuardadas.slice(inicio, final); // Devuelve las obras de la página solicitada
    };
}


async function obtenerIdsDepartamento(id) {
    try {
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${id}`);
        const data = await response.json();  // Convertir la respuesta a JSON
        const idObras = data.objectIDs;  // Acceder al arreglo objectIDs
        
        if (!idObras || idObras.length === 0) {
            console.log("No se encontraron obras en este departamento.");
            return [];
        }
        
        return idObras;  // Devolver el arreglo de IDs de las obras
    } catch (error) {
        console.error("Error al obtener los IDs del departamento:", error);
        return [];
    }
}
