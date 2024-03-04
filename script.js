const reponse = await fetch("http://localhost:5678/api/works");
const c = await fetch("http://localhost:5678/api/categories");
let projets = await reponse.json();
let categories = await c.json();
let mettreAJourModale = true;

async function genererProjets(projets) {
  for (let i = 0; i < projets.length; i++) {
    const projet = projets[i];
    const divGallery = document.querySelector(".gallery");

    // création des éléments du dom
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    const figcaptionElement = document.createElement("figcaption");

    imageElement.src = projet.imageUrl;
    imageElement.alt = projet.title;
    figcaptionElement.textContent = projet.title;

    // rattachement des balises au DOM
    divGallery.appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);
  }
}

//recuperer les catégories
async function genererCategories(categorie) {
  const filtre = document.querySelector(".filtre");
  const categorieTous = document.createElement("button");
  categorieTous.innerText = "Tous";
  categorieTous.classList.add("button");
  categorieTous.classList.add("btn-tous");

  filtre.appendChild(categorieTous);
  for (let i = 0; i < categories.length; i++) {
    const categorie = categories[i];

    if (categorie.name !== null) {
      const divCategorie = document.createElement("button");

      const className = categorie.name.replace(/\s+/g, "-").replace(/&/g, "et");

      divCategorie.classList.add("button");
      divCategorie.classList.add("btn-" + className);

      divCategorie.innerText = className.replace(/-/g, " "); // pour changer les tirets par des espaces

      filtre.appendChild(divCategorie);
    }
  }
}
genererCategories();

async function recupererProjets(categorieFiltre = null, mettreAJourModale) {
  const reponse = await fetch("http://localhost:5678/api/works");
  let projets = await reponse.json();

  if (mettreAJourModale === true) {
    const galleryModal = document.getElementById("gallery-modal");
    galleryModal.innerHTML = "";
    genererProjetsModal(projets);
    mettreAJourModale = true;
  }
  if (categorieFiltre) {
    projets = projets.filter(
      (projet) => projet.category.name === categorieFiltre
    );
  }
  const divGallery = document.querySelector(".gallery");
  divGallery.innerHTML = "";
  genererProjets(projets);
}
genererProjets(projets);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                       Les boutons de filtres
// bouton tous
const boutonTous = document.querySelector(".btn-tous");

boutonTous.addEventListener("click", function (event) {
  document.querySelector(".gallery").innerHTML = "";
  recupererProjets(null, false);
});

// bouton objets
const boutonObjets = document.querySelector(".btn-Objets");

boutonObjets.addEventListener("click", function () {
  document.querySelector(".gallery").innerHTML = "";

  recupererProjets("Objets", false);
});

// bouton Appartements
const boutonAppartements = document.querySelector(".btn-Appartements");
boutonAppartements.addEventListener("click", function () {
  document.querySelector(".gallery").innerHTML = "";

  recupererProjets("Appartements", false);
});
// bouton HOtel&Restaurants
const boutonHotelsRestaurants = document.querySelector(
  ".btn-Hotels-et-restaurants"
);
boutonHotelsRestaurants.addEventListener("click", function () {
  document.querySelector(".gallery").innerHTML = "";

  recupererProjets("Hotels & restaurants", false);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// si token.ok {-> générer page modif}
const loginHeader = document.querySelector(".btn-login");

function Indexmodif() {
  //selection des éléments du DOM
  const mesProjets = document.querySelector(".mes-projets");
  const container = document.querySelector(".container");

  // ajout des éléménts modifier
  const lienProjet = document.createElement("a");
  const bandeau = document.createElement("div");

  //ajout de texte
  loginHeader.innerHTML = "<a href=#> logout </a>";
  lienProjet.innerHTML =
    '<i class="fa-regular fa-pen-to-square"> </i> Modifier';
  bandeau.innerHTML =
    '<i class="fa-regular fa-pen-to-square"> </i> Mode Edition ';

  // ajout des class
  bandeau.classList.add("bandeau");
  mesProjets.classList.add("icone-projet");
  lienProjet.setAttribute("href", "#modal1");
  lienProjet.classList.add("js-modal");
  // ajout des appendchild
  container.appendChild(bandeau);
  mesProjets.appendChild(lienProjet);
}

//appliquer la page modif

const informationUtilisateur = localStorage.getItem("information");
const infoUtilisateur = informationUtilisateur
  ? JSON.parse(informationUtilisateur)
  : null;

if (infoUtilisateur && infoUtilisateur.token) {
  Indexmodif();
  genererProjetsModal(projets);
}

//config bouton "logout" pour supprimer les informations stockées dans le localStorage
loginHeader.addEventListener("click", async function (event) {
  if (infoUtilisateur && infoUtilisateur.token) {
    event.preventDefault();
    localStorage.removeItem("information");
    window.location.reload();
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                  boite modal

let modal = null;
let previousTarget = null;
let previousModal = null;
let textAdd = false;

const openSecondModal = function (e) {
  previousModal.style.display = "none";
  previousModal.setAttribute("aria-hidden", "true");
  previousModal.removeAttribute("aria-modal");
  modal
    .querySelector(".js-modal-previous")
    .addEventListener("click", ModalPrecedente);
};

const openModal = function (e) {
  e.preventDefault();
  let target = e.currentTarget.getAttribute("href");
  modal = document.querySelector(target); // prend le href pour identifier la modale
  if (target === "#modal2") {
    openSecondModal(e);
  }
  if (target === "#modal1") {
    previousModal = modal;
  }
  modal.style.display = null; // enleve le style pour rendre visible et suprrimer le display pour rendr evisible la modale
  modal.removeAttribute("aria-hidden"); // enleve l'attribut aria-hidden qui cache la modale au lecteurs d'écran
  modal.setAttribute("aria-modal", "true"); // ajoute l'attribut aria-modal = true
  modal.addEventListener("click", closeModal); // listener sur l'ensemble de la modale pour quitter la modale
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal); // meme chose sur le bouton pour femrer la modale
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none"; // repasse le "display" en non
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
  previousModal = null;
  // pour supprimer la balise p
  const messageConfirmationAjout = document.querySelector(".delete-message");
  if (messageConfirmationAjout) {
    messageConfirmationAjout.remove();
  }
};

const ModalPrecedente = function (e) {
  if (previousModal === null) return;
  e.preventDefault();
  modal.style.display = "none"; // repasse le "display" en non
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  previousModal.style.display = null;
  previousModal.setAttribute("aria-hidden", "true");
  previousModal.removeAttribute("aria-modal");
  modal = previousModal;
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

// function "generer projet" pour modale

async function genererProjetsModal(projets) {
  for (let i = 0; i < projets.length; i++) {
    const projet = projets[i];
    const galleryModal = document.getElementById("gallery-modal");

    // création des éléments du dom
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    const trashImage = document.createElement("i");

    trashImage.classList.add("fa-regular");
    trashImage.classList.add("fa-trash-can");
    imageElement.src = projet.imageUrl;
    imageElement.alt = projet.title;
    figureElement.classList.add("image-modal");

    // rattachement des balises au DOM
    galleryModal.appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(trashImage);

    //activtation delete
    trashImage.addEventListener("click", async function (event) {
      const id = projet.id;
      const token = localStorage.getItem("information")
        ? JSON.parse(localStorage.getItem("information")).token
        : null;

      const reponse = await fetch("http://localhost:5678/api/works/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (reponse.ok) {
        galleryModal.removeChild(figureElement);
        await recupererProjets();
      } else {
        alert("La supression du projet a échoué");
      }
    });
  }
}

// ajout des catégories de la modale

async function genererCategoriesModal(categorie) {
  const c = await fetch("http://localhost:5678/api/categories");
  let categories = await c.json();

  for (let i = 0; i < categories.length; i++) {
    const categorie = categories[i];
    const select = document.getElementById("select");
    // création des éléments du dom
    const optionElement = document.createElement("option");
    optionElement.setAttribute("value", categorie.id);
    optionElement.setAttribute("name", categorie.name);

    optionElement.textContent = categorie.name;
    // rattachement des balises au DOM
    select.appendChild(optionElement);
  }
}
genererCategoriesModal();

// prévisualiser la photo ajoutée :

let imagePreview = document.getElementById("imagePreview");
let icone = document.querySelector(".fa-image");
let label = document.querySelector(".label-file");
let p = document.querySelector(".paragraphe");
let removeButton = document.getElementById("close-img");
let buttonInput = document.getElementById("submitButton");

const ajouterEcouteFile = function () {
  document.getElementById("file").addEventListener("change", changeFunction);
};

// ajout de la fonction event
const changeFunction = function (e) {
  const reader = new FileReader();
  reader.onload = function () {
    imagePreview.src = reader.result;
    imagePreview.style.display = null;
    removeButton.style.display = null;

    icone.style.display = "none";
    label.style.display = "none";
    p.style.display = "none";
  };
  if (event.target.files[0]) {
    reader.readAsDataURL(event.target.files[0]);
  }
};

ajouterEcouteFile();

removeButton.addEventListener("click", function (e) {
  const fileInput = document.getElementById("file");
  fileInput.value = "";
  imagePreview.style.display = "none";
  removeButton.style.display = "none";
  icone.style.display = "";
  label.style.display = "";
  p.style.display = "";
  buttonInput.disabled = true;
});
// bouton ajouter une photo

const formulaire = document.getElementById("formAjoutImage");
const contenuFormulaire = formulaire.innerHTML;

const AddPictures = async function (event) {
  event.preventDefault();
  const formData = new FormData();

  formData.append("title", event.target.querySelector("[name=titre]").value);
  formData.append(
    "category",
    event.target.querySelector("[name=categorie]").value
  );
  const image = event.target.querySelector("[name=image]").files[0];
  if (image) {
    formData.append("image", image);
  }

  try {
    const reponse = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${infoUtilisateur.token}`,
      },
      body: formData,
    });

    const data = await reponse.json();

    if (reponse.ok) {
      const divGallery = document.querySelector(".gallery");
      const borderButton = document.getElementById("div-ok");
      const gallery = document.getElementById("gallery-modal");
      if (!textAdd) {
        const MessageConfirmationAjout = document.createElement("p");
        MessageConfirmationAjout.innerText =
          "le projet a été ajouté avec succès.";
        MessageConfirmationAjout.classList.add("delete-message");
        borderButton.appendChild(MessageConfirmationAjout);
        textAdd = true;
      }

      console.log("Succès:", data);
      divGallery.innerHTML = "";
      gallery.innerHTML = "";
      await recupererProjets(null, true);
    }
  } catch (error) {
    console.log(error);
  }
};

// event.target.querySelector("[name=utilisateur").value,

formulaire.addEventListener("submit", AddPictures);

// pour activer le bouton valider (le dégriser)

function validateForm() {
  const titre = formulaire.querySelector("[name=titre]").value.trim();
  const categorie = formulaire.querySelector("[name=categorie]").value.trim();
  const image = formulaire.querySelector("[name=image]").files[0];

  const isFormValid = titre !== "" && categorie !== "" && image !== undefined;

  buttonInput.disabled = !isFormValid;
}

formulaire
  .querySelector("[name=titre]")
  .addEventListener("input", validateForm);
formulaire
  .querySelector("[name=categorie]")
  .addEventListener("input", validateForm);
formulaire
  .querySelector("[name=image]")
  .addEventListener("change", validateForm);
