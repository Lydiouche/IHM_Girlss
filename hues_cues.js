//ajouter onglet solution car galere un peu

const ROWS = 15;
const COLS = 20;
const SQUARE_SIZE = 30;

let target = null;
let score = 0;
let turns = 0;
let attempts = 0;

//const MAX_ATTEMPTS = 100;

// Sélection des éléments du DOM
const gridElement = document.getElementById('grid');
const hintElement = document.getElementById('hint');
const messageElement = document.getElementById('message');
const scoreElement = document.getElementById('score');
const btnStart = document.getElementById('btn-start');
const turnsElement = document.getElementById('turns');

// Fonction pour générer la couleur (identique à avant)
function getGridColor(row, col) {
    const h = (col / COLS) * 360;
    const s = 70;
    const l = (row / ROWS) * 80 + 10;
    return `hsl(${h}, ${s}%, ${l}%)`;
}

// Les indices
function getHint(h, l) {
    if (l < 20) return "Dark Sasuke";
    if (l > 85) return "Blanc comme neige en été";

    // Découpage du cercle chromatique en objets simples
    if (h < 20 || h >= 340) return "Fraise sans chantilly";
    if (h < 50) return "On le mange pour devenir aimable";
    if (h < 70) return "Le repas pref des ptites abeilles";
    if (h < 150) return "Comme une petite grenouille";
    if (h < 200) return "Un plouf dans l'eau";
    if (h < 260) return "La couleur des rois";
    if (h < 300) return "Une petite violette dans les bois";
    return "Bonbon tout rose";
}

// Initialisation de la grille
function createGrid() {
    gridElement.innerHTML = ''
    gridElement.style.display = 'grid';
    gridElement.style.gridTemplateColumns = `repeat(${COLS}, ${SQUARE_SIZE}px)`;
    gridElement.style.gap = '1px';
    gridElement.style.justifyContent = 'center';

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const square = document.createElement('div');
            square.classList.add('square'); 
            square.style.width = `${SQUARE_SIZE}px`;
            square.style.height = `${SQUARE_SIZE}px`;
            square.style.backgroundColor = getGridColor(r, c);
            square.style.cursor = 'pointer';
            
            square.addEventListener('click', (e) => handleGuess(r, c, e.target)); //e.target=element
            gridElement.appendChild(square);
        }
    }
}

function startNewGame() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(s => s.style.opacity = "1"); // Réactive tous les carrés a opacité normale

    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    target = { row: r, col: c };
    attempts = 0;

    const h = (c / COLS) * 360;
    const l = (r / ROWS) * 80 + 10;

    //affichage indice
    hintElement.innerHTML = `<strong>Indice : ${getHint(h, l)}</strong>`;
    messageElement.innerText = `Tentatives réalisées : ${attempts}`;
    btnStart.innerText = "Réinitialiser la couleur";    

    //const vHint = r < ROWS / 2 ? "Sombre" : "Clair";
    //const hHint = c < COLS / 2 ? "Froid" : "Chaud";
    
    //hintElement.innerHTML = `<strong>Indice : ${vHint} & ${hHint}</strong>`;
    //messageElement.innerText = "Trouvez la couleur !";
}

function handleGuess(r, c, element) {
    if (!target) return;
    if (element.style.opacity === "0.5") return;
    
    attempts++;
    element.style.opacity = "0.5";

    const dist = Math.abs(r - target.row) + Math.abs(c - target.col);

    if (dist === 0) {
        messageElement.innerText = "BG t'as trouvééééé ! (+10 pts)";
        if (attempts === 1) {
            messageElement.innerText = " BRAVO, 20 pts bonus pour le one shot !";
            score += 20;
        } 
        else if (attempts <= 3) {
            messageElement.innerText = "Waaw t'as trouvé vite, 15points pour la peine !";
            score += 15;
        }
        else {
            messageElement.innerText = "T'en as pris du temps pour trouver, t'as quand même 10 points";
            score += 10;
        }
    endTurn();

    } else if (dist <= 3) {
        messageElement.innerText = "Tu chauffeees";
        //score += 5;
    } else if (dist <= 6) {
        messageElement.innerText = "C'est un début... ";
    } 
    //else {
    //    messageElement.innerText = "T'es loiiiiin la";
    //}
    else {
        let direction = "";
        if (r < target.row) direction = "plus bas";
        else if (r > target.row) direction = "plus haut";
        else if (c < target.col) direction = "plus à droite";
        else direction = "plus à gauche";
        messageElement.innerText = `Raté ! Cherche ${direction}. (Essais : ${attempts})`;
    }
    
    scoreElement.innerText = score;
}

function endTurn() {
    turns++;
    turnsElement.innerText = turns;
    target = null; // Désactive les clics
    btnStart.innerText = "Tour Suivant";
}

// Lancement
btnStart.addEventListener('click', startNewGame);
createGrid();