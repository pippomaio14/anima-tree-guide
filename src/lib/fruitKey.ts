// Chiave dicotomica per il riconoscimento delle piante dal frutto
// nel Parco Bosco Anima Mundi (43 specie).
// Considera tipo (secco/carnoso/cono), forma, ali, colore, dimensione.

export type FruitKeyResult = {
  type: "result";
  id: string;
  species: string;
  scientificName: string;
  description: string;
  characteristics: string[];
};

export type FruitKeyQuestion = {
  type: "question";
  id: string;
  question: string;
  hint?: string;
  optionA: { label: string; next: string };
  optionB: { label: string; next: string };
};

export type FruitKeyNode = FruitKeyQuestion | FruitKeyResult;

export const fruitStartNodeId = "start";

const r = (
  id: string,
  species: string,
  scientificName: string,
  description: string,
  characteristics: string[]
): FruitKeyResult => ({
  type: "result",
  id,
  species,
  scientificName,
  description,
  characteristics,
});

const q = (
  id: string,
  question: string,
  optionA: { label: string; next: string },
  optionB: { label: string; next: string },
  hint?: string
): FruitKeyQuestion => ({ type: "question", id, question, optionA, optionB, hint });

export const fruitKey: Record<string, FruitKeyNode> = {
  // ============ START ============
  start: q(
    "start",
    "Che tipo di frutto/struttura riproduttiva osservi?",
    { label: "Secco (samara, baccello, capsula, ghianda, achenio, cono)", next: "q_dry" },
    { label: "Carnoso (drupa, bacca, pomo, cinorrodo)", next: "q_fleshy" },
    "Tocca il frutto: se è duro/legnoso/cartaceo è secco; se è polposo e succoso è carnoso."
  ),

  // ============ FRUTTI SECCHI ============
  q_dry: q(
    "q_dry",
    "Il frutto è un cono legnoso, un galbulo o un seme nudo simile a una drupa?",
    { label: "Sì — gimnosperma (cono o seme nudo)", next: "q_gymno" },
    { label: "No — angiosperma (samara, baccello, capsula, ghianda...)", next: "q_dry2" }
  ),
  q_gymno: q(
    "q_gymno",
    "Il frutto è un galbulo legnoso sferico oppure un seme carnoso giallo maleodorante?",
    { label: "Galbulo legnoso 2–3 cm a scaglie peltate", next: "res_cipresso" },
    { label: "Seme giallo-arancio drupaceo, maleodorante a maturità", next: "res_ginkgo" }
  ),
  res_cipresso: r(
    "res_cipresso",
    "Cipresso comune",
    "Cupressus sempervirens",
    "Conifera mediterranea con galbuli legnosi sferici composti da 8–14 scaglie peltate.",
    ["Galbulo 2–3 cm", "Scaglie peltate ombelicate", "Verde poi grigio-bruno"]
  ),
  res_ginkgo: r(
    "res_ginkgo",
    "Ginkgo o Albero di Capelvenere",
    "Ginkgo biloba",
    "Specie dioica con semi nudi rivestiti da sarcotesta carnosa giallo-arancio dall'odore sgradevole.",
    ["Semi 2–3 cm", "Polpa esterna burrosa maleodorante", "Mandorla interna commestibile"]
  ),

  q_dry2: q(
    "q_dry2",
    "Il frutto è alato (samara/disamara) o piumoso/cotonoso?",
    { label: "Sì, presenta ali, peli o piume", next: "q_winged" },
    { label: "No — è baccello, capsula, ghianda, achenio o nocciola", next: "q_dry3" }
  ),

  // ---- frutti alati / piumosi ----
  q_winged: q(
    "q_winged",
    "Si tratta di samare/ali rigide o di strutture piumose/cotonose?",
    { label: "Samara o frutto chiaramente alato", next: "q_samara" },
    { label: "Frutto con peli, piume o batuffoli cotonosi", next: "q_plumose" }
  ),
  q_samara: q(
    "q_samara",
    "La samara è doppia (disamara di due ali unite) o singola?",
    { label: "Disamara (due ali a V o angolo)", next: "q_disamara" },
    { label: "Samara singola o riunita in altre forme", next: "q_samara_single" }
  ),
  q_disamara: q(
    "q_disamara",
    "L'angolo tra le due ali è quasi piatto (~180°) o ottuso/aperto?",
    { label: "Ali quasi orizzontali, ~180°", next: "res_acero_campestre" },
    { label: "Ali ad angolo ottuso (90–130°)", next: "res_acero_riccio" }
  ),
  res_acero_campestre: r(
    "res_acero_campestre",
    "Acero campestre",
    "Acer campestre",
    "Disamare con le due ali disposte quasi orizzontalmente, in linea retta.",
    ["Ali ~180°", "Frutto 2–3 cm", "Spesso pruinoso"]
  ),
  res_acero_riccio: r(
    "res_acero_riccio",
    "Acero riccio",
    "Acer platanoides",
    "Disamare grandi con ali ad angolo ottuso, achenio appiattito.",
    ["Ali ad angolo ottuso", "Frutto 4–5 cm", "Achenio piatto"]
  ),
  q_samara_single: q(
    "q_samara_single",
    "La samara è una chiavetta singola allungata o un achenio con ali laterali/circolari?",
    { label: "Samara singola allungata (a chiavetta, lingua)", next: "q_fraxinus" },
    { label: "Frutto alato in modo diverso (disco, racemo pendulo, capsula vescicolosa)", next: "q_other_winged" }
  ),
  q_fraxinus: q(
    "q_fraxinus",
    "La samara è isolata in pannocchie pendule e l'albero ha gemme nere, oppure in pannocchie con gemme grigio-brune?",
    { label: "Gemme nere vellutate, samara 3–4 cm", next: "res_frassino" },
    { label: "Gemme grigio-brune, infiorescenza vistosa bianco-cremeo", next: "res_orniello" }
  ),
  res_frassino: r(
    "res_frassino",
    "Frassino comune",
    "Fraxinus excelsior",
    "Samare lanceolate riunite in pannocchie pendule, persistenti in inverno.",
    ["Samara 3–4 cm", "Gemme nere", "Pannocchie pendule"]
  ),
  res_orniello: r(
    "res_orniello",
    "Orniello",
    "Fraxinus ornus",
    "Samare lineari riunite in pannocchie, fiori vistosi profumati.",
    ["Samara 2–3 cm", "Pannocchie cremose", "Gemme grigie"]
  ),
  q_other_winged: q(
    "q_other_winged",
    "Che forma ha il frutto alato?",
    { label: "Achenio appiattito a disco/cappello con ala circolare", next: "res_marruca" },
    { label: "Altro (racemo pendulo, capsula a lanterna, brattea trilobata)", next: "q_other_winged2" }
  ),
  res_marruca: r(
    "res_marruca",
    "Marruca",
    "Paliurus spina-christi",
    "Frutto secco a forma di cappello con ala circolare ondulata.",
    ["Disco 2 cm", "Ala membranacea", "Rami spinosi"]
  ),
  q_other_winged2: q(
    "q_other_winged2",
    "Come si presenta il frutto?",
    { label: "Lungo racemo pendulo con samare a due ali laterali", next: "res_pterocarya" },
    { label: "Brattea trilobata fogliacea che racchiude un piccolo achenio, in amenti pendenti", next: "q_carpino_or_lantern" }
  ),
  res_pterocarya: r(
    "res_pterocarya",
    "Noce del Caucaso",
    "Pterocarya fraxinifolia",
    "Spettacolari racemi penduli (20–40 cm) di samare bilobate.",
    ["Racemi 30 cm", "Samara con 2 ali laterali", "Persistenti d'autunno"]
  ),
  q_carpino_or_lantern: q(
    "q_carpino_or_lantern",
    "Le strutture sono brattee fogliacee trilobate in amenti penduli, oppure capsule vescicolose a lanterna rosata?",
    { label: "Brattee trilobate verdi-bruno, achenio alla base", next: "res_carpino" },
    { label: "Capsule a 3 valve, gonfie come lanterne rosa-bronzo", next: "res_koelreuteria" }
  ),
  res_carpino: r(
    "res_carpino",
    "Carpino bianco",
    "Carpinus betulus",
    "Infruttescenze pendule con brattee trilobate caratteristiche.",
    ["Brattea trilobata", "Achenio costoluto", "Amenti penduli"]
  ),
  res_koelreuteria: r(
    "res_koelreuteria",
    "Albero delle lanterne cinesi",
    "Koelreuteria paniculata",
    "Capsule vescicolose a forma di lanterna cinese, rosa-bronzee.",
    ["Capsula 4–5 cm", "3 valve papiracee", "Semi neri rotondi"]
  ),

  // ---- piumosi/cotonosi ----
  q_plumose: q(
    "q_plumose",
    "I frutti sono in grandi infiorescenze piumose o sono capsule che si aprono liberando peli cotonosi?",
    { label: "Pannocchie piumose vaporose rosa-grigie (fumo)", next: "res_scotano" },
    { label: "Piccole capsule che liberano semi con peli bianchi cotonosi", next: "res_salice" }
  ),
  res_scotano: r(
    "res_scotano",
    "Scotano",
    "Cotinus coggygria",
    "Infruttescenze con peduncoli sterili piumosi che danno aspetto di fumo rosa.",
    ["Pannocchia piumosa", "Achenio minuto", "Foglie autunno scarlatto"]
  ),
  res_salice: r(
    "res_salice",
    "Salice bianco",
    "Salix alba",
    "Capsule verdi che si aprono liberando semi avvolti da peli bianchi cotonosi.",
    ["Capsula 4–5 mm", "Semi piumosi", "Foglie argentee"]
  ),

  // ---- baccelli/capsule/ghiande/noci ----
  q_dry3: q(
    "q_dry3",
    "Il frutto è un baccello (legume) tipico delle leguminose?",
    { label: "Sì, baccello allungato e piatto", next: "q_legume" },
    { label: "No — capsula, ghianda, achenio, nocciola, strobilo legnoso o urna", next: "q_dry4" }
  ),
  q_legume: q(
    "q_legume",
    "Il baccello pende a grappoli giallo-bruni di legumi sottili e cilindrici, oppure è appiattito tipico di Cercis?",
    { label: "Grappoli penduli di legumi cilindrici, semi velenosi", next: "res_maggiociondolo" },
    { label: "Legume piatto rosso-bruno tipo Cercis", next: "q_cercis" }
  ),
  res_maggiociondolo: r(
    "res_maggiociondolo",
    "Maggiociondolo",
    "Laburnum anagyroides",
    "Lunghi grappoli penduli di baccelli con semi tossici (citisina).",
    ["Baccello 4–6 cm", "Semi neri tossici", "Racemi gialli in primavera"]
  ),
  q_cercis: q(
    "q_cercis",
    "I baccelli pendono in gruppi dai rami o crescono direttamente sul tronco (caulifloria)?",
    { label: "Baccelli su tronco e rami principali (cauliflori)", next: "res_cercis_sili" },
    { label: "Baccelli portati solo sui rametti, foglie più appuntite", next: "res_cercis_cana" }
  ),
  res_cercis_sili: r(
    "res_cercis_sili",
    "Albero di Giuda",
    "Cercis siliquastrum",
    "Baccelli appiattiti rosso-bruni che restano a lungo sull'albero.",
    ["Baccello 8–12 cm", "Caulifloria", "Foglia cuoriforme"]
  ),
  res_cercis_cana: r(
    "res_cercis_cana",
    "Albero di Giuda canadese",
    "Cercis canadensis",
    "Simile al congenere ma con baccelli portati sui rametti e foglie più acuminate.",
    ["Baccello 6–9 cm", "Foglie acuminate", "Rametti non cauliflori"]
  ),

  q_dry4: q(
    "q_dry4",
    "Il frutto è una capsula (legnosa o carnosa) o un'urna/strobilo?",
    { label: "Capsula o urna", next: "q_capsule" },
    { label: "Ghianda, nocciola, achenio o strobilo legnoso", next: "q_nut" }
  ),
  q_capsule: q(
    "q_capsule",
    "Si tratta di una capsula con grossi semi castani lisci o di un'urna legnosa con piccoli acheni?",
    { label: "Capsula liscia con seme tipo ippocastano (in arbusto)", next: "res_ippocastano" },
    { label: "Urna/coppa legnosa contenente acheni (ex fiore di calicanto)", next: "res_calicanto" }
  ),
  res_ippocastano: r(
    "res_ippocastano",
    "Ippocastano nano",
    "Aesculus parviflora",
    "Arbusto pollonifero con capsule lisce (raramente fertili) contenenti grossi semi castani.",
    ["Capsula liscia", "Seme grande lucido", "Infiorescenze a candela"]
  ),
  res_calicanto: r(
    "res_calicanto",
    "Calicanto d'inverno",
    "Chimonanthus praecox",
    "Pseudofrutto a urna legnosa allungata contenente più acheni.",
    ["Urna 3–4 cm", "Persistente sul ramo", "Fiori gialli profumati a gennaio"]
  ),

  q_nut: q(
    "q_nut",
    "Cosa osservi sul ramo?",
    { label: "Ghianda in cupola squamosa (quercia)", next: "res_farnia" },
    { label: "Nocciole, strobili o piccoli acheni", next: "q_nut2" }
  ),
  res_farnia: r(
    "res_farnia",
    "Farnia o Quercia",
    "Quercus robur",
    "Ghiande oblunghe peduncolate (peduncolo 3–8 cm) in cupola squamosa.",
    ["Ghianda 2–3 cm", "Peduncolo lungo", "Foglie auricolate"]
  ),
  q_nut2: q(
    "q_nut2",
    "Si tratta di nocciole in cupola fogliacea o di strobili legnosi simili a pigne?",
    { label: "Nocciole avvolte da brattea fogliacea sfrangiata", next: "res_nocciolo" },
    { label: "Piccoli strobili legnosi neri tipo pigna, persistenti", next: "res_ontano" }
  ),
  res_nocciolo: r(
    "res_nocciolo",
    "Nocciolo",
    "Corylus avellana",
    "Frutto (nocciola) racchiuso in una brattea fogliacea sfrangiata.",
    ["Nocciola 1–2 cm", "Involucro sfrangiato", "Maturazione estate-autunno"]
  ),
  res_ontano: r(
    "res_ontano",
    "Ontano nero o comune",
    "Alnus glutinosa",
    "Piccoli strobili legnosi (pseudoconi) ovoidali persistenti tutto l'inverno.",
    ["Strobilo 1,5–2 cm", "Nero a maturità", "Spesso in ambienti umidi"]
  ),

  // ============ FRUTTI CARNOSI ============
  q_fleshy: q(
    "q_fleshy",
    "Che tipo di frutto carnoso osservi?",
    { label: "Drupa (un solo nocciolo legnoso) o bacca", next: "q_drupe_berry" },
    { label: "Pomo (Rosacee: melo, pero, sorbo) o cinorrodo/follicolo aggregato", next: "q_pome" }
  ),

  // ---- pomi e affini ----
  q_pome: q(
    "q_pome",
    "Il frutto è un pomo carnoso (tipo mela/pera/sorbe) oppure un cinorrodo rosso liscio o un aggregato di follicoli?",
    { label: "Pomo classico (polpa carnosa, cuore con semi)", next: "q_pomo" },
    { label: "Cinorrodo rosso liscio oppure cono aggregato di follicoli rossastri", next: "q_rose_magnolia" }
  ),
  q_rose_magnolia: q(
    "q_rose_magnolia",
    "Si tratta di un cinorrodo (falso frutto rosso ovoide) o di un cono di follicoli?",
    { label: "Cinorrodo rosso liscio ovoide su arbusto spinoso", next: "res_rosa" },
    { label: "Cono aggregato di follicoli rosa-rossi che liberano semi arancio", next: "res_magnolia" }
  ),
  res_rosa: r(
    "res_rosa",
    "Rosa canina o Rosa selvatica",
    "Rosa canina",
    "Cinorrodo (falso frutto) rosso ovoide ricco di acheni pelosi all'interno.",
    ["Cinorrodo 1,5–2 cm", "Arbusto spinoso", "Ricco di vitamina C"]
  ),
  res_magnolia: r(
    "res_magnolia",
    "Magnolia denudata",
    "Magnolia denudata",
    "Frutto aggregato a cono di follicoli che a maturità si aprono liberando semi rosso-arancio.",
    ["Cono 6–10 cm", "Semi pendenti su filo", "Fiori bianchi prima delle foglie"]
  ),

  q_pomo: q(
    "q_pomo",
    "Il pomo è grande (>2 cm) tipo mela/pera o piccolo (<2 cm) tipo sorbe/azzeruole?",
    { label: "Grande (>2 cm), mela o pera", next: "q_melo_pero" },
    { label: "Piccolo (<2,5 cm), tipo sorba, azzeruola, nespola, amelanchier", next: "q_sorbe" }
  ),
  q_melo_pero: q(
    "q_melo_pero",
    "Il frutto è globoso (mela) o piriforme/allungato (pera)?",
    { label: "Globoso, verde-giallo, talvolta arrossato (mela)", next: "res_melo" },
    { label: "Piriforme, verde-bruno, polpa granulosa", next: "res_pero" }
  ),
  res_melo: r(
    "res_melo",
    "Melo selvatico",
    "Malus sylvestris",
    "Piccola mela acidula 2–4 cm, globosa, giallo-verde spesso arrossata.",
    ["Pomo 2–4 cm", "Polpa acidula", "Rami talvolta spinescenti"]
  ),
  res_pero: r(
    "res_pero",
    "Pero selvatico",
    "Pyrus pyraster",
    "Piccola pera 2–4 cm piriforme con polpa granulosa, peduncolo lungo.",
    ["Pomo piriforme", "Polpa granulosa", "Rami spinescenti"]
  ),

  q_sorbe: q(
    "q_sorbe",
    "Che colore/forma hanno i piccoli pomi?",
    { label: "Pomo rosso o giallo-rosso liscio (sorba/azzeruola)", next: "q_red_pome" },
    { label: "Pomo bruno con calice persistente aperto, oppure bluastro pruinoso", next: "q_brown_blue_pome" }
  ),
  q_red_pome: q(
    "q_red_pome",
    "Il pomo è grande (1,5–2 cm) rosso liscio tipo piccola mela oppure piriforme bruno-puntato?",
    { label: "Rosso vivo, globoso, tipo piccola mela 1,5–2 cm", next: "res_azzeruolo" },
    { label: "Bruno-rossastro, piriforme, puntinato di lenticelle", next: "res_ciavardello" }
  ),
  res_azzeruolo: r(
    "res_azzeruolo",
    "Azzeruolo rosso",
    "Crataegus azarolus",
    "Piccoli pomi rossi 1,5–2 cm dal sapore dolce-acidulo.",
    ["Pomo 2 cm", "5 stili", "Foglie lobate"]
  ),
  res_ciavardello: r(
    "res_ciavardello",
    "Ciavardello",
    "Sorbus torminalis",
    "Pomi piriformi bruno-rossastri puntinati di lenticelle chiare.",
    ["Pomo 1,5 cm", "Lenticelle visibili", "Maturazione tardiva"]
  ),
  q_brown_blue_pome: q(
    "q_brown_blue_pome",
    "Il pomo è grande (2–3 cm) bruno con grandi sepali persistenti, sorba marrone, o piccolo blu-nerastro pruinoso?",
    { label: "Grande nespola bruna con calice persistente aperto a corona", next: "res_nespolo" },
    { label: "Sorba grande (2–3 cm) gialla/bruna piriforme su grande albero", next: "res_sorbo" },
    },
  ),
};
