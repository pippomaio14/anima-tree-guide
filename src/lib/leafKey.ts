// Chiave dicotomica per il riconoscimento delle piante dalle foglie
// nel Parco Bosco Anima Mundi (43 specie).
// Ogni nodo è una domanda con due o più opzioni che porta a un altro nodo
// o a un risultato. La struttura supporta optionA/optionB (binaria) per la UI esistente,
// ma alcune coppie possono guidare verso un sotto-nodo con ulteriore distinzione.

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
  // ===== INIZIO =====
  start: {
    type: "question",
    id: "start",
    question: "Che tipo di foglia stai osservando?",
    hint: "Guarda la forma generale: larga e piatta, ad ago/squama, oppure a ventaglio.",
    optionA: { label: "Foglia larga e piatta (latifoglia)", next: "q_leaf_arrangement" },
    optionB: { label: "Ad ago/squama o a ventaglio", next: "q_needle_or_fan" },
  },

  q_needle_or_fan: {
    type: "question",
    id: "q_needle_or_fan",
    question: "Come si presenta la foglia?",
    optionA: { label: "Foglie a squame piatte sui rametti (conifera)", next: "r_cipresso" },
    optionB: { label: "Foglia a ventaglio con nervature parallele", next: "r_ginkgo" },
  },

  // ===== LATIFOGLIE: composta o semplice =====
  q_leaf_arrangement: {
    type: "question",
    id: "q_leaf_arrangement",
    question: "La foglia è semplice o composta?",
    hint: "Composta = formata da più foglioline distinte su un unico picciolo.",
    optionA: { label: "Semplice (un'unica lamina)", next: "q_simple_lobed" },
    optionB: { label: "Composta (più foglioline)", next: "q_compound_type" },
  },

  // ===== COMPOSTE =====
  q_compound_type: {
    type: "question",
    id: "q_compound_type",
    question: "Come sono disposte le foglioline?",
    optionA: { label: "Palmate, tutte da un punto a ventaglio", next: "r_ippocastano_nano" },
    optionB: { label: "Pennate (lungo un asse) o trifogliate (3 foglioline)", next: "q_compound_count" },
  },

  q_compound_count: {
    type: "question",
    id: "q_compound_count",
    question: "Quante foglioline ha la foglia?",
    optionA: { label: "Solo 3 foglioline (trifogliata)", next: "r_maggiociondolo" },
    optionB: { label: "5 o più foglioline pennate", next: "q_pinnate_size" },
  },

  q_pinnate_size: {
    type: "question",
    id: "q_pinnate_size",
    question: "Come sono le foglioline e la foglia complessiva?",
    optionA: { label: "Foglia molto grande (>30 cm), 11-21 foglioline lanceolate, rachide spesso alata", next: "r_noce_caucaso" },
    optionB: { label: "Foglia di dimensioni medie/piccole", next: "q_pinnate_margin" },
  },

  q_pinnate_margin: {
    type: "question",
    id: "q_pinnate_margin",
    question: "Com'è il margine delle foglioline?",
    optionA: { label: "Margine intero o appena dentato (Fraxinus)", next: "q_fraxinus" },
    optionB: { label: "Margine nettamente dentato/seghettato", next: "q_pinnate_serrate" },
  },

  q_fraxinus: {
    type: "question",
    id: "q_fraxinus",
    question: "Come sono le foglioline del Frassino?",
    hint: "Osserva picciolo e gemme alla base della foglia.",
    optionA: { label: "Foglioline sessili (senza picciolo), gemme nere", next: "r_frassino" },
    optionB: { label: "Foglioline picciolate, gemme grigio-pelose", next: "r_orniello" },
  },

  q_pinnate_serrate: {
    type: "question",
    id: "q_pinnate_serrate",
    question: "Quante e come sono le foglioline?",
    optionA: { label: "5-7 foglioline grandi (10-15 cm), opposte, odore sgradevole se stropicciate", next: "r_sambuco" },
    optionB: { label: "Molte foglioline (11-21) lanceolate, regolarmente seghettate", next: "q_sorbus_rosa" },
  },

  q_sorbus_rosa: {
    type: "question",
    id: "q_sorbus_rosa",
    question: "Le foglioline sono grandi o piccole?",
    optionA: { label: "Foglioline 4-7 cm, 11-21, foglia lunga fino a 25 cm (Sorbus)", next: "r_sorbo_domestico" },
    optionB: { label: "Foglioline piccole 2-4 cm, 5-7, rami con spine ricurve", next: "r_rosa_canina" },
  },

  // ===== SEMPLICI: lobate o non lobate =====
  q_simple_lobed: {
    type: "question",
    id: "q_simple_lobed",
    question: "La foglia ha lobi marcati?",
    hint: "Lobo = sporgenza separata da una insenatura profonda.",
    optionA: { label: "Sì, ha lobi distinti", next: "q_lobed_type" },
    optionB: { label: "No, margine intero o solo dentato", next: "q_simple_margin" },
  },

  q_lobed_type: {
    type: "question",
    id: "q_lobed_type",
    question: "Come sono disposti i lobi?",
    optionA: { label: "Palmati (tutti partono dalla base, a stella/ventaglio)", next: "q_palmate_lobes" },
    optionB: { label: "Pennati (distribuiti lungo la nervatura centrale)", next: "q_pinnate_lobes" },
  },

  q_palmate_lobes: {
    type: "question",
    id: "q_palmate_lobes",
    question: "Che aspetto hanno i lobi palmati?",
    optionA: { label: "3-5 lobi ottusi e arrotondati, foglia piccola (5-8 cm)", next: "r_acero_campestre" },
    optionB: { label: "Lobi acuti/appuntiti", next: "q_palmate_acute" },
  },

  q_palmate_acute: {
    type: "question",
    id: "q_palmate_acute",
    question: "La foglia è grande o piccola?",
    optionA: { label: "Grande (10-18 cm), 5 lobi acuti, picciolo con lattice bianco", next: "r_acero_riccio" },
    optionB: { label: "Foglia 5-10 cm con 3 lobi acuti e dentati, stipole evidenti sul picciolo", next: "r_pallon_maggio" },
  },

  q_pinnate_lobes: {
    type: "question",
    id: "q_pinnate_lobes",
    question: "Come sono i lobi pennati?",
    optionA: { label: "Lobi arrotondati, base della foglia auricolata, picciolo cortissimo", next: "r_farnia" },
    optionB: { label: "Lobi acuminati e dentati, foglia simile ad acero ma alternata (Sorbus)", next: "r_ciavardello" },
  },

  // ===== SEMPLICI NON LOBATE =====
  q_simple_margin: {
    type: "question",
    id: "q_simple_margin",
    question: "Com'è il margine della foglia?",
    optionA: { label: "Intero (liscio, senza denti)", next: "q_entire_shape" },
    optionB: { label: "Dentato o seghettato", next: "q_serrate_arrangement" },
  },

  // ===== INTERE =====
  q_entire_shape: {
    type: "question",
    id: "q_entire_shape",
    question: "Che forma ha la foglia intera?",
    optionA: { label: "Cuoriforme o tondeggiante (a forma di cuore/disco)", next: "q_heart_shape" },
    optionB: { label: "Ovata, ellittica o lanceolata", next: "q_entire_texture" },
  },

  q_heart_shape: {
    type: "question",
    id: "q_heart_shape",
    question: "Che aspetto ha la foglia cuoriforme/tondeggiante?",
    optionA: { label: "Foglia a cuore con apice arrotondato (Albero di Giuda mediterraneo)", next: "r_albero_giuda" },
    optionB: { label: "Foglia a cuore con apice più appuntito o foglia rotonda intera glabra", next: "q_heart_2" },
  },

  q_heart_2: {
    type: "question",
    id: "q_heart_2",
    question: "Quale dei due?",
    optionA: { label: "Cuoriforme con apice acuto/cuspidato (varietà americana)", next: "r_albero_giuda_canadese" },
    optionB: { label: "Foglia rotondo-obovata, intera, colore rosso/viola in autunno", next: "r_scotano" },
  },

  q_entire_texture: {
    type: "question",
    id: "q_entire_texture",
    question: "Com'è la consistenza e il colore della foglia?",
    optionA: { label: "Coriacea, sempreverde, spesso aromatica se stropicciata", next: "q_evergreen_aromatic" },
    optionB: { label: "Decidua o argentea/grigiastra", next: "q_deciduous_entire" },
  },

  q_evergreen_aromatic: {
    type: "question",
    id: "q_evergreen_aromatic",
    question: "Che profumo e che dimensione ha?",
    optionA: { label: "Foglia 6-12 cm lanceolata, odore di alloro tipico in cucina", next: "r_alloro" },
    optionB: { label: "Foglia con altre caratteristiche", next: "q_evergreen_2" },
  },

  q_evergreen_2: {
    type: "question",
    id: "q_evergreen_2",
    question: "Quale di queste descrizioni si adatta meglio?",
    optionA: { label: "Foglia ovale-lanceolata con 3 nervature ben evidenti dalla base, odore di canfora", next: "r_canfora" },
    optionB: { label: "Foglia ovata 4-8 cm, coriacea lucida scura, picciolo corto (Ligustro)", next: "q_evergreen_3" },
  },

  q_evergreen_3: {
    type: "question",
    id: "q_evergreen_3",
    question: "Foglia opposta o alterna?",
    optionA: { label: "Foglia opposta, ovale-ellittica, sempreverde (Viburno tino, infiorescenze a corimbo bianche)", next: "r_viburno_tino" },
    optionB: { label: "Foglia opposta, ovale, coriacea lucida (Ligustro del Giappone, siepi)", next: "r_ligustro" },
  },

  q_deciduous_entire: {
    type: "question",
    id: "q_deciduous_entire",
    question: "Com'è la foglia decidua a margine intero?",
    optionA: { label: "Argentata su entrambe le pagine, stretta lanceolata", next: "q_silvery" },
    optionB: { label: "Verde, di altra forma", next: "q_other_entire" },
  },

  q_silvery: {
    type: "question",
    id: "q_silvery",
    question: "Il ramo ha spine?",
    optionA: { label: "Senza spine, foglia argentea-verdastra 4-8 cm (Olivagno)", next: "r_olivagno" },
    optionB: { label: "Con spine acute sul ramo, foglia stretta argentea (Olivello spinoso)", next: "r_olivello" },
  },

  q_other_entire: {
    type: "question",
    id: "q_other_entire",
    question: "Quale aspetto descrive meglio la foglia?",
    optionA: { label: "Grande obovata (10-15 cm), molle, fiori bianchi/rosa prima delle foglie (Magnolia)", next: "r_magnolia" },
    optionB: { label: "Foglia lanceolata opposta, decidua, profumata in inverno (Calicanto)", next: "r_calicanto" },
  },

  // ===== DENTATE =====
  q_serrate_arrangement: {
    type: "question",
    id: "q_serrate_arrangement",
    question: "Le foglie sono opposte o alterne sul rametto?",
    optionA: { label: "Opposte (due foglie allo stesso nodo)", next: "q_opposite_serrate" },
    optionB: { label: "Alterne (una per nodo)", next: "q_alternate_serrate" },
  },

  q_opposite_serrate: {
    type: "question",
    id: "q_opposite_serrate",
    question: "Quale descrizione corrisponde?",
    optionA: { label: "Foglia ovata con 3-5 paia di nervature parallele molto curve verso l'apice, margine intero/ondulato (Corniolo)", next: "r_corniolo" },
    optionB: { label: "Foglia lanceolata, lucida, sempreverde, leggermente dentata (Lauroceraso)", next: "r_lauroceraso" },
  },

  q_alternate_serrate: {
    type: "question",
    id: "q_alternate_serrate",
    question: "Il ramo ha spine o no?",
    optionA: { label: "Sì, rami con spine", next: "q_thorny" },
    optionB: { label: "No, ramo senza spine", next: "q_no_thorn_serrate" },
  },

  q_thorny: {
    type: "question",
    id: "q_thorny",
    question: "Che tipo di spine?",
    optionA: { label: "Spine tripartite (3-fide), foglie piccole ovate in fascetti, fiori gialli (Crespino)", next: "r_crespino" },
    optionB: { label: "Altre spine", next: "q_thorny_2" },
  },

  q_thorny_2: {
    type: "question",
    id: "q_thorny_2",
    question: "Quale tipo di spine e foglie?",
    optionA: { label: "Foglie ovate 2-4 cm con 3 nervature evidenti, due spine (una dritta, una uncinata) per nodo (Marruca)", next: "r_marruca" },
    optionB: { label: "Altre", next: "q_thorny_3" },
  },

  q_thorny_3: {
    type: "question",
    id: "q_thorny_3",
    question: "Foglia lunga argentea o piccola dentata?",
    optionA: { label: "Foglia stretta argentea, ramo molto spinoso (Olivello spinoso)", next: "r_olivello" },
    optionB: { label: "Foglia piccola obovata dentata, rami nerastri spinosi, frutto pruno-nero (Prugnolo)", next: "r_prugnolo" },
  },

  q_no_thorn_serrate: {
    type: "question",
    id: "q_no_thorn_serrate",
    question: "Come sono le nervature secondarie?",
    optionA: { label: "Diritte, parallele e regolari, terminanti nel dente (Betulacee)", next: "q_betulaceae" },
    optionB: { label: "Curve o irregolari (Rosacee/Salice/altre)", next: "q_rosaceae_or_other" },
  },

  q_betulaceae: {
    type: "question",
    id: "q_betulaceae",
    question: "Quale aspetto descrive la foglia?",
    optionA: { label: "Foglia ovata acuminata 5-10 cm, doppiamente dentata, nervature parallele molto incise (Carpino bianco)", next: "r_carpino" },
    optionB: { label: "Altra", next: "q_betulaceae_2" },
  },

  q_betulaceae_2: {
    type: "question",
    id: "q_betulaceae_2",
    question: "Foglia tonda con apice acuto o tronco?",
    optionA: { label: "Foglia subrotonda con apice acuto, doppiamente dentata, pubescente (Nocciolo)", next: "r_nocciolo" },
    optionB: { label: "Foglia obovata con apice tronco/smarginato, vischiosa da giovane (Ontano nero)", next: "r_ontano" },
  },

  q_rosaceae_or_other: {
    type: "question",
    id: "q_rosaceae_or_other",
    question: "Foglia lunga lanceolata oppure ovata/rotonda?",
    optionA: { label: "Lunga lanceolata (>3x la larghezza), biancastra sotto (Salice bianco)", next: "r_salice" },
    optionB: { label: "Ovata, ellittica o rotonda", next: "q_rosaceae" },
  },

  q_rosaceae: {
    type: "question",
    id: "q_rosaceae",
    question: "La pagina inferiore è tomentosa (peluria fitta) o glabra?",
    optionA: { label: "Tomentosa/pubescente sotto", next: "q_tomentose" },
    optionB: { label: "Glabra (priva di peli) o quasi", next: "q_glabrous" },
  },

  q_tomentose: {
    type: "question",
    id: "q_tomentose",
    question: "Che forma e dimensione?",
    optionA: { label: "Foglia ovata 4-8 cm, picciolo corto, frutto = mela selvatica (Melo selvatico)", next: "r_melo" },
    optionB: { label: "Foglia lanceolata/obovata 8-12 cm, dentata solo nella metà superiore, frutto a 'nespola' (Nespolo europeo)", next: "r_nespolo" },
  },

  q_glabrous: {
    type: "question",
    id: "q_glabrous",
    question: "Come è il picciolo e la forma generale?",
    optionA: { label: "Foglia rotonda/ovata con picciolo lungo (uguale o maggiore della lamina), dentata fine (Pero selvatico)", next: "r_pero_selvatico" },
    optionB: { label: "Foglia ellittica/ovata con picciolo medio, dentata fine", next: "q_glabrous_2" },
  },

  q_glabrous_2: {
    type: "question",
    id: "q_glabrous_2",
    question: "Quale di queste descrizioni si adatta meglio?",
    optionA: { label: "Foglia ovata-ellittica 3-5 cm, glabra, dentata fine, fiori bianchi a racemo (Pero corvino - Amelanchier)", next: "r_pero_corvino" },
    optionB: { label: "Altra (foglia dentata, ciliegi/prugni o azzeruolo)", next: "q_prunus_or_azz" },
  },

  q_prunus_or_azz: {
    type: "question",
    id: "q_prunus_or_azz",
    question: "Il margine ha denti regolari o lobi/incisioni?",
    optionA: { label: "Margine con 3-5 lobi/incisioni, foglia rosacea (Azzeruolo rosso)", next: "r_azzeruolo" },
    optionB: { label: "Margine solo dentato regolare (genere Prunus)", next: "q_prunus" },
  },

  q_prunus: {
    type: "question",
    id: "q_prunus",
    question: "Quale Prunus?",
    optionA: { label: "Foglia ovata 6-10 cm, finemente dentata, fiori in racemi pendenti (Pado - Prunus padus)", next: "r_pado" },
    optionB: { label: "Foglia più piccola, altra forma", next: "q_prunus_2" },
  },

  q_prunus_2: {
    type: "question",
    id: "q_prunus_2",
    question: "Quale aspetto?",
    optionA: { label: "Foglia ovata 3-6 cm, lievemente cuoriforme alla base, aromatica (Ciliegio canino - Prunus mahaleb)", next: "r_ciliegio_canino" },
    optionB: { label: "Foglia lanceolata 4-8 cm, rossastra da giovane, frutto giallo/rosso simile a piccola susina (Amolo - Mirabolano)", next: "r_amolo" },
  },

  // ===== RISULTATI =====

  r_cipresso: {
    type: "result",
    id: "r_cipresso",
    species: "Cipresso comune",
    scientificName: "Cupressus sempervirens",
    description: "Conifera mediterranea dalla caratteristica forma colonnare slanciata.",
    characteristics: ["Foglie a squame piatte", "Forma colonnare", "Coni legnosi rotondi"],
  },
  r_ginkgo: {
    type: "result",
    id: "r_ginkgo",
    species: "Ginkgo (Albero di Capelvenere)",
    scientificName: "Ginkgo biloba",
    description: "Fossile vivente con foglia a ventaglio bilobato, unico nel suo genere.",
    characteristics: ["Foglia a ventaglio", "Nervature parallele dicotome", "Decidua, giallo intenso in autunno"],
  },

  r_ippocastano_nano: {
    type: "result",
    id: "r_ippocastano_nano",
    species: "Ippocastano nano",
    scientificName: "Aesculus parviflora",
    description: "Arbusto a foglia palmato-composta con 5-7 foglioline, fiori bianchi in pannocchia.",
    characteristics: ["Foglia palmato-composta", "5-7 foglioline lanceolate dentate", "Fiori bianchi a spiga eretta"],
  },
  r_maggiociondolo: {
    type: "result",
    id: "r_maggiociondolo",
    species: "Maggiociondolo",
    scientificName: "Laburnum anagyroides",
    description: "Albero ornamentale con foglia trifogliata e vistosi grappoli di fiori gialli a maggio.",
    characteristics: ["Foglia trifogliata", "Foglioline ovate, pelose sotto", "Fiori gialli pendenti"],
  },
  r_noce_caucaso: {
    type: "result",
    id: "r_noce_caucaso",
    species: "Noce del Caucaso",
    scientificName: "Pterocarya fraxinifolia",
    description: "Grande albero con foglie pennate molto lunghe e infiorescenze pendule di samare alate.",
    characteristics: ["Foglia molto grande (30-50 cm)", "11-21 foglioline lanceolate", "Frutti alati in lunghi grappoli"],
  },
  r_frassino: {
    type: "result",
    id: "r_frassino",
    species: "Frassino comune",
    scientificName: "Fraxinus excelsior",
    description: "Albero d'alto fusto con foglie pennate, foglioline sessili e gemme nere caratteristiche.",
    characteristics: ["Foglia pennata 9-13 foglioline", "Foglioline sessili", "Gemme nere"],
  },
  r_orniello: {
    type: "result",
    id: "r_orniello",
    species: "Orniello",
    scientificName: "Fraxinus ornus",
    description: "Frassino dei boschi mediterranei, con vistosa fioritura bianca primaverile (manna).",
    characteristics: ["Foglia pennata 5-9 foglioline picciolate", "Gemme grigio-pelose", "Fiori bianchi profumati"],
  },
  r_sambuco: {
    type: "result",
    id: "r_sambuco",
    species: "Sambuco",
    scientificName: "Sambucus nigra",
    description: "Arbusto/piccolo albero con grandi infiorescenze bianche e bacche nere eduli (da cotte).",
    characteristics: ["Foglia pennata 5-7 foglioline", "Odore sgradevole se stropicciata", "Midollo bianco abbondante"],
  },
  r_sorbo_domestico: {
    type: "result",
    id: "r_sorbo_domestico",
    species: "Sorbo domestico",
    scientificName: "Sorbus domestica",
    description: "Albero da frutto antico, con foglia pennata simile al frassino e piccoli pomi eduli.",
    characteristics: ["Foglia pennata 11-21 foglioline", "Foglioline seghettate", "Frutti a pero/mela in miniatura"],
  },
  r_rosa_canina: {
    type: "result",
    id: "r_rosa_canina",
    species: "Rosa canina (Rosa selvatica)",
    scientificName: "Rosa canina",
    description: "Arbusto spinoso dei boschi, con fiori rosa pallido e bacche rosse (cinorrodi).",
    characteristics: ["Foglia pennata 5-7 foglioline", "Rami con spine ricurve", "Cinorrodi rossi in autunno"],
  },

  r_acero_campestre: {
    type: "result",
    id: "r_acero_campestre",
    species: "Acero campestre",
    scientificName: "Acer campestre",
    description: "Acero di siepe, piccolo albero con foglie palmate a lobi ottusi.",
    characteristics: ["Foglia piccola 5-8 cm", "3-5 lobi arrotondati", "Samare ad ali orizzontali"],
  },
  r_acero_riccio: {
    type: "result",
    id: "r_acero_riccio",
    species: "Acero riccio",
    scientificName: "Acer platanoides",
    description: "Acero ornamentale a foglia grande con 5 lobi acuti e picciolo che emette lattice bianco.",
    characteristics: ["Foglia grande 10-18 cm", "5 lobi acuti dentati", "Picciolo con lattice bianco"],
  },
  r_pallon_maggio: {
    type: "result",
    id: "r_pallon_maggio",
    species: "Pallon di Maggio",
    scientificName: "Viburnum opulus",
    description: "Arbusto con foglie trilobate simili all'acero e infiorescenze a 'palla' bianca.",
    characteristics: ["Foglia 3-lobata acuta", "Stipole sul picciolo", "Bacche rosse traslucide"],
  },
  r_farnia: {
    type: "result",
    id: "r_farnia",
    species: "Farnia (Quercia)",
    scientificName: "Quercus robur",
    description: "Grande quercia caducifoglia, longeva e maestosa, simbolo dei boschi planiziali.",
    characteristics: ["Foglia lobata pennata", "Base auricolata, picciolo cortissimo", "Produce ghiande su lungo peduncolo"],
  },
  r_ciavardello: {
    type: "result",
    id: "r_ciavardello",
    species: "Ciavardello",
    scientificName: "Sorbus torminalis",
    description: "Sorbo dei boschi con foglie lobate simili all'acero ma alterne.",
    characteristics: ["Foglia lobata acuminata", "Foglie alterne (non opposte)", "Frutti bruni a 'pera' selvatica"],
  },

  r_albero_giuda: {
    type: "result",
    id: "r_albero_giuda",
    species: "Albero di Giuda",
    scientificName: "Cercis siliquastrum",
    description: "Albero mediterraneo dalla spettacolare fioritura rosa-violacea sui rami nudi.",
    characteristics: ["Foglia cuoriforme con apice arrotondato", "Fiori rosa direttamente sui rami", "Legumi pendenti rossastri"],
  },
  r_albero_giuda_canadese: {
    type: "result",
    id: "r_albero_giuda_canadese",
    species: "Albero di Giuda canadese",
    scientificName: "Cercis canadensis",
    description: "Variante nordamericana con foglie cuoriformi a punta più acuta e fioritura rosa intensa.",
    characteristics: ["Foglia cuoriforme con apice acuto/cuspidato", "Fiori rosa-magenta sui rami", "Pianta ornamentale"],
  },
  r_scotano: {
    type: "result",
    id: "r_scotano",
    species: "Scotano (Albero della nebbia)",
    scientificName: "Cotinus coggygria",
    description: "Arbusto con foglie tonde e infiorescenze piumose simili a 'fumo' rosato.",
    characteristics: ["Foglia rotondo-obovata intera", "Colore rosso-viola in autunno", "Infiorescenze piumose vaporose"],
  },

  r_alloro: {
    type: "result",
    id: "r_alloro",
    species: "Alloro",
    scientificName: "Laurus nobilis",
    description: "Sempreverde mediterraneo aromatico, usato in cucina e simbolo della vittoria.",
    characteristics: ["Foglia lanceolata coriacea", "Aromatica se stropicciata", "Bacche nere"],
  },
  r_canfora: {
    type: "result",
    id: "r_canfora",
    species: "Albero della canfora",
    scientificName: "Cinnamomum camphora",
    description: "Grande sempreverde con foglie aromatiche che rilasciano profumo di canfora.",
    characteristics: ["Foglia ovale con 3 nervature evidenti", "Odore di canfora", "Sempreverde"],
  },
  r_viburno_tino: {
    type: "result",
    id: "r_viburno_tino",
    species: "Viburno tino (Lentaggine)",
    scientificName: "Viburnum tinus",
    description: "Arbusto sempreverde mediterraneo con fiori bianco-rosati in inverno-primavera.",
    characteristics: ["Foglia opposta sempreverde", "Infiorescenze a corimbo bianche", "Bacche blu metallico"],
  },
  r_ligustro: {
    type: "result",
    id: "r_ligustro",
    species: "Ligustro del Giappone",
    scientificName: "Ligustrum japonicum",
    description: "Sempreverde ornamentale molto usato per siepi formali.",
    characteristics: ["Foglia ovale coriacea lucida", "Sempreverde", "Fiori bianchi a pannocchia"],
  },

  r_olivagno: {
    type: "result",
    id: "r_olivagno",
    species: "Olivagno",
    scientificName: "Elaeagnus angustifolia",
    description: "Piccolo albero con foglie argentee strette, simile a un olivo.",
    characteristics: ["Foglia lanceolata argentea", "Senza spine evidenti", "Fiori giallastri profumati"],
  },
  r_olivello: {
    type: "result",
    id: "r_olivello",
    species: "Olivello spinoso",
    scientificName: "Hippophae rhamnoides",
    description: "Arbusto pioniero con foglie argentee e bacche arancioni ricche di vitamina C.",
    characteristics: ["Foglia stretta argentea sotto", "Rami molto spinosi", "Bacche arancioni"],
  },
  r_magnolia: {
    type: "result",
    id: "r_magnolia",
    species: "Magnolia denudata",
    scientificName: "Magnolia denudata",
    description: "Magnolia decidua con grandi fiori bianchi che sbocciano prima delle foglie.",
    characteristics: ["Foglia obovata grande", "Fiori bianchi enormi a primavera", "Decidua"],
  },
  r_calicanto: {
    type: "result",
    id: "r_calicanto",
    species: "Calicanto d'inverno",
    scientificName: "Chimonanthus praecox",
    description: "Arbusto deciduo dai fiori gialli intensamente profumati in pieno inverno.",
    characteristics: ["Foglia lanceolata opposta", "Fiori gialli profumati in inverno", "Decidua"],
  },

  r_corniolo: {
    type: "result",
    id: "r_corniolo",
    species: "Corniolo",
    scientificName: "Cornus mas",
    description: "Piccolo albero con fioritura gialla precoce e frutti rossi eduli (corniole).",
    characteristics: ["Foglia opposta ovata", "Nervature curve molto evidenti", "Frutti rossi commestibili"],
  },
  r_lauroceraso: {
    type: "result",
    id: "r_lauroceraso",
    species: "Lauroceraso",
    scientificName: "Prunus laurocerasus 'Rotundifolia'",
    description: "Sempreverde da siepe, con foglie coriacee lucide (foglie e semi tossici).",
    characteristics: ["Foglia sempreverde lucida", "Margine appena dentato", "Frutti neri tossici"],
  },

  r_crespino: {
    type: "result",
    id: "r_crespino",
    species: "Crespino comune",
    scientificName: "Berberis vulgaris",
    description: "Arbusto spinoso con foglie in fascetti e bacche rosse acidule.",
    characteristics: ["Foglie ovate in fascetti", "Spine 3-fide ai nodi", "Bacche rosse aspre"],
  },
  r_marruca: {
    type: "result",
    id: "r_marruca",
    species: "Marruca",
    scientificName: "Paliurus spina-christi",
    description: "Arbusto spinosissimo della macchia mediterranea con curiosi frutti a 'cappello'.",
    characteristics: ["Foglia ovata con 3 nervature", "Due spine per nodo (una dritta, una ricurva)", "Frutti a disco"],
  },
  r_prugnolo: {
    type: "result",
    id: "r_prugnolo",
    species: "Prugnolo selvatico",
    scientificName: "Prunus spinosa",
    description: "Arbusto spinoso con fiori bianchi a fine inverno e prugne nere astringenti.",
    characteristics: ["Rami spinosi neri", "Foglia obovata piccola dentata", "Prugne piccole blu-nere"],
  },

  r_carpino: {
    type: "result",
    id: "r_carpino",
    species: "Carpino bianco",
    scientificName: "Carpinus betulus",
    description: "Albero dei boschi misti con foglia tipicamente solcata dalle nervature parallele.",
    characteristics: ["Foglia ovata doppiamente dentata", "Nervature parallele molto incise", "Frutti con brattea a 3 lobi"],
  },
  r_nocciolo: {
    type: "result",
    id: "r_nocciolo",
    species: "Nocciolo",
    scientificName: "Corylus avellana",
    description: "Arbusto/piccolo albero con foglia subrotonda pubescente, produce le nocciole.",
    characteristics: ["Foglia subrotonda con apice acuto", "Doppiamente dentata, pelosa", "Amenti pendenti gialli in inverno"],
  },
  r_ontano: {
    type: "result",
    id: "r_ontano",
    species: "Ontano nero (Ontano comune)",
    scientificName: "Alnus glutinosa",
    description: "Albero dei luoghi umidi e ripariali, con foglie tronche all'apice e piccoli 'coni' legnosi.",
    characteristics: ["Foglia obovata con apice tronco/smarginato", "Vischiosa da giovane", "Coni legnosi persistenti"],
  },

  r_salice: {
    type: "result",
    id: "r_salice",
    species: "Salice bianco",
    scientificName: "Salix alba",
    description: "Albero ripariale con foglie strette argentate, tipico di rive e zone umide.",
    characteristics: ["Foglia lanceolata stretta lunga", "Pagina inferiore biancastra/setosa", "Rami flessibili penduli"],
  },

  r_melo: {
    type: "result",
    id: "r_melo",
    species: "Melo selvatico",
    scientificName: "Malus sylvestris",
    description: "Antenato selvatico del melo coltivato, con piccole mele acidule.",
    characteristics: ["Foglia ovata dentata", "Pagina inferiore tomentosa", "Frutti = piccole mele"],
  },
  r_nespolo: {
    type: "result",
    id: "r_nespolo",
    species: "Nespolo europeo",
    scientificName: "Mespilus germanica",
    description: "Albero da frutto antico, con grandi fiori bianchi solitari e frutto da consumare maturo.",
    characteristics: ["Foglia lanceolata-obovata tomentosa", "Dentata nella metà superiore", "Frutto a 'nespola'"],
  },
  r_pero_selvatico: {
    type: "result",
    id: "r_pero_selvatico",
    species: "Pero selvatico",
    scientificName: "Pyrus pyraster",
    description: "Antenato selvatico del pero, con frutti piccoli astringenti.",
    characteristics: ["Foglia rotondo-ovata", "Picciolo lungo come la lamina", "Margine finemente dentato"],
  },
  r_pero_corvino: {
    type: "result",
    id: "r_pero_corvino",
    species: "Pero corvino (Amelanchier)",
    scientificName: "Amelanchier ovalis",
    description: "Arbusto montano con fiori bianchi a stella e bacche nere-bluastre eduli.",
    characteristics: ["Foglia ovata-ellittica glabra", "Margine finemente dentato", "Fiori bianchi a racemo, bacche scure"],
  },

  r_azzeruolo: {
    type: "result",
    id: "r_azzeruolo",
    species: "Azzeruolo rosso",
    scientificName: "Crataegus azarolus",
    description: "Piccolo albero da frutto della famiglia dei biancospini, frutti rosso-aranciati eduli.",
    characteristics: ["Foglia 3-5 lobata/dentata", "Spine corte sui rami", "Frutti tipo piccole mele rosse"],
  },

  r_pado: {
    type: "result",
    id: "r_pado",
    species: "Pado (Ciliegio a grappolo)",
    scientificName: "Prunus padus",
    description: "Ciliegio selvatico con vistosi grappoli pendenti di fiori bianchi profumati.",
    characteristics: ["Foglia ovata finemente dentata", "Racemi bianchi pendenti", "Ciliegine nere amare"],
  },
  r_ciliegio_canino: {
    type: "result",
    id: "r_ciliegio_canino",
    species: "Ciliegio canino",
    scientificName: "Prunus mahaleb",
    description: "Piccolo ciliegio selvatico aromatico, usato come portainnesto.",
    characteristics: ["Foglia ovata 3-6 cm aromatica", "Base lievemente cuoriforme", "Frutti neri molto amari"],
  },
  r_amolo: {
    type: "result",
    id: "r_amolo",
    species: "Amolo (Mirabolano)",
    scientificName: "Prunus cerasifera",
    description: "Piccolo albero ornamentale e da frutto, spesso con foglie e fiori rossastri.",
    characteristics: ["Foglia lanceolata dentata", "Spesso rossastra (varietà 'Pissardii')", "Frutti gialli o rossi"],
  },
};

export const startNodeId = "start";
