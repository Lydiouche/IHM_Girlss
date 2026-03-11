

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