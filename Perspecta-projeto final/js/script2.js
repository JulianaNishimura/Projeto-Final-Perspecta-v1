const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString); //pega a url em formato de string

let page = urlParams.get('page'); //pega a page

if(page == null) {
    page = getRandomInt(100); //pega uma entre 100
}
console.log(page); //teste

let Tempo = localStorage.getItem('OpcaoTempoEscolhido');
let Categoria = localStorage.getItem('OpcaoCategoriaEscolhida');
let Temporizador = localStorage.getItem('TimerComecou');
let horaEscolhida = 0;
let minutosEscolhido = 0;
let timer = false;
let query = null;  //variaveis

//oq vai estar escrito na categoria
if (Categoria === "opçãoobjetos") {
    document.getElementById('cont_categoria').innerHTML = "Categoria Objetos";
    query = "object";
}
else if (Categoria === "opçãorostos") {
    document.getElementById('cont_categoria').innerHTML = "Categoria Rostos";
    query = "people faces";
}
else if (Categoria === "opçãoanimais") {
    document.getElementById('cont_categoria').innerHTML = "Categoria Animais";
    query = "animals";
}
else if (Categoria === "opçãoperspectiva") {
    document.getElementById('cont_categoria').innerHTML = "Categoria Perspectiva";
    query = "angle structure";
}
else if (Categoria === "opçãopaisagens") {
    document.getElementById('cont_categoria').innerHTML = "Categoria Paisagens";
    query = "landscapes";
}
else if (Categoria === "opçãocorposposes") {
    document.getElementById('cont_categoria').innerHTML = "Categoria Corpos e Poses";
    query = "model posing";
}

// COLETA AS IMAGENS INICIAIS
let listaimg = getimages(query, page);

console.log(listaimg); //teste

shuffle(listaimg); //random para pegar ultima diferente
document.getElementById("imagem1sessao").src=listaimg[listaimg.length-1];  //usando shuffle com pop dps de utilizar a ultima img.

if (Tempo === "opção5minutos") {
    minutosEscolhido = 5;
} 
else if (Tempo === "opção15minutos") {
    minutosEscolhido = 15;
}
else if (Tempo === "opção30minutos") {
    minutosEscolhido = 30;
}
else if (Tempo === "opção45minutos") {
    minutosEscolhido = 45;
}
else if (Tempo === "opção60minutos") {
    horaEscolhida = 1;
}
else if (Tempo === "opção75minutos") {
    horaEscolhida = 1;
    minutosEscolhido = 15;
}
else if (Tempo === "opção90minutos") {
    horaEscolhida = 1;
    minutosEscolhido = 30;
}
else if (Tempo === "opção105minutos") {
    horaEscolhida = 1;
    minutosEscolhido = 45;
}
else if (Tempo === "opção120minutos") {
    horaEscolhida = 2;
}//horas escolhidas para ser atribuido no timer na hora de parar

let Pausa = document.getElementById('pausar');
let Pular = document.getElementById('reset');

let hora = 0;
let minutos = 0;
let segundos = 0;
let contador = 0;
let timeoutident;

if (Temporizador === "true") {
    timer = true;
    TempoFun();
}

Pausa.addEventListener('click', function () {
    if (timer) {
        timer = false;
    } else {
        timer = true;
        TempoFun();
    }
});

Pular.addEventListener('click', function () {
    timer = false;
    clearTimeout(timeoutident);
    listaimg.pop();
    if (listaimg == 0){
        Redirect();
    }
    shuffle(listaimg);
    document.getElementById("imagem1sessao").src=listaimg[listaimg.length-1];
    hora = 0;
    minutos = 0;
    segundos = 0;
    contador = 0;
    document.getElementById('hr').innerHTML = "00";
    document.getElementById('min').innerHTML = "00";
    document.getElementById('seg').innerHTML = "00";
    timer = true;
    TempoFun();
    
});

function getimages(query, page){ //funcao api imagem

    const xhr       = new XMLHttpRequest();
    const urlParams = new URLSearchParams({"query": query, "orientation": "portrait", "order_by": "relevant", "page": page});

    let listaimg = [];

    xhr.open("GET", "https://api.unsplash.com/search/photos?" + urlParams, false);
    xhr.setRequestHeader("Authorization", "Client-ID YAn2034xFPyeh6XN-QrdUeR7mdqA7I6D182AOg8umvI");

    xhr.send();
    let response = null;

    if (xhr.status === 200) {
        response = JSON.parse(xhr.responseText);
    } else {
        console.error("Error:", xhr.statusText);
    }

    for (const elemento of response.results) {
            let imgurl = elemento.urls.raw + "&w=950";
            listaimg.push(imgurl);
    }
    
    return listaimg;
}

function shuffle(lista) { //funcao random
    let index = lista.length;
    while (index != 0) {
        let rand = Math.floor(Math.random() * index);
        index--;

        [lista[index], lista[rand]] = [lista[rand], lista[index]];
    }
}

function TempoFun() { //funcao cronometro com restart na hora escolhida
    if (timer) {
        contador++;

        if (contador == 100) {
            segundos++;
            contador = 0;
        }

        if (segundos == 60) {
            minutos++;
            segundos = 0;
        }

        if (minutos == 60) {
            hora++;
            minutos = 0;
            segundos = 0;
        }

        let hrEscrito;
        if(hora < 10){
            hrEscrito = "0" + hora;
        }
        else {
            hrEscrito = hora;
        }

        let minEscrito;
        if(minutos < 10){
            minEscrito = "0" + minutos;
        }
        else {
            minEscrito = minutos;
        }

        let segEscrito;
        if(segundos < 10){
            segEscrito = "0" + segundos;
        }
        else {
            segEscrito = segundos;
        }
    
        document.getElementById('hr').innerHTML = hrEscrito;
        document.getElementById('min').innerHTML = minEscrito;
        document.getElementById('seg').innerHTML = segEscrito;

        if (hora == horaEscolhida && minutos == minutosEscolhido && listaimg != null && listaimg.length != 0) {
            console.log("Entrou");
            timer = false;
            clearTimeout(timeoutident);
            listaimg.pop();
            if (listaimg == 0){
                Redirect();
            }
            shuffle(listaimg);
            document.getElementById("imagem1sessao").src=listaimg[listaimg.length-1];
            hora = 0;
            minutos = 0;
            segundos = 0;
            contador = 0;
            document.getElementById('hr').innerHTML = "00";
            document.getElementById('min').innerHTML = "00";
            document.getElementById('seg').innerHTML = "00";
            timer = true;
            
        }

        timeoutident = setTimeout(TempoFun, 10);
    }
}

function Redirect(){
    if (confirm("Quer continuar com mais uma sessão?") == true) {
        window.location.href='sessões.html?page='+ getRandomInt(100);
    } else {
        window.location.href='index.html';
    }
}

function getRandomInt(max){
    return Math.floor(Math.random() * max);
}

console.log(Tempo);
console.log(Categoria);
console.log(Temporizador);
console.log(timer);
