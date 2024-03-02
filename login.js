/* 
1) il faut écouter les inforamtions remplis par l'utilisateur (login mdp click sur le bouton envoyer)
    - Si clic "informations vide" = réponse "remplissez les cases manquantes",
    - si clic mais informations incorrectes = réponse "l'indentifiant ou le mdp n'est pas valide",
    - si clic et informations correcte -> redirection vers page d'accueil édit 

2) Page d'accueil edit : 
- ajout d'une barre noire "edit" en haut de page (element, balise et class)
- ajout d'un bouton édit à coté du h2 "mes projets" (element balise et class)
- login -> logout (changement innertext)

fetch ("ressource", {objet
method: post
body:"charge utile"
headers : "format de la charge utile"
});

*/

// définition des variables
const formulaireLogin = document.querySelector(".formulaire-login");
const MessageErreur = document.querySelector(".message-erreur");
let messageAlerte = document.createElement("p");
// let identifantSophie = "sophie.bluel@test.tld";
// let motDePasseSophie = "S0phie";

// fonction pour générer le message d'erreur
function paragrapheErreur() {
  messageAlerte.classList.add("messageErreur");
  MessageErreur.appendChild(messageAlerte);
}

//L'event listener submit du formulaire (lorsqu'on clique)

formulaireLogin.addEventListener("submit", async function (event) {
  event.preventDefault();
  const login = {
    email: event.target.querySelector("[name=email]").value,
    password: event.target.querySelector("[name=mot-de-passe]").value,
  };

  const chargeUtile = JSON.stringify(login);

  const result = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: chargeUtile,
  });

  const reponse = await result.json();
  const valeurReponse = JSON.stringify(reponse);
  localStorage.setItem("information", valeurReponse);

  if (reponse.token) {
    messageAlerte.remove();
    window.location.href = "/index.html";
  } else {
    messageAlerte.textContent =
      "L'identifiant ou le mot de passe est incorrect.";
    paragrapheErreur();
  }
});

if (login.email === "") {
  messageAlerte.textContent = "veuillez renseigner les champs vides.";
  paragrapheErreur();
}

/*

*/
