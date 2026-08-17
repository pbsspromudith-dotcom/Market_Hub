export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in miles
  return distance;
};

export const extractCityName = (locationStr: string): string => {
  if (!locationStr) return '';
  const trimmed = locationStr.trim();
  if (!trimmed || trimmed.toLowerCase() === 'all' || trimmed.toLowerCase() === 'canada') return '';
  
  const parts = trimmed.split(',').map(p => p.trim());
  if (parts.length > 1) {
    // If first part contains house/street numbers e.g. "123 Yonge St, Toronto, ON", city is second part
    if (/\d/.test(parts[0]) && parts[1]) {
      return parts[1].replace(/^city of\s+/i, '');
    }
    return parts[0].replace(/^city of\s+/i, '');
  }
  return trimmed.replace(/^city of\s+/i, '');
};

// Comprehensive Canadian major cities and their sub-cities / boroughs / regions
export const CANADA_METRO_MAPPINGS: Record<string, string[]> = {
  // Ontario
  'toronto': [
    'Toronto', 'North York', 'Scarborough', 'Etobicoke', 'York', 'East York', 
    'Downtown Toronto', 'Old Toronto', 'Midtown Toronto', 'Mississauga', 'Brampton', 
    'Markham', 'Vaughan', 'Richmond Hill', 'Oakville', 'Burlington', 'Pickering', 
    'Ajax', 'Whitby', 'Oshawa', 'Newmarket', 'Milton', 'Caledon', 'Halton Hills', 
    'Aurora', 'King', 'Whitchurch-Stouffville', 'Georgina', 'Clarington'
  ],
  'ottawa': [
    'Ottawa', 'Gatineau', 'Kanata', 'Nepean', 'Gloucester', 'Orleans', 
    'Stittsville', 'Barrhaven', 'Vanier', 'Cumberland'
  ],
  'hamilton': [
    'Hamilton', 'Ancaster', 'Dundas', 'Stoney Creek', 'Flamborough', 'Glanbrook', 
    'St. Catharines', 'Niagara Falls', 'Welland', 'Grimsby'
  ],
  'kitchener': [
    'Kitchener', 'Waterloo', 'Cambridge', 'Guelph', 'Woolwich', 'Wilmot'
  ],
  'waterloo': [
    'Waterloo', 'Kitchener', 'Cambridge', 'Guelph'
  ],
  'london': [
    'London', 'St. Thomas', 'Strathroy', 'Windsor', 'Chatham-Kent', 'Sarnia'
  ],
  'barrie': [
    'Barrie', 'Innisfil', 'Orillia', 'Collingwood', 'Wasaga Beach', 'Bradford'
  ],

  // Quebec
  'montreal': [
    'Montreal', 'Montréal', 'Downtown Montreal', 'Ville-Marie', 'Le Plateau-Mont-Royal', 
    'Rosemont', 'Côte-des-Neiges', 'NDG', 'Outremont', 'Verdun', 'Saint-Laurent', 
    'Ahuntsic', 'Laval', 'Longueuil', 'Brossard', 'Boucherville', 'Terrebonne', 
    'Repentigny', 'Saint-Jean-sur-Richelieu', 'Saint-Jérôme', 'Blainville', 
    'Dollard-des-Ormeaux', 'Pointe-Claire', 'Kirkland', 'Beaconsfield', 'Dorval', 
    'Westmount', 'Mont-Royal', 'Vaudreuil-Dorion', 'Châteauguay', 'Mirabel'
  ],
  'quebec': [
    'Quebec', 'Québec', 'Sainte-Foy', 'Beauport', 'Charlesbourg', 'Lévis', 'Loretteville'
  ],
  'quebec city': [
    'Quebec', 'Québec', 'Sainte-Foy', 'Beauport', 'Charlesbourg', 'Lévis', 'Loretteville'
  ],
  'gatineau': [
    'Gatineau', 'Ottawa', 'Hull', 'Aylmer', 'Buckingham'
  ],

  // British Columbia
  'vancouver': [
    'Vancouver', 'Downtown Vancouver', 'Kitsilano', 'Yaletown', 'East Vancouver', 
    'Surrey', 'Burnaby', 'Richmond', 'Coquitlam', 'Langley', 'Delta', 
    'North Vancouver', 'West Vancouver', 'Maple Ridge', 'New Westminster', 
    'Port Coquitlam', 'Port Moody', 'White Rock', 'Pitt Meadows', 'Abbotsford', 'Chilliwack'
  ],
  'victoria': [
    'Victoria', 'Saanich', 'Langford', 'Nanaimo', 'Courtenay', 'Campbell River', 
    'Duncan', 'Sidney', 'Esquimalt', 'Colwood'
  ],
  'kelowna': [
    'Kelowna', 'West Kelowna', 'Kamloops', 'Vernon', 'Penticton'
  ],

  // Alberta
  'calgary': [
    'Calgary', 'NW Calgary', 'NE Calgary', 'SW Calgary', 'SE Calgary', 'Downtown Calgary', 
    'Airdrie', 'Cochrane', 'Okotoks', 'Chestermere', 'Strathmore', 'High River'
  ],
  'edmonton': [
    'Edmonton', 'Downtown Edmonton', 'Strathcona', 'West Edmonton', 
    'Sherwood Park', 'St. Albert', 'Leduc', 'Spruce Grove', 'Stony Plain', 'Fort Saskatchewan', 'Beaumont'
  ],

  // Manitoba
  'winnipeg': [
    'Winnipeg', 'St. Vital', 'St. Boniface', 'Transcona', 'Charleswood', 'River Heights', 
    'St. James', 'Kildonan', 'Steinbach', 'Brandon', 'Selkirk'
  ],

  // Saskatchewan
  'saskatoon': [
    'Saskatoon', 'Regina', 'Prince Albert', 'Moose Jaw', 'Warman', 'Martensville'
  ],
  'regina': [
    'Regina', 'Saskatoon', 'Moose Jaw'
  ],

  // Nova Scotia / Atlantic Canada
  'halifax': [
    'Halifax', 'Dartmouth', 'Bedford', 'Sackville', 'Cole Harbour', 'Fall River'
  ],
  'st. john\'s': [
    'St. John\'s', 'Mount Pearl', 'Paradise', 'Conception Bay South'
  ]
};

export const getExpandedLocationKeywords = (locationStr: string): string[] => {
  if (!locationStr) return [];
  const city = extractCityName(locationStr);
  if (!city) return [];
  
  const cityLower = city.toLowerCase();

  // 1. Direct match as a primary metro city
  if (CANADA_METRO_MAPPINGS[cityLower]) {
    return CANADA_METRO_MAPPINGS[cityLower];
  }

  // 2. Sub-city match: find parent metro and include both sub-city & parent city + sister sub-cities
  const expanded: Set<string> = new Set([city]);
  for (const [parentCity, subCities] of Object.entries(CANADA_METRO_MAPPINGS)) {
    const isSub = subCities.some(s => s.toLowerCase() === cityLower);
    if (isSub) {
      const capitalizedParent = parentCity.charAt(0).toUpperCase() + parentCity.slice(1);
      expanded.add(capitalizedParent);
      subCities.forEach(s => expanded.add(s));
      break;
    }
  }

  return Array.from(expanded);
};
