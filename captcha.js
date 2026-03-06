// ====== CONFIG : liste de tes captchas (adapte les noms si besoin) ======
const captchas = [
  "data/Captcha_1_instruct.json",
  "data/Captcha_2_instruct.json",
];

let index = 0;
let valide = false; // empêche "suivant" si faux

const img = document.getElementById("captcha-img");
const txt = document.getElementById("instruction");

const validation = document.getElementById("btn-valider");
const reponse = document.getElementById("captcha-input");
const message = document.getElementById("ok");

const btnPrec = document.getElementById("precedent");
const btnSuiv = document.getElementById("suivant");

//recup catcha
async function loadCaptcha(i) {
  try {
    const response = await fetch(captchas[i]);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    const result = await response.json();
    displayCaptcha(result);

    //remise à 0
    reponse.value = "";
    message.innerText = "";

    // reset validation + bloque suivant
    valide = false;
    btnSuiv.disabled = true;
  } 
  catch (error) {
    console.error(error.message);
    message.innerText = "Erreur de chargement du captcha";
  }
}

function displayCaptcha(result) {
  img.src = result.source;
  txt.innerText = result.instruction;

  // stocke la solution pour la comparaison
  window.solution = result.solution;
}

// ====== INIT ======
loadCaptcha(index);

// ====== VALIDATION ======
validation.addEventListener("click", () => {
  if (!window.solution) {
    message.innerText = "Captcha pas encore chargé";
    return;
  }

  const saisie = reponse.value.trim().toLowerCase();
  const sol = String(window.solution).trim().toLowerCase();

  if (saisie === sol) {
    message.innerText = "BG, passe au suivant.";
    valide = true;
    btnSuiv.disabled = false;
  } else {
    message.innerText = "Aaaaaah le nul";
    valide = false;
    btnSuiv.disabled = true;
  }
});

//fonctionnement buttons
btnSuiv.addEventListener("click", () => {
  if (!valide) {
    message.innerText = "Vous devez d'abord valider celui la";
    return;
  }
  index = (index + 1) % captchas.length;

  loadCaptcha(index);
});

btnPrec.addEventListener("click", () => {

  // bloque si le captcha actuel n'est pas validé
  if (!valide) {
    message.innerText = "Faites celui la d'abord";
    return;
  }

  index = (index - 1 + captchas.length) % captchas.length;
  loadCaptcha(index);

});