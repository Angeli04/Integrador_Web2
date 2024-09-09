// Verifica si `obrasDeArte` está definido en `window`
if (window.obrasDeArte) {
    console.log(window.obrasDeArte);
  } else {
    console.log("obrasDeArte no está disponible.");
}

let departamentos = []

window.obrasDeArte.forEach(element => {
    departamentos.push(element.departamento)
});

let departamentosFiltrados = [... new Set(departamentos)]
console.log(departamentosFiltrados)