// Chiave dicotomica per il riconoscimento delle piante dai fiori
// nel Parco Bosco Anima Mundi (43 specie).
// Considera anche fiori poco vistosi: amenti, coni, glomeruli, fiori apetali.

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
  // ===== INIZIO =====
  start: {
    type: "question",
    id: "start",
    question: "La pianta produce fiori veri (con petali o sepali) o solo strutture coniche/amenti?",
    hint: "Le conifere producono coni; molti alberi anemofili producono amenti (spighe pendenti senza petali).",
    optionA: { label: "Coni o strutture nude (senza petali)", next: "q_no_petals" },
    optionB: { label: "Fiori con petali visibili o vistosi", next: "q_color" },
  },

  // ===== NO PETALI: gimnosperme + amenti + apetali =====
  q_no_petals: {
    type: "question",
    id: "q_no_petals",
    question: "Che tipo di struttura riproduttiva osservi?",
    optionA: { label: "Coni legnosi o ovuli su pianta senza fiori veri (gimnosperma)", next: "q_gymno" },
    optionB: { label: "Amenti / spighe / glomeruli (su latifoglia)", next: "q_catkins" },
  },

  q_gymno: {
    type: "question",
    id: "q_gymno",
    question: "Che tipo di gimnosperma?",
    optionA: { label: "Conifera con piccoli coni sferici legnosi (1-3 cm), foglie a squama", next: "r_cipresso" },
    optionB: { label: "Albero con foglie a ventaglio e ovuli peduncolati (giallo-aranciati a maturità)", next: "r_ginkgo" },
  },

  q_catkins: {
    type: "question",
    id: "q_catkins",
    question: "Com'è l'amento?",
    optionA: { label: "Pendulo, soffice/lanoso (giallo o argenteo, simile a coda)", next: "q_pendulous_catkin" },
    optionB: { label: "Eretto, breve, oppure piccoli fiori a fascetto sul ramo", next: "q_erect_catkin" },
  },

  q_pendulous_catkin: {
    type: "question",
    id: "q_pendulous_catkin",
    question: "Quale descrizione si adatta?",
    optionA: { label: "Amenti gialli a 'coda di topo' in pieno inverno, prima delle foglie; arbusto", next: "r_nocciolo" },
    optionB: { label: "Altri amenti penduli", next: "q_pendulous_catkin_2" },
  },

  q_pendulous_catkin_2: {
    type: "question",
    id: "q_pendulous_catkin_2",
    question: "Quale?",
    optionA: { label: "Amenti penduli + piccoli 'coni' legnosi persistenti sui rami (Ontano)", next: "r_ontano" },
    optionB: { label: "Altri", next: "q_pendulous_catkin_3" },
  },

  q_pendulous_catkin_3: {
    type: "question",
    id: "q_pendulous_catkin_3",
    question: "Forma e dimensione?",
    optionA: { label: "Amenti molto lunghi (15-50 cm) penduli, su albero a foglie pennate grandi", next: "r_noce_caucaso" },
    optionB: { label: "Amenti soffici argentei o gialli ('gattini' del salice), albero ripariale", next: "r_salice" },
  },

  q_erect_catkin: {
    type: "question",
    id: "q_erect_catkin",
    question: "Quale tipo di infiorescenza maschile/femminile?",
    optionA: { label: "Amenti a 'pigna' verde eretta, foglia con nervature parallele incise (Carpino)", next: "r_carpino" },
    optionB: { label: "Fiori femminili eretti minuscoli che diventeranno ghiande (Quercia)", next: "r_farnia" },
  },

  // ===== FIORI CON PETALI: per colore =====
  q_color: {
    type: "question",
    id: "q_color",
    question: "Qual è il colore predominante dei fiori?",
    optionA: { label: "Bianchi o crema", next: "q_white" },
    optionB: { label: "Gialli, rosa, rossi o verdognoli", next: "q_other_color" },
  },

  q_other_color: {
    type: "question",
    id: "q_other_color",
    question: "Quale tonalità?",
    optionA: { label: "Gialli (anche giallo-verdi o giallo-arancio)", next: "q_yellow" },
    optionB: { label: "Rosa, rossi, viola o verdognoli/piumosi", next: "q_pink_or_green" },
  },

  // ===== GIALLI =====
  q_yellow: {
    type: "question",
    id: "q_yellow",
    question: "Come sono disposti i fiori gialli?",
    optionA: { label: "In lunghi grappoli pendenti molto vistosi (10-25 cm)", next: "q_yellow_pendant" },
    optionB: { label: "Piccoli, in mazzetti, ombrelle o solitari", next: "q_yellow_small" },
  },

  q_yellow_pendant: {
    type: "question",
    id: "q_yellow_pendant",
    question: "Quale?",
    optionA: { label: "Grappoli gialli pendenti come glicine, fioritura a maggio, foglia trifogliata", next: "r_maggiociondolo" },
    optionB: { label: "Pannocchie giallo-oro estive, seguite da capsule a 'lanterna cinese'", next: "r_lanterne" },
  },

  q_yellow_small: {
    type: "question",
    id: "q_yellow_small",
    question: "Quando fioriscono e su che tipo di pianta?",
    optionA: { label: "In pieno inverno, prima delle foglie", next: "q_yellow_winter" },
    optionB: { label: "In primavera-estate, con le foglie", next: "q_yellow_spring" },
  },

  q_yellow_winter: {
    type: "question",
    id: "q_yellow_winter",
    question: "Quale aspetto?",
    optionA: { label: "Petali allungati cerei, profumo intensissimo, arbusto deciduo", next: "r_calicanto" },
    optionB: { label: "Piccoli fiori gialli a ombrella sui rami nudi, poi frutti rossi", next: "r_corniolo" },
  },

  q_yellow_spring: {
    type: "question",
    id: "q_yellow_spring",
    question: "Quale descrizione?",
    optionA: { label: "Piccoli fiori in racemi pendenti su arbusto spinoso (spine 3-fide)", next: "r_crespino" },
    optionB: { label: "Altri gialli piccoli/insignificanti", next: "q_yellow_spring_2" },
  },

  q_yellow_spring_2: {
    type: "question",
    id: "q_yellow_spring_2",
    question: "Quale?",
    optionA: { label: "Fiori giallo-verdi in corimbi penduli, albero con foglie palmate (Acero)", next: "q_acer" },
    optionB: { label: "Piccoli fiori giallo-argentei profumati a campanella, arbusto a foglie argentate", next: "q_silvery" },
  },

  q_acer: {
    type: "question",
    id: "q_acer",
    question: "Che acero?",
    optionA: { label: "Foglia grande (10-18 cm) con 5 lobi acuti, picciolo con lattice bianco", next: "r_acero_riccio" },
    optionB: { label: "Foglia piccola (5-8 cm) con 3-5 lobi ottusi arrotondati", next: "r_acero_campestre" },
  },

  q_silvery: {
    type: "question",
    id: "q_silvery",
    question: "Foglie argentee o foglie verdi normali?",
    optionA: { label: "Foglie argentate (lanceolate o strette)", next: "q_silvery_thorn" },
    optionB: { label: "Foglie verdi piccole (1-3 cm) con 3 nervature, due spine per nodo (Marruca)", next: "r_marruca" },
  },
  q_silvery_thorn: {
    type: "question",
    id: "q_silvery_thorn",
    question: "Il ramo ha spine?",
    optionA: { label: "Senza spine evidenti, fiori giallo-argentei a campanella profumati (Olivagno)", next: "r_olivagno" },
    optionB: { label: "Rami molto spinosi, fiori verde-giallini insignificanti (Olivello spinoso)", next: "r_olivello" },
  },

  // ===== ROSA / ROSSI / VERDI =====
  q_pink_or_green: {
    type: "question",
    id: "q_pink_or_green",
    question: "I fiori sono rosa/rossi vistosi o verdognoli/piumosi?",
    optionA: { label: "Rosa intenso o magenta, vistosi", next: "q_pink" },
    optionB: { label: "Verdognoli, brunastri o piumosi", next: "q_greenish" },
  },

  q_pink: {
    type: "question",
    id: "q_pink",
    question: "Come si dispongono?",
    optionA: { label: "Direttamente sui rami nudi prima delle foglie (cauliflori)", next: "q_cercis" },
    optionB: { label: "Su rami fogliati, grandi a 5 petali (rosa pallida selvatica)", next: "r_rosa" },
  },

  q_cercis: {
    type: "question",
    id: "q_cercis",
    question: "Quale Albero di Giuda?",
    optionA: { label: "Specie mediterranea, foglia cuoriforme con apice arrotondato", next: "r_albero_giuda" },
    optionB: { label: "Specie nordamericana, foglia cuoriforme con apice più acuto", next: "r_albero_giuda_canadese" },
  },

  q_greenish: {
    type: "question",
    id: "q_greenish",
    question: "Aspetto dell'infiorescenza?",
    optionA: { label: "Grandi infiorescenze piumose rosa-grigiastre simili a fumo/nuvola", next: "r_scotano" },
    optionB: { label: "Piccoli fiori verdognoli senza petali in pannocchie (Frassino)", next: "r_frassino" },
  },

  // ===== BIANCHI =====
  q_white: {
    type: "question",
    id: "q_white",
    question: "Come sono i fiori bianchi?",
    optionA: { label: "Grandi e vistosi (>4 cm di diametro), pochi per ramo", next: "q_white_big" },
    optionB: { label: "Piccoli, riuniti in mazzetti, racemi, pannocchie o ombrelle", next: "q_white_small" },
  },

  q_white_big: {
    type: "question",
    id: "q_white_big",
    question: "Quale?",
    optionA: { label: "Enormi fiori bianchi (8-15 cm) sui rami nudi prima delle foglie", next: "r_magnolia" },
    optionB: { label: "Fiori bianchi solitari 3-5 cm con 5 petali e lunghi sepali, frutto a 'nespola'", next: "r_nespolo" },
  },

  q_white_small: {
    type: "question",
    id: "q_white_small",
    question: "Forma dell'infiorescenza?",
    optionA: { label: "Ombrella/corimbo (fiori riuniti su uno stesso piano)", next: "q_corymb" },
    optionB: { label: "Racemo, pannocchia, fascetto o mazzetti su rami nudi", next: "q_raceme_or_cluster" },
  },

  q_corymb: {
    type: "question",
    id: "q_corymb",
    question: "Aspetto del corimbo/ombrella?",
    optionA: { label: "Corimbi piatti grandi (15-25 cm), odore intenso, su arbusto/albero a foglia pennata", next: "r_sambuco" },
    optionB: { label: "Corimbi più piccoli o sferici, foglie semplici", next: "q_corymb_2" },
  },

  q_corymb_2: {
    type: "question",
    id: "q_corymb_2",
    question: "Quale Viburno?",
    optionA: { label: "Corimbi sferici bianchi 'a palla', foglie 3-lobate simili ad acero, bacche rosse", next: "r_pallon_maggio" },
    optionB: { label: "Corimbi rosa-bianchi a fine inverno/primavera, foglie sempreverdi opposte", next: "r_viburno_tino" },
  },

  q_raceme_or_cluster: {
    type: "question",
    id: "q_raceme_or_cluster",
    question: "Pannocchia/racemo o fascetti/mazzetti?",
    optionA: { label: "Racemi/pannocchie allungati (asse principale evidente)", next: "q_raceme" },
    optionB: { label: "Fascetti/mazzetti di pochi fiori (2-8), tipici delle Rosacee", next: "q_rosacee_cluster" },
  },

  q_raceme: {
    type: "question",
    id: "q_raceme",
    question: "Quale?",
    optionA: { label: "Pannocchia eretta a piramide sopra foglie palmate, su arbusto (Ippocastano nano)", next: "r_ippocastano_nano" },
    optionB: { label: "Altro racemo/pannocchia", next: "q_raceme_2" },
  },

  q_raceme_2: {
    type: "question",
    id: "q_raceme_2",
    question: "Quale?",
    optionA: { label: "Racemi pendenti di fiori bianchi piccoli profumati, foglie ovate dentate (Pado)", next: "r_pado" },
    optionB: { label: "Racemi eretti su arbusto sempreverde a foglia coriacea lucida (Lauroceraso)", next: "q_raceme_3" },
  },

  q_raceme_3: {
    type: "question",
    id: "q_raceme_3",
    question: "Quale sempreverde da siepe?",
    optionA: { label: "Foglia molto coriacea lucida lanceolata (Lauroceraso)", next: "r_lauroceraso" },
    optionB: { label: "Foglia ovale coriacea, pannocchie tardo-estive (Ligustro del Giappone)", next: "q_panicle_2" },
  },

  q_panicle_2: {
    type: "question",
    id: "q_panicle_2",
    question: "Quale pannocchia bianca?",
    optionA: { label: "Pannocchia terminale di fiori bianco-crema in estate, su sempreverde a foglia coriacea", next: "r_ligustro" },
    optionB: { label: "Pannocchia di fiori bianco-crema profumati prima delle foglie, su frassino", next: "r_orniello" },
  },

  q_rosacee_cluster: {
    type: "question",
    id: "q_rosacee_cluster",
    question: "Quando e come fioriscono?",
    optionA: { label: "Fiori solitari o a coppie sui rami nudi a fine inverno (rosacee precoci)", next: "q_early_rosacee" },
    optionB: { label: "Fiori in mazzetti di 3-8 con le foglie, in primavera", next: "q_late_rosacee" },
  },

  q_early_rosacee: {
    type: "question",
    id: "q_early_rosacee",
    question: "Pianta con o senza spine?",
    optionA: { label: "Rami spinosi neri, fiori bianchi piccolissimi a febbraio-marzo (Prugnolo)", next: "r_prugnolo" },
    optionB: { label: "Rami senza spine, fiori bianco-rosati 2-3 cm prima delle foglie (Mirabolano)", next: "r_amolo" },
  },

  q_late_rosacee: {
    type: "question",
    id: "q_late_rosacee",
    question: "Quale aspetto?",
    optionA: { label: "Pianta spinosa con corimbi di fiori bianchi a 5 petali (Azzeruolo)", next: "r_azzeruolo" },
    optionB: { label: "Pianta senza spine evidenti", next: "q_late_rosacee_2" },
  },

  q_late_rosacee_2: {
    type: "question",
    id: "q_late_rosacee_2",
    question: "Petali e foglie come?",
    optionA: { label: "Fiori bianchi a 5 petali stretti e allungati, racemo eretto a stella (Pero corvino)", next: "r_pero_corvino" },
    optionB: { label: "Fiori bianchi a 5 petali rotondi in mazzetti corti", next: "q_pomacee" },
  },

  q_pomacee: {
    type: "question",
    id: "q_pomacee",
    question: "Frutto previsto?",
    optionA: { label: "Frutto = mela selvatica, foglie ovate tomentose sotto (Melo selvatico)", next: "r_melo" },
    optionB: { label: "Frutto = piccola pera o sorba o ciliegina", next: "q_pomacee_2" },
  },

  q_pomacee_2: {
    type: "question",
    id: "q_pomacee_2",
    question: "Quale?",
    optionA: { label: "Foglia rotonda con picciolo lungo, fiori bianchi 2-3 cm (Pero selvatico)", next: "r_pero_selvatico" },
    optionB: { label: "Foglia composta pennata o lobata, fiori in corimbo", next: "q_sorbus" },
  },

  q_sorbus: {
    type: "question",
    id: "q_sorbus",
    question: "Foglia composta o lobata?",
    optionA: { label: "Foglia pennata 11-21 foglioline, frutti a piccola pera/mela (Sorbo domestico)", next: "r_sorbo_domestico" },
    optionB: { label: "Foglia lobata simile ad acero ma alterna, frutti bruni (Ciavardello)", next: "r_ciavardello" },
  },

  // ===== RISULTATI =====

  r_cipresso: {
    type: "result", id: "r_cipresso",
    species: "Cipresso comune",
    scientificName: "Cupressus sempervirens",
    description: "Conifera mediterranea: non ha fiori veri, ma piccoli coni legnosi sferici.",
    characteristics: ["Coni sferici 2-3 cm", "Foglie a squama", "Sempreverde colonnare"],
  },
  r_ginkgo: {
    type: "result", id: "r_ginkgo",
    species: "Ginkgo (Albero di Capelvenere)",
    scientificName: "Ginkgo biloba",
    description: "Gimnosperma con sessi separati: piante femminili producono ovuli giallo-aranciati maleodoranti a maturità.",
    characteristics: ["Strobili maschili gialli", "Ovuli femminili carnosi", "Foglia a ventaglio"],
  },

  r_nocciolo: {
    type: "result", id: "r_nocciolo",
    species: "Nocciolo",
    scientificName: "Corylus avellana",
    description: "Fiorisce in pieno inverno con amenti maschili gialli pendenti ('coda di topo') e minuscoli fiori femminili rossi.",
    characteristics: ["Amenti gialli pendenti in inverno", "Fiori femminili rossi minuscoli", "Frutto = nocciola"],
  },
  r_ontano: {
    type: "result", id: "r_ontano",
    species: "Ontano nero (Ontano comune)",
    scientificName: "Alnus glutinosa",
    description: "Albero ripariale con amenti maschili penduli e infiorescenze femminili che diventano piccoli 'coni' legnosi persistenti.",
    characteristics: ["Amenti maschili penduli", "'Coni' legnosi persistenti", "Habitat umido"],
  },
  r_noce_caucaso: {
    type: "result", id: "r_noce_caucaso",
    species: "Noce del Caucaso",
    scientificName: "Pterocarya fraxinifolia",
    description: "Grande albero con spettacolari amenti penduli verdognoli lunghissimi (15-50 cm), seguiti da frutti alati a grappolo.",
    characteristics: ["Amenti penduli 15-50 cm", "Frutti = noci alate a grappolo", "Foglie pennate grandi"],
  },
  r_salice: {
    type: "result", id: "r_salice",
    species: "Salice bianco",
    scientificName: "Salix alba",
    description: "Albero dioico ripariale con amenti soffici ('gattini') argentei o gialli secondo il sesso.",
    characteristics: ["Amenti soffici argentei/gialli", "Pianta dioica", "Foglie lanceolate biancastre"],
  },
  r_carpino: {
    type: "result", id: "r_carpino",
    species: "Carpino bianco",
    scientificName: "Carpinus betulus",
    description: "Albero dei boschi misti con amenti maschili penduli e infiorescenze femminili erette a 'pigna' verde.",
    characteristics: ["Amenti maschili penduli", "Frutti con brattea a 3 lobi", "Nervature parallele incise"],
  },
  r_farnia: {
    type: "result", id: "r_farnia",
    species: "Farnia (Quercia)",
    scientificName: "Quercus robur",
    description: "Grande quercia con fiori maschili in amenti penduli giallo-verdi e fiori femminili minuscoli che diventeranno ghiande.",
    characteristics: ["Amenti maschili penduli", "Fiori femminili minuscoli", "Frutto = ghianda su lungo peduncolo"],
  },

  r_maggiociondolo: {
    type: "result", id: "r_maggiociondolo",
    species: "Maggiociondolo",
    scientificName: "Laburnum anagyroides",
    description: "Spettacolari grappoli gialli pendenti a maggio, simili a un glicine giallo. Tutta la pianta è tossica.",
    characteristics: ["Lunghi grappoli gialli pendenti", "Foglia trifogliata", "Semi tossici"],
  },
  r_lanterne: {
    type: "result", id: "r_lanterne",
    species: "Albero delle lanterne cinesi",
    scientificName: "Koelreuteria paniculata",
    description: "Estive pannocchie erette di fiori giallo-oro, seguite da capsule rosate a forma di lanterna.",
    characteristics: ["Pannocchie gialle erette", "Capsule a 'lanterna' rosate", "Foglia pennata"],
  },
  r_calicanto: {
    type: "result", id: "r_calicanto",
    species: "Calicanto d'inverno",
    scientificName: "Chimonanthus praecox",
    description: "Arbusto deciduo dai piccoli fiori gialli cerosi profumatissimi in pieno inverno, sui rami nudi.",
    characteristics: ["Fiori gialli cerosi", "Profumo intenso", "Fiorisce in gennaio-febbraio"],
  },
  r_corniolo: {
    type: "result", id: "r_corniolo",
    species: "Corniolo",
    scientificName: "Cornus mas",
    description: "Fioritura precocissima: minuscoli fiori gialli a ombrella sui rami nudi a fine inverno; frutti rossi eduli in estate.",
    characteristics: ["Ombrelle di fiori gialli", "Sui rami nudi", "Frutti rossi commestibili"],
  },
  r_crespino: {
    type: "result", id: "r_crespino",
    species: "Crespino comune",
    scientificName: "Berberis vulgaris",
    description: "Arbusto spinoso con grappoli pendenti di fiori gialli e bacche rosse acidule in autunno.",
    characteristics: ["Racemi pendenti gialli", "Spine 3-fide", "Bacche rosse aspre"],
  },
  r_acero_riccio: {
    type: "result", id: "r_acero_riccio",
    species: "Acero riccio",
    scientificName: "Acer platanoides",
    description: "Fiorisce prima delle foglie con vistosi corimbi giallo-verdi eretti.",
    characteristics: ["Corimbi giallo-verdi", "Prima delle foglie", "Picciolo con lattice bianco"],
  },
  r_acero_campestre: {
    type: "result", id: "r_acero_campestre",
    species: "Acero campestre",
    scientificName: "Acer campestre",
    description: "Piccoli corimbi giallo-verdi penduli, contemporanei alle foglie.",
    characteristics: ["Corimbi giallo-verdi", "Foglia piccola 3-5 lobi ottusi", "Samare ad ali orizzontali"],
  },
  r_olivagno: {
    type: "result", id: "r_olivagno",
    species: "Olivagno",
    scientificName: "Elaeagnus angustifolia",
    description: "Piccoli fiori giallo-argentei a campanella, profumatissimi, su rametti a foglia argentea.",
    characteristics: ["Fiori a campanella giallo-argentei", "Profumo dolce intenso", "Foglie argentee"],
  },
  r_olivello: {
    type: "result", id: "r_olivello",
    species: "Olivello spinoso",
    scientificName: "Hippophae rhamnoides",
    description: "Fiori piccolissimi verde-giallini insignificanti, dioico; frutti arancioni ricchi di vitamina C.",
    characteristics: ["Fiori apetali verde-giallini", "Pianta dioica spinosa", "Bacche arancioni"],
  },

  r_albero_giuda: {
    type: "result", id: "r_albero_giuda",
    species: "Albero di Giuda",
    scientificName: "Cercis siliquastrum",
    description: "Spettacolare fioritura rosa-magenta direttamente sui rami nudi (cauliflora) prima delle foglie.",
    characteristics: ["Fiori rosa sui rami nudi", "Cauliflora", "Foglia cuoriforme arrotondata"],
  },
  r_albero_giuda_canadese: {
    type: "result", id: "r_albero_giuda_canadese",
    species: "Albero di Giuda canadese",
    scientificName: "Cercis canadensis",
    description: "Variante nordamericana con fiori rosa-magenta sui rami nudi e foglia cuoriforme con apice acuto.",
    characteristics: ["Fiori rosa sui rami", "Foglia con apice acuto", "Cauliflora"],
  },
  r_rosa: {
    type: "result", id: "r_rosa",
    species: "Rosa canina (Rosa selvatica)",
    scientificName: "Rosa canina",
    description: "Grandi fiori rosa pallido a 5 petali con stami gialli, su arbusto spinoso; frutti = cinorrodi rossi.",
    characteristics: ["Fiori rosa 5 petali", "Stami gialli vistosi", "Cinorrodi rossi in autunno"],
  },
  r_scotano: {
    type: "result", id: "r_scotano",
    species: "Scotano (Albero della nebbia)",
    scientificName: "Cotinus coggygria",
    description: "Grandi infiorescenze piumose rosa-grigiastre persistenti che ricordano una nuvola di fumo.",
    characteristics: ["Infiorescenze piumose 'a fumo'", "Foglia rotonda intera", "Colori autunnali intensi"],
  },
  r_frassino: {
    type: "result", id: "r_frassino",
    species: "Frassino comune",
    scientificName: "Fraxinus excelsior",
    description: "Fiori apetali poco vistosi in pannocchie verdognole/violacee prima delle foglie.",
    characteristics: ["Fiori apetali violacei", "Prima delle foglie", "Gemme nere caratteristiche"],
  },

  r_magnolia: {
    type: "result", id: "r_magnolia",
    species: "Magnolia denudata",
    scientificName: "Magnolia denudata",
    description: "Enormi fiori bianchi a tulipano (8-15 cm) sui rami nudi a inizio primavera.",
    characteristics: ["Fiori bianchi 8-15 cm", "A coppa/tulipano", "Prima delle foglie"],
  },
  r_nespolo: {
    type: "result", id: "r_nespolo",
    species: "Nespolo europeo",
    scientificName: "Mespilus germanica",
    description: "Grandi fiori bianchi solitari 3-5 cm con sepali lunghi, seguiti dalla classica nespola.",
    characteristics: ["Fiori bianchi solitari grandi", "Sepali lunghi fogliacei", "Frutto = nespola"],
  },

  r_sambuco: {
    type: "result", id: "r_sambuco",
    species: "Sambuco",
    scientificName: "Sambucus nigra",
    description: "Grandi corimbi piatti bianco-crema (15-25 cm) dal profumo intenso; bacche nere in autunno.",
    characteristics: ["Corimbi piatti 15-25 cm", "Profumo intenso", "Bacche nere eduli (cotte)"],
  },
  r_pallon_maggio: {
    type: "result", id: "r_pallon_maggio",
    species: "Pallon di Maggio",
    scientificName: "Viburnum opulus",
    description: "Infiorescenze sferiche bianche 'a palla' a maggio; bacche rosse traslucide in autunno.",
    characteristics: ["Corimbi sferici bianchi", "Foglia 3-lobata", "Bacche rosse traslucide"],
  },
  r_viburno_tino: {
    type: "result", id: "r_viburno_tino",
    species: "Viburno tino (Lentaggine)",
    scientificName: "Viburnum tinus",
    description: "Sempreverde mediterraneo con corimbi rosa-bianchi da fine inverno a primavera; bacche blu metallico.",
    characteristics: ["Corimbi bianco-rosati", "Sempreverde", "Bacche blu metallico"],
  },

  r_ippocastano_nano: {
    type: "result", id: "r_ippocastano_nano",
    species: "Ippocastano nano",
    scientificName: "Aesculus parviflora",
    description: "Arbusto con vistose pannocchie erette di fiori bianchi a stami rossi sopra le foglie palmate.",
    characteristics: ["Pannocchia bianca eretta", "Stami lunghi rossi", "Foglie palmate"],
  },
  r_pado: {
    type: "result", id: "r_pado",
    species: "Pado (Ciliegio a grappolo)",
    scientificName: "Prunus padus",
    description: "Lunghi racemi pendenti di fiori bianchi profumati in primavera; piccole ciliegine nere amare.",
    characteristics: ["Racemi bianchi pendenti", "Fiori profumati", "Drupe nere amare"],
  },
  r_lauroceraso: {
    type: "result", id: "r_lauroceraso",
    species: "Lauroceraso",
    scientificName: "Prunus laurocerasus 'Rotundifolia'",
    description: "Sempreverde da siepe con racemi eretti di fiori bianchi profumati; tutte le parti sono tossiche.",
    characteristics: ["Racemi bianchi eretti", "Foglia coriacea lucida", "Tossico"],
  },
  r_ligustro: {
    type: "result", id: "r_ligustro",
    species: "Ligustro del Giappone",
    scientificName: "Ligustrum japonicum",
    description: "Sempreverde da siepe con pannocchie terminali di fiori bianco-crema in piena estate.",
    characteristics: ["Pannocchie estive bianche", "Sempreverde lucido", "Bacche nere"],
  },
  r_orniello: {
    type: "result", id: "r_orniello",
    species: "Orniello",
    scientificName: "Fraxinus ornus",
    description: "Frassino da fiore: vistose pannocchie di fiori bianco-crema profumati con le prime foglie.",
    characteristics: ["Pannocchie bianche profumate", "Foglia pennata picciolata", "Produce 'manna'"],
  },

  r_prugnolo: {
    type: "result", id: "r_prugnolo",
    species: "Prugnolo selvatico",
    scientificName: "Prunus spinosa",
    description: "A fine inverno copre i rami spinosi neri di una nuvola di piccoli fiori bianchi a 5 petali.",
    characteristics: ["Fiori bianchi su rami nudi", "Rami molto spinosi", "Drupe blu-nere astringenti"],
  },
  r_amolo: {
    type: "result", id: "r_amolo",
    species: "Amolo (Mirabolano)",
    scientificName: "Prunus cerasifera",
    description: "Fiorisce prestissimo con fiori bianco-rosati a 5 petali, spesso prima delle foglie.",
    characteristics: ["Fiori bianco-rosati", "Precoci, prima/con le foglie", "Frutti gialli o rossi"],
  },
  r_azzeruolo: {
    type: "result", id: "r_azzeruolo",
    species: "Azzeruolo rosso",
    scientificName: "Crataegus azarolus",
    description: "Biancospino orientale con corimbi di fiori bianchi a 5 petali e piccoli pomi rosso-aranciati eduli.",
    characteristics: ["Corimbi bianchi", "Rami spinosi", "Frutti rosso-arancio eduli"],
  },
  r_pero_corvino: {
    type: "result", id: "r_pero_corvino",
    species: "Pero corvino (Amelanchier)",
    scientificName: "Amelanchier ovalis",
    description: "Racemi eretti di fiori bianchi a petali stretti 'a stella'; bacche nere-bluastre eduli.",
    characteristics: ["Petali bianchi stretti a stella", "Fiori a racemo eretto", "Bacche scure dolci"],
  },
  r_melo: {
    type: "result", id: "r_melo",
    species: "Melo selvatico",
    scientificName: "Malus sylvestris",
    description: "Mazzetti di fiori bianco-rosati a 5 petali, con stami gialli; piccole mele acidule.",
    characteristics: ["Fiori bianco-rosati", "5 petali rotondi", "Frutti = mele selvatiche"],
  },
  r_pero_selvatico: {
    type: "result", id: "r_pero_selvatico",
    species: "Pero selvatico",
    scientificName: "Pyrus pyraster",
    description: "Mazzetti di fiori bianchi puri a 5 petali con stami rossastri; piccole pere astringenti.",
    characteristics: ["Fiori bianchi puri", "Stami rossastri", "Piccole pere selvatiche"],
  },
  r_sorbo_domestico: {
    type: "result", id: "r_sorbo_domestico",
    species: "Sorbo domestico",
    scientificName: "Sorbus domestica",
    description: "Corimbi di fiori bianchi a 5 petali su foglia pennata; frutti a piccola pera o mela (sorbe).",
    characteristics: ["Corimbi bianchi", "Foglia pennata", "Frutti = sorbe"],
  },
  r_ciavardello: {
    type: "result", id: "r_ciavardello",
    species: "Ciavardello",
    scientificName: "Sorbus torminalis",
    description: "Corimbi bianchi a maggio su foglia lobata simile ad acero; frutti bruni piccoli (allusi alle 'pere').",
    characteristics: ["Corimbi bianchi", "Foglia lobata alterna", "Frutti bruni puntinati"],
  },

  // Specie senza nodo decisionale: Marruca (raggiungibile altrimenti)
  // viene comunque inclusa come risultato collegato da rami spinosi.
  r_marruca: {
    type: "result", id: "r_marruca",
    species: "Marruca",
    scientificName: "Paliurus spina-christi",
    description: "Arbusto spinosissimo della macchia mediterranea con piccoli fiori giallo-verdi in ombrellette.",
    characteristics: ["Fiori giallo-verdi piccoli", "Due spine per nodo", "Frutti a 'cappello' a disco"],
  },
};

export const flowerStartNodeId = "start";
