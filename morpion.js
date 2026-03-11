const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Configuration
const GRID_SIZE = 3;
const SQUARE_SIZE = 150;
let currentPlayer = "X";
let isGameActive = true; // Drapeau pour arrêter le jeu
let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

// 1. Initialisation du Canvas
function initGame() {
    canvas.width = GRID_SIZE * SQUARE_SIZE;
    canvas.height = GRID_SIZE * SQUARE_SIZE;
    drawGrid();
    addResetButton();
}

// 2. Dessiner la grille
function drawGrid() {
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 5;
    for (let i = 1; i < GRID_SIZE; i++) {
        // Verticales
        ctx.beginPath();
        ctx.moveTo(i * SQUARE_SIZE, 0);
        ctx.lineTo(i * SQUARE_SIZE, canvas.height);
        ctx.stroke();
        // Horizontales
        ctx.beginPath();
        ctx.moveTo(0, i * SQUARE_SIZE);
        ctx.lineTo(canvas.width, i * SQUARE_SIZE);
        ctx.stroke();
    }
}

// 3. Dessiner les symboles
function drawSymbol(col, row, player) {
    const x = col * SQUARE_SIZE + SQUARE_SIZE / 2;
    const y = row * SQUARE_SIZE + SQUARE_SIZE / 2;
    ctx.lineWidth = 8;

    if (player === "X") {
        ctx.strokeStyle = "#ff4757";
        const offset = 40;
        ctx.beginPath();
        ctx.moveTo(x - offset, y - offset); ctx.lineTo(x + offset, y + offset);
        ctx.moveTo(x + offset, y - offset); ctx.lineTo(x - offset, y + offset);
        ctx.stroke();
    } else {
        ctx.strokeStyle = "#146a90";
        ctx.beginPath();
        ctx.arc(x, y, 40, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// 4. Détection de victoire
function checkWinner() {
    const lines = [
        [[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]], // Lignes
        [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]], // Colonnes
        [[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]]                       // Diagonales
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a[0]][a[1]] !== "" &&
            board[a[0]][a[1]] === board[b[0]][b[1]] &&
            board[a[0]][a[1]] === board[c[0]][c[1]]) {
            return board[a[0]][a[1]]; // Renvoie le vainqueur
        }
    }
    return board.flat().includes("") ? null : "nul";
}

// 5. Gestion du clic
canvas.addEventListener('mousedown', (e) => {
    if (!isGameActive) return; // Stop si jeu fini

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / SQUARE_SIZE);
    const row = Math.floor(y / SQUARE_SIZE);

    if (board[row][col] === "") {
        board[row][col] = currentPlayer;
        drawSymbol(col, row, currentPlayer);

        const result = checkWinner();
        if (result) {
            isGameActive = false;
            setTimeout(() => {
                if (result === "nul") alert("Match nul !");
                else alert("Le joueur " + result + " a gagné !");
            }, 50);
        } else {
            currentPlayer = (currentPlayer === "X") ? "O" : "X";
        }
    }
});

function addResetButton() {
    const tools = document.getElementById('tools');
    const btn = document.createElement('button');
    btn.textContent = "Recommencer la partie";
    btn.onclick = () => location.reload();
    tools.appendChild(btn);
}

initGame();