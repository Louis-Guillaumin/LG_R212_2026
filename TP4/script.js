const conteneurProjets = document.querySelector('#projets-liste');

async function chargerEtAfficherProjets() {
  conteneurProjets.innerHTML = '<p class="loading">Chargement...</p>';
  try {
    const reponse = await fetch('./data.json');
    if (!reponse.ok) throw new Error(`Erreur HTTP : ${reponse.status}`);
    const donnees = await reponse.json();
    
    conteneurProjets.innerHTML = '';
    donnees.projets.forEach((projet) => {
      const carte = document.createElement('article');
      carte.classList.add('carte');
      carte.innerHTML = `
        <h3>${projet.titre}</h3>
        <p>${projet.description}</p>
        <p class="annee">${projet.annee}</p>
        <div class="tags">
          ${projet.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      `;
      conteneurProjets.append(carte);
    });
  } catch (erreur) {
    conteneurProjets.innerHTML = `<p class="error">Impossible de charger les données : ${erreur.message}</p>`;
  }
}
chargerEtAfficherProjets();


function afficherPays(tableauPays, conteneur) {
  conteneur.innerHTML = '';
  tableauPays.forEach((p) => {
    const carte = document.createElement('article');
    carte.classList.add('carte');
    carte.innerHTML = `
      <h3>${p.flag || ''} ${p.name.common}</h3>
      <p>Capitale : ${p.capital ? p.capital[0] : 'Inconnue'}</p>
      <p>Population : ${p.population.toLocaleString()}</p>
    `;
    conteneur.append(carte);
  });
}



const conteneurApi = document.querySelector('#api-liste');
let tousPays = []; 

async function chargerPaysEurope() {
  conteneurApi.innerHTML = '<p class="loading">Chargement des pays...</p>';
  try {
    const reponse = await fetch('https://restcountries.com/v3.1/region/europe');
    if (!reponse.ok) throw new Error("Erreur de récupération");
    tousPays = await reponse.json();
    afficherPays(tousPays, conteneurApi);
  } catch (erreur) {
    conteneurApi.innerHTML = '<p class="error">Impossible de charger les pays.</p>';
  }
}
chargerPaysEurope();


document.querySelector('#tri-pop').addEventListener('click', () => {
  const tries = [...tousPays].sort((a, b) => b.population - a.population);
  afficherPays(tries, conteneurApi);
});

document.querySelector('#tri-nom').addEventListener('click', () => {
  const tries = [...tousPays].sort((a, b) => a.name.common.localeCompare(b.name.common));
  afficherPays(tries, conteneurApi);
});

document.querySelector('#filtre-grand').addEventListener('click', () => {
  const grands = tousPays.filter(p => p.population > 10000000);
  afficherPays(grands, conteneurApi);
});

document.querySelector('#reinitialiser').addEventListener('click', () => {
  afficherPays(tousPays, conteneurApi);
});




const inputRecherche = document.querySelector('#recherche');
const conteneurRecherche = document.querySelector('#recherche-resultats');
let timerRecherche = null;

inputRecherche.addEventListener('input', () => {
  clearTimeout(timerRecherche); 
  
  timerRecherche = setTimeout(async () => {
    const terme = inputRecherche.value.trim();
    
    if (terme.length < 2) {
      conteneurRecherche.innerHTML = '<p>Tapez au moins 2 caractères.</p>';
      return;
    }

    conteneurRecherche.innerHTML = '<p class="loading">Recherche...</p>';

    try {
      const reponse = await fetch(`https://restcountries.com/v3.1/name/${terme}`);
      if (!reponse.ok) {
        conteneurRecherche.innerHTML = '<p>Aucun résultat.</p>';
        return;
      }
      const paysTrouves = await reponse.json();
      afficherPays(paysTrouves, conteneurRecherche);
    } catch (erreur) {
      conteneurRecherche.innerHTML = '<p class="error">Erreur de recherche.</p>';
    }
  }, 300); 
});


const listeConteneurPokemon = document.querySelector('#liste-pokemon');
const detailConteneurPokemon = document.querySelector('#detail-pokemon');

async function chargerListePokemon() {
  try {
    const reponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
    const donnees = await reponse.json();

    listeConteneurPokemon.innerHTML = '';
    donnees.results.forEach((pokemon) => {
      const bouton = document.createElement('button');
      bouton.textContent = pokemon.name;
      bouton.addEventListener('click', () => chargerDetailPokemon(pokemon.name));
      listeConteneurPokemon.append(bouton);
    });
  } catch (erreur) {
    listeConteneurPokemon.innerHTML = '<p class="error">Impossible de charger la liste.</p>';
  }
}

async function chargerDetailPokemon(nom) {
  detailConteneurPokemon.innerHTML = '<p class="loading">Chargement...</p>';
  try {
    const reponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${nom}`);
    const pokemon = await reponse.json();

    detailConteneurPokemon.innerHTML = `
      <h2>${pokemon.name}</h2>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <p>Taille : ${pokemon.height / 10} m</p>
      <p>Poids : ${pokemon.weight / 10} kg</p>
      <p>Types : ${pokemon.types.map(t => t.type.name).join(', ')}</p>
    `;
  } catch (erreur) {
    detailConteneurPokemon.innerHTML = '<p class="error">Impossible de charger le détail.</p>';
  }
}

chargerListePokemon();