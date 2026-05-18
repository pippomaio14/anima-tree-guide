// Chiave dicotomica semplificata per il riconoscimento degli alberi dalla foglia
// Ogni nodo è una domanda con due opzioni (sì/no oppure A/B) che porta a un altro nodo o a un risultato.

export type LeafKeyResult = {
  type: "result";
  id: string;
  species: string;
  scientificName: string;
  description: string;
  characteristics: string[];
};

export type LeafKeyQuestion = {
  type: "question";
  id: string;
  question: string;
  hint?: string;
  optionA: { label: string; next: string };
  optionB: { label: string; next: string };
};

export type LeafKeyNode = LeafKeyQuestion | LeafKeyResult;

export const leafKey: Record<string, LeafKeyNode> = {
  start: {
    type: "question",
    id: "start",
    question: "Che tipo di foglia osservi?",
    hint: "Guarda la forma generale e la lamina della foglia.",
    optionA: { label: "Foglia larga e piatta (latifoglia)", next: "q_broadleaf" },
    optionB: { label: "Foglia ad ago o squamosa (conifera)", next: "q_conifer" },
  },

  // === LATIFOGLIE ===
  q_broadleaf: {
    type: "question",
    id: "q_broadleaf",
    question: "La foglia è semplice o composta?",
    hint: "Composta = formata da più foglioline su un unico picciolo.",
    optionA: { label: "Semplice (un'unica lamina)", next: "q_simple_margin" },
    optionB: { label: "Composta (più foglioline)", next: "q_compound_type" },
  },

  q_simple_margin: {
    type: "question",
    id: "q_simple_margin",
    question: "Com'è il margine della foglia?",
    hint: "Osserva il bordo: liscio, dentato o lobato.",
    optionA: { label: "Lobato (con insenature profonde)", next: "q_lobed_shape" },
    optionB: { label: "Intero o dentato (senza lobi)", next: "q_entire_shape" },
  },

  q_lobed_shape: {
    type: "question",
    id: "q_lobed_shape",
    question: "Che forma hanno i lobi?",
    optionA: { label: "Lobi arrotondati (forma a mano)", next: "r_quercia" },
    optionB: { label: "Lobi appuntiti, palmati (a stella)", next: "q_palmate_lobes" },
  },

  q_palmate_lobes: {
    type: "question",
    id: "q_palmate_lobes",
    question: "Quanti lobi principali ha la foglia?",
    optionA: { label: "3-5 lobi acuti, foglia grande", next: "r_platano" },
    optionB: { label: "5-7 lobi sottili, foglia più piccola", next: "r_acero" },
  },

  q_entire_shape: {
    type: "question",
    id: "q_entire_shape",
    question: "Che forma ha la lamina?",
    optionA: { label: "Cuoriforme (a forma di cuore)", next: "r_tiglio" },
    optionB: { label: "Ovale o allungata, lanceolata", next: "q_lanceolate" },
  },

  q_lanceolate: {
    type: "question",
    id: "q_lanceolate",
    question: "Com'è la superficie della foglia?",
    optionA: { label: "Lucida e coriacea, sempreverde", next: "r_leccio" },
    optionB: { label: "Sottile, decidua, con margine dentato", next: "r_faggio" },
  },

  q_compound_type: {
    type: "question",
    id: "q_compound_type",
    question: "Come sono disposte le foglioline?",
    optionA: { label: "Pennate (lungo un asse centrale)", next: "q_pinnate" },
    optionB: { label: "Palmate (tutte da un punto, a ventaglio)", next: "r_ippocastano" },
  },

  q_pinnate: {
    type: "question",
    id: "q_pinnate",
    question: "Quante foglioline ci sono?",
    optionA: { label: "5-9 foglioline grandi, margine dentato", next: "r_noce" },
    optionB: { label: "Molte foglioline piccole (11+)", next: "r_robinia" },
  },

  // === CONIFERE ===
  q_conifer: {
    type: "question",
    id: "q_conifer",
    question: "Le foglie sono aghiformi o squamiformi?",
    optionA: { label: "Aghi sottili e allungati", next: "q_needle_group" },
    optionB: { label: "Squame piatte, sovrapposte", next: "r_cipresso" },
  },

  q_needle_group: {
    type: "question",
    id: "q_needle_group",
    question: "Come sono disposti gli aghi?",
    optionA: { label: "In ciuffi (fascetti di 2 o più aghi)", next: "r_pino" },
    optionB: { label: "Singoli, inseriti uno a uno sul ramo", next: "q_single_needle" },
  },

  q_single_needle: {
    type: "question",
    id: "q_single_needle",
    question: "Gli aghi sono pungenti o morbidi?",
    optionA: { label: "Pungenti, rigidi, a sezione quadrangolare", next: "r_abete_rosso" },
    optionB: { label: "Morbidi, piatti, con due righe chiare sotto", next: "r_abete_bianco" },
  },

  // === RISULTATI ===
  r_quercia: {
    type: "result",
    id: "r_quercia",
    species: "Quercia (Rovere/Farnia)",
    scientificName: "Quercus robur / Quercus petraea",
    description: "Albero maestoso e longevo, simbolo di forza. Tipico dei boschi italiani.",
    characteristics: ["Foglia lobata", "Lobi arrotondati", "Produce ghiande"],
  },
  r_platano: {
    type: "result",
    id: "r_platano",
    species: "Platano",
    scientificName: "Platanus × acerifolia",
    description: "Albero da viale con corteccia a chiazze che si sfalda.",
    characteristics: ["Foglia grande palmata", "3-5 lobi acuti", "Corteccia screziata"],
  },
  r_acero: {
    type: "result",
    id: "r_acero",
    species: "Acero",
    scientificName: "Acer sp.",
    description: "Conosciuto per le foglie palmate e i frutti alati (samare).",
    characteristics: ["Foglia palmata", "Lobi appuntiti", "Frutti ad elica"],
  },
  r_tiglio: {
    type: "result",
    id: "r_tiglio",
    species: "Tiglio",
    scientificName: "Tilia sp.",
    description: "Albero ornamentale dai fiori profumati e dalle foglie a cuore.",
    characteristics: ["Foglia cuoriforme", "Margine dentato", "Fiori profumati"],
  },
  r_leccio: {
    type: "result",
    id: "r_leccio",
    species: "Leccio",
    scientificName: "Quercus ilex",
    description: "Quercia sempreverde tipica del paesaggio mediterraneo.",
    characteristics: ["Foglia coriacea", "Sempreverde", "Pagina inferiore tomentosa"],
  },
  r_faggio: {
    type: "result",
    id: "r_faggio",
    species: "Faggio",
    scientificName: "Fagus sylvatica",
    description: "Albero dei boschi montani, con foglie lucide e ondulate.",
    characteristics: ["Foglia ovale", "Margine ondulato/cigliato", "Corteccia liscia grigia"],
  },
  r_ippocastano: {
    type: "result",
    id: "r_ippocastano",
    species: "Ippocastano",
    scientificName: "Aesculus hippocastanum",
    description: "Albero ornamentale con foglie palmate e frutti spinosi.",
    characteristics: ["Foglia palmato-composta", "5-7 foglioline", "Castagne non commestibili"],
  },
  r_noce: {
    type: "result",
    id: "r_noce",
    species: "Noce",
    scientificName: "Juglans regia",
    description: "Albero da frutto pregiato, con legno di grande valore.",
    characteristics: ["Foglia pennata", "5-9 foglioline", "Aromatica se stropicciata"],
  },
  r_robinia: {
    type: "result",
    id: "r_robinia",
    species: "Robinia (Acacia)",
    scientificName: "Robinia pseudoacacia",
    description: "Specie diffusa, con rami spinosi e fiori bianchi profumati.",
    characteristics: ["Foglia pennata con molte foglioline", "Spine sui rami", "Fiori bianchi a grappolo"],
  },
  r_cipresso: {
    type: "result",
    id: "r_cipresso",
    species: "Cipresso",
    scientificName: "Cupressus sempervirens",
    description: "Conifera dalla caratteristica forma colonnare.",
    characteristics: ["Foglie a squama", "Forma colonnare", "Coni legnosi rotondi"],
  },
  r_pino: {
    type: "result",
    id: "r_pino",
    species: "Pino",
    scientificName: "Pinus sp.",
    description: "Conifera con aghi raccolti in fascetti, produce pigne.",
    characteristics: ["Aghi in fascetti", "Pigne legnose", "Resina aromatica"],
  },
  r_abete_rosso: {
    type: "result",
    id: "r_abete_rosso",
    species: "Abete rosso (Peccio)",
    scientificName: "Picea abies",
    description: "Tipico delle Alpi, con pigne pendenti e aghi pungenti.",
    characteristics: ["Aghi singoli pungenti", "Pigne pendenti", "Chioma conica"],
  },
  r_abete_bianco: {
    type: "result",
    id: "r_abete_bianco",
    species: "Abete bianco",
    scientificName: "Abies alba",
    description: "Conifera maestosa con aghi piatti e pigne erette.",
    characteristics: ["Aghi piatti morbidi", "Due righe bianche sotto", "Pigne erette"],
  },
};

export const startNodeId = "start";
