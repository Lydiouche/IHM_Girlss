// --- 1. CONSTANTES ET ÉTAT GLOBAL ---
const canvas = document.getElementById("myCanvas");
const size = 50;
let selectedColor = '#ff0000';
let currentMode = "pinceau";
let isDragging = false;

// État du Morpion
let gameActive = false;
let currentPlayer = 1;
let gameBoard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
];

// --- 2. NAVIGATION (MENU PRINCIPAL) ---

function switchMode(mode) {
    const toolsDiv = document.getElementById("tools");
    toolsDiv.innerHTML = "";

    if (mode === "canvas") {
        currentMode = "pinceau";
        // On dessine la grande grille pour le pixel art (ex: 10x5)
        drawCartesianGrid(size, 5, 10);
        setupCanvasTools();
    }
    else if (mode === "morpion") {
        currentMode = "morpion";
        // On dessine UNIQUEMENT une grille de 3x3 pour le jeu
        canvas.width = 3 * size;
        canvas.height = 3 * size;
        drawCartesianGrid(size, 3, 3);
        setupMorpionTools();
        resetMorpion();
    }
}

// --- 3. DESSIN ET GRILLE ---

function drawCartesianGrid(size, rows, cols) {
    let context = canvas.getContext('2d');

    // Nettoie tout le canvas avant de redessiner la grille
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = '#4444CC';
    context.lineWidth = 1;
    context.beginPath();
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            context.rect(c * size, r * size, size, size);
        }
    }
    context.stroke();
}

function fillSquare(size, x, y, color) {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(x * size, y * size, size, size);
}

// --- 4. CONVERSIONS COORDONNÉES ---

function toCanvasCoordinate(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function toCartesianCoordinate(pixelX, pixelY, size) {
    return { x: pixelX / size, y: pixelY / size };
}

// --- 5. LOGIQUE MÉTIER DU MORPION ---

function checkWin() {
    for (let i = 0; i < 3; i++) {
        if (gameBoard[i][0] !== 0 && gameBoard[i][0] === gameBoard[i][1] && gameBoard[i][1] === gameBoard[i][2]) return true;
        if (gameBoard[0][i] !== 0 && gameBoard[0][i] === gameBoard[1][i] && gameBoard[1][i] === gameBoard[2][i]) return true;
    }
    if (gameBoard[0][0] !== 0 && gameBoard[0][0] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[2][2]) return true;
    if (gameBoard[0][2] !== 0 && gameBoard[0][2] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[2][0]) return true;
    return false;
}

function resetMorpion() {
    gameBoard = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    gameActive = true;
    currentPlayer = 1;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            fillSquare(size, c, r, 'blanchedalmond');
            let ctx = canvas.getContext('2d');
            ctx.strokeStyle = '#4444CC';
            ctx.strokeRect(c * size, r * size, size, size);
        }
    }
}

// --- 6. GESTION DES OUTILS (DYNAMIQUE) ---

function setupCanvasTools() {
    const toolsDiv = document.getElementById("tools");

    const btnPinceau = document.createElement("button");
    btnPinceau.innerText = "Pinceau";
    btnPinceau.onclick = () => { currentMode = "pinceau"; };

    const btnGomme = document.createElement("button");
    btnGomme.innerText = "Gomme";
    btnGomme.onclick = () => { currentMode = "gomme"; };

    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = selectedColor;
    colorPicker.oninput = (e) => { selectedColor = e.target.value; };

    toolsDiv.append(btnPinceau, btnGomme, colorPicker);
}

function setupMorpionTools() {
    const toolsDiv = document.getElementById("tools");
    const btnReset = document.createElement("button");
    btnReset.innerText = "Réinitialiser le Jeu";
    btnReset.onclick = () => resetMorpion();
    toolsDiv.append(btnReset);
}

// --- 7. ACTIONS ET ÉVÉNEMENTS ---

function applyTool(gridX, gridY) {
    if (currentMode === "pinceau") {
        fillSquare(size, gridX, gridY, selectedColor);
    }
    else if (currentMode === "gomme") {
        fillSquare(size, gridX, gridY, 'blanchedalmond');
        let ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#4444CC';
        ctx.strokeRect(gridX * size, gridY * size, size, size);
    }
    else if (currentMode === "morpion") {
        if (gameActive && gridX < 3 && gridY < 3 && gameBoard[gridY][gridX] === 0) {
            gameBoard[gridY][gridX] = currentPlayer;
            fillSquare(size, gridX, gridY, (currentPlayer === 1 ? "red" : "blue"));
            if (checkWin()) {
                alert("Victoire du joueur " + (currentPlayer === 1 ? "Rouge" : "Bleu") + " !");
                gameActive = false;
            } else {
                currentPlayer = (currentPlayer === 1) ? 2 : 1;
            }
        }
    }
}

function handleClick(x, y) {
    const coords = toCartesianCoordinate(x, y, size);
    applyTool(Math.floor(coords.x), Math.floor(coords.y));
}

function handleDrag(x, y) {
    // Le drag n'est autorisé qu'en mode dessin (pinceau/gomme)
    if (currentMode === "pinceau" || currentMode === "gomme") {
        const coords = toCartesianCoordinate(x, y, size);
        applyTool(Math.floor(coords.x), Math.floor(coords.y));
    }
}

// Écouteurs d'événements
canvas.addEventListener('mousedown', function (event) {
    isDragging = true;
    const pos = toCanvasCoordinate(event.clientX, event.clientY);
    handleClick(pos.x, pos.y);
});

canvas.addEventListener('mousemove', function (event) {
    if (isDragging) {
        const pos = toCanvasCoordinate(event.clientX, event.clientY);
        handleDrag(pos.x, pos.y);
    }
});

window.addEventListener('mouseup', function () {
    isDragging = false;
});

// Menu principal
document.getElementById("btnGoCanvas").onclick = () => switchMode("canvas");
document.getElementById("btnGoMorpion").onclick = () => switchMode("morpion");

// --- INITIALISATION ---
drawCartesianGrid(size, 5, 10);
switchMode("canvas"); // Démarre sur le mode dessin