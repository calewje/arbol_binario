/* 
//                        + ---> aplica una operacion UNA O MÁS VECES 
//                                          gm ---> global macht
const validacion = /^[0-9]+[+\-/*]{1}[0-9]+$/;
const validacion2 = /^[0-9]+[+\-/*][(][0-9]+[+\-/*]{1}[0-9]+[)]+$/;
const validacion3 = /^[(][0-9]+[+\-/*]{1}[0-9]+[)]+[+\-/*]{1}[0-9]+$/;
const validacion5 = /^[(][0-9]+[+\-/*]{1}[0-9]+[)]+[+\-/*]{1}[(][0-9]+[+\-/*]{1}[0-9]+[)]/;
*/

const validacionGeneral = /^[0-9a-zA-Z+\-*/() ]+$/;

//Se guardara todo lo que tenga el boton
let btn1 = document.getElementById("btn_generar");
let arbol = document.getElementById("contenido_arbol");
 

const estilos ={
    color:'#98f1eaff',
    outline: false,
    endPlugOutline:false,
    endPlugSize: 1,
    startPlug: 'behind',
    endPlug: 'behind'
}

const nodo = (valor,id)=>{
    return `<div class='col-2 align-self-end'><span id="${id}" class='btn btn-success rounded-circle'>${valor}</span></div>`
}
const nodo2  = (valor,id)=>{ 
    return  `<div class='col-3'><span id="${id}" class='btn btn-primary rounded-circle'>${valor}<span></div>`
}
/* const nodo3 = (valor,id)=>{
    return `<div class='col-2 align-self-end'><span id="${id}" class='btn btn-success rounded-circle'>${valor}</span></div>`
}  */
//"<div class='row justify-content-around'>"+"<div class='col-2 text-center'>|</div>"+"<div class='col-3 text-center'></div>"+"<div class='col-2 text-center'>|</div>"+"</div>"
const tokenizar = (expresion) => {
    return expresion.match(/[a-zA-Z]+|\d+|[()+\-*/]/g) || [];
};

const construirArbol = (tokens) => {
    let pilaOperandos = [];
    let pilaOperadores = [];

    const prioridad = { "+": 1, "-": 1, "*": 2, "/": 2 };

    const aplicarOperador = () => {
        let operador = pilaOperadores.pop();
        let derecha = pilaOperandos.pop();
        let izquierda = pilaOperandos.pop();
        pilaOperandos.push({ valor: operador, izq: izquierda, der: derecha });
    };

    tokens.forEach(t => {
    if (/^[a-zA-Z0-9]+$/.test(t)) {  // acepta números y variables
        pilaOperandos.push({ valor: t });
    } else if (t === "(") {
        pilaOperadores.push(t);
    } else if (t === ")") {
        while (pilaOperadores[pilaOperadores.length - 1] !== "(") {
            aplicarOperador();
        }
        pilaOperadores.pop();
    } else {
        while (pilaOperadores.length &&
            prioridad[pilaOperadores[pilaOperadores.length - 1]] >= prioridad[t]) {
            aplicarOperador();
        }
        pilaOperadores.push(t);
    }
});

    while (pilaOperadores.length) {
        aplicarOperador();
    }

    return pilaOperandos[0]; // raíz del árbol
};

let idCounter = 0;

const dibujarArbol = (nodoActual, contenedorId) => {
    if (!nodoActual) return null;

    const nodoId = `n${idCounter++}`;

    // Crear contenedor para este subárbol
    let contenedor = document.createElement("div");
    contenedor.className = "d-flex flex-column align-items-center m-3";

    // Nodo actual
    let nodoHTML = document.createElement("div");
    nodoHTML.innerHTML = nodoActual.izq || nodoActual.der
        ? nodo2(nodoActual.valor, nodoId)
        : nodo(nodoActual.valor, nodoId);

    contenedor.appendChild(nodoHTML);

    // Si tiene hijos → fila para hijos
    if (nodoActual.izq || nodoActual.der) {
        let filaHijos = document.createElement("div");
        filaHijos.className = "d-flex justify-content-around w-100 m-3";

        if (nodoActual.izq) filaHijos.appendChild(dibujarArbol(nodoActual.izq, nodoId));
        if (nodoActual.der) filaHijos.appendChild(dibujarArbol(nodoActual.der, nodoId));

        contenedor.appendChild(filaHijos);
    }

    // 🚨 OJO: conectar al padre solo después de que esté insertado en el DOM
    setTimeout(() => {
        if (contenedorId) {
            new LeaderLine(
                document.getElementById(contenedorId),
                document.getElementById(nodoId),
                estilos
            );
        }
    }, 0);

    return contenedor;
};


function preOrden(nodo) {
    if (!nodo) return [];
    return [nodo.valor].concat(preOrden(nodo.izq), preOrden(nodo.der));
}

function inOrden(nodo) {
    if (!nodo) return [];
    return inOrden(nodo.izq).concat([nodo.valor], inOrden(nodo.der));
}

function postOrden(nodo) {
    if (!nodo) return [];
    return postOrden(nodo.izq).concat(postOrden(nodo.der), [nodo.valor]);
}


    btn1.addEventListener("click",()=>{
        let expresion = document.getElementById("expresion").value;
        // validara la expresis

         if (!validacionGeneral.test(expresion)) {
        alert("Expresión inválida.");
        return;
    }

    arbol.innerHTML = ""; // limpiar antes
    idCounter = 0;

        /* if(validacion.test(expresion)){

        let hojas = expresion.split(/[+-/*]/);
        let operador = expresion.split(/[0-9]/);
        let operador2 = operador.filter(Boolean);
        console.log(operador2);

            arbol.innerHTML = nodo(hojas[0],"a");
            arbol.innerHTML += nodo2(operador2,"o");
            arbol.innerHTML += nodo(hojas[1],"b");

        new LeaderLine(
                document.getElementById("o"),
                document.getElementById("a"),
                estilos
            )
            new LeaderLine(
                document.getElementById("o"),
                document.getElementById("b"),
                estilos
            )

        }else if(validacion2.test(expresion)){
            //let hojas2 = expresion.split(/[(][+-/*]/)
            //                      split() ----> nos ayuda a combertir de una cadena a un arreglo  
            //                              --> se le puede pasar una expresion regular
            let hojas = expresion.split(/[+-/*]/);
            let operador1 = expresion.split(/[0-9]/);
            let operador3 = operador1.filter(Boolean);
            let hojas2 = hojas[1].replace("(","");
            let hojas3 = hojas[2].replace(")","");
            console.log(hojas);
            console.log(operador3);
            
            arbol.innerHTML = nodo(hojas[0],"c");
            arbol.innerHTML += nodo2(operador3[0].replace("(",""),"o");
            //arbol.innerHTML += "<div class='col-2 text-center'></div>";
            arbol.innerHTML += nodo(operador3[1],"o2");
            arbol.innerHTML += `<div class='row'></div>`;
            
            arbol.innerHTML += `<div class='col-2'></div><div class='col-2'></div><div class='col-2'></div>`;
            arbol.innerHTML += nodo3(hojas2,"a");
            arbol.innerHTML += nodo3(hojas3,"b");

            

            //arbol.innerHTML += nodo2(hojas2[1],"c");

            
            new LeaderLine(
                document.getElementById("o"),
                document.getElementById("o2"),
                estilos
            )

            new LeaderLine(
                document.getElementById("o"),
                document.getElementById("c"),
                estilos
            )
            new LeaderLine(
                document.getElementById("o2"),
                document.getElementById("a"),
                estilos
            )
            new LeaderLine(
                document.getElementById("o2"),
                document.getElementById("b"),
                estilos
            )
            //alert("Hojas: "+hojas + "\n" + "Operador: " + operador);

            //alert("Cumple");
        } else if(validacion3.test(expresion)){
            //let hojas2 = expresion.split(/[(][+-/*]/)
            //                      split() ----> nos ayuda a combertir de una cadena a un arreglo  
            //                              --> se le puede pasar una expresion regular
            let hojas = expresion.split(/[)]+[+-/*]/);
            let operador1 = expresion.split(/[0-9]/);
            let operador3 = operador1.filter(Boolean);
            let operador2 = operador3[2].replace(")","");
            let hojas2 = hojas[0].split(/[+-/*]/);
            let hojas3 = hojas2[0].replace("(","");
            console.log(operador3);
            
            arbol.innerHTML = nodo(operador3[1],"o2");
            arbol.innerHTML += nodo2(operador2,"o");
            //arbol.innerHTML += "<div class='col-2 text-center'></div>";
            arbol.innerHTML += nodo(hojas[1],"c");
            arbol.innerHTML += `<div class='row'></div>`;

            arbol.innerHTML += nodo3(hojas3,"a");
            arbol.innerHTML += nodo3(hojas2[1],"b");
            arbol.innerHTML += `<div class='col-2'></div><div class='col-2'></div><div class='col-2'></div>`;

            

            //arbol.innerHTML += nodo2(hojas2[1],"c");

            
            new LeaderLine(
                document.getElementById("o"),
                document.getElementById("o2"),
                estilos
            )

            new LeaderLine(
                document.getElementById("o"),
                document.getElementById("c"),
                estilos
            )
            new LeaderLine(
                document.getElementById("o2"),
                document.getElementById("a"),
                estilos
            )
            new LeaderLine(
                document.getElementById("o2"),
                document.getElementById("b"),
                estilos
            )
            //alert("Hojas: "+hojas + "\n" + "Operador: " + operador);

            //alert("Cumple");
        }else if(validacion5.test(expresion)){
        let hojas = expresion.split(/[)]+[+-/*]/);
            let operador1 = expresion.split(/[0-9]/);
            let operador3 = operador1.filter(Boolean);
            let operador2 = operador3[2].replace("(","");
            let hojas2 = hojas[0].split(/[+-/*]/);
            let hojas3 = hojas[1].split(/[+-/*]/);
            console.log(operador3);
            //.filter(Boolean)
            arbol.innerHTML = nodo(operador3[1],"o2");
            arbol.innerHTML += nodo2(operador2.replace(")",""),"o");
            arbol.innerHTML += nodo(operador3[3],"o3");
            arbol.innerHTML += `<div class='row'></div>`;

            arbol.innerHTML += nodo3(hojas2[0].replace("(",""),"a");
            arbol.innerHTML += nodo3(hojas2[1],"b");
            //arbol.innerHTML += `<div class='col-1'></div><div class='col-2'></div><div class='col-2'></div>`;
            arbol.innerHTML += nodo3(hojas3[0].replace("(",""),"c");
            arbol.innerHTML += nodo3(hojas3[1].replace(")",""),"d");

 
            new LeaderLine(
                document.getElementById("o"),
                document.getElementById("o2"),
                estilos
            )

            new LeaderLine(
                document.getElementById("o"),
                document.getElementById("o3"),
                estilos
            )
            new LeaderLine(
                document.getElementById("o2"),
                document.getElementById("a"),
                estilos
            )
            new LeaderLine(
                document.getElementById("o2"),
                document.getElementById("b"),
                estilos
            )
            new LeaderLine(
                document.getElementById("o3"),
                document.getElementById("c"),
                estilos
            )
            new LeaderLine(
                document.getElementById("o3"),
                document.getElementById("d"),
                estilos
            )
        }  else{
            alert("no cumple");
        }
        //alert("Boton funcionando" + expresion); */
    // Tokenizar y construir árbol
    
    let tokens = tokenizar(expresion);
    let raiz = construirArbol(tokens);

    let subarbol = dibujarArbol(raiz, null);
    arbol.appendChild(subarbol);

    console.log("Tokens:", tokens);
    console.log("Árbol:", raiz);

    let pre = preOrden(raiz).join(" ");
    let ino = inOrden(raiz).join(" ");
    let post = postOrden(raiz).join(" ");

    document.getElementById("recorridos").innerHTML = `
        <h5>Árbol Binario</h5>
        <p><strong>Pre-orden:</strong> ${pre}</p>
        <p><strong>In-orden:</strong> ${ino}</p>
        <p><strong>Post-orden:</strong> ${post}</p>
    `;
    // Usamos map para debug y mostrar tokens
    //tokens.map((t, i) => console.log(`Token ${i}: ${t}`));

    //Dibujar el árbol en el contenedor
    //dibujarArbol(raiz, null); 

    
    })



console.log(btn1);





// Arbol binario
// pre-orden : A + B
// pos-orden : + A B
// iorden     : A B +






