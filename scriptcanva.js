const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let currentColor = "#000000";
let isDrawing = false;

// 1. Dessiner la grille [cite : 56]
function drawCartesianGrid(square_size, rows, cols) {
    canvas.width = cols * square_size;
    canvas.height = rows * square_size;
    
    ctx.strokeStyle = "#ddd";
    for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * square_size, 0);
        ctx.lineTo(i * square_size, canvas.height);
        ctx.stroke();
    }
    for (let j = 0; j <= rows; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * square_size);
        ctx.lineTo(canvas.width, j * square_size);
        ctx.stroke();
    }
}

// 2. Coordonnées pixel haut-gauche [cite : 58]
function toPixelCoordinate(col, row, square_size) {
    return { x: col * square_size, y: row * square_size };
}

// 3. Trouver le carré unitaire à partir d'un pixel [cite : 59]
function toCartesianCoordinate(x, y, square_size) {
    return { col: Math.floor(x / square_size), row: Math.floor(y / square_size) };
}

// 4. Remplir un carré [cite : 60]
function fillSquare(col, row, square_size, color) {
    const coords = toPixelCoordinate(col, row, square_size);
    ctx.fillStyle = color;
    ctx.fillRect(coords.x + 1, coords.y + 1, square_size - 2, square_size - 2);
}

// 7. Conversion coordonnées souris vers Canvas [cite : 78]
function toCanvasCoordinate(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

// 10 & 11. Ajouter les outils (Boutons et Palette) [cite : 85, 90]
function addTools() {
    const toolsDiv = document.getElementById('tools');

    const btnPinceau = document.createElement('button');
    btnPinceau.textContent = "Pinceau";
    
    const btnGomme = document.createElement('button');
    btnGomme.textContent = "Gomme";

    const colorPicker = document.createElement('input');
    colorPicker.type = "color";
    colorPicker.addEventListener('input', (e) => {
        currentColor = e.target.value;
    });

    toolsDiv.appendChild(btnPinceau);
    toolsDiv.appendChild(btnGomme);
    toolsDiv.appendChild(colorPicker);

    btnGomme.onclick = () => { currentColor = "#FFFFFF"; }; // Simple gomme
}

// Gestion des événements [cite : 64, 66, 69]
const SQUARE_SIZE = 20;

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const pos = toCanvasCoordinate(e);
    const coord = toCartesianCoordinate(pos.x, pos.y, SQUARE_SIZE);
    fillSquare(coord.col, coord.row, SQUARE_SIZE, currentColor);
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        const pos = toCanvasCoordinate(e);
        const coord = toCartesianCoordinate(pos.x, pos.y, SQUARE_SIZE);
        fillSquare(coord.col, coord.row, SQUARE_SIZE, currentColor);
    }
});

window.addEventListener('mouseup', () => { isDrawing = false; });

// Initialisation
drawCartesianGrid(SQUARE_SIZE, 20, 30);
addTools();