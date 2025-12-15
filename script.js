// Lista svih 18 ekipa
const teams = [
    "MNK Pag",
    "MNK Kolan",
    "MNK Mornar",
    "MNK Gorica",
    "MNK Rtina",
    "Veterani Pag",
    "Forca",
    "Cavali",
    "Mlade nade",
    "Tenkisti Zadar",
    "Pumpa baš iz Brabusa",
    "Papataži Pag",
    "O.Š. Juraj Dalmatinac Pag",
    "Stara Novalja",
    "M.A.M Povljana / Plovanija",
    "Julovica boys",
    "Separe",
    "Hajduk Vlašići"
];

const DRAW_BUTTON = document.getElementById('draw-button');
const BRACKET_CONTAINER = document.getElementById('bracket-container');
const BRACKET_DIV = document.getElementById('bracket');
const TEAM_LIST_INITIAL_DIV = document.getElementById('team-list-initial');
const NUMBER_OF_TEAMS = teams.length;

// Potrebno je odrediti koliko ekipa ide direktno u 1/8 finala (Round 2)
// Najbliža potencija broja 2 je 16 (2^4) ili 32 (2^5).
// Sa 18 ekipa, treba nam 16 ekipa za 1/8 finala.
// 18 - 16 = 2 ekipe moraju igrati u pretkolu (Round 1)
// Da bi 16 ekipa ušlo u 1/8 finala, moramo eliminirati 2 ekipe.
// Stoga, 4 ekipe moraju igrati 2 utakmice u pretkolu (2 pobjednika idu dalje).
const TEAMS_IN_PRELIMINARY_ROUND = 4; // Ove 4 ekipe igraju u Rundi 1 (2 meča)
const TEAMS_GETTING_BYE = NUMBER_OF_TEAMS - TEAMS_IN_PRELIMINARY_ROUND; // 14 ekipa ide direktno u Runda 2 (1/8 finala)

// --- FUNKCIJE LOGIKE ---

// Fisher-Yates (Knuth) algoritam za miješanje polja
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Stvara HTML za pojedini meč
function createMatchHtml(matchLabel, team1, team2) {
    return `
        <div class="match">
            <span class="match-label">${matchLabel}</span>
            <span class="team-name">${team1}</span>
            <span class="team-name">${team2}</span>
        </div>
    `;
}

// Stvara HTML za ekipu koja ide direktno dalje (BYE)
function createByeHtml(matchLabel, team) {
    return `
        <div class="match">
            <span class="match-label">${matchLabel}</span>
            <span class="team-name">${team}</span>
            <span class="bye-info">(Direktno u 1/8 Finala - BYE)</span>
        </div>
    `;
}

// Glavna funkcija za izvlačenje i generiranje ždrijeba
function drawTournament() {
    DRAW_BUTTON.disabled = true;
    DRAW_BUTTON.textContent = 'IZVLAČENJE U TIJEKU...';
    BRACKET_DIV.innerHTML = '';
    
    // Miješanje timova
    const shuffledTeams = [...teams];
    shuffleArray(shuffledTeams);

    // Izdvajanje timova za pretkolo (Round 1) i timova s BYE (direktno u Round 2)
    const teamsForRound1 = shuffledTeams.slice(0, TEAMS_IN_PRELIMINARY_ROUND); // 4 ekipe
    const teamsForRound2Bye = shuffledTeams.slice(TEAMS_IN_PRELIMINARY_ROUND); // 14 ekipa

    // Odgoda za simulaciju "profesionalnog" izvlačenja
    setTimeout(() => {
        
        // --- Runda 1 (Pretkolo) ---
        let round1Html = '<div class="bracket-round"><h4>Runda 1 (Pretkolo)</h4>';
        
        // Meč A
        round1Html += createMatchHtml(
            'R1 - Utakmica A (Ulaz u 1/8)',
            teamsForRound1[0],
            teamsForRound1[1]
        );

        // Meč B
        round1Html += createMatchHtml(
            'R1 - Utakmica B (Ulaz u 1/8)',
            teamsForRound1[2],
            teamsForRound1[3]
        );

        round1Html += '</div>';

        // --- Runda 2 (1/8 Finala - BYE dio) ---
        let round2ByeHtml = '<div class="bracket-round"><h4>Runda 2 (1/8 Finala) - Direktan Plasman (BYE)</h4>';
        
        // Ekipe s BYE-om (14) su direktno plasirane u 1/8 finala
        // Moramo ih spojiti u 7 parova
        for (let i = 0; i < teamsForRound2Bye.length; i += 2) {
            round2ByeHtml += createMatchHtml(
                `1/8 - Meč ${String.fromCharCode(65 + i / 2)}`,
                teamsForRound2Bye[i],
                teamsForRound2Bye[i + 1]
            );
        }
        
        round2ByeHtml += '</div>';

        // --- Runda 2 (1/8 Finala - Utakmice s pobjednicima Pretkola) ---
        let round2FinalHtml = '<div class="bracket-round"><h4>Runda 2 (1/8 Finala) - Utakmice s Pobjednicima</h4>';
        
        // S ovim mečevima se popunjava preostali dio 1/8 finala
        round2FinalHtml += createMatchHtml(
            '1/8 - Meč H', // Posljednji meč 1/8 finala (ukupno 8)
            'Pobjednik R1 - Utakmica A', // Pobjednik pretkola A
            'Pobjednik R1 - Utakmica B'  // Pobjednik pretkola B
        );

        round2FinalHtml += '</div>';
        
        // Ispisivanje u DOM
        BRACKET_DIV.innerHTML = round1Html + round2ByeHtml + round2FinalHtml;

        // Prikazivanje ždrijeba i skrivanje gumba
        BRACKET_CONTAINER.style.display = 'block';
        DRAW_BUTTON.style.display = 'none';
        TEAM_LIST_INITIAL_DIV.style.display = 'none';

    }, 2000); // 2 sekunde odgode
}

// --- INICIJALIZACIJA ---

function initialize() {
    // 1. Prikaz početne liste timova
    const ul = document.createElement('ul');
    teams.forEach(team => {
        const li = document.createElement('li');
        li.textContent = team;
        ul.appendChild(li);
    });
    TEAM_LIST_INITIAL_DIV.appendChild(ul);
    
    // 2. Postavljanje event listenere na gumb
    DRAW_BUTTON.addEventListener('click', drawTournament);
}

document.addEventListener('DOMContentLoaded', initialize);
