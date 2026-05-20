export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type QuizCategory = {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  color: string;
  questions: QuizQuestion[];
};

export const quizCategories: QuizCategory[] = [
  {
    id: "acqua",
    title: "Acqua",
    description: "Il ciclo dell'acqua e la sua importanza",
    icon: "Droplets",
    color: "gradient-forest",
    questions: [
      {
        question: "Quale percentuale di acqua dolce è disponibile sul pianeta?",
        options: ["Circa il 50%", "Circa il 25%", "Circa il 2,5%", "Circa il 10%"],
        correctIndex: 2,
        explanation: "Solo il 2,5% dell'acqua sulla Terra è dolce, e meno dell'1% è facilmente accessibile.",
      },
      {
        question: "Cos'è la traspirazione delle piante?",
        options: [
          "L'assorbimento di acqua dalle radici",
          "Il rilascio di vapore acqueo dalle foglie",
          "La fotosintesi",
          "La caduta delle foglie",
        ],
        correctIndex: 1,
        explanation: "Le piante rilasciano vapore acqueo attraverso gli stomi delle foglie, contribuendo al ciclo dell'acqua.",
      },
      {
        question: "Cosa significa 'acqua potabile'?",
        options: [
          "Acqua di sorgente",
          "Acqua che si può bere senza rischi per la salute",
          "Acqua minerale",
          "Acqua bollita",
        ],
        correctIndex: 1,
        explanation: "L'acqua potabile rispetta parametri chimici e microbiologici sicuri per il consumo umano.",
      },
      {
        question: "Quale fase del ciclo dell'acqua trasforma il vapore in nuvole?",
        options: ["Evaporazione", "Condensazione", "Precipitazione", "Infiltrazione"],
        correctIndex: 1,
        explanation: "La condensazione trasforma il vapore in goccioline che formano le nuvole.",
      },
      {
        question: "Cosa sono le falde acquifere?",
        options: [
          "Fiumi sotterranei visibili",
          "Riserve d'acqua nel sottosuolo tra rocce permeabili",
          "Laghi alpini",
          "Sorgenti termali",
        ],
        correctIndex: 1,
        explanation: "Le falde acquifere sono accumuli d'acqua nel sottosuolo, fondamentali per pozzi e sorgenti.",
      },
    ],
  },
  {
    id: "suolo",
    title: "Suolo",
    description: "La pelle viva della Terra",
    icon: "Mountain",
    color: "gradient-amber",
    questions: [
      {
        question: "Quanto tempo occorre per formare 1 cm di suolo fertile?",
        options: ["Pochi mesi", "10 anni", "Centinaia di anni", "Un milione di anni"],
        correctIndex: 2,
        explanation: "La formazione di 1 cm di suolo richiede da 100 a 1000 anni a seconda delle condizioni.",
      },
      {
        question: "Quale organismo è considerato l'ingegnere del suolo?",
        options: ["La formica", "Il lombrico", "La talpa", "Il ragno"],
        correctIndex: 1,
        explanation: "I lombrichi areano il suolo, lo arricchiscono di sostanza organica e migliorano la struttura.",
      },
      {
        question: "Cos'è l'humus?",
        options: [
          "Un tipo di roccia",
          "Sostanza organica decomposta nel suolo",
          "Una pianta",
          "Un minerale argilloso",
        ],
        correctIndex: 1,
        explanation: "L'humus è la frazione organica stabile del suolo, fondamentale per la fertilità.",
      },
      {
        question: "Cos'è l'erosione del suolo?",
        options: [
          "L'arricchimento naturale",
          "Il dilavamento e la perdita di suolo per acqua o vento",
          "La compattazione",
          "La rotazione delle colture",
        ],
        correctIndex: 1,
        explanation: "L'erosione asporta la parte fertile del suolo, riducendone la produttività.",
      },
      {
        question: "Quale pratica agricola aiuta a proteggere il suolo?",
        options: [
          "Monocoltura intensiva",
          "Aratura profonda continua",
          "Rotazione delle colture e cover crops",
          "Uso massiccio di pesticidi",
        ],
        correctIndex: 2,
        explanation: "La rotazione e le colture di copertura mantengono la fertilità e prevengono l'erosione.",
      },
    ],
  },
  {
    id: "piante",
    title: "Piante",
    description: "Il mondo vegetale e la fotosintesi",
    icon: "Leaf",
    color: "gradient-forest",
    questions: [
      {
        question: "Cosa producono le piante durante la fotosintesi?",
        options: [
          "Anidride carbonica e acqua",
          "Ossigeno e zuccheri",
          "Azoto e proteine",
          "Metano e ossigeno",
        ],
        correctIndex: 1,
        explanation: "Le piante usano CO₂, acqua e luce solare per produrre ossigeno e glucosio.",
      },
      {
        question: "Qual è la funzione delle radici?",
        options: [
          "Solo sostenere la pianta",
          "Assorbire acqua e sali minerali e ancorare la pianta",
          "Produrre fiori",
          "Fare la fotosintesi",
        ],
        correctIndex: 1,
        explanation: "Le radici assorbono nutrienti e acqua, oltre a sostenere la pianta.",
      },
      {
        question: "Cosa sono le piante decidue?",
        options: [
          "Piante che restano sempre verdi",
          "Piante che perdono le foglie in autunno",
          "Piante acquatiche",
          "Piante rampicanti",
        ],
        correctIndex: 1,
        explanation: "Le decidue (caducifoglie) perdono le foglie nella stagione fredda o secca.",
      },
      {
        question: "Quale parte del fiore produce il polline?",
        options: ["Pistillo", "Stame (antera)", "Petalo", "Sepalo"],
        correctIndex: 1,
        explanation: "Le antere, all'apice degli stami, producono il polline maschile.",
      },
      {
        question: "Quale gas assorbono le piante dall'atmosfera?",
        options: ["Ossigeno", "Azoto", "Anidride carbonica", "Metano"],
        correctIndex: 2,
        explanation: "Le piante assorbono CO₂ per la fotosintesi, contribuendo a mitigare il clima.",
      },
    ],
  },
  {
    id: "animali",
    title: "Animali",
    description: "Fauna e comportamenti",
    icon: "Bird",
    color: "gradient-amber",
    questions: [
      {
        question: "Cos'è un animale endemico?",
        options: [
          "Un animale in via di estinzione",
          "Una specie presente solo in una determinata area",
          "Un animale domestico",
          "Un animale migratore",
        ],
        correctIndex: 1,
        explanation: "Le specie endemiche vivono esclusivamente in un'area geografica delimitata.",
      },
      {
        question: "Quale insetto è fondamentale per l'impollinazione?",
        options: ["Zanzara", "Ape", "Mosca", "Cimice"],
        correctIndex: 1,
        explanation: "Le api impollinano gran parte delle piante coltivate e selvatiche.",
      },
      {
        question: "Quale di questi è un mammifero?",
        options: ["Coccodrillo", "Pipistrello", "Aquila", "Salamandra"],
        correctIndex: 1,
        explanation: "Il pipistrello è l'unico mammifero capace di volo attivo.",
      },
      {
        question: "Cosa mangia un animale onnivoro?",
        options: [
          "Solo carne",
          "Solo vegetali",
          "Sia vegetali che carne",
          "Solo insetti",
        ],
        correctIndex: 2,
        explanation: "Gli onnivori, come l'orso o il cinghiale, si nutrono di vegetali e di animali.",
      },
      {
        question: "Perché molti uccelli migrano?",
        options: [
          "Per turismo",
          "Per seguire risorse alimentari e clima favorevole",
          "Per perdersi",
          "Per cambiare colore",
        ],
        correctIndex: 1,
        explanation: "La migrazione consente di trovare cibo e luoghi adatti alla riproduzione.",
      },
    ],
  },
  {
    id: "biodiversita",
    title: "Biodiversità",
    description: "La varietà della vita",
    icon: "Sprout",
    color: "gradient-forest",
    questions: [
      {
        question: "Cosa indica la biodiversità?",
        options: [
          "Il numero di alberi in un bosco",
          "La varietà di forme di vita in un ecosistema",
          "La quantità di acqua disponibile",
          "Il livello di inquinamento",
        ],
        correctIndex: 1,
        explanation: "La biodiversità comprende geni, specie ed ecosistemi diversi.",
      },
      {
        question: "Quale ambiente ospita più biodiversità?",
        options: ["Deserto", "Foresta pluviale tropicale", "Tundra", "Ghiacciaio"],
        correctIndex: 1,
        explanation: "Le foreste pluviali ospitano oltre la metà delle specie terrestri conosciute.",
      },
      {
        question: "Cosa sono le specie aliene invasive?",
        options: [
          "Specie provenienti dallo spazio",
          "Specie introdotte fuori dal loro areale che danneggiano gli ecosistemi locali",
          "Specie in via di estinzione",
          "Specie geneticamente modificate",
        ],
        correctIndex: 1,
        explanation: "Le specie invasive minacciano la biodiversità autoctona, come la nutria o l'ambrosia.",
      },
      {
        question: "Cos'è un ecosistema?",
        options: [
          "Solo il clima di un'area",
          "L'insieme di organismi viventi e ambiente fisico che interagiscono",
          "Un parco protetto",
          "Una catena montuosa",
        ],
        correctIndex: 1,
        explanation: "Un ecosistema è la rete di relazioni tra esseri viventi e ambiente.",
      },
      {
        question: "Perché la biodiversità è importante per l'uomo?",
        options: [
          "Solo per il turismo",
          "Fornisce cibo, medicine, aria pulita, regolazione del clima",
          "Non è importante",
          "Solo per la ricerca scientifica",
        ],
        correctIndex: 1,
        explanation: "I servizi ecosistemici dipendono dalla biodiversità e sostengono la nostra vita.",
      },
    ],
  },
  {
    id: "inquinamento",
    title: "Inquinamento",
    description: "Impatti dell'uomo sull'ambiente",
    icon: "AlertTriangle",
    color: "gradient-amber",
    questions: [
      {
        question: "Qual è la principale causa dell'effetto serra antropico?",
        options: [
          "Le eruzioni vulcaniche",
          "L'uso di combustibili fossili",
          "Gli alberi",
          "Il vento",
        ],
        correctIndex: 1,
        explanation: "La combustione di carbone, petrolio e gas rilascia CO₂, principale gas serra antropico.",
      },
      {
        question: "Quanto può impiegare una bottiglia di plastica a degradarsi in natura?",
        options: ["1 anno", "10 anni", "100 anni", "Fino a 1000 anni"],
        correctIndex: 3,
        explanation: "La plastica può persistere centinaia di anni, frammentandosi in microplastiche.",
      },
      {
        question: "Cosa sono le microplastiche?",
        options: [
          "Piccoli oggetti di plastica riutilizzabili",
          "Frammenti di plastica inferiori a 5 mm",
          "Plastiche biodegradabili",
          "Tipi di colla",
        ],
        correctIndex: 1,
        explanation: "Le microplastiche contaminano acqua, suolo, cibo e organismi viventi.",
      },
      {
        question: "Cosa indica l'acronimo PM10?",
        options: [
          "Una sostanza chimica",
          "Particolato atmosferico con diametro fino a 10 micrometri",
          "Un tipo di plastica",
          "Una scala sismica",
        ],
        correctIndex: 1,
        explanation: "Il PM10 è polvere sottile in sospensione, dannosa per le vie respiratorie.",
      },
      {
        question: "Quale azione riduce di più l'impronta ecologica individuale?",
        options: [
          "Lasciare la luce accesa",
          "Ridurre sprechi, mobilità sostenibile e consumi consapevoli",
          "Usare più imballaggi",
          "Aumentare l'uso dell'auto privata",
        ],
        correctIndex: 1,
        explanation: "Stili di vita sobri e scelte consapevoli riducono significativamente l'impatto ambientale.",
      },
    ],
  },
  {
    id: "clima",
    title: "Clima ed Energia",
    description: "Cambiamenti climatici e risorse",
    icon: "Sun",
    color: "gradient-forest",
    questions: [
      {
        question: "Qual è una fonte di energia rinnovabile?",
        options: ["Carbone", "Petrolio", "Solare", "Gas naturale"],
        correctIndex: 2,
        explanation: "Solare, eolico, idroelettrico, geotermico e biomasse sono fonti rinnovabili.",
      },
      {
        question: "Cosa si intende per 'riscaldamento globale'?",
        options: [
          "L'aumento delle ondate di freddo",
          "L'aumento della temperatura media del pianeta",
          "Il raffreddamento degli oceani",
          "L'aumento della pioggia ovunque",
        ],
        correctIndex: 1,
        explanation: "Il riscaldamento globale è l'aumento progressivo della temperatura media terrestre.",
      },
      {
        question: "Quale gas serra ha il maggior impatto antropico per quantità?",
        options: ["Metano", "Anidride carbonica (CO₂)", "Ozono", "Vapore acqueo"],
        correctIndex: 1,
        explanation: "La CO₂ è il principale gas serra emesso dalle attività umane.",
      },
      {
        question: "Cosa significa 'decarbonizzazione'?",
        options: [
          "Aumentare l'uso del carbone",
          "Ridurre le emissioni di CO₂ nei processi produttivi ed energetici",
          "Eliminare la CO₂ dalle bevande",
          "Bruciare più foreste",
        ],
        correctIndex: 1,
        explanation: "Decarbonizzare significa passare a sistemi a basse o nulle emissioni di carbonio.",
      },
      {
        question: "Quale comportamento aiuta a contrastare il cambiamento climatico?",
        options: [
          "Sprecare energia elettrica",
          "Piantare alberi e ridurre i consumi energetici",
          "Usare sempre l'auto",
          "Lasciare gli elettrodomestici in standby",
        ],
        correctIndex: 1,
        explanation: "Le foreste assorbono CO₂ e i consumi consapevoli riducono le emissioni.",
      },
    ],
  },
];
