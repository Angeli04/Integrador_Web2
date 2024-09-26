import { response } from 'express';
import { traducir, getArt } from './obras.js';

export function paginarObrasDepartamento() {
    let indiceID = 0;
    let obrasGuardadas = [];
    let ultimoDepartamento = null; // Para verificar si el departamento cambia

    return async function obtenerPaginaDpto(pagina, obrasPorPagina, idDepartment) {
        // Verifica si el departamento cambió
        if (idDepartment !== ultimoDepartamento) {
            // Si el departamento cambió, resetea el indice y las obras guardadas
            indiceID = 0;
            obrasGuardadas = [];
            ultimoDepartamento = idDepartment; // Actualiza el ultimo departamento
        }

        const aver = await obtenerIdsDepartamento(idDepartment);
        let inicio = (pagina - 1) * obrasPorPagina;
        let final = pagina * obrasPorPagina;

        // Si ya tiene suficientes obras guardadas para cubrir la página solicitada
        if (obrasGuardadas.length >= final) {
            return obrasGuardadas.slice(inicio, final);
        }

        // Si no tienee suficientes obras, sigue obteniendo hasta llenar la página
        while (obrasGuardadas.length < final && indiceID < aver.length) {
            const obraData = await getArt(aver[indiceID]);

            if (obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)) {
                obrasGuardadas.push(obraData);
                console.log(`${aver[indiceID]} Conseguido`);
            } else {
                console.log(`${aver[indiceID]} Duplicado o no disponible`);
            }
            indiceID++;
        }

        console.log(`Ultimo ID guardado: ${indiceID}`);

        return obrasGuardadas.slice(inicio, final);
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

export function paginarObrasPais() {
    let indiceID = 0;
    let obrasGuardadas = [];
    let ultimoPais = null;  // Variable para almacenar el último país consultado

    return async function obtenerPaginaPais(pagina, obrasPorPagina, nombrePais) {
        // Si el país cambió, reiniciamos las variables internas
        if (nombrePais !== ultimoPais) {
            indiceID = 0;
            obrasGuardadas = [];
            ultimoPais = nombrePais;
            console.log(`Cambio de país detectado: Reiniciando obras guardadas para ${nombrePais}`);
        }

        const aver = await obtenerIdsPaises(nombrePais);
        let inicio = (pagina - 1) * obrasPorPagina;
        let final = pagina * obrasPorPagina;

        if (obrasGuardadas.length >= final) {
            return obrasGuardadas.slice(inicio, final);
        }

        while (obrasGuardadas.length < final && indiceID < aver.length) {
            const obraData = await getArt(aver[indiceID]);

            if (obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)) {
                obrasGuardadas.push(obraData);
                console.log(`${aver[indiceID]} Conseguido`);
            } else {
                console.log(`${aver[indiceID]} Duplicado o no disponible`);
            }
            indiceID++;
        }
        console.log(`Ultimo ID guardado: ${indiceID}`);
        return obrasGuardadas.slice(inicio, final);
    };
}

export function paginarObrasDepartamentoPais() {
    let indiceID = 0;
    let obrasGuardadas = [];
    let ultimoDepartamento = null;
    let ultimoPais = null;

    return async function obtenerPaginaDepartamentoPais(pagina, obrasPorPagina, idDepartment, nombrePais) {
        // Verifica si el departamento o el país han cambiado
        if (idDepartment !== ultimoDepartamento || nombrePais !== ultimoPais) {
            // Si el departamento o país cambian, resetea el índice y las obras guardadas
            indiceID = 0;
            obrasGuardadas = [];
            ultimoDepartamento = idDepartment; // Actualiza el último departamento
            ultimoPais = nombrePais; // Actualiza el último país
        }

        const idsPaises = await obtenerIdsPaises(nombrePais);
        const idsDepartamento = await obtenerIdsDepartamento(idDepartment);
        const idsCompletos = idsPaises.filter(numero => idsDepartamento.includes(numero));

        let inicio = (pagina - 1) * obrasPorPagina;
        let final = pagina * obrasPorPagina;

        // Si ya tienes suficientes obras guardadas para cubrir la página solicitada
        if (obrasGuardadas.length >= final) {
            return obrasGuardadas.slice(inicio, final);
        }

        // Si no tienes suficientes obras, sigue obteniendo hasta llenar la página
        while (obrasGuardadas.length < final && indiceID < idsCompletos.length) {
            const obraData = await getArt(idsCompletos[indiceID]);

            if (obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)) {
                obrasGuardadas.push(obraData);
                console.log(`${idsCompletos[indiceID]} Conseguido`);
            } else {
                console.log(`${idsCompletos[indiceID]} Duplicado o no disponible`);
            }
            indiceID++;
        }

        console.log(`Ultimo ID guardado: ${indiceID}`);

        return obrasGuardadas.slice(inicio, final);
    };
}

async function obtenerIdsFrase(frase){
    try{
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=&q=${encodeURIComponent(frase)}`)
        const data = await response.json()
        const idObras = data.objectIDs;

        if(!idObras || idObras.length === 0){
            console.log("No se encontraron obras en este departamento.")
            return []
        }
        return idObras
    } catch (error) {
        console.error("Error al obtener los IDs del pais:", error);
        return [];
    }
}

export function paginarObrasFrase() {
    let indiceID = 0;
    let obrasGuardadas = [];
    let ultimaFrase = null;

    return async function obtenerPaginaFrase(pagina, obrasPorPagina, frase) {
        // Verifica si la frase ha cambiado
        if (frase !== ultimaFrase) {
            // Si la frase cambia, resetea el índice y las obras guardadas
            indiceID = 0;
            obrasGuardadas = [];
            ultimaFrase = frase; // Actualiza la última frase
        }

        const aver = await obtenerIdsFrase(frase); // Obtiene un arreglo de IDs que contienen la frase
        let inicio = (pagina - 1) * obrasPorPagina;
        let final = pagina * obrasPorPagina;

        // Si ya tienes suficientes obras guardadas para cubrir la página solicitada
        if (obrasGuardadas.length >= final) {
            return obrasGuardadas.slice(inicio, final);
        }

        // Si no tienes suficientes obras, sigue obteniendo hasta llenar la página
        while (obrasGuardadas.length < final && indiceID < aver.length) {
            const obraData = await getArt(aver[indiceID]);

            if (obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)) {
                obrasGuardadas.push(obraData);
                console.log(`${aver[indiceID]} Conseguido`);
            } else {
                console.log(`${aver[indiceID]} Duplicado o no disponible`);
            }
            indiceID++;
        }

        console.log(`Ultimo ID guardado: ${aver[indiceID]}`);

        return obrasGuardadas.slice(inicio, final);
    };
}

async function obtenerIdsFrasePais(frase,pais) {
    
    try{
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?geoLocation=${pais}&q=${frase}`)
        const data = await response.json()
        const idObras = data.objectIDs
        if(!idObras || idObras.length === 0){
            console.log("No se encontraron obras en este departamento.")
            return []
        }
        return idObras

    } catch (error) {
        console.error("Error al obtener los IDs del pais:", error);
        return [];
    }

}

export function paginarObrasFrasePais() {
    let indiceID = 0;
    let obrasGuardadas = [];
    let ultimaFrase = null;
    let ultimoPais = null;

    return async function obtenerPaginaFrasePais(pagina, obrasPorPagina, frase, pais) {
        // Verifica si la frase o el país han cambiado
        if (frase !== ultimaFrase || pais !== ultimoPais) {
            // Si cambian, reinicia el índice y las obras guardadas
            indiceID = 0;
            obrasGuardadas = [];
            ultimaFrase = frase; // Actualiza la última frase
            ultimoPais = pais;   // Actualiza el último país
        }

        const aver = await obtenerIdsFrasePais(frase, pais); // Obtiene un arreglo de IDs que contienen la frase y el país
        let inicio = (pagina - 1) * obrasPorPagina;
        let final = pagina * obrasPorPagina;

        // Si ya tienes suficientes obras guardadas para cubrir la página solicitada
        if (obrasGuardadas.length >= final) {
            return obrasGuardadas.slice(inicio, final);
        }

        // Si no tienes suficientes obras, sigue obteniendo hasta llenar la página
        while (obrasGuardadas.length < final && indiceID < aver.length) {
            const obraData = await getArt(aver[indiceID]);

            if (obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)) {
                obrasGuardadas.push(obraData);
                console.log(`${aver[indiceID]} Conseguido`);
            } else {
                console.log(`${aver[indiceID]} Duplicado o no disponible`);
            }
            indiceID++;
        }

        console.log(`Ultimo ID guardado: ${aver[indiceID]}`);

        return obrasGuardadas.slice(inicio, final);
    };
}

async function obtenerIdsDepartamentoFrase(departamento,frase) {
    try{
        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${departamento}&q=${frase}`)
        const data = await response.json()
        const idObras = data.objectIDs
        if(!idObras || idObras.length === 0){
            console.log("No se encontraron obras en este departamento.")
            return []
        }
        return idObras

    } catch (error) {
        console.error("Error al obtener los IDs del pais:", error);
        return [];
    }
}

export function paginarObrasDepartamentoFrase() {
    let indiceID = 0;
    let obrasGuardadas = [];
    let ultimaFrase = null;
    let ultimoDepartamento = null;

    return async function obtenerPaginaDepartamentoFrase(pagina, obrasPorPagina, frase, departamento) {
        // Verifica si la frase o el departamento han cambiado
        if (frase !== ultimaFrase || departamento !== ultimoDepartamento) {
            // Si cambian, reinicia el índice y las obras guardadas
            indiceID = 0;
            obrasGuardadas = [];
            ultimaFrase = frase; // Actualiza la última frase
            ultimoDepartamento = departamento; // Actualiza el último departamento
        }

        const aver = await obtenerIdsDepartamentoFrase(departamento, frase); // Obtiene un arreglo de IDs que contienen la frase y el departamento
        let inicio = (pagina - 1) * obrasPorPagina;
        let final = pagina * obrasPorPagina;

        // Si ya tienes suficientes obras guardadas para cubrir la página solicitada
        if (obrasGuardadas.length >= final) {
            return obrasGuardadas.slice(inicio, final);
        }

        // Si no tienes suficientes obras, sigue obteniendo hasta llenar la página
        while (obrasGuardadas.length < final && indiceID < aver.length) {
            const obraData = await getArt(aver[indiceID]);

            if (obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)) {
                obrasGuardadas.push(obraData);
                console.log(`${aver[indiceID]} Conseguido`);
            } else {
                console.log(`${aver[indiceID]} Duplicado o no disponible`);
            }
            indiceID++;
        }

        console.log(`Ultimo ID guardado: ${aver[indiceID]}`);

        return obrasGuardadas.slice(inicio, final);
    };
}

async function obtenerIdsDepartamentoFrasePais(departamento,frase,pais) {

    try{
        const idsDepartamento = await obtenerIdsDepartamentoFrase(departamento,frase)
        //const idsFrase = await obtenerIdsDepartamento(departamento,frase)
        const idsPais = await obtenerIdsFrasePais(frase,pais)
        const idObras = idsDepartamento.filter(id=>idsPais.includes(id));
        if(!idObras || idObras.length === 0){
            console.log("No se encontraron obras en este departamento.")
            return []
        }
        return idObras

    } catch (error) {
        console.error("Error al obtener los IDs del pais:", error);
        return [];
    }
}

export function paginarObrasCompleto() {
    let indiceID = 0;
    let obrasGuardadas = [];
    let ultimaFrase = null;
    let ultimoDepartamento = null;
    let ultimoPais = null;

    return async function obtenerPaginaCompleto(pagina, obrasPorPagina, frase, departamento, pais) {
        // Verifica si alguno de los parámetros ha cambiado
        if (frase !== ultimaFrase || departamento !== ultimoDepartamento || pais !== ultimoPais) {
            // Si cambian, reinicia el índice y las obras guardadas
            indiceID = 0;
            obrasGuardadas = [];
            ultimaFrase = frase; // Actualiza el último valor de frase
            ultimoDepartamento = departamento; // Actualiza el último valor de departamento
            ultimoPais = pais; // Actualiza el último valor de país
        }

        const aver = await obtenerIdsDepartamentoFrasePais(departamento, frase, pais); // Obtiene los IDs que cumplen con todos los filtros
        let inicio = (pagina - 1) * obrasPorPagina;
        let final = pagina * obrasPorPagina;

        // Si ya tienes suficientes obras guardadas para cubrir la página solicitada
        if (obrasGuardadas.length >= final) {
            return obrasGuardadas.slice(inicio, final);
        }

        // Si no tienes suficientes obras, sigue obteniendo hasta llenar la página
        while (obrasGuardadas.length < final && indiceID < aver.length) {
            const obraData = await getArt(aver[indiceID]);

            if (obraData && !obrasGuardadas.some(o => o.titulo === obraData.titulo && o.fechaCreacion === obraData.fechaCreacion)) {
                obrasGuardadas.push(obraData);
                console.log(`${aver[indiceID]} Conseguido`);
            } else {
                console.log(`${aver[indiceID]} Duplicado o no disponible`);
            }
            indiceID++;
        }

        console.log(`Ultimo ID guardado: ${aver[indiceID]}`);

        return obrasGuardadas.slice(inicio, final);
    };
}