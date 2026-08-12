import type { WaterBody } from '../types';

// Water bodies aren't well-served by off-the-shelf clickable polygon data
// (sea/ocean boundaries are inherently fuzzy), so these are rendered as
// labelled point markers at each body's approximate centre — accurate
// enough to click, study and quiz on, without the visual clutter or
// unreliable geometry that full boundary polygons would need.

export const WATER_BODIES: WaterBody[] = [
  {
    id: 'pacific',
    name: 'Pacific Ocean',
    type: 'Ocean',
    lat: 0,
    lng: -160,
    bordering: ['USA', 'Japan', 'China', 'Australia', 'Chile', 'Russia', 'Philippines', 'Indonesia'],
    facts: "The largest and deepest ocean on Earth — bigger than all landmasses combined. Rimmed by the 'Ring of Fire', the world's most active earthquake and volcano belt."
  },
  {
    id: 'atlantic',
    name: 'Atlantic Ocean',
    type: 'Ocean',
    lat: 10,
    lng: -35,
    bordering: ['USA', 'Brazil', 'United Kingdom', 'Portugal', 'Nigeria', 'Argentina', 'Canada'],
    facts: 'Second-largest ocean, separating the Americas from Europe and Africa. The Mid-Atlantic Ridge, an underwater mountain chain, runs down its centre.'
  },
  {
    id: 'indian',
    name: 'Indian Ocean',
    type: 'Ocean',
    lat: -20,
    lng: 78,
    bordering: ['India', 'Australia', 'Indonesia', 'Somalia', 'South Africa', 'Sri Lanka', 'Madagascar'],
    facts: 'The only ocean named after a single country. Its northern basin is dominated by seasonal monsoon winds that reverse direction twice a year.'
  },
  {
    id: 'arctic',
    name: 'Arctic Ocean',
    type: 'Ocean',
    lat: 85,
    lng: -40,
    bordering: ['Russia', 'Canada', 'USA', 'Norway', 'Greenland (Denmark)', 'Iceland'],
    facts: "Smallest and shallowest ocean, centred on the North Pole. Largely ice-covered year-round, though the ice extent is shrinking with warming."
  },
  {
    id: 'southern',
    name: 'Southern Ocean',
    type: 'Ocean',
    lat: -65,
    lng: 0,
    bordering: ['Antarctica'],
    facts: 'Encircles Antarctica and is defined by the powerful Antarctic Circumpolar Current — the largest ocean current on Earth.'
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean Sea',
    type: 'Sea',
    lat: 35,
    lng: 18,
    bordering: ['Spain', 'France', 'Italy', 'Greece', 'Turkey', 'Egypt', 'Libya', 'Morocco'],
    facts: 'A near-landlocked sea between Europe, Africa and Asia. Connects to the Atlantic via the Strait of Gibraltar and to the Red Sea via the Suez Canal.'
  },
  {
    id: 'caribbean',
    name: 'Caribbean Sea',
    type: 'Sea',
    lat: 15,
    lng: -75,
    bordering: ['Cuba', 'Jamaica', 'Mexico', 'Colombia', 'Venezuela', 'Panama'],
    facts: 'Southeast of the Gulf of Mexico, ringed by Central America and the Caribbean islands. Home to the Mesoamerican Reef, the second-largest barrier reef system on Earth.'
  },
  {
    id: 'black-sea',
    name: 'Black Sea',
    type: 'Sea',
    lat: 43,
    lng: 35,
    bordering: ['Turkey', 'Bulgaria', 'Romania', 'Ukraine', 'Russia', 'Georgia'],
    facts: 'Lies between southeastern Europe and Asia Minor. Connects to the Mediterranean through the Bosphorus and Dardanelles straits, on either side of Istanbul.'
  },
  {
    id: 'red-sea',
    name: 'Red Sea',
    type: 'Sea',
    lat: 20,
    lng: 38,
    bordering: ['Egypt', 'Saudi Arabia', 'Sudan', 'Eritrea', 'Yemen', 'Djibouti'],
    facts: 'Separates Africa from the Arabian Peninsula. One of the saltiest seas in the world; the Suez Canal links its northern tip to the Mediterranean.'
  },
  {
    id: 'arabian-sea',
    name: 'Arabian Sea',
    type: 'Sea',
    lat: 15,
    lng: 65,
    bordering: ['India', 'Pakistan', 'Oman', 'Yemen', 'Somalia'],
    facts: "Forms the northwestern Indian Ocean, between India and the Arabian Peninsula. A historic trade corridor linking India, the Middle East and East Africa."
  },
  {
    id: 'bay-of-bengal',
    name: 'Bay of Bengal',
    type: 'Bay',
    lat: 15,
    lng: 88,
    bordering: ['India', 'Bangladesh', 'Sri Lanka', 'Myanmar'],
    facts: "The world's largest bay, forming the northeastern Indian Ocean. Receives the Ganges–Brahmaputra delta, the largest river delta on Earth."
  },
  {
    id: 'south-china-sea',
    name: 'South China Sea',
    type: 'Sea',
    lat: 12,
    lng: 114,
    bordering: ['China', 'Vietnam', 'Philippines', 'Malaysia', 'Brunei', 'Indonesia', 'Taiwan'],
    facts: "One of the world's busiest shipping corridors in the western Pacific, and the subject of overlapping territorial claims among several bordering states."
  },
  {
    id: 'east-china-sea',
    name: 'East China Sea',
    type: 'Sea',
    lat: 29,
    lng: 125,
    bordering: ['China', 'Japan', 'Taiwan', 'South Korea'],
    facts: "Lies between mainland China, Japan's Ryukyu Islands and Taiwan. The Yangtze, China's longest river, empties into it."
  },
  {
    id: 'yellow-sea',
    name: 'Yellow Sea',
    type: 'Sea',
    lat: 36,
    lng: 123,
    bordering: ['China', 'North Korea', 'South Korea'],
    facts: 'Separates mainland China from the Korean Peninsula. Named for the yellow silt the Huang He (Yellow River) carries into it.'
  },
  {
    id: 'caspian-sea',
    name: 'Caspian Sea',
    type: 'Sea',
    lat: 42,
    lng: 51,
    bordering: ['Russia', 'Kazakhstan', 'Turkmenistan', 'Iran', 'Azerbaijan'],
    facts: "The world's largest inland body of water — technically a lake, though long studied as a 'sea'. Landlocked and rich in oil, gas and sturgeon (caviar)."
  },
  {
    id: 'persian-gulf',
    name: 'Persian Gulf',
    type: 'Gulf',
    lat: 27,
    lng: 51,
    bordering: ['Iran', 'Iraq', 'Kuwait', 'Saudi Arabia', 'Bahrain', 'Qatar', 'UAE', 'Oman'],
    facts: 'Lies between Iran and the Arabian Peninsula. Connects to the Arabian Sea via the Strait of Hormuz, a critical chokepoint for global oil shipping.'
  },
  {
    id: 'gulf-of-mexico',
    name: 'Gulf of Mexico',
    type: 'Gulf',
    lat: 25,
    lng: -90,
    bordering: ['USA', 'Mexico', 'Cuba'],
    facts: 'Receives the Mississippi River and is a major hub for offshore oil and gas extraction.'
  },
  {
    id: 'gulf-of-aden',
    name: 'Gulf of Aden',
    type: 'Gulf',
    lat: 12.5,
    lng: 48,
    bordering: ['Yemen', 'Somalia', 'Djibouti'],
    facts: 'Links the Red Sea (via the Bab-el-Mandeb strait) to the Arabian Sea — a historically vital and piracy-prone shipping lane.'
  },
  {
    id: 'bering-sea',
    name: 'Bering Sea',
    type: 'Sea',
    lat: 58,
    lng: -175,
    bordering: ['Russia', 'USA'],
    facts: "Sits in the northern Pacific between Russia and Alaska. Its narrow northern outlet, the Bering Strait, separates Asia from North America by just ~82 km."
  }
];
