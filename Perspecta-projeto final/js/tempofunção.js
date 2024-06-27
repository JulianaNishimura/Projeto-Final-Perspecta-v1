var tempoSelecionado = null;
var categoriaSelecionada = null;
var InicioCronometro = false;

function ValorTempo() {
    var tempo = document.querySelector('input[name="escolhaminutos"]:checked').value;
    if (tempo !== tempoSelecionado) {
        tempoSelecionado = tempo;
        console.log(tempo);

        localStorage.setItem('OpcaoTempoEscolhido', tempoSelecionado);
    }
    return tempoSelecionado;
}

function ValorCategoria() {
    var categoria = document.querySelector('input[name="escolhacategoria"]:checked').value;
    if (categoria !== categoriaSelecionada) {
        categoriaSelecionada = categoria;
        console.log(categoria);

        localStorage.setItem('OpcaoCategoriaEscolhida', categoriaSelecionada);
    }
    return categoriaSelecionada;
} 

function Iniciar() {
    if (tempoSelecionado !== null && categoriaSelecionada !== null) {
        window.location.href = "sessões.html";
        InicioCronometro = "true";

        localStorage.setItem('TimerComecou', InicioCronometro);
    }
    else {
        alert("Você não escolheu tempo ou categoria! Escolha e tente novamente.")
    }
}
