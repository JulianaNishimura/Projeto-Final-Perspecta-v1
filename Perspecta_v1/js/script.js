function ValorTempo() {
  return (
    document.querySelector('input[name="escolhaminutos"]:checked').value || null
  );
}

function ValorCategoria() {
  return (
    document.querySelector('input[name="escolhacategoria"]:checked').value ||
    null
  );
}

function Cronometro() {
  const tempo = ValorTempo();
  const categoria = ValorCategoria();

  if (tempo && categoria) {
    localStorage.setItem('OpcaoTempoEscolhido', tempo);
    localStorage.setItem('OpcaoCategoriaEscolhida', categoria);
    localStorage.setItem('TimerComecou', 'true');
    window.location.href = 'sessões.html';
  } else {
    alert('Você não escolheu tempo ou categoria! Escolha e tente novamente.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document
    .getElementById('botao_começar_treino')
    ?.addEventListener('click', Cronometro);
});
