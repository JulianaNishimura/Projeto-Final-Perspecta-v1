const categorias = {
  opçãoobjetos: ['Categoria Objetos', 'object'],
  opçãorostos: ['Categoria Rostos', 'people faces'],
  opçãoanimais: ['Categoria Animais', 'animals'],
  opçãoperspectiva: ['Categoria Perspectiva', 'angle structure'],
  opçãopaisagens: ['Categoria Paisagens', 'landscapes'],
  opçãocorposposes: ['Categoria Corpos e Poses', 'model posing'],
};

const tempos = {
  opção5minutos: [0, 5],
  opção15minutos: [0, 15],
  opção30minutos: [0, 30],
  opção45minutos: [0, 45],
  opção60minutos: [1, 0],
  opção75minutos: [1, 15],
  opção90minutos: [1, 30],
  opção105minutos: [1, 45],
  opção120minutos: [2, 0],
};

const urlParams = new URLSearchParams(window.location.search);
let page = urlParams.get('page') || IntRandomico(100);

const Tempo = localStorage.getItem('OpcaoTempoEscolhido');
const Categoria = localStorage.getItem('OpcaoCategoriaEscolhida');
const Temporizador = localStorage.getItem('TimerComecou');

let horaEscolhida = 0,
  minutosEscolhido = 0,
  timer = false,
  query = null,
  listaimg = [],
  hora = 0,
  minutos = 0,
  segundos = 0,
  contador = 0,
  timeoutident;

function IntRandomico(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function formatTime(value) {
  return value < 10 ? `0${value}` : value;
}

function TempoFun() {
  if (!timer) return;

  contador++;
  if (contador === 100) {
    segundos++;
    contador = 0;
  }
  if (segundos === 60) {
    minutos++;
    segundos = 0;
  }
  if (minutos === 60) {
    hora++;
    minutos = 0;
    segundos = 0;
  }

  document.getElementById('hr').innerHTML = formatTime(hora);
  document.getElementById('min').innerHTML = formatTime(minutos);
  document.getElementById('seg').innerHTML = formatTime(segundos);

  if (hora === horaEscolhida && minutos === minutosEscolhido) {
    resetTimer();
    updateImage();
  }

  timeoutident = setTimeout(TempoFun, 10);
}

function resetTimer() {
  timer = false;
  clearTimeout(timeoutident);
  hora = minutos = segundos = contador = 0;
  document.getElementById('hr').innerHTML = '00';
  document.getElementById('min').innerHTML = '00';
  document.getElementById('seg').innerHTML = '00';
  timer = true;
}

function Pausa() {
  timer = !timer;
  if (timer) TempoFun();
}

function Pular() {
  resetTimer();
  updateImage();
  TempoFun();
}

function setupCategoria() {
  const elemento = document.getElementById('cont_categoria');
  if (elemento && categorias[Categoria]) {
    elemento.innerHTML = categorias[Categoria][0];
    query = categorias[Categoria][1];
  }
}

function setupTempo() {
  if (tempos[Tempo]) {
    [horaEscolhida, minutosEscolhido] = tempos[Tempo];
  }
}

async function getImages(query, page) {
  const params = new URLSearchParams({
    query: query,
    orientation: 'portrait',
    order_by: 'relevant',
    page: page,
  });

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?${params}`,
      {
        method: 'GET',
        headers: {
          Authorization:
            'Client-ID YAn2034xFPyeh6XN-QrdUeR7mdqA7I6D182AOg8umvI',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data.results.map((item) => ({
      url: `${item.urls.raw}&w=950`,
      photographer: item.user.name,
      profile: `${item.user.links.html}?utm_source=your_app_name&utm_medium=referral`,
    }));
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

function updateImage() {
  if (listaimg.length === 0) {
    Redirect();
    return;
  }
  shuffle(listaimg);
  const img = listaimg.pop();
  document.getElementById('imagem1sessao').src = img.url;
  document.getElementById(
    'credito_foto'
  ).innerHTML = `Photo by <a href="${img.profile}" target="_blank">${img.photographer}</a> on 
                <a href="https://unsplash.com/?utm_source=your_app_name&utm_medium=referral" target="_blank">Unsplash</a>`;
}

function Redirect() {
  Swal.fire({
    title: 'Deseja iniciar outra sessão?',
    text: 'Você pode escolher uma nova imagem ou encerrar por aqui.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sim, continuar!',
    cancelButtonText: 'Não, voltar ao início',
    reverseButtons: true,
    background: '#fff0f6',
    color: '#370519',
    confirmButtonColor: '#df87ab',
    cancelButtonColor: '#ffc4de',
    customClass: {
      popup: 'rounded-xl',
      confirmButton: 'custom-confirm-btn',
      cancelButton: 'custom-cancel-btn',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = `sessões.html?page=${IntRandomico(100)}`;
    } else {
      window.location.href = '../index.html';
    }
  });
}

// Inicialização
async function init() {
  setupCategoria();
  setupTempo();

  listaimg = await getImages(query, page);
  updateImage();

  document.getElementById('pausar').addEventListener('click', Pausa);
  document.getElementById('reset').addEventListener('click', Pular);

  if (Temporizador === 'true') {
    timer = true;
    TempoFun();
  }
}

init().catch((error) => console.error('Erro na inicialização:', error));
