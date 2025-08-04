// --- REGISTRO DO SERVICE WORKER ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration);
      })
      .catch((error) => {
        console.log('Falha ao registrar o Service Worker:', error);
      });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Referências aos elementos do DOM
  const cartela = document.getElementById('cartela');
  const sortearBtn = document.getElementById('sortearBtn');
  
  // Elementos do Modal
  const modal = document.getElementById('pergunta-modal');
  const textoPerguntaModal = document.getElementById('texto-pergunta-modal');
  const textoRespostaModal = document.getElementById('texto-resposta-modal');
  const mostrarRespostaBtnModal = document.getElementById('mostrarRespostaBtnModal');
  const fecharModalBtn = document.getElementById('fechar-modal-btn');

  // Variáveis de estado do jogo
  let bancoDePerguntas = [];
  let numerosDisponiveis = [];

  // Função principal que carrega os dados e inicia o jogo
  async function carregarEIniciarJogo() {
    try {
      const response = await fetch('perguntas.json');
      if (!response.ok) {
        throw new Error(`Erro ao buscar o arquivo: ${response.statusText}`);
      }
      bancoDePerguntas = await response.json();
      inicializarJogo();
    } catch (error) {
      console.error("Não foi possível carregar o banco de perguntas:", error);
      alert("Erro ao carregar as perguntas. Por favor, tente recarregar a página.");
    }
  }

  // Prepara a cartela
  const inicializarJogo = () => {
    bancoDePerguntas.forEach((item, index) => {
      numerosDisponiveis.push(index);
      const btn = document.createElement('div');
      btn.className = 'number';
      btn.textContent = index + 1;
      btn.dataset.index = index;

      btn.addEventListener('click', () => {
        abrirModalComPergunta(index);
      });
      cartela.appendChild(btn);
    });
  };
  
  // NOVA FUNÇÃO: Abre o modal e preenche com a pergunta
  const abrirModalComPergunta = (index) => {
    if (index >= 0 && index < bancoDePerguntas.length) {
      const btnDaCartela = document.querySelector(`.number[data-index='${index}']`);
      
      // Só abre se a pergunta não tiver sido marcada
      if (btnDaCartela && !btnDaCartela.classList.contains('marcado')) {
        const item = bancoDePerguntas[index];
        textoPerguntaModal.textContent = item.pergunta;
        textoRespostaModal.textContent = item.resposta;

        // Reseta a UI do modal
        textoRespostaModal.style.display = 'none';
        mostrarRespostaBtnModal.textContent = 'Mostrar Resposta';
        mostrarRespostaBtnModal.style.display = 'inline-block';

        // Mostra o modal
        modal.classList.add('visivel');
        modal.classList.remove('modal-oculto');
        
        // Marca o número na cartela
        btnDaCartela.classList.add('marcado');
        const indiceParaRemover = numerosDisponiveis.indexOf(index);
        if (indiceParaRemover > -1) {
          numerosDisponiveis.splice(indiceParaRemover, 1);
        }
      }
    }
  };

  // NOVA FUNÇÃO: Fecha o modal
  const fecharModal = () => {
    modal.classList.remove('visivel');
    modal.classList.add('modal-oculto');
  };

  // Sorteia uma pergunta aleatória
  const sortearPergunta = () => {
    if (numerosDisponiveis.length === 0) {
      alert('Todas as perguntas já foram feitas!');
      return;
    }
    const indiceAleatorio = Math.floor(Math.random() * numerosDisponiveis.length);
    const indiceSorteado = numerosDisponiveis[indiceAleatorio];
    abrirModalComPergunta(indiceSorteado);
  };

  // Alterna a visibilidade da resposta DENTRO DO MODAL
  const alternarRespostaModal = () => {
    const isHidden = textoRespostaModal.style.display === 'none';
    if (isHidden) {
      textoRespostaModal.style.display = 'block';
      mostrarRespostaBtnModal.textContent = 'Ocultar Resposta';
    } else {
      textoRespostaModal.style.display = 'none';
      mostrarRespostaBtnModal.textContent = 'Mostrar Resposta';
    }
  };

  // Adiciona os listeners aos botões
  sortearBtn.addEventListener('click', sortearPergunta);
  fecharModalBtn.addEventListener('click', fecharModal);
  mostrarRespostaBtnModal.addEventListener('click', alternarRespostaModal);

  // Fecha o modal se clicar no fundo escuro
  modal.addEventListener('click', (event) => {
      if (event.target === modal) {
          fecharModal();
      }
  });

  // Inicia todo o processo
  carregarEIniciarJogo();
});