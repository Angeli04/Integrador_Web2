import { traducir, getArt } from './obras.js';

export function paginarObrasDepartamento(obrasPorPagina, idDepartment) {
    
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

        console.log(`Ultimo ID guardado: ${indiceID}`)

        return obrasGuardadas.slice(inicio, final); // Devuelve las obras de la página solicitada
    };
}


export async function obtenerIdsDepartamento(id) {
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



export async function obtenerIdsPaises(pais) {
  
  try{
    const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${pais}&q=""`)
    const data = await response.json()
    const idObras  = data.objectIDs;

    if(!idObras || idObras.length === 0){
      console.log("No se encontraron obras en este departamento.")
      return []
    }

    return idObras;
  } catch (error) {
    console.error("Error al obtener los IDs del pais:", error);
    return [];
  }

}

export function paginarObrasPais(obrasPorPagina,nombrePais) {
    let indiceID = 0;
    let obrasGuardadas = []

    return async function obtenerPaginaPais(pagina) {
        const aver = await obtenerIdsPaises(nombrePais)
        let inicio = (pagina-1) * obrasPorPagina
        let final = pagina * obrasPorPagina;

        if (obrasGuardadas.length >= final) {
            return obrasGuardadas.slice(inicio, final)
        }

        while (obrasGuardadas.length < final && indiceID < aver.length) {
            const obraData = await getArt(aver[indiceID])

            if(obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)){
                obrasGuardadas.push(obraData);
                console.log(`${aver[indiceID]} Conseguido`)
            } else {
                console.log(`${aver[indiceID]} Duplicado o no disponible`)
            }
            indiceID++;
        }
        console.log(`Ultimo ID guardado: ${indiceID}`)
        return obrasGuardadas.slice(inicio,final);
    };
}