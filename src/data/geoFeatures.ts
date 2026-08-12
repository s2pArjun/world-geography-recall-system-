import type { GeoFeatureItem } from '../types';

// A curated, exam-oriented set — not exhaustive, but covering the features
// most commonly tested in SSC CGL / UPSC / CDS-style general knowledge.
// Rendered as an optional point-marker layer so the globe isn't cluttered
// by default (matches spec section 5: "optional layers").

export const GEO_FEATURES: GeoFeatureItem[] = [
  // --- Rivers ---------------------------------------------------------
  {
    id: 'river-nile',
    name: 'Nile',
    category: 'River',
    lat: 30.1,
    lng: 31.2,
    countries: ['Egypt', 'Sudan', 'Ethiopia', 'Uganda'],
    facts: "Traditionally cited as the world's longest river (~6,650 km), flowing north into the Mediterranean through Sudan and Egypt."
  },
  {
    id: 'river-amazon',
    name: 'Amazon',
    category: 'River',
    lat: -1,
    lng: -49.5,
    countries: ['Brazil', 'Peru', 'Colombia'],
    facts: 'Carries by far the greatest water volume of any river on Earth, and rivals the Nile for length.'
  },
  {
    id: 'river-ganges',
    name: 'Ganges',
    category: 'River',
    lat: 23.5,
    lng: 90,
    countries: ['India', 'Bangladesh'],
    facts: "India's most sacred river; joins the Brahmaputra to form the Ganges Delta, the world's largest river delta, at the Bay of Bengal."
  },
  {
    id: 'river-brahmaputra',
    name: 'Brahmaputra',
    category: 'River',
    lat: 26.2,
    lng: 91.7,
    countries: ['China', 'India', 'Bangladesh'],
    facts: "Rises in Tibet as the Yarlung Tsangpo, cuts through the Himalayas into Assam, and joins the Ganges in Bangladesh."
  },
  {
    id: 'river-indus',
    name: 'Indus',
    category: 'River',
    lat: 24.5,
    lng: 67.5,
    countries: ['China', 'India', 'Pakistan'],
    facts: 'Gave the Indian subcontinent its name and nurtured the Indus Valley Civilisation; flows mainly through Pakistan.'
  },
  {
    id: 'river-yangtze',
    name: 'Yangtze',
    category: 'River',
    lat: 31.4,
    lng: 121.5,
    countries: ['China'],
    facts: "Asia's longest river and the world's third-longest, flowing entirely within China."
  },
  {
    id: 'river-yellow',
    name: 'Yellow River (Huang He)',
    category: 'River',
    lat: 37.8,
    lng: 119,
    countries: ['China'],
    facts: "Called the 'cradle of Chinese civilisation'; named for the yellow silt it carries."
  },
  {
    id: 'river-mississippi',
    name: 'Mississippi',
    category: 'River',
    lat: 29.2,
    lng: -89.3,
    countries: ['USA'],
    facts: "North America's largest river system, draining much of the central USA into the Gulf of Mexico."
  },
  {
    id: 'river-mekong',
    name: 'Mekong',
    category: 'River',
    lat: 10,
    lng: 106,
    countries: ['China', 'Myanmar', 'Laos', 'Thailand', 'Cambodia', 'Vietnam'],
    facts: 'Flows through more mainland Southeast Asian countries than any other river.'
  },
  {
    id: 'river-danube',
    name: 'Danube',
    category: 'River',
    lat: 45.2,
    lng: 29.7,
    countries: ['Germany', 'Austria', 'Hungary', 'Serbia', 'Romania'],
    facts: "Flows through more countries than any other river in the world, from Germany's Black Forest to the Black Sea."
  },
  {
    id: 'river-volga',
    name: 'Volga',
    category: 'River',
    lat: 45.7,
    lng: 47.9,
    countries: ['Russia'],
    facts: "Europe's longest river, flowing entirely within Russia into the landlocked Caspian Sea."
  },
  {
    id: 'river-congo',
    name: 'Congo',
    category: 'River',
    lat: -6,
    lng: 12.4,
    countries: ['DR Congo', 'Congo'],
    facts: "The world's deepest river and second-largest by discharge; unusually, it crosses the Equator twice."
  },

  // --- Mountain ranges --------------------------------------------------
  {
    id: 'mtn-himalayas',
    name: 'Himalayas',
    category: 'Mountain Range',
    lat: 28,
    lng: 84,
    countries: ['Nepal', 'India', 'Bhutan', 'China', 'Pakistan'],
    facts: "Home to the world's highest peaks, including Mount Everest; separates the Indian subcontinent from the Tibetan Plateau."
  },
  {
    id: 'mtn-andes',
    name: 'Andes',
    category: 'Mountain Range',
    lat: -25,
    lng: -68,
    countries: ['Chile', 'Argentina', 'Peru', 'Bolivia', 'Colombia'],
    facts: 'The longest continental mountain range on Earth, running the length of South America.'
  },
  {
    id: 'mtn-rockies',
    name: 'Rocky Mountains',
    category: 'Mountain Range',
    lat: 44,
    lng: -110,
    countries: ['Canada', 'USA'],
    facts: "North America's principal mountain range, stretching from British Columbia to New Mexico."
  },
  {
    id: 'mtn-alps',
    name: 'Alps',
    category: 'Mountain Range',
    lat: 46.5,
    lng: 10,
    countries: ['France', 'Switzerland', 'Italy', 'Austria', 'Germany'],
    facts: "Europe's highest and most extensive mountain range, arcing across eight countries."
  },
  {
    id: 'mtn-ural',
    name: 'Ural Mountains',
    category: 'Mountain Range',
    lat: 60,
    lng: 59.5,
    countries: ['Russia'],
    facts: 'Conventionally marks the boundary between Europe and Asia, running north–south through Russia.'
  },
  {
    id: 'mtn-atlas',
    name: 'Atlas Mountains',
    category: 'Mountain Range',
    lat: 31.5,
    lng: -7,
    countries: ['Morocco', 'Algeria', 'Tunisia'],
    facts: 'Separates the Sahara Desert from the Mediterranean coast in northwest Africa.'
  },
  {
    id: 'mtn-karakoram',
    name: 'Karakoram Range',
    category: 'Mountain Range',
    lat: 35.9,
    lng: 76.5,
    countries: ['Pakistan', 'India', 'China'],
    facts: "Home to K2, the world's second-highest peak, and the greatest concentration of high peaks anywhere on Earth."
  },

  // --- Deserts ------------------------------------------------------------
  {
    id: 'desert-sahara',
    name: 'Sahara',
    category: 'Desert',
    lat: 23,
    lng: 13,
    countries: ['Algeria', 'Libya', 'Egypt', 'Mali', 'Niger'],
    facts: "The world's largest hot desert — nearly the size of the entire United States — spanning North Africa."
  },
  {
    id: 'desert-arabian',
    name: 'Arabian Desert',
    category: 'Desert',
    lat: 24,
    lng: 47,
    countries: ['Saudi Arabia', 'Oman', 'UAE', 'Yemen'],
    facts: "Covers most of the Arabian Peninsula, including the Rub' al Khali (Empty Quarter), the largest continuous sand desert on Earth."
  },
  {
    id: 'desert-gobi',
    name: 'Gobi Desert',
    category: 'Desert',
    lat: 43,
    lng: 103,
    countries: ['Mongolia', 'China'],
    facts: 'A cold desert on the Mongolia–China plateau, famous for major dinosaur fossil discoveries.'
  },
  {
    id: 'desert-kalahari',
    name: 'Kalahari Desert',
    category: 'Desert',
    lat: -23,
    lng: 22,
    countries: ['Botswana', 'Namibia', 'South Africa'],
    facts: 'A large semi-arid sandy region across Southern Africa.'
  },
  {
    id: 'desert-thar',
    name: 'Thar Desert',
    category: 'Desert',
    lat: 27,
    lng: 71,
    countries: ['India', 'Pakistan'],
    facts: "The 'Great Indian Desert' — one of the world's most densely populated desert regions, split between Rajasthan and Pakistan."
  },
  {
    id: 'desert-atacama',
    name: 'Atacama Desert',
    category: 'Desert',
    lat: -24,
    lng: -69.5,
    countries: ['Chile'],
    facts: 'The driest non-polar desert on Earth; some weather stations have never recorded rainfall.'
  },

  // --- Straits --------------------------------------------------------
  {
    id: 'strait-gibraltar',
    name: 'Strait of Gibraltar',
    category: 'Strait',
    lat: 36,
    lng: -5.5,
    countries: ['Spain', 'Morocco'],
    facts: 'Separates Spain from Morocco and links the Atlantic Ocean to the Mediterranean Sea.'
  },
  {
    id: 'strait-hormuz',
    name: 'Strait of Hormuz',
    category: 'Strait',
    lat: 26.5,
    lng: 56.3,
    countries: ['Iran', 'Oman'],
    facts: "The world's most important oil chokepoint, linking the Persian Gulf to the Arabian Sea."
  },
  {
    id: 'strait-malacca',
    name: 'Strait of Malacca',
    category: 'Strait',
    lat: 3,
    lng: 100.5,
    countries: ['Malaysia', 'Indonesia', 'Singapore'],
    facts: "One of the world's busiest shipping lanes, linking the Indian Ocean to the South China Sea."
  },
  {
    id: 'strait-bering',
    name: 'Bering Strait',
    category: 'Strait',
    lat: 65.8,
    lng: -169,
    countries: ['Russia', 'USA'],
    facts: 'The narrow gap — about 82 km wide — separating Asia from North America.'
  },
  {
    id: 'strait-palk',
    name: 'Palk Strait',
    category: 'Strait',
    lat: 9.7,
    lng: 79.6,
    countries: ['India', 'Sri Lanka'],
    facts: 'Separates Tamil Nadu (India) from Sri Lanka.'
  },
  {
    id: 'strait-bab-el-mandeb',
    name: 'Bab-el-Mandeb',
    category: 'Strait',
    lat: 12.6,
    lng: 43.4,
    countries: ['Yemen', 'Djibouti'],
    facts: 'Links the Red Sea to the Gulf of Aden — a vital route for traffic heading to and from the Suez Canal.'
  },
  {
    id: 'strait-dover',
    name: 'Strait of Dover',
    category: 'Strait',
    lat: 51,
    lng: 1.4,
    countries: ['United Kingdom', 'France'],
    facts: 'The narrowest point of the English Channel, separating England from France by about 33 km.'
  },

  // --- Canals -----------------------------------------------------------
  {
    id: 'canal-suez',
    name: 'Suez Canal',
    category: 'Canal',
    lat: 30.5,
    lng: 32.3,
    countries: ['Egypt'],
    facts: 'Connects the Mediterranean to the Red Sea across Egypt without locks, dramatically shortening the Europe–Asia sea route.'
  },
  {
    id: 'canal-panama',
    name: 'Panama Canal',
    category: 'Canal',
    lat: 9.1,
    lng: -79.7,
    countries: ['Panama'],
    facts: 'Connects the Atlantic and Pacific Oceans across Panama using a system of locks.'
  },

  // --- Islands / island groups -------------------------------------------
  {
    id: 'island-greenland',
    name: 'Greenland',
    category: 'Island / Island Group',
    lat: 72,
    lng: -40,
    countries: ['Denmark (autonomous territory)'],
    facts: "The world's largest island (Australia is classified as a continent, not an island)."
  },
  {
    id: 'island-borneo',
    name: 'Borneo',
    category: 'Island / Island Group',
    lat: 0.5,
    lng: 114,
    countries: ['Indonesia', 'Malaysia', 'Brunei'],
    facts: 'The largest island in Asia, its territory shared by three countries.'
  },
  {
    id: 'island-new-guinea',
    name: 'New Guinea',
    category: 'Island / Island Group',
    lat: -5,
    lng: 141,
    countries: ['Papua New Guinea', 'Indonesia'],
    facts: "The world's second-largest island, split between Papua New Guinea and Indonesia."
  },
  {
    id: 'island-andaman-nicobar',
    name: 'Andaman & Nicobar Islands',
    category: 'Island / Island Group',
    lat: 10.5,
    lng: 92.8,
    countries: ['India'],
    facts: 'An Indian union territory in the Bay of Bengal, geographically closer to Myanmar and Thailand than the mainland.'
  },
  {
    id: 'island-lakshadweep',
    name: 'Lakshadweep',
    category: 'Island / Island Group',
    lat: 10.6,
    lng: 72.6,
    countries: ['India'],
    facts: "India's smallest union territory — a coral-atoll archipelago in the Arabian Sea."
  },
  {
    id: 'island-sicily',
    name: 'Sicily',
    category: 'Island / Island Group',
    lat: 37.6,
    lng: 14.1,
    countries: ['Italy'],
    facts: 'The largest island in the Mediterranean Sea, off the toe of the Italian mainland.'
  }
];
