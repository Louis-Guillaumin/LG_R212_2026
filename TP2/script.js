
// EXERCICE 1 — Menu burger

const bouton = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');

// Ouvre ou ferme le menu au clic et indique l'état aux lecteurs (accessibilité)
bouton.addEventListener('click', () => {
  menu.classList.toggle('is-open');
  const isOpen = menu.classList.contains('is-open');
  bouton.setAttribute('aria-expanded', isOpen);
});

// Permet de fermer le menu en appuyant sur la touche Échap et de replacer le focus sur le bouton
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) {
    menu.classList.remove('is-open');
    bouton.setAttribute('aria-expanded', 'false');
    bouton.focus();
  }
});


// EXERCICE 2 — Modale accessible

const btnOpen = document.querySelector('.modal-open');
const btnClose = document.querySelector('.modal-close');
const modal = document.querySelector('.modal');

// Fonctions pour gérer l'affichage de la modale en modifiant la classe CSS et les attributs ARIA
function ouvrirModale() {
  modal.classList.add('is-visible');
  modal.setAttribute('aria-hidden', 'false');
}

function fermerModale() {
  modal.classList.remove('is-visible');
  modal.setAttribute('aria-hidden', 'true');
  btnOpen.focus();
}

btnOpen.addEventListener('click', ouvrirModale);
btnClose.addEventListener('click', fermerModale);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-visible')) {
    fermerModale();
  }
});

// Ferme la modale uniquement si l'utilisateur clique sur le fond sombre
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    fermerModale();
  }
});


// EXERCICE 3 — Accordéon

const questions = document.querySelectorAll('.faq-question');

// Parcourt toutes les questions pour leur attacher une action au clic
questions.forEach((question) => {
  question.addEventListener('click', () => {
    const reponse = question.nextElementSibling;
    const estDejaOuverte = reponse.classList.contains('is-visible');

    // Ferme d'abord toutes les réponses pour qu'une seule reste ouverte à la fois
    document.querySelectorAll('.faq-answer').forEach((r) => {
      r.classList.remove('is-visible');
    });

    if (!estDejaOuverte) {
      reponse.classList.add('is-visible');
    }
  });
});


// EXERCICE 4 (Bonus) — Thème sombre

const btnTheme = document.querySelector('#theme-toggle');

// Alterne la classe 'dark' sur le corps de la page et met à jour le texte du bouton
btnTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  btnTheme.textContent = isDark ? '☀️ Clair' : '🌙 Sombre';
});