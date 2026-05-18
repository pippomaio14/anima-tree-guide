// Chiave dicotomica semplificata per il riconoscimento delle piante dai fiori

export type FlowerKeyResult = {
  type: "result";
  id: string;
  species: string;
  scientificName: string;
  description: string;
  characteristics: string[];
};

export type FlowerKeyQuestion = {
  type: "question";
  id: string;
  question: string;
  hint?: string;
  optionA: { label: string; next: string };
  optionB: { label: string; next: string };
};

export type FlowerKeyNode = FlowerKeyQuestion | FlowerKeyResult;

export const flowerKey: Record<string, FlowerKeyNode> = {
  start: {
    type: "question",
    id: "start",
    question: "Di che colore è il fiore?",
    hint: "Osserva il colore dominante dei petali.",
    optionA: { label: "Giallo o arancione", next: "q_yellow" },
    optionB: { label: "Altro colore (bianco, rosa, blu, viola, rosso)", next: "q_other_color" },
  },

  // === GIALLI ===
  q_yellow: {
    type: "question",
    id: "q_yellow",
    question: "Quanti petali ha il fiore?",
    optionA: { label: "5 petali ben distinti", next: "q_yellow_5" },
    optionB: { label: "Molti petali (capolino composto)", next: "q_yellow_many" },
  },
  q_yellow_5: {
    type: "question",
    id: "q_yellow_5",
    question: "Com'è la pianta?",
    optionA: { label: "Erbacea bassa, foglie palmate", next: "r_ranuncolo" },
    optionB: { label: "Arbusto con fiori profumati a grappolo", next: "r_ginestra" },
  },
  q_yellow_many: {
    type: "question",
    id: "q_yellow_many",
    question: "Com'è il fiore?",
    optionA: { label: "Grande con disco centrale scuro", next: "r_girasole" },
    optionB: { label: "Piccolo, comune nei prati", next: "q_yellow_meadow" },
  },
  q_yellow_meadow: {
    type: "question",
    id: "q_yellow_meadow",
    question: "Che forma ha il capolino?",
    optionA: { label: "Tutto giallo, diventa soffione bianco", next: "r_tarassaco" },
    optionB: { label: "Disco giallo con petali bianchi", next: "r_margherita" },
  },

  // === ALTRI COLORI ===
  q_other_color: {
    type: "question",
    id: "q_other_color",
    question: "Che colore prevale?",
    optionA: { label: "Bianco", next: "q_white" },
    optionB: { label: "Rosa, rosso, blu o viola", next: "q_pink_purple" },
  },

  // === BIANCHI ===
  q_white: {
    type: "question",
    id: "q_white",
    question: "Dove cresce la pianta?",
    optionA: { label: "Su un albero o arbusto", next: "q_white_tree" },
    optionB: { label: "Pianta erbacea (a terra)", next: "q_white_herb" },
  },
  q_white_tree: {
    type: "question",
    id: "q_white_tree",
    question: "Com'è il fiore?",
    optionA: { label: "5 petali, profumato, in primavera (da frutto)", next: "r_ciliegio" },
    optionB: { label: "A grappoli pendenti molto profumati", next: "r_robinia_fiore" },
  },
  q_white_herb: {
    type: "question",
    id: "q_white_herb",
    question: "Com'è il fiore?",
    optionA: { label: "Petali bianchi attorno a un disco giallo", next: "r_margherita" },
    optionB: { label: "Piccolo, a forma di campanella o stella", next: "q_white_small" },
  },
  q_white_small: {
    type: "question",
    id: "q_white_small",
    question: "Quando e come fiorisce?",
    optionA: { label: "A fine inverno, fiori pendenti a campanella", next: "r_bucaneve" },
    optionB: { label: "Stellato, sotto bosco in primavera", next: "r_anemone" },
  },

  // === ROSA / ROSSI / BLU / VIOLA ===
  q_pink_purple: {
    type: "question",
    id: "q_pink_purple",
    question: "Il colore principale è caldo (rosso/rosa) o freddo (blu/viola)?",
    optionA: { label: "Rosso o rosa", next: "q_red_pink" },
    optionB: { label: "Blu o viola", next: "q_blue_purple" },
  },
  q_red_pink: {
    type: "question",
    id: "q_red_pink",
    question: "Com'è il fiore?",
    optionA: { label: "Grande, con molti petali profumati (arbusto spinoso)", next: "r_rosa" },
    optionB: { label: "Rosso vivo, petali sottili, nei campi", next: "r_papavero" },
  },
  q_blue_purple: {
    type: "question",
    id: "q_blue_purple",
    question: "Com'è la forma del fiore?",
    optionA: { label: "Piccoli fiori riuniti in spiga profumata (aromatica)", next: "r_lavanda" },
    optionB: { label: "A forma di campanella o singolo", next: "q_blue_single" },
  },
  q_blue_single: {
    type: "question",
    id: "q_blue_single",
    question: "Dove e come cresce?",
    optionA: { label: "Erbacea bassa con foglie cuoriformi, profumato", next: "r_violetta" },
    optionB: { label: "Fiore a campanella su stelo eretto", next: "r_campanula" },
  },

  // === RISULTATI ===
  r_ranuncolo: {
    type: "result",
    id: "r_ranuncolo",
    species: "Ranuncolo",
    scientificName: "Ranunculus sp.",
    description: "Comune nei prati umidi, con petali gialli lucidi quasi laccati.",
    characteristics: ["5 petali gialli lucidi", "Foglie palmate", "Prati e luoghi umidi"],
  },
  r_ginestra: {
    type: "result",
    id: "r_ginestra",
    species: "Ginestra",
    scientificName: "Spartium junceum",
    description: "Arbusto mediterraneo con fiori gialli intensamente profumati.",
    characteristics: ["Arbusto con rami verdi", "Fiori a grappolo", "Profumo intenso"],
  },
  r_girasole: {
    type: "result",
    id: "r_girasole",
    species: "Girasole",
    scientificName: "Helianthus annuus",
    description: "Pianta annuale dai grandi capolini gialli che seguono il sole.",
    characteristics: ["Capolino grande", "Disco centrale scuro", "Stelo alto e robusto"],
  },
  r_tarassaco: {
    type: "result",
    id: "r_tarassaco",
    species: "Tarassaco (Soffione)",
    scientificName: "Taraxacum officinale",
    description: "Erba comune dei prati, il capolino sfiorito diventa il classico soffione.",
    characteristics: ["Capolino giallo intenso", "Foglie a rosetta dentate", "Frutti piumosi (soffione)"],
  },
  r_margherita: {
    type: "result",
    id: "r_margherita",
    species: "Margherita",
    scientificName: "Leucanthemum vulgare",
    description: "Fiore simbolo dei prati estivi, semplice e luminoso.",
    characteristics: ["Petali bianchi", "Disco centrale giallo", "Steli sottili eretti"],
  },
  r_ciliegio: {
    type: "result",
    id: "r_ciliegio",
    species: "Ciliegio (in fiore)",
    scientificName: "Prunus avium",
    description: "Albero da frutto con splendida fioritura bianca primaverile.",
    characteristics: ["5 petali bianchi", "Fioritura abbondante", "Profumo delicato"],
  },
  r_robinia_fiore: {
    type: "result",
    id: "r_robinia_fiore",
    species: "Robinia (Acacia)",
    scientificName: "Robinia pseudoacacia",
    description: "Albero con grappoli pendenti di fiori bianchi molto profumati e mellitiferi.",
    characteristics: ["Grappoli pendenti", "Profumo dolce", "Rami con spine"],
  },
  r_bucaneve: {
    type: "result",
    id: "r_bucaneve",
    species: "Bucaneve",
    scientificName: "Galanthus nivalis",
    description: "Tra i primi fiori a sbocciare, spesso ancora con la neve al suolo.",
    characteristics: ["Fiore pendente a campanella", "Fioritura invernale", "Pianta bulbosa"],
  },
  r_anemone: {
    type: "result",
    id: "r_anemone",
    species: "Anemone dei boschi",
    scientificName: "Anemone nemorosa",
    description: "Fiorisce in primavera nel sottobosco, formando tappeti bianchi.",
    characteristics: ["Fiore stellato bianco", "Sottobosco primaverile", "Foglie tripartite"],
  },
  r_rosa: {
    type: "result",
    id: "r_rosa",
    species: "Rosa",
    scientificName: "Rosa sp.",
    description: "Arbusto spinoso dai fiori profumati, simbolo per eccellenza.",
    characteristics: ["Molti petali", "Profumo intenso", "Rami con spine"],
  },
  r_papavero: {
    type: "result",
    id: "r_papavero",
    species: "Papavero",
    scientificName: "Papaver rhoeas",
    description: "Fiore rosso brillante dei campi di grano e dei prati incolti.",
    characteristics: ["4 petali rossi sottili", "Centro scuro", "Steli pelosi"],
  },
  r_lavanda: {
    type: "result",
    id: "r_lavanda",
    species: "Lavanda",
    scientificName: "Lavandula angustifolia",
    description: "Arbusto aromatico mediterraneo dai fiori viola raccolti in spighe.",
    characteristics: ["Spiga di fiori viola", "Foglie strette argentate", "Aromatica"],
  },
  r_violetta: {
    type: "result",
    id: "r_violetta",
    species: "Viola",
    scientificName: "Viola odorata",
    description: "Piccolo fiore profumato del sottobosco, fiorisce in primavera.",
    characteristics: ["Fiore viola profumato", "Foglie cuoriformi", "Pianta bassa"],
  },
  r_campanula: {
    type: "result",
    id: "r_campanula",
    species: "Campanula",
    scientificName: "Campanula sp.",
    description: "Fiori a forma di campanella, comuni in montagna e nei prati.",
    characteristics: ["Forma a campanella", "Colore blu/viola", "Stelo eretto"],
  },
};

export const flowerStartNodeId = "start";
