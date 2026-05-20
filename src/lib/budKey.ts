// Chiave dicotomica per il riconoscimento delle piante dalle gemme
// nel Parco Bosco Anima Mundi (43 specie).
// Considera disposizione, scaglie, forma, dimensione, peluria, colore.

export type BudKeyResult = {
  type: "result";
  id: string;
  species: string;
  scientificName: string;
  description: string;
  characteristics: string[];
};

export type BudKeyQuestion = {
  type: "question";
  id: string;
  question: string;
  hint?: string;
  optionA: { label: string; next: string };
  optionB: { label: string; next: string };
};

export type BudKeyNode = BudKeyQuestion | BudKeyResult;

export const budStartNodeId = "start";

const r = (
  id: string,
  species: string,
  scientificName: string,
  description: string,
  characteristics: string[]
): BudKeyResult => ({
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
  a: { label: string; next: string },
  b: { label: string; next: string },
  hint?: string
): BudKeyQuestion => ({ type: "question", id, question, hint, optionA: a, optionB: b });

export const budKey: Record<string, BudKeyNode> = {
  // ===== INIZIO =====
  start: q(
    "start",
    "La pianta ha vere gemme con scaglie protettive o presenta foglie/squame sempreverdi senza gemme evidenti?",
    { label: "Sempreverde: niente gemme evidenti (squame, aghi, foglie coriacee)", next: "q_evergreen" },
    { label: "Gemme distinte, ben visibili sui rametti", next: "q_arrangement" },
    "Osserva un rametto in inverno: la presenza di scaglie distingue le caducifoglie."
  ),

  // ===== SEMPREVERDI / SQUAMIFORMI =====
  q_evergreen: q(
    "q_evergreen",
    "Le foglie/squame sono aghiformi o coriacee e larghe?",
    { label: "Squame appiattite a rametto (conifera senza aghi distinti)", next: "res_cipresso" },
    { label: "Foglie larghe, coriacee, sempreverdi", next: "q_evergreen_broad" }
  ),
  q_evergreen_broad: q(
    "q_evergreen_broad",
    "Le foglie sempreverdi sono aromatiche, coriacee e lanceolate, oppure ovali e lucide?",
    { label: "Lanceolate, aromatiche se sfregate (lauro)", next: "res_alloro" },
    { label: "Ovali, lucide, non aromatiche", next: "q_evergreen_oval" }
  ),
  q_evergreen_oval: q(
    "q_evergreen_oval",
    "Le foglie sono opposte, piccole e cuoiose (arbusto) o alterne e grandi?",
    { label: "Opposte, piccole, arbusto compatto (viburno)", next: "res_viburno_tino" },
    { label: "Alterne, grandi, lucide", next: "q_evergreen_alt" }
  ),
  q_evergreen_alt: q(
    "q_evergreen_alt",
    "Le foglie emanano un forte odore di canfora se stropicciate?",
    { label: "Sì, forte aroma canforato", next: "res_canfora" },
    { label: "No, foglie inodore o leggermente aromatiche", next: "q_evergreen_alt2" }
  ),
  q_evergreen_alt2: q(
    "q_evergreen_alt2",
    "Le foglie sono molto grandi, ellittiche e lucide (Magnolia/Lauroceraso) o medie e oblunghe (Ligustro)?",
    { label: "Grandi, fortemente lucide, margine intero o leggermente seghettato", next: "q_magnolia_laurocer" },
    { label: "Medie, opposte, brillanti (ligustro)", next: "res_ligustro" }
  ),
  q_magnolia_laurocer: q(
    "q_magnolia_laurocer",
    "Le foglie hanno margine finemente seghettato e schiacciate emanano odore di mandorla amara?",
    { label: "Sì, odore di mandorla (lauroceraso)", next: "res_lauroceraso" },
    { label: "No, foglie spesse e inodore (magnolia)", next: "res_magnolia" }
  ),

  // ===== GEMME VERE: disposizione =====
  q_arrangement: q(
    "q_arrangement",
    "Come sono disposte le gemme sul rametto?",
    { label: "Opposte (coppie affrontate) o verticillate", next: "q_opposite" },
    { label: "Alterne (una per nodo, sparse o distiche)", next: "q_alternate" },
    "Guarda la disposizione delle gemme laterali lungo il rametto."
  ),

  // ===== GEMME OPPOSTE =====
  q_opposite: q(
    "q_opposite",
    "Le gemme sono grandi, appiccicose/resinose o nere/vellutate?",
    { label: "Grandi, vischiose, brune lucide (ippocastano)", next: "res_ippocastano" },
    { label: "Non appiccicose: nere, brune o piccole", next: "q_opp_black" }
  ),
  q_opp_black: q(
    "q_opp_black",
    "Le gemme apicali sono nero-vellutate, coniche?",
    { label: "Sì, nere e vellutate (frassino)", next: "q_fraxinus" },
    { label: "No, brune o grigie", next: "q_opp_brown" }
  ),
  q_fraxinus: q(
    "q_fraxinus",
    "Le gemme sono nere intense, conico-piramidali, oppure grigio-brune più piccole?",
    { label: "Nere intense, grandi (frassino comune)", next: "res_frassino" },
    { label: "Grigio-brune, più piccole, corteccia liscia chiara (orniello)", next: "res_orniello" }
  ),
  q_opp_brown: q(
    "q_opp_brown",
    "Il rametto è di un arbusto con gemme opposte ravvicinate (corniolo, viburno) o di un acero?",
    { label: "Albero/arbusto con gemme rosse o brune e rametti grigi (acero)", next: "q_acer" },
    { label: "Arbusto con gemme opposte allungate, infiorescenze a grappolo", next: "q_opp_shrub" }
  ),
  q_acer: q(
    "q_acer",
    "Le gemme sono piccole, rosso-brune con squame chiare (acero campestre) o grandi, verdastre o porpora (acero riccio)?",
    { label: "Piccole, brune, rametto a volte con creste sugherose", next: "res_acero_campestre" },
    { label: "Grandi, ovoidi, con squame verdi-purpuree", next: "res_acero_riccio" }
  ),
  q_opp_shrub: q(
    "q_opp_shrub",
    "Le gemme sono allungate e fusiformi (corniolo) o ovoidi con squame ravvicinate (viburno/sambuco)?",
    { label: "Fusiformi, brune, fiori gialli precoci", next: "res_corniolo" },
    { label: "Ovoidi/tondeggianti, varie", next: "q_viburnum_sambucus" }
  ),
  q_viburnum_sambucus: q(
    "q_viburnum_sambucus",
    "Le gemme sono rossastre, nude (senza scaglie evidenti) o coperte da squame?",
    { label: "Nude o quasi, rossastre, midollo bianco abbondante (sambuco)", next: "res_sambuco" },
    { label: "Con squame, gemma terminale evidente (pallone di maggio)", next: "res_pallon_maggio" }
  ),

  // ===== GEMME ALTERNE =====
  q_alternate: q(
    "q_alternate",
    "Il rametto presenta spine vere o aculei?",
    { label: "Sì, presenza di spine/aculei", next: "q_thorny" },
    { label: "No, rametto inerme", next: "q_no_thorn" }
  ),

  // ----- SPINOSE -----
  q_thorny: q(
    "q_thorny",
    "Le spine sono accoppiate alla base delle foglie/gemme (stipolari) o sparse/terminali?",
    { label: "Spine stipolari accoppiate, una dritta e una uncinata (marruca)", next: "res_marruca" },
    { label: "Spine sparse, terminali o lungo il rametto", next: "q_thorny2" }
  ),
  q_thorny2: q(
    "q_thorny2",
    "La pianta è un piccolo arbusto con spine tripartite e gemme rosse (crespino) o ha aculei robusti?",
    { label: "Spine a 3 punte, gemme piccole rosse, fiori gialli (crespino)", next: "res_crespino" },
    { label: "Aculei o spine semplici/robuste", next: "q_thorny3" }
  ),
  q_thorny3: q(
    "q_thorny3",
    "Il rametto è argenteo o ramato con spine acute (olivello/olivagno) o verde/bruno con gemme di Prunus/Rosa?",
    { label: "Rametto argentato o squamoso, spine robuste", next: "q_eleagnaceae" },
    { label: "Rametto bruno o verde, gemme di Rosacea", next: "q_rosaceae_thorny" }
  ),
  q_eleagnaceae: q(
    "q_eleagnaceae",
    "Le squame del rametto sono argentee (olivagno) o rugginose/ramate con spine molto rigide (olivello spinoso)?",
    { label: "Argentee, spine rade, foglie strette lanceolate", next: "res_olivagno" },
    { label: "Rugginose, fittissime spine, rametti molto rigidi", next: "res_olivello" }
  ),
  q_rosaceae_thorny: q(
    "q_rosaceae_thorny",
    "Il rametto ha aculei ricurvi e gemme rosse (rosa) o spine vere terminali su rametti corti?",
    { label: "Aculei ricurvi, fusto verde, gemme piccole rosse (rosa canina)", next: "res_rosa_canina" },
    { label: "Spine terminali rigide su rametti corti", next: "q_thorny_prunus" }
  ),
  q_thorny_prunus: q(
    "q_thorny_prunus",
    "I rametti sono scuri, quasi neri, con gemme minute (prugnolo) o grigi con gemme più grandi (azzeruolo/melo/pero)?",
    { label: "Rametti nerastri, gemme piccole, spine acute (prugnolo)", next: "res_prugnolo" },
    { label: "Rametti grigi, gemme più grandi", next: "q_thorny_pomoid" }
  ),
  q_thorny_pomoid: q(
    "q_thorny_pomoid",
    "Le gemme sono pelose grigiastre (azzeruolo), glabre rosse (melo) o coniche brune (pero)?",
    { label: "Pelose, grigie, su rametti spinosi (azzeruolo rosso)", next: "res_azzeruolo" },
    { label: "Glabre o brune, gemme coniche", next: "q_melo_pero" }
  ),
  q_melo_pero: q(
    "q_melo_pero",
    "Le gemme sono ovoidi e tomentose grigiastre (melo) o coniche, acute, glabre brune (pero)?",
    { label: "Ovoidi, tomentose, grigiastre (melo selvatico)", next: "res_melo" },
    { label: "Coniche, acute, glabre brune (pero selvatico)", next: "res_pero" }
  ),

  // ----- NON SPINOSE -----
  q_no_thorn: q(
    "q_no_thorn",
    "Il rametto porta amenti (infiorescenze pendule) già formati in inverno?",
    { label: "Sì, amenti evidenti in inverno", next: "q_catkins" },
    { label: "No, solo gemme", next: "q_buds_only" }
  ),

  // ----- AMENTI -----
  q_catkins: q(
    "q_catkins",
    "Gli amenti sono raggruppati a 'pigne' legnose (ontano) o sono allungati e penduli?",
    { label: "Piccole pigne legnose persistenti (ontano)", next: "res_ontano" },
    { label: "Amenti allungati, penduli", next: "q_catkins2" }
  ),
  q_catkins2: q(
    "q_catkins2",
    "Le gemme/amenti appartengono a nocciolo, carpino, farnia, salice o noce del Caucaso?",
    { label: "Gemme rosse, amenti gialli precoci (nocciolo)", next: "res_nocciolo" },
    { label: "Altre conformazioni", next: "q_catkins3" }
  ),
  q_catkins3: q(
    "q_catkins3",
    "Le gemme sono piccole, appressate, fusiformi su rametti zigzaganti (carpino) o grandi a grappolo all'apice (farnia)?",
    { label: "Piccole, appressate, fusiformi, rametti sottili (carpino bianco)", next: "res_carpino" },
    { label: "Grandi, a grappolo all'apice, ovoidi (farnia)", next: "q_quercus_or_other" }
  ),
  q_quercus_or_other: q(
    "q_quercus_or_other",
    "Sono gemme a grappolo apicale brune (farnia) o gemme nude, vellutate, su rametti robusti (noce del Caucaso) o salice (gemma unica appressata)?",
    { label: "Gemme ovoidi raggruppate all'apice del rametto (farnia)", next: "res_farnia" },
    { label: "Altre: noce del Caucaso o salice", next: "q_pterocarya_salix" }
  ),
  q_pterocarya_salix: q(
    "q_pterocarya_salix",
    "Le gemme sono nude (senza scaglie), brune-vellutate (Pterocarya) o coperte da un'unica scaglia a cappuccio (Salix)?",
    { label: "Nude, vellutate, midollo a setti (noce del Caucaso)", next: "res_noce_caucaso" },
    { label: "Una sola squama liscia che avvolge la gemma (salice bianco)", next: "res_salice" }
  ),

  // ----- SOLO GEMME (no amenti) -----
  q_buds_only: q(
    "q_buds_only",
    "Le gemme sono nude (prive di scaglie) o coperte da scaglie?",
    { label: "Nude: tomentose, pelose, visibilmente fogliose", next: "q_naked" },
    { label: "Coperte da scaglie embricate", next: "q_scaled" }
  ),
  q_naked: q(
    "q_naked",
    "Le gemme nude appartengono a Magnolia denudata (grandi, vellutate argentee), Calicanto (piccole tomentose con fiori gialli profumati invernali) o scotano (piccole, rossastre)?",
    { label: "Grandi gemme fiorali argenteo-vellutate (Magnolia denudata)", next: "res_magnolia" },
    { label: "Piccole, altre", next: "q_naked2" }
  ),
  q_naked2: q(
    "q_naked2",
    "Le gemme sono associate a fiori gialli profumati che sbocciano in pieno inverno?",
    { label: "Sì, fiori gialli su rami nudi (calicanto d'inverno)", next: "res_calicanto" },
    { label: "No, gemme rossastre, foglie ovali (scotano)", next: "res_scotano" }
  ),

  // ----- GEMME COPERTE DA SCAGLIE -----
  q_scaled: q(
    "q_scaled",
    "Il rametto presenta corti rami a 'sperone' con gemme apicali (Ginkgo, Cercis) o gemme regolarmente distribuite?",
    { label: "Sì, brachiblasti (rametti corti con gemma all'apice)", next: "q_brachy" },
    { label: "No, gemme distribuite lungo i rametti", next: "q_normal_scaled" }
  ),
  q_brachy: q(
    "q_brachy",
    "I brachiblasti portano una sola squama a ventaglio (Ginkgo) o gemme rossastre da cui escono fiori cauliflori (Cercis)?",
    { label: "Brachiblasti con gemme grigie globose (Ginkgo biloba)", next: "res_ginkgo" },
    { label: "Gemme rossastre lungo rami e tronco, fiori rosa cauliflori", next: "q_cercis" }
  ),
  q_cercis: q(
    "q_cercis",
    "I rametti sono grigi e sottili (Albero di Giuda europeo) o porpora-rossastri e zigzaganti (canadese)?",
    { label: "Grigi sottili, fiori sul tronco e rami principali", next: "res_giuda" },
    { label: "Rossastri zigzaganti, fiori più piccoli (canadese)", next: "res_giuda_canadese" }
  ),

  // ----- GEMME NORMALI A SCAGLIE -----
  q_normal_scaled: q(
    "q_normal_scaled",
    "Il rametto/gemma ha odore di mandorla amara se inciso (Prunus) o no?",
    { label: "Sì, odore di mandorla amara (gruppo Prunus)", next: "q_prunus" },
    { label: "No, nessun odore caratteristico", next: "q_no_almond" }
  ),
  q_prunus: q(
    "q_prunus",
    "Le gemme sono raggruppate sui brachiblasti (ciliegio canino, pado, amolo) o gemme normali distinte?",
    { label: "Gemme a grappolo sui rametti corti", next: "q_prunus_brachy" },
    { label: "Gemme isolate distribuite", next: "q_prunus_iso" }
  ),
  q_prunus_brachy: q(
    "q_prunus_brachy",
    "Le foglie/rametti emanano forte odore di cumarina (ciliegio canino) o sono inodore con fioritura a grappolo (pado)?",
    { label: "Forte odore di cumarina, arbusto (Prunus mahaleb)", next: "res_ciliegio_canino" },
    { label: "Inodore, fioritura a racemo pendulo (pado)", next: "res_pado" }
  ),
  q_prunus_iso: q(
    "q_prunus_iso",
    "I rametti sono rossi lucenti con gemme piccole (mirabolano/amolo) o altro?",
    { label: "Rametti rosso-bruno lucidi, gemme piccole appressate", next: "res_amolo" },
    { label: "Altro Prunus a foglie sempreverdi (già trattato)", next: "res_lauroceraso" }
  ),

  // ----- NO MANDORLA -----
  q_no_almond: q(
    "q_no_almond",
    "Le gemme sono distiche (su due file opposte sul rametto) o disposte a spirale?",
    { label: "Distiche (es. nespolo, pero corvino, ciavardello)", next: "q_distichous" },
    { label: "A spirale o sparse", next: "q_spiral" }
  ),
  q_distichous: q(
    "q_distichous",
    "Le gemme sono molto tomentose grigiastre (nespolo) o glabre brune?",
    { label: "Grandi, tomentose, grigie, su rametti pelosi (nespolo europeo)", next: "res_nespolo" },
    { label: "Glabre, brune o rossastre", next: "q_distichous2" }
  ),
  q_distichous2: q(
    "q_distichous2",
    "Le gemme sono piccole, rosse, su rametti grigi sottili (pero corvino) o brune lucide su rametti più robusti (ciavardello)?",
    { label: "Piccole rosse, arbusto a rametti sottili (Amelanchier)", next: "res_pero_corvino" },
    { label: "Brune lucide, ovoidi, su albero (ciavardello)", next: "res_ciavardello" }
  ),

  // ----- A SPIRALE -----
  q_spiral: q(
    "q_spiral",
    "Le gemme sono composte (foglie composte alla ripresa): pinnate o trifogliate?",
    { label: "Sì, ramo che farà foglie composte (maggiociondolo, sorbo, lanterne cinesi)", next: "q_composed" },
    { label: "No, foglie semplici", next: "q_simple_spiral" }
  ),
  q_composed: q(
    "q_composed",
    "I rametti sono verde scuro/sericei con gemme appiattite argentate (maggiociondolo) o altro?",
    { label: "Sì, gemme argenteo-seriche, fiori gialli pendenti (maggiociondolo)", next: "res_maggiociondolo" },
    { label: "Gemme brune, rametti robusti", next: "q_composed2" }
  ),
  q_composed2: q(
    "q_composed2",
    "Le gemme sono ovoidi, brune lucide (sorbo domestico) o piccole con frutti a vesciche persistenti (Koelreuteria)?",
    { label: "Ovoidi, brune, viscose, foglie pinnate (sorbo domestico)", next: "res_sorbo" },
    { label: "Piccole, rametti con capsule vesciche brune persistenti", next: "res_koelreuteria" }
  ),

  // ----- FOGLIE SEMPLICI A SPIRALE -----
  q_simple_spiral: q(
    "q_simple_spiral",
    "Il rametto è un arbusto suffruticoso a fioritura precoce o un albero/arbusto con gemme tipiche?",
    { label: "Arbusto basso pollonifero con polloni multipli (ippocastano nano)", next: "res_ippocastano_nano" },
    { label: "Albero/arbusto con gemme alterne tipiche", next: "q_simple2" }
  ),
  q_simple2: q(
    "q_simple2",
    "Le gemme appartengono ad altre specie non ancora distinte? Confronto finale.",
    { label: "Probabilmente già identificabile dalla descrizione", next: "res_generic" },
    { label: "Ricomincia il percorso", next: "start" }
  ),

  // ===== RISULTATI =====
  res_cipresso: r("res_cipresso", "Cipresso comune", "Cupressus sempervirens", "Conifera sempreverde con rametti coperti da squame appiattite; gemme non distinguibili.", ["Squame embricate", "Coni globosi legnosi", "Portamento colonnare"]),
  res_alloro: r("res_alloro", "Alloro", "Laurus nobilis", "Sempreverde aromatico con foglie lanceolate coriacee; gemme piccole nascoste tra le foglie.", ["Foglie aromatiche", "Margine ondulato", "Bacche nere"]),
  res_viburno_tino: r("res_viburno_tino", "Viburno tino", "Viburnum tinus", "Arbusto sempreverde con foglie opposte coriacee; gemme piccole verdastre tra le foglie.", ["Foglie opposte sempreverdi", "Fiori bianco-rosa invernali", "Frutti blu metallici"]),
  res_canfora: r("res_canfora", "Albero della canfora", "Cinnamomum camphora", "Sempreverde aromatico; foglie con odore di canfora; gemme piccole avvolte da foglioline.", ["Aroma canfora", "Foglie lucide trinervate", "Tronco fessurato"]),
  res_ligustro: r("res_ligustro", "Ligustro del Giappone", "Ligustrum japonicum", "Arbusto sempreverde con foglie opposte lucide e gemme minute appressate.", ["Foglie opposte", "Sempreverde", "Pannocchie bianche profumate"]),
  res_lauroceraso: r("res_lauroceraso", "Lauroceraso", "Prunus laurocerasus rotundifolia", "Sempreverde con foglie grandi cuoiose; odore di mandorla amara se stropicciate.", ["Foglie grandi lucide", "Odore mandorla amara", "Racemi bianchi"]),
  res_magnolia: r("res_magnolia", "Magnolia denudata", "Magnolia denudata", "Gemme fiorali grandi, vellutato-argentee, terminali su rametti glabri.", ["Gemme grandi argentee", "Fiori bianchi su rami nudi", "Foglie obovate"]),

  res_ippocastano: r("res_ippocastano", "Ippocastano nano", "Aesculus parviflora", "Arbusto pollonifero; gemme opposte appiccicose, brune, coniche.", ["Gemme opposte vischiose", "Foglie palmate", "Pannocchie bianche"]),
  res_frassino: r("res_frassino", "Frassino comune", "Fraxinus excelsior", "Gemme apicali nero-vellutate, opposte, conico-piramidali su rametti robusti.", ["Gemme nere", "Opposte", "Foglie pinnate"]),
  res_orniello: r("res_orniello", "Orniello", "Fraxinus ornus", "Gemme opposte, grigio-brune, più piccole del frassino; corteccia liscia chiara.", ["Gemme grigio-brune", "Corteccia liscia", "Pannocchie bianche profumate"]),
  res_acero_campestre: r("res_acero_campestre", "Acero campestre", "Acer campestre", "Gemme opposte piccole, brune con squame chiare; rametti a volte con creste sugherose.", ["Gemme piccole opposte", "Creste sugherose", "Foglie 5-lobate piccole"]),
  res_acero_riccio: r("res_acero_riccio", "Acero riccio", "Acer platanoides", "Gemme opposte grandi ovoidi con squame verdi e porpora; lattice bianco al taglio.", ["Gemme grandi opposte", "Lattice bianco", "Foglie palmate acute"]),
  res_corniolo: r("res_corniolo", "Corniolo", "Cornus mas", "Gemme opposte fusiformi brune; fioritura gialla precocissima a fine inverno.", ["Gemme fusiformi", "Fiori gialli precoci", "Drupe rosse commestibili"]),
  res_sambuco: r("res_sambuco", "Sambuco", "Sambucus nigra", "Gemme opposte rossastre, semi-nude; midollo bianco abbondante nei rametti.", ["Gemme nude rossastre", "Midollo bianco", "Corimbi bianchi"]),
  res_pallon_maggio: r("res_pallon_maggio", "Pallon di Maggio", "Viburnum opulus", "Gemme opposte ovoidi con due squame rossastre; rametti grigi.", ["Gemme opposte squamose", "Infiorescenze sferiche bianche", "Drupe rosse"]),

  res_marruca: r("res_marruca", "Marruca", "Paliurus spina-christi", "Arbusto spinoso con coppia di spine stipolari (una dritta, una uncinata).", ["Spine accoppiate", "Foglie ovate trinervate", "Frutti a disco"]),
  res_crespino: r("res_crespino", "Crespino comune", "Berberis vulgaris", "Arbusto con spine tripartite; gemme piccole rosse; legno giallo.", ["Spine a 3 punte", "Legno giallo", "Bacche rosse"]),
  res_olivagno: r("res_olivagno", "Olivagno", "Elaeagnus angustifolia", "Rametti argentati squamosi con spine rade; foglie strette lanceolate.", ["Rametti argentati", "Foglie argentate", "Frutti gialli"]),
  res_olivello: r("res_olivello", "Olivello spinoso", "Hippophae rhamnoides", "Arbusto con rametti rugginosi e spine molto rigide; gemme piccole.", ["Spine rigide", "Foglie argentee", "Bacche arancioni"]),
  res_rosa_canina: r("res_rosa_canina", "Rosa canina", "Rosa canina", "Aculei ricurvi su fusti verdi; gemme piccole rosse alterne.", ["Aculei ricurvi", "Gemme rosse", "Cinorrodi rossi"]),
  res_prugnolo: r("res_prugnolo", "Prugnolo selvatico", "Prunus spinosa", "Rametti nerastri con spine acute; gemme minutissime brune.", ["Rametti scuri spinosi", "Gemme minute", "Fiori bianchi precoci"]),
  res_azzeruolo: r("res_azzeruolo", "Azzeruolo rosso", "Crataegus azarolus", "Gemme alterne pelose grigiastre su rametti spinosi.", ["Spine corte", "Gemme tomentose", "Frutti rossi pomi"]),
  res_melo: r("res_melo", "Melo selvatico", "Malus sylvestris", "Gemme ovoidi tomentose grigiastre; rametti talvolta spinescenti.", ["Gemme tomentose", "Rametti spinosi", "Mele piccole acide"]),
  res_pero: r("res_pero", "Pero selvatico", "Pyrus pyraster", "Gemme coniche acute, glabre, brune; rametti rigidi spinescenti.", ["Gemme coniche acute", "Rametti spinosi", "Frutti piccoli astringenti"]),

  res_ontano: r("res_ontano", "Ontano nero", "Alnus glutinosa", "Gemme alterne picciolate, viola-rossastre; pigne legnose persistenti.", ["Gemme picciolate", "Pigne legnose", "Amenti precoci"]),
  res_nocciolo: r("res_nocciolo", "Nocciolo", "Corylus avellana", "Gemme alterne ovoidi rossastre; amenti maschili gialli precocissimi.", ["Gemme rosse", "Amenti gialli invernali", "Frutti nocciole"]),
  res_carpino: r("res_carpino", "Carpino bianco", "Carpinus betulus", "Gemme piccole fusiformi appressate su rametti zigzaganti sottili.", ["Gemme appressate", "Rametti zigzag", "Tronco fluitato"]),
  res_farnia: r("res_farnia", "Farnia", "Quercus robur", "Gemme alterne ovoidi raggruppate a grappolo all'apice dei rametti.", ["Gemme raggruppate apicali", "Foglie lobate", "Ghiande peduncolate"]),
  res_noce_caucaso: r("res_noce_caucaso", "Noce del Caucaso", "Pterocarya fraxinifolia", "Gemme nude vellutate brune; midollo a setti trasversali.", ["Gemme nude", "Midollo a setti", "Foglie pinnate grandi"]),
  res_salice: r("res_salice", "Salice bianco", "Salix alba", "Gemme alterne appressate coperte da una sola squama liscia a cappuccio.", ["Squama unica", "Gemme appressate", "Foglie strette argentee"]),

  res_calicanto: r("res_calicanto", "Calicanto d'inverno", "Chimonanthus praecox", "Arbusto a foglie caduche; gemme piccole tomentose; fiori gialli profumati a gennaio.", ["Fioritura invernale", "Fiori gialli profumati", "Gemme piccole"]),
  res_scotano: r("res_scotano", "Scotano", "Cotinus coggygria", "Arbusto con gemme piccole rossastre seminude; foglie obovate; infruttescenze piumose.", ["Gemme rossastre", "Foglie tonde", "Infiorescenze piumose"]),

  res_ginkgo: r("res_ginkgo", "Ginkgo", "Ginkgo biloba", "Brachiblasti con gemme grigie globose; foglie a ventaglio in primavera.", ["Brachiblasti", "Gemme globose", "Foglie a ventaglio"]),
  res_giuda: r("res_giuda", "Albero di Giuda", "Cercis siliquastrum", "Gemme rossastre alterne lungo rami e tronco da cui sbocciano fiori rosa cauliflori.", ["Gemme cauliflore", "Fiori rosa precoci", "Foglie cordate"]),
  res_giuda_canadese: r("res_giuda_canadese", "Albero di Giuda canadese", "Cercis canadensis", "Simile al precedente ma con rametti porpora zigzaganti e fiori più piccoli.", ["Rametti zigzag rossi", "Fiori cauliflori", "Foglie cordate acute"]),

  res_ciliegio_canino: r("res_ciliegio_canino", "Ciliegio canino", "Prunus mahaleb", "Arbusto/alberello con gemme a grappolo sui brachiblasti; forte odore di cumarina.", ["Odore cumarina", "Gemme a grappolo", "Frutti piccoli neri"]),
  res_pado: r("res_pado", "Pado", "Prunus padus", "Gemme alterne brune; foglie con odore di mandorla amara; racemi pendenti.", ["Racemi penduli", "Gemme brune", "Drupe nere amare"]),
  res_amolo: r("res_amolo", "Amolo (Mirabolano)", "Prunus cerasifera", "Rametti rosso-bruno lucidi; gemme piccole appressate; fioritura bianca precoce.", ["Rametti rossi lucidi", "Fioritura bianca precoce", "Drupe rosse o gialle"]),

  res_nespolo: r("res_nespolo", "Nespolo europeo", "Mespilus germanica", "Gemme distiche tomentose grigiastre su rametti pelosi; spesso spinescente.", ["Gemme tomentose", "Rametti pelosi", "Frutti bruni grandi"]),
  res_pero_corvino: r("res_pero_corvino", "Pero corvino", "Amelanchier ovalis", "Arbusto con gemme piccole rosse distiche su rametti sottili grigi.", ["Gemme rosse piccole", "Rametti sottili", "Fiori bianchi stellati"]),
  res_ciavardello: r("res_ciavardello", "Ciavardello", "Sorbus torminalis", "Gemme alterne brune lucide ovoidi; rametti robusti grigi.", ["Gemme brune lucide", "Foglie lobate", "Frutti bruni puntinati"]),

  res_maggiociondolo: r("res_maggiociondolo", "Maggiociondolo", "Laburnum anagyroides", "Gemme alterne argenteo-seriche appiattite su rametti verde scuro.", ["Gemme argentee", "Fiori gialli penduli", "Foglie trifogliate"]),
  res_sorbo: r("res_sorbo", "Sorbo domestico", "Sorbus domestica", "Gemme ovoidi brune lucide viscose; foglie pinnate alla ripresa.", ["Gemme viscose", "Foglie pinnate", "Frutti a pomo"]),
  res_koelreuteria: r("res_koelreuteria", "Albero delle lanterne cinesi", "Koelreuteria paniculata", "Rametti con capsule vesciche brune persistenti; gemme alterne piccole.", ["Capsule a lanterna", "Foglie composte", "Fiori gialli a pannocchia"]),

  res_ippocastano_nano: r("res_ippocastano_nano", "Ippocastano nano", "Aesculus parviflora", "Arbusto pollonifero a foglie composte; gemme opposte vischiose.", ["Polloni multipli", "Gemme appiccicose", "Pannocchie bianche"]),
  res_generic: r("res_generic", "Specie non distinta", "—", "Le caratteristiche non sono sufficienti per arrivare a una sola specie: confronta con la lista per le specie residue (es. Magnolia, Salice, Koelreuteria).", ["Ricontrolla disposizione delle gemme", "Verifica presenza di scaglie", "Considera odore e colore dei rametti"]),
};
