// Sélection des éléments HTML : le canvas pour le dessin et le texte pour afficher le tour
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('current-player');

// 1. Configuration de la grille (réduite à 4x4 comme demandé)
const ROWS = 4;
const COLS = 4;
const SQUARE_SIZE = 80; // Taille de chaque case en pixels

// État initial du jeu
let currentPlayer = "Red"; // Le joueur Rouge commence
// Création d'une matrice (tableau de tableaux) vide pour stocker les jetons
let board = Array(ROWS).fill().map(() => Array(COLS).fill(null));
let gameOver = false; // Variable pour bloquer le jeu en cas de victoire

/**
 * Fonction pour dessiner le plateau de jeu complet
 * S'inspire de drawCartesianGrid [cite : 56]
 */
function drawBoard() {
    canvas.width = COLS * SQUARE_SIZE;
    canvas.height = ROWS * SQUARE_SIZE;

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            // Dessine le fond de la case (couleur bois/saddlebrown)
            ctx.fillStyle = "saddlebrown";
            ctx.fillRect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
            
            // Dessine la bordure de la case (similaire à ta grille [cite : 56])
            ctx.strokeStyle = "black";
            ctx.strokeRect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);

            // Détermine la couleur du jeton selon le contenu de la matrice 'board'
            let color = "#FFFFFF"; // Blanc par défaut (case vide)
            if (board[r][c] === "Red") color = "#FF0000";
            if (board[r][c] === "Yellow") color = "#FFFF00";

            // Dessine le rond représentant le jeton
            ctx.beginPath();
            ctx.arc(
                c * SQUARE_SIZE + SQUARE_SIZE / 2, // Centre X
                r * SQUARE_SIZE + SQUARE_SIZE / 2, // Centre Y
                SQUARE_SIZE * 0.35,                // Rayon du cercle
                0, Math.PI * 2                     // Cercle complet
            );
            ctx.fillStyle = color;
            ctx.fill();
        }
    }
}

/**
 * Convertit la position de la souris en coordonnées internes au canvas
 * Provient de ta fonction toCanvasCoordinate [cite : 78]
 */
function toCanvasCoordinate(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

/**
 * Convertit les pixels en index de colonne et ligne
 * Provient de ta fonction toCartesianCoordinate [cite : 59]
 */
function toCartesianCoordinate(x, y) {
    return { col: Math.floor(x / SQUARE_SIZE), row: Math.floor(y / SQUARE_SIZE) };
}

/**
 * Vérifie si le joueur actuel a aligné 4 jetons
 */
function checkWin(player) {
    // Vérification Horizontale (chaque ligne)
    for (let r = 0; r < ROWS; r++) {
        if (board[r].every(cell => cell === player)) return true;
    }
    // Vérification Verticale (chaque colonne)
    for (let c = 0; c < COLS; c++) {
        if (board[0][c] === player && board[1][c] === player && 
            board[2][c] === player && board[3][c] === player) return true;
    }
    // Vérification des deux Diagonales
    if (board[0][0] === player && board[1][1] === player && 
        board[2][2] === player && board[3][3] === player) return true;
    if (board[0][3] === player && board[1][2] === player && 
        board[2][1] === player && board[3][0] === player) return true;
    
    return false;
}

/**
 * Gestionnaire d'événement au clic
 * Adapté de ton écouteur mousedown [cite : 64]
 */
canvas.addEventListener('mousedown', (e) => {
    if (gameOver) return; // Si quelqu'un a gagné, on ne peut plus cliquer

    const pos = toCanvasCoordinate(e);
    const coord = toCartesianCoordinate(pos.x, pos.y);

    // Si le clic est bien dans la grille et que la case est vide
    if (coord.row < ROWS && coord.col < COLS && board[coord.row][coord.col] === null) {
        // Enregistre le jeton dans la matrice
        board[coord.row][coord.col] = currentPlayer;
        drawBoard(); // Redessine tout le plateau
        
        // Vérifie la victoire après avoir posé le jeton
        if (checkWin(currentPlayer)) {
            statusText.textContent = `BRAVO ! LE JOUEUR ${currentPlayer === "Red" ? "ROUGE" : "JAUNE"} A GAGNÉ !`;
            gameOver = true;
        } else {
            switchPlayer(); // Passe au joueur suivant
        }
    }
});

/**
 * Alterne entre le joueur Rouge et Jaune
 */
function switchPlayer() {
    currentPlayer = (currentPlayer === "Red") ? "Yellow" : "Red";
    statusText.textContent = (currentPlayer === "Red") ? "Rouge" : "Jaune";
    statusText.style.color = (currentPlayer === "Red") ? "red" : "#ccaa00";
}

/**
 * Réinitialise tout le jeu (plateau vide, scores, etc.)
 */
function resetGame() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(null));
    currentPlayer = "Red";
    gameOver = false;
    statusText.textContent = "Rouge";
    statusText.style.color = "red";
    drawBoard();
}

// Premier dessin au chargement de la page
drawBoard();