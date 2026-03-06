function drawCartesianGrid(square_size, rows, cols) {
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = square_size * cols;
    canvas.height = square_size * rows;

    ctx.strokeStyle = "#ffc3c3"; // Couleur des lignes de la grille
    ctx.lineWidth = 1;

    // Dessiner les lignes verticales
    for (let c = 0; c <= cols; c++) {
        const x = c * square_size;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Dessiner les lignes horizontales
    for (let r = 0; r <= rows; r++) {
        const y = r * square_size;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    function toPixelCoordinate(x, y) {
        return {
            x: x * square_size,
            y: y * square_size
        };
    }

    function toCartesianCoordinate(x, y) {
        return {
            x: Math.floor(x / square_size),
            y: Math.floor(y / square_size)
        };
    }

    function fillSquare(x, y, color) {
        const pixelCoord = toPixelCoordinate(x, y);
        ctx.fillStyle = color;
        ctx.fillRect( //les + et - permette d'etre a int quadrillage
            pixelCoord.x+1,
            pixelCoord.y+1,
            square_size-2,
            square_size-2
        );
    }

    function eraseSquare(x, y) {
        const pixelCoord = toPixelCoordinate(x, y);
        //ctx.fillStyle = color;
        ctx.clearRect(
            pixelCoord.x + 1,
            pixelCoord.y + 1,
            square_size - 2,
            square_size - 2
    );
}

    return { canvas, ctx, toCartesianCoordinate, fillSquare, eraseSquare}
}

// Fonction pour récupérer la case de la grille
function getGridCoordinate(event, canvas, square_size) {
    const rect = canvas.getBoundingClientRect();

    const x = Math.floor((event.clientX - rect.left) / square_size);
    const y = Math.floor((event.clientY - rect.top) / square_size);

    return { x, y };
}

// 5 et 8. Gestion du click
function handleClick(canvas, square_size, fillSquare, toCartesianCoordinate, eraseSquare) {

    canvas.addEventListener("mousedown", (event) => {
        if (event.button !==0) return;

        const rect = canvas.getBoundingClientRect();

        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        const cell = toCartesianCoordinate(canvasX, canvasY);

        if (currentTool === "pinceau") {
            fillSquare(cell.x, cell.y, brushColor);
        }

        if (currentTool === "gomme") {
            eraseSquare(cell.x, cell.y); //marche sans color
        }
    });
}

// 6. Gestion du drag
function handleDrag(canvas, square_size, fillSquare, toCartesianCoordinate, eraseSquare) {

    let mouseDown = false;

    canvas.addEventListener("mousedown", (event) => {
        if (event.button === 0) {
            mouseDown = true;
        }
    });

    canvas.addEventListener("mousemove", (event) => {
        if (!mouseDown) return;

        const rect = canvas.getBoundingClientRect();

        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;

        const cell = toCartesianCoordinate(canvasX, canvasY);

        // Remplir la case pendant le drag
        if (currentTool === "pinceau") {
            fillSquare(cell.x, cell.y, brushColor);
        }

        if (currentTool === "gomme") {
            eraseSquare(cell.x, cell.y);
        }        
    });

    canvas.addEventListener("mouseup", (event) => {
        if (event.button === 0) {
            mouseDown = false;
        }
    });
}

function toCanvasCoordinate(x, y) {
    const canvas = document.getElementById("myCanvas");
    const rect = canvas.getBoundingClientRect();

    return {
        x: x - rect.left,
        y: y - rect.top
    };
}


//synthese des outils
let brushColor = "#fbaaf2";
let currentTool = "pinceau";

function addTools() {

    const toolsDiv = document.getElementById("tools");

    // bouton pinceau
    const brushButton = document.createElement("button");
    brushButton.textContent = "Pinceau";

    brushButton.addEventListener("click", () => {
        currentTool = "pinceau";
        console.log("Outil actif : pinceau");
    });

    // bouton gomme
    const eraserButton = document.createElement("button");
    eraserButton.textContent = "Gomme";

    eraserButton.addEventListener("click", () => {
        currentTool = "gomme";
        console.log("Outil actif : gomme");
    });

    //palette couleurs
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.value = brushColor;
    colorPicker.addEventListener("input", (event) => {
        brushColor = event.target.value; // ex: "#a1b2c3"
    });

    // ajout dans la div tools
    toolsDiv.appendChild(brushButton);
    toolsDiv.appendChild(eraserButton);
    toolsDiv.appendChild(colorPicker);
}

addTools();

// Appeler la fonction pour dessiner la grille
const grid = drawCartesianGrid(20, 16, 16);

const canvas = document.getElementById("myCanvas");

handleClick(canvas, 20, grid.fillSquare, grid.toCartesianCoordinate, grid.eraseSquare);
handleDrag(canvas, 20, grid.fillSquare, grid.toCartesianCoordinate, grid.eraseSquare);