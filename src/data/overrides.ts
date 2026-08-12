// Hand-curated corrections layered on top of the mledoze/countries dataset.
//
// Two kinds of entries:
//  1. NAME_ALIASES – alternate names/abbreviations a student might type for a
//     country. The primary `name` from the dataset is always accepted too.
//  2. CAPITAL_OVERRIDES – countries with more than one capital, or where the
//     source dataset's single value doesn't match what's commonly taught.
//     `primary` is what's shown when the answer is revealed; `accepted`
//     (superset including primary) is what's graded as correct.
//
// This list is intentionally small and targeted at well-known, commonly
// exam-tested cases rather than an exhaustive audit of all 195 countries.
// Keyed by cca3.

export const NAME_ALIASES: Record<string, string[]> = {
  USA: ['USA', 'US', 'U.S.', 'U.S.A.', 'United States of America', 'America'],
  GBR: ['UK', 'U.K.', 'Britain', 'Great Britain'],
  ARE: ['UAE', 'U.A.E.'],
  CZE: ['Czech Republic'],
  CIV: ["Cote d'Ivoire", "Côte d'Ivoire"],
  SWZ: ['Swaziland'],
  TUR: ['Turkey'],
  MMR: ['Burma'],
  CPV: ['Cabo Verde'],
  TLS: ['East Timor'],
  PRK: ['Korea North', 'DPRK', 'North Korea'],
  KOR: ['Korea South', 'Republic of Korea', 'South Korea'],
  COD: ['Democratic Republic of the Congo', 'DRC', 'Congo Kinshasa', 'DR Congo'],
  COG: ['Republic of the Congo', 'Congo Brazzaville', 'Congo'],
  VAT: ['Holy See', 'Vatican'],
  FSM: ['Federated States of Micronesia', 'FSM', 'Micronesia'],
  BIH: ['Bosnia'],
  KNA: ['St Kitts and Nevis', 'St. Kitts and Nevis'],
  LCA: ['St Lucia', 'St. Lucia'],
  VCT: ['St Vincent and the Grenadines', 'St. Vincent and the Grenadines'],
  STP: ['Sao Tome and Principe'],
  BRN: ['Brunei Darussalam'],
  LAO: ['Lao PDR', "Laos People's Democratic Republic"],
  RUS: ['Russian Federation'],
  SYR: ['Syrian Arab Republic'],
  IRN: ['Islamic Republic of Iran', 'Persia'],
  VEN: ['Bolivarian Republic of Venezuela'],
  MKD: ['Macedonia', 'FYROM']
};

export interface CapitalOverride {
  primary: string;
  accepted: string[];
  note?: string;
}

export const CAPITAL_OVERRIDES: Record<string, CapitalOverride> = {
  ZAF: {
    primary: 'Pretoria',
    accepted: ['Pretoria', 'Cape Town', 'Bloemfontein'],
    note: 'South Africa uniquely has three capitals — Pretoria (executive), Cape Town (legislative) and Bloemfontein (judicial).'
  },
  SWZ: {
    primary: 'Mbabane',
    accepted: ['Mbabane', 'Lobamba'],
    note: 'Mbabane is the administrative capital; Lobamba is the royal and legislative capital.'
  },
  BOL: {
    primary: 'Sucre',
    accepted: ['Sucre', 'La Paz'],
    note: 'Sucre is the constitutional capital; La Paz is the administrative seat of government.'
  },
  LKA: {
    primary: 'Sri Jayawardenepura Kotte',
    accepted: ['Colombo', 'Sri Jayawardenepura Kotte', 'Kotte'],
    note: 'Kotte is the official legislative capital; Colombo is the commercial capital most people mean day-to-day.'
  },
  MYS: {
    primary: 'Kuala Lumpur',
    accepted: ['Kuala Lumpur', 'Putrajaya'],
    note: 'Kuala Lumpur is the seat of parliament and monarchy; Putrajaya is the administrative capital.'
  },
  NLD: {
    primary: 'Amsterdam',
    accepted: ['Amsterdam', 'The Hague', 'Hague'],
    note: 'Amsterdam is the constitutional capital; The Hague is the seat of government.'
  },
  ISR: {
    primary: 'Jerusalem',
    accepted: ['Jerusalem', 'Tel Aviv'],
    note: "Jerusalem is Israel's declared capital; many foreign embassies are in Tel Aviv."
  },
  CIV: {
    primary: 'Yamoussoukro',
    accepted: ['Yamoussoukro', 'Abidjan'],
    note: 'Yamoussoukro is the official capital; Abidjan is the largest city and de facto seat of government.'
  },
  BEN: {
    primary: 'Porto-Novo',
    accepted: ['Porto-Novo', 'Cotonou'],
    note: 'Porto-Novo is the official capital; Cotonou is the seat of government and largest city.'
  },
  TZA: {
    primary: 'Dodoma',
    accepted: ['Dodoma', 'Dar es Salaam'],
    note: 'Dodoma is the official capital; Dar es Salaam remains the commercial capital and former seat of government.'
  },
  MMR: {
    primary: 'Naypyidaw',
    accepted: ['Naypyidaw', 'Yangon', 'Rangoon'],
    note: 'Naypyidaw became the capital in 2005, replacing Yangon (Rangoon).'
  }
};
