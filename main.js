// JavaScript source code
function getPrimaryColor() {
    color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    return color;
}

window.addEventListener('load', () => {
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.value = getPrimaryColor();
});
function setPrimaryColor(color1) {
    document.documentElement
        .style
        .setProperty('--primary-color', color1);
}

document.getElementById('colorPicker').addEventListener('change', function () {
    setPrimaryColor(this.value);});

/// On récupère toutes les divs
const toutesLesDivs = document.querySelectorAll('div');

//// Pour chaque div, on initialise sa position et son écouteur
toutesLesDivs.forEach(div => {
    // On crée des propriétés de position propres à chaque div
    div.posX = 0;
    div.posY = 0;

    // Chaque div écoute le clavier individuellement
    div.onkeydown = function(event) {
        const pas = 15;

        // On identifie la touche
        if (event.key === "ArrowUp")    this.posY -= pas;
        if (event.key === "ArrowDown")  this.posY += pas;
        if (event.key === "ArrowLeft")  this.posX -= pas;
        if (event.key === "ArrowRight") this.posX += pas;

        // On applique le mouvement uniquement à la div qui a le focus
        this.style.top = this.posY + "px";
        this.style.left = this.posX + "px";
    };
});


// 1. On sélectionne tous les éléments li du menu
const menuItems = document.querySelectorAll('.myMenu li');

// 2. On parcourt chaque élément avec une boucle
menuItems.forEach(item => {
    // 3. On ajoute un écouteur d'événement au clic
    item.addEventListener('click', function () {

        // 4. On cherche l'élément qui a actuellement la classe 'active' pour lui enlever
        const currentActive = document.querySelector('.myMenu li.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }

        // 5. On ajoute la classe 'active' sur l'élément cliqué (this)
        this.classList.add('active');
    });
});