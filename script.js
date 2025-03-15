const currentPlayer = document.querySelector(".currentPlayer");
let selected;
let player = "X";
let vsAI = false; // Definir se o jogo é contra IA

let positions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Linhas
  [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Colunas
  [0, 4, 8], [2, 4, 6]              // Diagonais
];

// Perguntar o modo de jogo ao carregar
function chooseMode() {
  let mode = prompt("Escolha o modo de jogo:\n1 - Dois jogadores\n2 -Um jogador Contra a IA");
  if (mode === "2") {
    vsAI = true;
  }
}

function init() {
  selected = Array(9).fill(null);
  player = "X";
  updatePlayerDisplay();

  document.querySelectorAll(".game button").forEach((item, index) => {
    item.innerHTML = "";
    item.style.color = "black";
    item.style.backgroundColor = "white"; // Resetando fundo ao reiniciar
    item.addEventListener("click", newMove);
  });
}

function updatePlayerDisplay() {
  currentPlayer.innerHTML = `Jogue jogador: ${player}, sua vez!`;
  currentPlayer.style.color = player === "X" ? "rgb(189, 60, 156)" : "red";
}

function newMove(e) {
  const index = e.target.getAttribute("data-i") - 1;
  if (selected[index] !== null) return; // Evita jogadas duplicadas

  e.target.innerHTML = player;
  e.target.removeEventListener("click", newMove);
  selected[index] = player;

  setTimeout(() => {
    if (check()) return; // Se alguém ganhar, parar aqui

    player = player === "X" ? "O" : "X";
    updatePlayerDisplay();

    if (vsAI && player === "O") {
      setTimeout(aiMove, 500); // IA joga após 500ms
    }
  }, 100);
}

function aiMove() {
  let bestMove = getBestMove();
  if (bestMove !== null) {
    let buttons = document.querySelectorAll(".game button");
    buttons[bestMove].innerHTML = "O";
    buttons[bestMove].removeEventListener("click", newMove);
    selected[bestMove] = "O";

    setTimeout(() => {
      if (check()) return;
      player = "X";
      updatePlayerDisplay();
    }, 100);
  }
}

function getBestMove() {
  // 1. Tentar ganhar
  for (let pos of positions) {
    let oCount = pos.filter((i) => selected[i] === "O").length;
    let emptySpot = pos.find((i) => selected[i] === null);
    if (oCount === 2 && emptySpot !== undefined) return emptySpot;
  }

  // 2. Bloquear o jogador "X"
  for (let pos of positions) {
    let xCount = pos.filter((i) => selected[i] === "X").length;
    let emptySpot = pos.find((i) => selected[i] === null);
    if (xCount === 2 && emptySpot !== undefined) return emptySpot;
  }

  // 3. Jogar no centro se estiver disponível
  if (selected[4] === null) return 4;

  // 4. Jogar em um canto disponível
  let corners = [0, 2, 6, 8].filter((i) => selected[i] === null);
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

  // 5. Jogar em qualquer posição disponível
  let available = selected.map((v, i) => (v === null ? i : null)).filter((v) => v !== null);
  return available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null;
}

function check() {
  let playerLastMove = player;
  let items = selected.map((item, i) => [item, i]).filter((item) => item[0] === playerLastMove).map((item) => item[1]);

  for (let pos of positions) {
    if (pos.every((i) => items.includes(i))) {
      highlightWinningLine(pos); // Destacar linha vencedora
      alert(`Parabéns Jogador '${playerLastMove}', Você GANHOU!!!!`);
      return true;
    }
  }

  if (selected.every((item) => item !== null)) {
    alert("Parabéns Jogadores, vocês empataram. Jogo equilibrado!");
    return true;
  }

  return false;
}

// Destaca a linha vencedora de vermelho e desativa todos os botões
function highlightWinningLine(pos) {
  let buttons = document.querySelectorAll(".game button");
  pos.forEach((index) => {
    buttons[index].style.backgroundColor = "red"; // Destacando os botões vencedores
    buttons[index].style.color = "white";
  });

  // Desativa todos os botões para evitar cliques extras após o fim do jogo
  buttons.forEach((btn) => btn.removeEventListener("click", newMove));

  setTimeout(() => init(), 3000); // Reinicia o jogo após 3s
}

// Executa a escolha de modo antes de iniciar
chooseMode();
init();
