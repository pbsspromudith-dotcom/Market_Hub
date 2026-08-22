/**
 * Canadian Locations Database & Instant Search Engine
 * Compiled from HitAds.ca 10 Canadian Provinces Main Cities & Sub-Cities Specifications
 * (Alberta, British Columbia, Manitoba, New Brunswick, Newfoundland and Labrador,
 *  Nova Scotia, Ontario, Prince Edward Island, Quebec, Saskatchewan)
 */

export interface CanadianProvince {
  name: string;
  code: string;
}

export interface RegionGroup {
  key: string;
  name: string;
  mainCity: string;
  province: string;
  provinceCode: string;
  locations: string[];
  lat?: string;
  lon?: string;
}

export interface LocationItem {
  name: string;
  regionKey: string;
  regionName: string;
  province: string;
  provinceCode: string;
  isMainCity: boolean;
  parentCity: string;
  fullAddress: string;
  displayTitle: string;
  displaySubtitle: string;
  lat: string;
  lon: string;
}

export const CANADIAN_PROVINCES: Record<string, CanadianProvince> = {
  AB: { name: 'Alberta', code: 'AB' },
  BC: { name: 'British Columbia', code: 'BC' },
  MB: { name: 'Manitoba', code: 'MB' },
  NB: { name: 'New Brunswick', code: 'NB' },
  NL: { name: 'Newfoundland and Labrador', code: 'NL' },
  NS: { name: 'Nova Scotia', code: 'NS' },
  ON: { name: 'Ontario', code: 'ON' },
  PE: { name: 'Prince Edward Island', code: 'PE' },
  QC: { name: 'Quebec', code: 'QC' },
  SK: { name: 'Saskatchewan', code: 'SK' },
  NT: { name: 'Northwest Territories', code: 'NT' },
  YT: { name: 'Yukon', code: 'YT' },
  NU: { name: 'Nunavut', code: 'NU' },
};

export const PROVINCE_NAME_TO_CODE: Record<string, string> = {
  'alberta': 'AB',
  'british columbia': 'BC',
  'manitoba': 'MB',
  'new brunswick': 'NB',
  'newfoundland and labrador': 'NL',
  'newfoundland': 'NL',
  'labrador': 'NL',
  'nova scotia': 'NS',
  'ontario': 'ON',
  'prince edward island': 'PE',
  'quebec': 'QC',
  'québec': 'QC',
  'saskatchewan': 'SK',
  'northwest territories': 'NT',
  'yukon': 'YT',
  'nunavut': 'NU',
};

// Raw Developer Mappings from all 10 PDFs
export const RAW_PROVINCE_DATA: Record<string, { province: string; provinceCode: string; regions: Record<string, { name: string; locations: string[]; lat?: string; lon?: string }> }> = {
  AB: {
    province: 'Alberta',
    provinceCode: 'AB',
    regions: {
      'calgary': {
        name: 'Calgary / Greater Calgary',
        lat: '51.0447',
        lon: '-114.0719',
        locations: [ 'Calgary', 'Downtown Calgary', 'NW Calgary', 'NE Calgary', 'SW Calgary', 'SE Calgary', 'Beltline', 'Kensington', 'Inglewood', 'Bridgeland' ],
      },
      'airdrie': {
        name: 'Airdrie / Rocky View',
        lat: '51.2917',
        lon: '-114.0144',
        locations: [ 'Airdrie', 'Balzac', 'Crossfield', 'Irricana', 'Beiseker', 'Rocky View County' ],
      },
      'okotoks': {
        name: 'Okotoks / Foothills',
        lat: '50.7255',
        lon: '-113.9749',
        locations: [ 'Okotoks', 'Black Diamond', 'Turner Valley', 'Diamond Valley', 'Longview', 'Aldersyde' ],
      },
      'cochrane': {
        name: 'Cochrane / Rocky View',
        lat: '51.1884',
        lon: '-114.4719',
        locations: [ 'Cochrane', 'Bragg Creek', 'Ghost Lake', 'Morley' ],
      },
      'chestermere': {
        name: 'Chestermere / Rocky View',
        lat: '51.0500',
        lon: '-113.8222',
        locations: [ 'Chestermere', 'Langdon', 'Indus', 'Conrich' ],
      },
      'high-river': {
        name: 'High River / Foothills',
        lat: '50.5817',
        lon: '-113.8744',
        locations: [ 'High River', 'Cayley', 'Nanton' ],
      },
      'strathmore': {
        name: 'Strathmore / Wheatland',
        lat: '51.0378',
        lon: '-113.4008',
        locations: [ 'Strathmore', 'Carseland', 'Standard', 'Husar' ],
      },
      'edmonton': {
        name: 'Edmonton / Greater Edmonton',
        lat: '53.5461',
        lon: '-113.4938',
        locations: [ 'Edmonton', 'Downtown Edmonton', 'Strathcona', 'West Edmonton', 'North Edmonton', 'South Edmonton', 'Old Strathcona', 'Oliver', 'Garneau', 'Mill Woods', 'Castledowns' ],
      },
      'sherwood-park': {
        name: 'Sherwood Park / Strathcona County',
        lat: '53.5255',
        lon: '-113.3155',
        locations: [ 'Sherwood Park', 'Ardrossan', 'Strathcona County' ],
      },
      'st-albert': {
        name: 'St. Albert / Sturgeon County',
        lat: '53.6305',
        lon: '-113.6256',
        locations: [ 'St. Albert', 'Morinville', 'Legal', 'Bon Accord', 'Gibbons', 'Redwater' ],
      },
      'fort-saskatchewan': {
        name: 'Fort Saskatchewan / Strathcona',
        lat: '53.7128',
        lon: '-113.2133',
        locations: [ 'Fort Saskatchewan', 'Bruderheim', 'Lamont' ],
      },
      'beaumont': {
        name: 'Beaumont / Leduc County',
        lat: '53.3564',
        lon: '-113.4150',
        locations: [ 'Beaumont', 'New Sarepta' ],
      },
      'leduc': {
        name: 'Leduc / Leduc County',
        lat: '53.2594',
        lon: '-113.5492',
        locations: [ 'Leduc', 'Nisku', 'Devon', 'Calmar', 'Thorsby', 'Millet', 'Edmonton International Airport' ],
      },
      'spruce-grove': {
        name: 'Spruce Grove / Parkland',
        lat: '53.5450',
        lon: '-113.9009',
        locations: [ 'Spruce Grove', 'Parkland County', 'Wabamun' ],
      },
      'stony-plain': {
        name: 'Stony Plain / Parkland',
        lat: '53.5303',
        lon: '-114.0042',
        locations: [ 'Stony Plain', 'Spring Lake', 'Parkland County' ],
      },
      'red-deer': {
        name: 'Red Deer / Central Alberta',
        lat: '52.2681',
        lon: '-113.8111',
        locations: [ 'Red Deer', 'Blackfalds', 'Lacombe', 'Sylvan Lake', 'Penhold', 'Innisfail', 'Olds', 'Rocky Mountain House' ],
      },
      'lacombe': {
        name: 'Lacombe / Central Alberta',
        lat: '52.4683',
        lon: '-113.7369',
        locations: [ 'Lacombe', 'Blackfalds', 'Bentley', 'Clive', 'Alix', 'Ponoka' ],
      },
      'medicine-hat': {
        name: 'Medicine Hat / Southeast Alberta',
        lat: '50.0417',
        lon: '-110.6775',
        locations: [ 'Medicine Hat', 'Redcliff', 'Dunmore', 'Bow Island', 'Brooks', 'Taber' ],
      },
      'lethbridge': {
        name: 'Lethbridge / Southern Alberta',
        lat: '49.6956',
        lon: '-112.8451',
        locations: [ 'Lethbridge', 'Coaldale', 'Coalhurst', 'Picture Butte', 'Raymond', 'Magrath', 'Cardston', 'Fort Macleod' ],
      },
      'brooks': {
        name: 'Brooks / Newell',
        lat: '50.5642',
        lon: '-111.8980',
        locations: [ 'Brooks', 'Bassano', 'Duchess', 'Rosemary', 'Tilley', 'Medicine Hat' ],
      },
      'grande-prairie': {
        name: 'Grande Prairie / Peace Country',
        lat: '55.1699',
        lon: '-118.7986',
        locations: [ 'Grande Prairie', 'Clairmont', 'Sexsmith', 'Wembley', 'Beaverlodge', 'Hythe', 'Valleyview', 'Peace River' ],
      },
      'peace-river': {
        name: 'Peace River / Northern Alberta',
        lat: '56.2347',
        lon: '-117.2897',
        locations: [ 'Peace River', 'Grimshaw', 'Fairview', 'Manning', 'High Level', 'Falher', 'McLennan' ],
      },
      'fort-mcmurray': {
        name: 'Fort McMurray / Wood Buffalo',
        lat: '56.7264',
        lon: '-111.3803',
        locations: [ 'Fort McMurray', 'Anzac', 'Fort McKay', 'Conklin', 'Janvier', 'Saprae Creek' ],
      },
      'cold-lake': {
        name: 'Cold Lake / Bonnyville',
        lat: '54.4642',
        lon: '-110.1825',
        locations: [ 'Cold Lake', 'Bonnyville', 'Glendon', 'Ardmore', 'Iron River', 'Elk Point', 'St. Paul' ],
      },
      'lloydminster': {
        name: 'Lloydminster / East Central Alberta',
        lat: '53.2844',
        lon: '-110.0062',
        locations: [ 'Lloydminster', 'Vermilion', 'Kitscoty', 'Marwayne', 'Wainwright', 'Provost' ],
      },
      'camrose': {
        name: 'Camrose / East Central Alberta',
        lat: '53.0232',
        lon: '-112.8315',
        locations: [ 'Camrose', 'Wetaskiwin', 'Tofield', 'Viking', 'Killam', 'Sedgewick', 'Daysland' ],
      },
      'wetaskiwin': {
        name: 'Wetaskiwin / Central Alberta',
        lat: '52.9694',
        lon: '-113.3675',
        locations: [ 'Wetaskiwin', 'Millet', 'Maskwacis', 'Ponoka', 'Pigeon Lake' ],
      },
      'drumheller': {
        name: 'Drumheller / Badlands',
        lat: '51.4637',
        lon: '-112.7103',
        locations: [ 'Drumheller', 'Rosedale', 'Morrin', 'Carbon', 'Three Hills', 'Hanna', 'Oyen' ],
      },
      'canmore': {
        name: 'Canmore / Bow Valley',
        lat: '51.0890',
        lon: '-115.3598',
        locations: [ 'Canmore', 'Banff', 'Exshaw', 'Dead Man\'s Flats', 'Kananaskis' ],
      },
      'jasper': {
        name: 'Jasper / Yellowhead',
        lat: '52.8737',
        lon: '-118.0814',
        locations: [ 'Jasper', 'Hinton', 'Edson', 'Grande Cache' ],
      },
      'rocky-mountain-house': {
        name: 'Rocky Mountain House / Clearwater',
        lat: '52.3758',
        lon: '-114.9200',
        locations: [ 'Rocky Mountain House', 'Caroline', 'Eckville', 'Nordegg', 'Sylvan Lake' ],
      },
      'olds': {
        name: 'Olds / Mountain View',
        lat: '51.7925',
        lon: '-114.1067',
        locations: [ 'Olds', 'Didsbury', 'Carstairs', 'Sundre', 'Cremona', 'Crossfield' ],
      },
      'vegreville': {
        name: 'Vegreville / Minburn',
        lat: '53.4981',
        lon: '-112.0544',
        locations: [ 'Vegreville', 'Mundare', 'Two Hills', 'Lamont', 'Viking' ],
      },
    },
  },
  BC: {
    province: 'British Columbia',
    provinceCode: 'BC',
    regions: {
      'vancouver': {
        name: 'Vancouver / Metro Vancouver',
        lat: '49.2827',
        lon: '-123.1207',
        locations: [ 'Vancouver', 'Downtown Vancouver', 'West End', 'Kitsilano', 'East Vancouver', 'South Vancouver', 'Gastown', 'Yaletown', 'Mount Pleasant', 'Point Grey', 'Fairview', 'Kerrisdale' ],
      },
      'surrey': {
        name: 'Surrey / South Fraser',
        lat: '49.1913',
        lon: '-122.8490',
        locations: [ 'Surrey', 'City Centre', 'Guildford', 'Fleetwood', 'Newton', 'Cloverdale', 'South Surrey', 'Whalley' ],
      },
      'white-rock': {
        name: 'White Rock / South Fraser',
        lat: '49.0253',
        lon: '-122.8028',
        locations: [ 'White Rock', 'Ocean Park', 'Crescent Beach' ],
      },
      'langley': {
        name: 'Langley / Fraser Valley',
        lat: '49.1044',
        lon: '-122.6587',
        locations: [ 'Langley', 'Langley City', 'Langley Township', 'Fort Langley', 'Walnut Grove', 'Aldergrove', 'Willoughby', 'Brookswood', 'Murrayville' ],
      },
      'burnaby': {
        name: 'Burnaby / Metro Vancouver',
        lat: '49.2488',
        lon: '-122.9805',
        locations: [ 'Burnaby', 'Metrotown', 'Brentwood', 'Edmonds', 'Lougheed', 'Capitol Hill', 'Deer Lake' ],
      },
      'new-westminster': {
        name: 'New Westminster / Metro Vancouver',
        lat: '49.2057',
        lon: '-122.9110',
        locations: [ 'New Westminster', 'Queensborough', 'Uptown', 'Downtown New Westminster', 'Sapperton', 'West End New West' ],
      },
      'coquitlam': {
        name: 'Coquitlam / Tri-Cities',
        lat: '49.2838',
        lon: '-122.7932',
        locations: [ 'Coquitlam', 'Westwood Plateau', 'Burke Mountain', 'Austin Heights', 'Maillardville' ],
      },
      'port-coquitlam': {
        name: 'Port Coquitlam / Tri-Cities',
        lat: '49.2628',
        lon: '-122.7811',
        locations: [ 'Port Coquitlam', 'Citadel', 'Mary Hill', 'Oxford Heights' ],
      },
      'port-moody': {
        name: 'Port Moody / Tri-Cities',
        lat: '49.2831',
        lon: '-122.8317',
        locations: [ 'Port Moody', 'Newport Village', 'Klahanie', 'Heritage Mountain', 'Belcarra', 'Anmore' ],
      },
      'north-vancouver': {
        name: 'North Vancouver / North Shore',
        lat: '49.3200',
        lon: '-123.0724',
        locations: [ 'North Vancouver', 'Deep Cove', 'Lynn Valley', 'Lonsdale', 'Capilano', 'Seymour' ],
      },
      'west-vancouver': {
        name: 'West Vancouver / North Shore',
        lat: '49.3275',
        lon: '-123.1603',
        locations: [ 'West Vancouver', 'Dundarave', 'Ambleside', 'Horseshoe Bay', 'British Properties', 'Lions Bay', 'Bowen Island' ],
      },
      'richmond': {
        name: 'Richmond / Metro Vancouver',
        lat: '49.1666',
        lon: '-123.1336',
        locations: [ 'Richmond', 'Steveston', 'City Centre', 'Thompson', 'Westcambie', 'Broadmoor', 'Terra Nova' ],
      },
      'delta': {
        name: 'Delta / Metro Vancouver',
        lat: '49.0847',
        lon: '-123.0587',
        locations: [ 'Delta', 'Ladner', 'Tsawwassen', 'North Delta', 'Sunshine Hills' ],
      },
      'maple-ridge': {
        name: 'Maple Ridge / Pitt Meadows',
        lat: '49.2193',
        lon: '-122.5984',
        locations: [ 'Maple Ridge', 'Pitt Meadows', 'Hammond', 'Silver Valley', 'Albion', 'Webster\'s Corners' ],
      },
      'abbotsford': {
        name: 'Abbotsford / Fraser Valley',
        lat: '49.0504',
        lon: '-122.3045',
        locations: [ 'Abbotsford', 'Clearbrook', 'Matsqui', 'Clayburn', 'Sumas Prairie' ],
      },
      'mission': {
        name: 'Mission / Fraser Valley',
        lat: '49.1337',
        lon: '-122.3094',
        locations: [ 'Mission', 'Hatzic', 'Silverdale', 'Stave Falls', 'Steelhead' ],
      },
      'chilliwack': {
        name: 'Chilliwack / Fraser Valley',
        lat: '49.1579',
        lon: '-121.9514',
        locations: [ 'Chilliwack', 'Sardis', 'Vedder Crossing', 'Yarrow', 'Rosedale', 'Agassiz', 'Harrison Hot Springs', 'Hope' ],
      },
      'squamish': {
        name: 'Squamish / Sea to Sky',
        lat: '49.7016',
        lon: '-123.1558',
        locations: [ 'Squamish', 'Britannia Beach', 'Whistler', 'Pemberton' ],
      },
      'whistler': {
        name: 'Whistler / Pemberton',
        lat: '50.1163',
        lon: '-122.9574',
        locations: [ 'Whistler', 'Pemberton', 'Mount Currie', 'Squamish' ],
      },
      'victoria': {
        name: 'Victoria / Greater Victoria',
        lat: '48.4284',
        lon: '-123.3656',
        locations: [ 'Victoria', 'Downtown Victoria', 'Saanich', 'Oak Bay', 'Esquimalt', 'View Royal', 'Langford', 'Colwood', 'Metchosin', 'Sidney' ],
      },
      'langford': {
        name: 'West Shore / Greater Victoria',
        lat: '48.4506',
        lon: '-123.5058',
        locations: [ 'Langford', 'Colwood', 'View Royal', 'Metchosin', 'Highlands', 'Sooke', 'Victoria' ],
      },
      'nanaimo': {
        name: 'Nanaimo / Central Vancouver Island',
        lat: '49.1659',
        lon: '-123.9401',
        locations: [ 'Nanaimo', 'Lantzville', 'Ladysmith', 'Parksville', 'Qualicum Beach', 'Nanoose Bay', 'Gabriola Island' ],
      },
      'duncan': {
        name: 'Duncan / Cowichan Valley',
        lat: '48.7787',
        lon: '-123.7079',
        locations: [ 'Duncan', 'North Cowichan', 'Chemainus', 'Ladysmith', 'Lake Cowichan', 'Cobble Hill', 'Mill Bay', 'Shawnigan Lake' ],
      },
      'comox-valley': {
        name: 'Comox Valley',
        lat: '49.6953',
        lon: '-124.9904',
        locations: [ 'Courtenay', 'Comox', 'Cumberland', 'Royston', 'Black Creek', 'Union Bay' ],
      },
      'campbell-river': {
        name: 'Campbell River / North Island',
        lat: '50.0244',
        lon: '-125.2475',
        locations: [ 'Campbell River', 'Sayward', 'Gold River', 'Port McNeill', 'Port Hardy', 'Alert Bay' ],
      },
      'kelowna': {
        name: 'Kelowna / Central Okanagan',
        lat: '49.8880',
        lon: '-119.4960',
        locations: [ 'Kelowna', 'Downtown Kelowna', 'West Kelowna', 'Lake Country', 'Peachland', 'Winfield' ],
      },
      'vernon': {
        name: 'Vernon / North Okanagan',
        lat: '50.2670',
        lon: '-119.2720',
        locations: [ 'Vernon', 'Coldstream', 'Armstrong', 'Enderby', 'Lumby', 'Lake Country' ],
      },
      'penticton': {
        name: 'Penticton / South Okanagan',
        lat: '49.4991',
        lon: '-119.5937',
        locations: [ 'Penticton', 'Summerland', 'Oliver', 'Osoyoos', 'Keremeos', 'Naramata' ],
      },
      'kamloops': {
        name: 'Kamloops / Thompson',
        lat: '50.6745',
        lon: '-120.3273',
        locations: [ 'Kamloops', 'Barriere', 'Chase', 'Logan Lake', 'Merritt', 'Sun Peaks', 'Cache Creek' ],
      },
      'prince-george': {
        name: 'Prince George / Central BC',
        lat: '53.9171',
        lon: '-122.7497',
        locations: [ 'Prince George', 'Vanderhoof', 'Fort St. James', 'Quesnel', 'Mackenzie' ],
      },
      'quesnel': {
        name: 'Quesnel / Cariboo',
        lat: '52.9784',
        lon: '-122.4930',
        locations: [ 'Quesnel', 'Williams Lake', 'Wells', 'Barkerville', 'Prince George' ],
      },
      'williams-lake': {
        name: 'Williams Lake / Cariboo',
        lat: '52.1417',
        lon: '-122.1417',
        locations: [ 'Williams Lake', '100 Mile House', 'Quesnel', 'Horsefly', 'Likely', 'Lac La Hache' ],
      },
      'fort-st-john': {
        name: 'Fort St. John / Peace River',
        lat: '56.2465',
        lon: '-120.8476',
        locations: [ 'Fort St. John', 'Dawson Creek', 'Taylor', 'Hudson\'s Hope', 'Chetwynd' ],
      },
      'dawson-creek': {
        name: 'Dawson Creek / Peace River',
        lat: '55.7596',
        lon: '-120.2377',
        locations: [ 'Dawson Creek', 'Fort St. John', 'Pouce Coupe', 'Chetwynd', 'Tumbler Ridge' ],
      },
      'terrace': {
        name: 'Terrace / Northwest BC',
        lat: '54.5164',
        lon: '-128.5997',
        locations: [ 'Terrace', 'Kitimat', 'Prince Rupert', 'Hazelton', 'New Hazelton', 'Stewart' ],
      },
      'prince-rupert': {
        name: 'Prince Rupert / North Coast',
        lat: '54.3150',
        lon: '-130.3208',
        locations: [ 'Prince Rupert', 'Port Edward', 'Terrace', 'Kitimat', 'Haida Gwaii' ],
      },
      'cranbrook': {
        name: 'Cranbrook / East Kootenay',
        lat: '49.5128',
        lon: '-115.7694',
        locations: [ 'Cranbrook', 'Kimberley', 'Fernie', 'Sparwood', 'Elkford', 'Creston', 'Invermere' ],
      },
      'nelson': {
        name: 'Nelson / West Kootenay',
        lat: '49.4928',
        lon: '-117.2948',
        locations: [ 'Nelson', 'Castlegar', 'Trail', 'Rossland', 'Salmo', 'Kaslo', 'Nakusp' ],
      },
      'revelstoke': {
        name: 'Revelstoke / Columbia-Shuswap',
        lat: '51.0000',
        lon: '-118.1957',
        locations: [ 'Revelstoke', 'Golden', 'Sicamous', 'Salmon Arm', 'Enderby' ],
      },
      'salmon-arm': {
        name: 'Salmon Arm / Shuswap',
        lat: '50.7022',
        lon: '-119.2722',
        locations: [ 'Salmon Arm', 'Sicamous', 'Enderby', 'Armstrong', 'Sorrento', 'Blind Bay' ],
      },
    },
  },
  MB: {
    province: 'Manitoba',
    provinceCode: 'MB',
    regions: {
      'winnipeg': {
        name: 'Winnipeg / Greater Winnipeg',
        lat: '49.8951',
        lon: '-97.1384',
        locations: [ 'Winnipeg', 'Downtown Winnipeg', 'St. Boniface', 'St. Vital', 'Transcona', 'Charleswood', 'River Heights', 'St. James', 'North Kildonan', 'Fort Garry', 'East Kildonan', 'West Kildonan', 'Headingley', 'East St. Paul', 'West St. Paul' ],
      },
      'steinbach': {
        name: 'Steinbach / Southeast Manitoba',
        lat: '49.5258',
        lon: '-96.6839',
        locations: [ 'Steinbach', 'Blumenort', 'Mitchell', 'Niverville', 'Grunthal', 'Kleefeld', 'La Broquerie', 'Landmark', 'St. Pierre-Jolys' ],
      },
      'brandon': {
        name: 'Brandon / Westman',
        lat: '49.8485',
        lon: '-99.9501',
        locations: [ 'Brandon', 'Shilo', 'Souris', 'Rivers', 'Carberry', 'Minnedosa', 'Neepawa', 'Virden' ],
      },
      'portage-la-prairie': {
        name: 'Portage la Prairie / Central Plains',
        lat: '49.9728',
        lon: '-98.2919',
        locations: [ 'Portage la Prairie', 'Oakville', 'MacGregor', 'Elie', 'St. Claude', 'Gladstone' ],
      },
      'selkirk': {
        name: 'Selkirk / Interlake',
        lat: '50.1436',
        lon: '-96.8844',
        locations: [ 'Selkirk', 'St. Andrews', 'St. Clements', 'Lockport', 'Stonewall', 'Teulon', 'Gimli', 'Winnipeg Beach' ],
      },
      'winkler-morden': {
        name: 'Winkler / Morden / Pembina Valley',
        lat: '49.1817',
        lon: '-97.9406',
        locations: [ 'Winkler', 'Morden', 'Altona', 'Carman', 'Morris', 'Manitou', 'Plum Coulee', 'Gretna' ],
      },
      'dauphin': {
        name: 'Dauphin / Parkland',
        lat: '51.1494',
        lon: '-100.0503',
        locations: [ 'Dauphin', 'Gilbert Plains', 'Grandview', 'Roblin', 'Ste. Rose du Lac', 'Winnipegosis', 'Russell' ],
      },
      'thompson': {
        name: 'Thompson / Northern Manitoba',
        lat: '55.7435',
        lon: '-97.8558',
        locations: [ 'Thompson', 'Gillam', 'Leaf Rapids', 'Lynn Lake', 'Snow Lake' ],
      },
      'the-pas': {
        name: 'The Pas / Northern Manitoba',
        lat: '53.8250',
        lon: '-101.2542',
        locations: [ 'The Pas', 'Opaskwayak', 'Flin Flon', 'Cranberry Portage' ],
      },
      'flin-flon': {
        name: 'Flin Flon / Northwest Manitoba',
        lat: '54.7667',
        lon: '-101.8667',
        locations: [ 'Flin Flon', 'Cranberry Portage', 'Snow Lake', 'The Pas' ],
      },
      'swan-river': {
        name: 'Swan River / Parkland',
        lat: '52.1058',
        lon: '-101.2675',
        locations: [ 'Swan River', 'Minitonas', 'Benito', 'Bowsman', 'Roblin' ],
      },
      'neepawa': {
        name: 'Neepawa / Yellowhead',
        lat: '50.2289',
        lon: '-99.4658',
        locations: [ 'Neepawa', 'Minnedosa', 'Gladstone', 'Carberry', 'Rivers' ],
      },
      'virden': {
        name: 'Virden / Southwest Manitoba',
        lat: '49.8514',
        lon: '-100.9328',
        locations: [ 'Virden', 'Oak Lake', 'Elkhorn', 'Reston', 'Melita', 'Deloraine', 'Boissevain' ],
      },
      'gimli': {
        name: 'Gimli / Interlake',
        lat: '50.6331',
        lon: '-96.9908',
        locations: [ 'Gimli', 'Winnipeg Beach', 'Arborg', 'Riverton', 'Teulon', 'Stonewall' ],
      },
      'beausejour': {
        name: 'Beausejour / Eastman',
        lat: '50.0617',
        lon: '-96.5169',
        locations: [ 'Beausejour', 'Oakbank', 'Dugald', 'Anola', 'Lac du Bonnet', 'Pinawa', 'Powerview-Pine Falls' ],
      },
    },
  },
  NB: {
    province: 'New Brunswick',
    provinceCode: 'NB',
    regions: {
      'moncton': {
        name: 'Moncton / Greater Moncton',
        lat: '46.0878',
        lon: '-64.7782',
        locations: [ 'Moncton', 'Downtown Moncton', 'Dieppe', 'Riverview', 'Salisbury', 'Shediac', 'Cap-Pelé', 'Memramcook', 'Hillsborough', 'Petitcodiac' ],
      },
      'saint-john': {
        name: 'Saint John / Greater Saint John',
        lat: '45.2733',
        lon: '-66.0633',
        locations: [ 'Saint John', 'Uptown Saint John', 'Rothesay', 'Quispamsis', 'Grand Bay-Westfield', 'Hampton', 'St. Martins', 'Sussex' ],
      },
      'fredericton': {
        name: 'Fredericton / Capital Region',
        lat: '45.9636',
        lon: '-66.6431',
        locations: [ 'Fredericton', 'Downtown Fredericton', 'Oromocto', 'New Maryland', 'Hanwell', 'Lincoln', 'Burton', 'Stanley', 'Minto', 'Chipman' ],
      },
      'miramichi': {
        name: 'Miramichi / Northumberland',
        lat: '47.0275',
        lon: '-65.4678',
        locations: [ 'Miramichi', 'Newcastle', 'Chatham', 'Douglastown', 'Blackville', 'Neguac', 'Rogersville', 'Doaktown' ],
      },
      'bathurst': {
        name: 'Bathurst / Chaleur Region',
        lat: '47.6186',
        lon: '-65.6514',
        locations: [ 'Bathurst', 'Beresford', 'Nigadoo', 'Petit-Rocher', 'Pointe-Verte', 'Belledune', 'Caraquet' ],
      },
      'campbellton': {
        name: 'Campbellton / Restigouche',
        lat: '48.0075',
        lon: '-66.6728',
        locations: [ 'Campbellton', 'Dalhousie', 'Atholville', 'Tide Head', 'Balmoral', 'Charlo', 'Eel River Crossing' ],
      },
      'edmundston': {
        name: 'Edmundston / Madawaska',
        lat: '47.3765',
        lon: '-68.3253',
        locations: [ 'Edmundston', 'Saint-Basile', 'Saint-Jacques', 'Clair', 'Saint-François-de-Madawaska', 'Grand Falls', 'Saint-Léonard' ],
      },
      'grand-falls': {
        name: 'Grand Falls / Northwest New Brunswick',
        lat: '47.0494',
        lon: '-67.7386',
        locations: [ 'Grand Falls', 'Saint-Léonard', 'Perth-Andover', 'Plaster Rock', 'Aroostook', 'Drummond' ],
      },
      'woodstock': {
        name: 'Woodstock / Carleton County',
        lat: '46.1500',
        lon: '-67.5833',
        locations: [ 'Woodstock', 'Hartland', 'Florenceville-Bristol', 'Centreville', 'Canterbury', 'Nackawic', 'Meductic' ],
      },
      'st-stephen': {
        name: 'St. Stephen / Charlotte County',
        lat: '45.1925',
        lon: '-67.2764',
        locations: [ 'St. Stephen', 'St. Andrews', 'Blacks Harbour', 'Grand Manan', 'McAdam', 'Harvey' ],
      },
      'sussex': {
        name: 'Sussex / Kings County',
        lat: '45.7225',
        lon: '-65.5133',
        locations: [ 'Sussex', 'Sussex Corner', 'Hampton', 'Norton', 'Apohaqui', 'Petitcodiac' ],
      },
      'shediac': {
        name: 'Shediac / Southeast New Brunswick',
        lat: '46.2167',
        lon: '-64.5333',
        locations: [ 'Shediac', 'Cap-Pelé', 'Beaubassin East', 'Memramcook', 'Bouctouche', 'Cocagne', 'Richibucto' ],
      },
      'caraquet': {
        name: 'Caraquet / Acadian Peninsula',
        lat: '47.7950',
        lon: '-64.9392',
        locations: [ 'Caraquet', 'Shippagan', 'Tracadie', 'Lamèque', 'Bas-Caraquet', 'Bertrand', 'Paquetville' ],
      },
      'bouctouche': {
        name: 'Bouctouche / Kent County',
        lat: '46.4833',
        lon: '-64.7167',
        locations: [ 'Bouctouche', 'Richibucto', 'Rexton', 'Saint-Antoine', 'Cocagne', 'Rogersville' ],
      },
    },
  },
  NL: {
    province: 'Newfoundland and Labrador',
    provinceCode: 'NL',
    regions: {
      'st-johns': {
        name: 'St. John\'s / Northeast Avalon',
        lat: '47.5615',
        lon: '-52.7126',
        locations: [ 'St. John\'s', 'Downtown St. John\'s', 'Mount Pearl', 'Paradise', 'Torbay', 'Portugal Cove-St. Philip\'s', 'Logy Bay-Middle Cove-Outer Cove', 'Pouch Cove', 'Flatrock', 'Bauline' ],
      },
      'conception-bay-south': {
        name: 'Conception Bay South / Avalon',
        lat: '47.5167',
        lon: '-52.9833',
        locations: [ 'Conception Bay South', 'Foxtrap', 'Kelligrews', 'Manuels', 'Topsail', 'Paradise', 'Holyrood', 'Avondale' ],
      },
      'mount-pearl': {
        name: 'Mount Pearl / Paradise',
        lat: '47.5189',
        lon: '-52.7844',
        locations: [ 'Mount Pearl', 'Paradise', 'St. John\'s', 'Conception Bay South', 'Goulds', 'Petty Harbour-Maddox Cove' ],
      },
      'bay-roberts': {
        name: 'Bay Roberts / Conception Bay North',
        lat: '47.5969',
        lon: '-53.2625',
        locations: [ 'Bay Roberts', 'Carbonear', 'Harbour Grace', 'Spaniard\'s Bay', 'Clarke\'s Beach', 'North River', 'Cupids', 'Brigus', 'Victoria' ],
      },
      'clarenville': {
        name: 'Clarenville / Eastern Newfoundland',
        lat: '48.1561',
        lon: '-53.9639',
        locations: [ 'Clarenville', 'Arnold\'s Cove', 'Come By Chance', 'Sunnyside', 'Musgravetown', 'Port Blandford', 'Trinity', 'Bonavista' ],
      },
      'bonavista': {
        name: 'Bonavista / Discovery Region',
        lat: '48.6500',
        lon: '-53.1167',
        locations: [ 'Bonavista', 'Trinity', 'Port Rexton', 'Catalina', 'Elliston', 'King\'s Cove', 'Clarenville' ],
      },
      'marystown': {
        name: 'Marystown / Burin Peninsula',
        lat: '47.1667',
        lon: '-55.1500',
        locations: [ 'Marystown', 'Burin', 'Grand Bank', 'Fortune', 'Lawn', 'St. Lawrence', 'Lamaline', 'Lewin\'s Cove' ],
      },
      'gander': {
        name: 'Gander / Central Newfoundland',
        lat: '48.9569',
        lon: '-54.6089',
        locations: [ 'Gander', 'Appleton', 'Glenwood', 'Gambo', 'Hare Bay', 'Dover', 'Eastport', 'Musgrave Harbour' ],
      },
      'grand-falls-windsor': {
        name: 'Grand Falls-Windsor / Central Newfoundland',
        lat: '48.9289',
        lon: '-55.6586',
        locations: [ 'Grand Falls-Windsor', 'Bishop\'s Falls', 'Botwood', 'Badger', 'Buchans', 'Springdale', 'Lewisporte' ],
      },
      'lewisporte': {
        name: 'Lewisporte / Central Newfoundland',
        lat: '49.2500',
        lon: '-55.0500',
        locations: [ 'Lewisporte', 'Embree', 'Norris Arm', 'Campbellton', 'Birchy Bay', 'Summerford', 'Twillingate' ],
      },
      'corner-brook': {
        name: 'Corner Brook / Western Newfoundland',
        lat: '48.9500',
        lon: '-57.9500',
        locations: [ 'Corner Brook', 'Massey Drive', 'Steady Brook', 'Pasadena', 'Humber Valley', 'Lark Harbour', 'York Harbour' ],
      },
      'deer-lake': {
        name: 'Deer Lake / Humber Valley',
        lat: '49.1728',
        lon: '-57.4339',
        locations: [ 'Deer Lake', 'Reidville', 'Cormack', 'Pasadena', 'Rocky Harbour', 'Hampden', 'Howley' ],
      },
      'stephenville': {
        name: 'Stephenville / Bay St. George',
        lat: '48.5500',
        lon: '-58.5833',
        locations: [ 'Stephenville', 'Kippens', 'Port au Port West-Aguathuna-Felix Cove', 'Lourdes', 'St. George\'s', 'Stephenville Crossing' ],
      },
      'port-aux-basques': {
        name: 'Channel-Port aux Basques / Southwest Coast',
        lat: '47.5728',
        lon: '-59.1367',
        locations: [ 'Channel-Port aux Basques', 'Cape Ray', 'Isle aux Morts', 'Rose Blanche-Harbour le Cou', 'Burnt Islands' ],
      },
      'baie-verte': {
        name: 'Baie Verte / Green Bay',
        lat: '49.9333',
        lon: '-56.1833',
        locations: [ 'Baie Verte', 'Springdale', 'King\'s Point', 'La Scie', 'Burlington', 'Middle Arm', 'Ming\'s Bight' ],
      },
      'twillingate': {
        name: 'Twillingate / Notre Dame Bay',
        lat: '49.6500',
        lon: '-54.7667',
        locations: [ 'Twillingate', 'Summerford', 'New World Island', 'Lewisporte', 'Fogo Island', 'Change Islands' ],
      },
      'fogo-island': {
        name: 'Fogo Island / Central Coast',
        lat: '49.6667',
        lon: '-54.1833',
        locations: [ 'Fogo Island', 'Joe Batt\'s Arm', 'Tilting', 'Seldom', 'Fogo', 'Change Islands', 'Twillingate' ],
      },
      'st-anthony': {
        name: 'St. Anthony / Great Northern Peninsula',
        lat: '51.3750',
        lon: '-55.6000',
        locations: [ 'St. Anthony', 'St. Lunaire-Griquet', 'Raleigh', 'Goose Cove East', 'Main Brook', 'Roddickton-Bide Arm', 'Englee' ],
      },
      'labrador-city': {
        name: 'Labrador City / Wabush',
        lat: '52.9467',
        lon: '-66.9114',
        locations: [ 'Labrador City', 'Wabush', 'Churchill Falls' ],
      },
      'happy-valley-goose-bay': {
        name: 'Happy Valley-Goose Bay / Central Labrador',
        lat: '53.3017',
        lon: '-60.3261',
        locations: [ 'Happy Valley-Goose Bay', 'North West River', 'Sheshatshiu', 'Mud Lake', 'Churchill Falls' ],
      },
      'labrador-straits': {
        name: 'Labrador Straits',
        lat: '51.4833',
        lon: '-57.0667',
        locations: [ 'L\'Anse au Clair', 'Forteau', 'L\'Anse au Loup', 'Pinware', 'West St. Modeste', 'Red Bay' ],
      },
      'nunatsiavut': {
        name: 'Nunatsiavut / Northern Labrador',
        lat: '56.5417',
        lon: '-61.6917',
        locations: [ 'Nain', 'Hopedale', 'Makkovik', 'Postville', 'Rigolet' ],
      },
    },
  },
  NS: {
    province: 'Nova Scotia',
    provinceCode: 'NS',
    regions: {
      'halifax': {
        name: 'Halifax / HRM',
        lat: '44.6488',
        lon: '-63.5752',
        locations: [ 'Halifax', 'Downtown Halifax', 'Dartmouth', 'Bedford', 'Sackville', 'Clayton Park', 'Fairview', 'Spryfield', 'Cole Harbour', 'Eastern Passage', 'Timberlea', 'Tantallon', 'Fall River', 'Enfield' ],
      },
      'dartmouth': {
        name: 'Dartmouth / Cole Harbour',
        lat: '44.6658',
        lon: '-63.5678',
        locations: [ 'Dartmouth', 'Downtown Dartmouth', 'Cole Harbour', 'Eastern Passage', 'Woodside', 'Burnside', 'Westphal', 'Lawrencetown' ],
      },
      'bedford': {
        name: 'Bedford / Sackville',
        lat: '44.7333',
        lon: '-63.6667',
        locations: [ 'Bedford', 'Lower Sackville', 'Middle Sackville', 'Upper Sackville', 'Hammonds Plains', 'Lucasville', 'Fall River' ],
      },
      'truro': {
        name: 'Truro / Colchester County',
        lat: '45.3647',
        lon: '-63.2806',
        locations: [ 'Truro', 'Bible Hill', 'Valley', 'Brookfield', 'Stewiacke', 'Tatamagouche', 'Great Village' ],
      },
      'new-glasgow': {
        name: 'New Glasgow / Pictou County',
        lat: '45.5878',
        lon: '-62.6464',
        locations: [ 'New Glasgow', 'Stellarton', 'Westville', 'Trenton', 'Pictou', 'Scotsburn', 'Thorburn' ],
      },
      'antigonish': {
        name: 'Antigonish / Northeastern Nova Scotia',
        lat: '45.6264',
        lon: '-61.9917',
        locations: [ 'Antigonish', 'Guysborough', 'Port Hawkesbury', 'St. Andrews', 'Havre Boucher' ],
      },
      'sydney': {
        name: 'Cape Breton / Sydney',
        lat: '46.1368',
        lon: '-60.1831',
        locations: [ 'Sydney', 'Sydney River', 'North Sydney', 'Glace Bay', 'New Waterford', 'Dominion', 'Reserve Mines', 'Membertou', 'Louisbourg' ],
      },
      'port-hawkesbury': {
        name: 'Cape Breton / Port Hawkesbury',
        lat: '45.6167',
        lon: '-61.3500',
        locations: [ 'Port Hawkesbury', 'Port Hastings', 'Inverness', 'Mabou', 'Whycocomagh', 'St. Peter\'s', 'Arichat' ],
      },
      'amherst': {
        name: 'Amherst / Cumberland County',
        lat: '45.8333',
        lon: '-64.2167',
        locations: [ 'Amherst', 'Oxford', 'Springhill', 'Parrsboro', 'Pugwash', 'River Hebert' ],
      },
      'kentville': {
        name: 'Kentville / Annapolis Valley',
        lat: '45.0778',
        lon: '-64.4958',
        locations: [ 'Kentville', 'New Minas', 'Wolfville', 'Port Williams', 'Canning', 'Coldbrook', 'Berwick' ],
      },
      'windsor': {
        name: 'Windsor / West Hants',
        lat: '44.9878',
        lon: '-64.1333',
        locations: [ 'Windsor', 'Hantsport', 'Falmouth', 'Brooklyn', 'Mount Uniacke', 'Three Mile Plains' ],
      },
      'middleton': {
        name: 'Middleton / Annapolis Valley',
        lat: '44.9431',
        lon: '-65.0694',
        locations: [ 'Middleton', 'Greenwood', 'Kingston', 'Aylesford', 'Bridgetown', 'Annapolis Royal', 'Lawrencetown' ],
      },
      'bridgewater': {
        name: 'Bridgewater / South Shore',
        lat: '44.3778',
        lon: '-64.5186',
        locations: [ 'Bridgewater', 'Lunenburg', 'Mahone Bay', 'Chester', 'Liverpool', 'New Germany', 'Hubbards' ],
      },
      'yarmouth': {
        name: 'Yarmouth / Southwest Nova Scotia',
        lat: '43.8375',
        lon: '-66.1175',
        locations: [ 'Yarmouth', 'Tusket', 'Wedgeport', 'Pubnico', 'Barrington', 'Clark\'s Harbour', 'Shelburne' ],
      },
      'digby': {
        name: 'Digby / Western Nova Scotia',
        lat: '44.6208',
        lon: '-65.7583',
        locations: [ 'Digby', 'Weymouth', 'Clare', 'Meteghan', 'Bear River', 'Annapolis Royal' ],
      },
    },
  },
  ON: {
    province: 'Ontario',
    provinceCode: 'ON',
    regions: {
      'toronto': {
        name: 'Toronto / GTA',
        lat: '43.6532',
        lon: '-79.3832',
        locations: [ 'Toronto', 'Downtown Toronto', 'North York', 'Scarborough', 'Etobicoke', 'York', 'East York', 'Old Toronto', 'Midtown Toronto', 'East End Toronto', 'West End Toronto' ],
      },
      'mississauga': {
        name: 'Mississauga / Peel',
        lat: '43.5890',
        lon: '-79.6441',
        locations: [ 'Mississauga', 'Port Credit', 'Streetsville', 'Meadowvale', 'Cooksville', 'Malton', 'Clarkson', 'Erindale', 'Lorne Park', 'Erin Mills', 'Churchill Meadows', 'Mineola' ],
      },
      'brampton': {
        name: 'Brampton / Peel',
        lat: '43.7315',
        lon: '-79.7624',
        locations: [ 'Brampton', 'Bramalea', 'Mount Pleasant', 'Springdale', 'Heart Lake', 'Castlemore', "Fletcher's Meadow", 'Goreway' ],
      },
      'caledon': {
        name: 'Caledon / Peel',
        lat: '43.8687',
        lon: '-79.9996',
        locations: [ 'Caledon', 'Bolton', 'Caledon East', 'Inglewood', 'Belfountain', 'Alton', 'Cheltenham' ],
      },
      'oakville': {
        name: 'Oakville / Halton',
        lat: '43.4675',
        lon: '-79.6877',
        locations: [ 'Oakville', 'Bronte', 'Kerr Village', 'Glen Abbey', 'River Oaks', 'Falgarwood', 'West Oak Trails' ],
      },
      'burlington': {
        name: 'Burlington / Halton',
        lat: '43.3255',
        lon: '-79.7990',
        locations: [ 'Burlington', 'Aldershot', 'Tyandaga', 'Millcroft', 'Roseland', 'Alton Village' ],
      },
      'milton': {
        name: 'Milton / Halton',
        lat: '43.5183',
        lon: '-79.8774',
        locations: [ 'Milton', 'Old Milton', 'Campbellville', 'Brookville', 'Moffat' ],
      },
      'halton-hills': {
        name: 'Halton Hills / Halton',
        lat: '43.6300',
        lon: '-79.9500',
        locations: [ 'Halton Hills', 'Georgetown', 'Acton', 'Glen Williams', 'Norval' ],
      },
      'vaughan': {
        name: 'Vaughan / York Region',
        lat: '43.8372',
        lon: '-79.5083',
        locations: [ 'Vaughan', 'Woodbridge', 'Maple', 'Concord', 'Kleinburg', 'Thornhill' ],
      },
      'markham': {
        name: 'Markham / York Region',
        lat: '43.8561',
        lon: '-79.3370',
        locations: [ 'Markham', 'Unionville', 'Milliken', 'Cornell', 'Box Grove', 'Wismer' ],
      },
      'richmond-hill': {
        name: 'Richmond Hill / York Region',
        lat: '43.8828',
        lon: '-79.4403',
        locations: [ 'Richmond Hill', 'Oak Ridges', 'Jefferson', 'Langstaff' ],
      },
      'newmarket': {
        name: 'Newmarket / York Region',
        lat: '44.0592',
        lon: '-79.4613',
        locations: [ 'Newmarket', 'Glenway', 'Stonehaven', 'Armitage' ],
      },
      'aurora': {
        name: 'Aurora / York Region',
        lat: '44.0001',
        lon: '-79.4663',
        locations: [ 'Aurora', 'Aurora Grove', 'Aurora Highlands' ],
      },
      'king': {
        name: 'King / York Region',
        lat: '43.9300',
        lon: '-79.5500',
        locations: [ 'King City', 'Nobleton', 'Schomberg', 'Pottageville' ],
      },
      'whitchurch-stouffville': {
        name: 'Whitchurch-Stouffville / York Region',
        lat: '43.9700',
        lon: '-79.2500',
        locations: [ 'Stouffville', 'Whitchurch-Stouffville', 'Ballantrae', 'Gormley' ],
      },
      'georgina': {
        name: 'Georgina / York Region',
        lat: '44.3000',
        lon: '-79.4300',
        locations: [ 'Georgina', 'Keswick', 'Sutton', 'Jackson\'s Point', 'Pefferlaw' ],
      },
      'pickering': {
        name: 'Pickering / Durham Region',
        lat: '43.8384',
        lon: '-79.0868',
        locations: [ 'Pickering', 'Rouge Hill', 'Liverpool', 'Dunbarton', 'Amberlea', 'Bay Ridges' ],
      },
      'ajax': {
        name: 'Ajax / Durham Region',
        lat: '43.8509',
        lon: '-79.0204',
        locations: [ 'Ajax', 'Pickering Village', 'Southwood', 'Discovery Bay' ],
      },
      'whitby': {
        name: 'Whitby / Durham Region',
        lat: '43.8975',
        lon: '-78.9429',
        locations: [ 'Whitby', 'Brooklin', 'Port Whitby', 'Taunton' ],
      },
      'oshawa': {
        name: 'Oshawa / Durham Region',
        lat: '43.8971',
        lon: '-78.8658',
        locations: [ 'Oshawa', 'Downtown Oshawa', 'Kedron', 'Windfields', 'Samac', 'Lakeview' ],
      },
      'clarington': {
        name: 'Clarington / Durham Region',
        lat: '43.9100',
        lon: '-78.6800',
        locations: [ 'Bowmanville', 'Courtice', 'Newcastle', 'Orono' ],
      },
      'hamilton': {
        name: 'Hamilton / Greater Hamilton',
        lat: '43.2557',
        lon: '-79.8711',
        locations: [ 'Hamilton', 'Downtown Hamilton', 'Ancaster', 'Dundas', 'Stoney Creek', 'Waterdown', 'Mount Hope', 'Binbrook', 'Flamborough' ],
      },
      'niagara': {
        name: 'Niagara Region',
        lat: '43.0896',
        lon: '-79.0849',
        locations: [ 'Niagara Falls', 'St. Catharines', 'Welland', 'Thorold', 'Fort Erie', 'Port Colborne', 'Niagara-on-the-Lake', 'Grimsby', 'Lincoln', 'Pelham' ],
      },
      'ottawa': {
        name: 'Ottawa / Eastern Ontario',
        lat: '45.4215',
        lon: '-75.6972',
        locations: [ 'Ottawa', 'Downtown Ottawa', 'Kanata', 'Nepean', 'Orleans', 'Barrhaven', 'Gloucester', 'Stittsville', 'ByWard Market', 'Centretown', 'The Glebe', 'Westboro', 'Rockland', 'Casselman', 'Embrun', 'Carleton Place', 'Arnprior' ],
      },
      'kingston': {
        name: 'Kingston / Eastern Ontario',
        lat: '44.2312',
        lon: '-76.4860',
        locations: [ 'Kingston', 'Gananoque', 'Napanee', 'Amherstview', 'Sydenham', 'Brockville', 'Belleville', 'Trenton', 'Picton' ],
      },
      'peterborough': {
        name: 'Peterborough / Kawarthas',
        lat: '44.3091',
        lon: '-78.3197',
        locations: [ 'Peterborough', 'Lakefield', 'Bridgenorth', 'Norwood', 'Havelock', 'Lindsay', 'Bobcaygeon', 'Fenelon Falls', 'Cobourg', 'Port Hope' ],
      },
      'barrie': {
        name: 'Barrie / Simcoe County',
        lat: '44.3894',
        lon: '-79.6903',
        locations: [ 'Barrie', 'Innisfil', 'Bradford', 'Alliston', 'Angus', 'Orillia', 'Wasaga Beach', 'Collingwood', 'Midland', 'Penetanguishene' ],
      },
      'kitchener-waterloo': {
        name: 'Kitchener-Waterloo / Cambridge',
        lat: '43.4516',
        lon: '-80.4925',
        locations: [ 'Kitchener', 'Waterloo', 'Cambridge', 'Guelph', 'Elmira', 'New Hamburg', 'Wellesley', 'Fergus', 'Elora' ],
      },
      'london': {
        name: 'London / Southwestern Ontario',
        lat: '42.9849',
        lon: '-81.2453',
        locations: [ 'London', 'St. Thomas', 'Strathroy', 'Komoka', 'Dorchester', 'Woodstock', 'Ingersoll', 'Tillsonburg', 'Aylmer' ],
      },
      'windsor': {
        name: 'Windsor / Essex County',
        lat: '42.3149',
        lon: '-83.0364',
        locations: [ 'Windsor', 'Tecumseh', 'LaSalle', 'Amherstburg', 'Essex', 'Leamington', 'Kingsville', 'Lakeshore' ],
      },
      'chatham-kent': {
        name: 'Chatham-Kent / Sarnia',
        lat: '42.4048',
        lon: '-82.1910',
        locations: [ 'Chatham', 'Wallaceburg', 'Tilbury', 'Blenheim', 'Dresden', 'Sarnia', 'Petrolia', 'Point Edward', 'Corunna' ],
      },
      'brantford': {
        name: 'Brantford / Brant County',
        lat: '43.1394',
        lon: '-80.2644',
        locations: [ 'Brantford', 'Paris', 'St. George', 'Burford', 'Simcoe', 'Delhi', 'Caledonia' ],
      },
      'sudbury': {
        name: 'Sudbury / Northern Ontario',
        lat: '46.4900',
        lon: '-80.9900',
        locations: [ 'Greater Sudbury', 'Sudbury', 'Chelmsford', 'Val Caron', 'Hanmer', 'Lively', 'Espanola', 'North Bay', 'Sturgeon Falls' ],
      },
      'north-bay': {
        name: 'North Bay / Nipissing',
        lat: '46.3091',
        lon: '-79.4608',
        locations: [ 'North Bay', 'Callander', 'Sturgeon Falls', 'Mattawa', 'Temagami' ],
      },
      'sault-ste-marie': {
        name: 'Sault Ste. Marie / Algoma',
        lat: '46.5136',
        lon: '-84.3358',
        locations: [ 'Sault Ste. Marie', 'Echo Bay', 'Bruce Mines', 'Thessalon', 'Blind River', 'Elliot Lake' ],
      },
      'thunder-bay': {
        name: 'Thunder Bay / Northwestern Ontario',
        lat: '48.3809',
        lon: '-89.2477',
        locations: [ 'Thunder Bay', 'Fort William', 'Port Arthur', 'Nipigon', 'Marathon', 'Dryden', 'Kenora', 'Fort Frances' ],
      },
    },
  },
  PE: {
    province: 'Prince Edward Island',
    provinceCode: 'PE',
    regions: {
      'charlottetown': {
        name: 'Charlottetown / Greater Charlottetown',
        lat: '46.2382',
        lon: '-63.1311',
        locations: [ 'Charlottetown', 'Downtown Charlottetown', 'Brighton', 'Spring Park', 'Parkdale', 'Sherwood', 'East Royalty', 'West Royalty', 'Winsloe', 'Stratford', 'Cornwall' ],
      },
      'stratford': {
        name: 'Stratford / East Queens',
        lat: '46.2167',
        lon: '-63.0833',
        locations: [ 'Stratford', 'Southport', 'Bunbury', 'Keppoch', 'Tea Hill', 'Alexandra', 'Hazelbrook', 'Charlottetown' ],
      },
      'cornwall': {
        name: 'Cornwall / West Queens',
        lat: '46.2333',
        lon: '-63.2167',
        locations: [ 'Cornwall', 'North River', 'Clyde River', 'Kingston', 'Warren Grove', 'Hampshire', 'Meadowbank', 'Charlottetown' ],
      },
      'summerside': {
        name: 'Summerside / Prince County',
        lat: '46.3958',
        lon: '-63.7889',
        locations: [ 'Summerside', 'Sherbrooke', 'Linkletter', 'Miscouche', 'Kensington', 'Bedeque and Area', 'Central Prince' ],
      },
      'kensington': {
        name: 'Kensington / Central Prince',
        lat: '46.4333',
        lon: '-63.6333',
        locations: [ 'Kensington', 'New London', 'Malpeque Bay', 'Breadalbane', 'Kinkora', 'Bedeque and Area', 'Summerside' ],
      },
      'alberton': {
        name: 'Alberton / West Prince',
        lat: '46.8167',
        lon: '-64.0667',
        locations: [ 'Alberton', 'Tignish', 'Tignish Shore', 'O\'Leary', 'Miminegash', 'St. Felix', 'Greenmount-Montrose', 'Northport' ],
      },
      'oleary': {
        name: 'O\'Leary / West Prince',
        lat: '46.7000',
        lon: '-64.2333',
        locations: [ 'O\'Leary', 'Alberton', 'Tignish', 'Miminegash', 'St. Felix', 'Central Prince', 'Lot 11 and Area' ],
      },
      'borden-carleton': {
        name: 'Borden-Carleton / South Shore',
        lat: '46.2500',
        lon: '-63.6833',
        locations: [ 'Borden-Carleton', 'Crapaud', 'Victoria', 'Kinkora', 'Bedeque and Area', 'Central Prince' ],
      },
      'north-rustico': {
        name: 'North Rustico / North Shore',
        lat: '46.4500',
        lon: '-63.3167',
        locations: [ 'North Rustico', 'North Shore', 'Hunter River', 'Brackley', 'Miltonvale Park', 'New London', 'Resort Municipality' ],
      },
      'three-rivers': {
        name: 'Three Rivers / Kings County',
        lat: '46.1667',
        lon: '-62.6500',
        locations: [ 'Three Rivers', 'Montague', 'Georgetown', 'Cardigan', 'Brudenell', 'Valleyfield', 'Belfast', 'Murray River', 'Murray Harbour' ],
      },
      'souris': {
        name: 'Souris / Eastern Kings',
        lat: '46.3500',
        lon: '-62.2500',
        locations: [ 'Souris', 'Souris West', 'Eastern Kings', 'St. Peter\'s Bay', 'Annandale-Little Pond-Howe Bay', 'Morell' ],
      },
      'morell': {
        name: 'Morell / North Kings',
        lat: '46.4167',
        lon: '-62.6833',
        locations: [ 'Morell', 'St. Peter\'s Bay', 'Mount Stewart', 'Central Kings', 'Eastern Kings', 'Souris' ],
      },
    },
  },
  QC: {
    province: 'Quebec',
    provinceCode: 'QC',
    regions: {
      'montreal': {
        name: 'Montreal / Greater Montreal',
        lat: '45.5017',
        lon: '-73.5673',
        locations: [ 'Montreal', 'Downtown Montreal', 'Plateau-Mont-Royal', 'Rosemont-La Petite-Patrie', 'Côte-des-Neiges', 'Notre-Dame-de-Grâce', 'Verdun', 'LaSalle', 'Saint-Laurent', 'Ahuntsic-Cartierville', 'Saint-Léonard', 'Anjou', 'Montreal-Nord', 'Westmount', 'Côte Saint-Luc', 'Mount Royal' ],
      },
      'west-island': {
        name: 'West Island / Montreal',
        lat: '45.4478',
        lon: '-73.8217',
        locations: [ 'Pointe-Claire', 'Dorval', 'Dollard-des-Ormeaux', 'Kirkland', 'Beaconsfield', 'Baie-D\'Urfé', 'Sainte-Anne-de-Bellevue', 'Pierrefonds-Roxboro', 'L\'Île-Bizard-Sainte-Geneviève' ],
      },
      'laval': {
        name: 'Laval',
        lat: '45.6066',
        lon: '-73.7124',
        locations: [ 'Laval', 'Chomedey', 'Sainte-Dorothée', 'Fabreville', 'Sainte-Rose', 'Vimont', 'Auteuil', 'Duvernay', 'Laval-des-Rapides', 'Pont-Viau' ],
      },
      'longueuil': {
        name: 'Longueuil / South Shore',
        lat: '45.5312',
        lon: '-73.5181',
        locations: [ 'Longueuil', 'Saint-Hubert', 'Greenfield Park', 'Brossard', 'Saint-Lambert', 'Boucherville', 'Saint-Bruno-de-Montarville', 'Sainte-Julie', 'Varennes' ],
      },
      'chateauguay': {
        name: 'Châteauguay / South Shore',
        lat: '45.3667',
        lon: '-73.7500',
        locations: [ 'Châteauguay', 'Mercier', 'Léry', 'Beauharnois', 'Saint-Constant', 'Delson', 'Candiac', 'La Prairie', 'Sainte-Catherine' ],
      },
      'terrebonne': {
        name: 'Terrebonne / North Shore',
        lat: '45.6931',
        lon: '-73.6331',
        locations: [ 'Terrebonne', 'Mascouche', 'Repentigny', 'Charlemagne', 'L\'Assomption', 'Lachenaie', 'Le Gardeur' ],
      },
      'blainville': {
        name: 'Blainville / North Shore',
        lat: '45.6667',
        lon: '-73.8833',
        locations: [ 'Blainville', 'Boisbriand', 'Sainte-Thérèse', 'Rosemère', 'Lorraine', 'Mirabel', 'Saint-Eustache', 'Deux-Montagnes', 'Sainte-Marthe-sur-le-Lac' ],
      },
      'saint-jerome': {
        name: 'Saint-Jérôme / Laurentides',
        lat: '45.7833',
        lon: '-74.0000',
        locations: [ 'Saint-Jérôme', 'Prévost', 'Sainte-Sophie', 'Saint-Hippolyte', 'Saint-Sauveur', 'Sainte-Adèle', 'Val-David', 'Sainte-Agathe-des-Monts', 'Mont-Tremblant' ],
      },
      'vaudreuil-dorion': {
        name: 'Vaudreuil-Dorion / Montérégie',
        lat: '45.3975',
        lon: '-74.0306',
        locations: [ 'Vaudreuil-Dorion', 'Pincourt', 'L\'Île-Perrot', 'Notre-Dame-de-l\'Île-Perrot', 'Saint-Lazare', 'Hudson', 'Rigaud' ],
      },
      'quebec-city': {
        name: 'Quebec City / Capitale-Nationale',
        lat: '46.8139',
        lon: '-71.2080',
        locations: [ 'Quebec City', 'Old Quebec', 'Sainte-Foy', 'Sillery', 'Cap-Rouge', 'Charlesbourg', 'Beauport', 'Limoilou', 'L\'Ancienne-Lorette', 'Saint-Augustin-de-Desmaures' ],
      },
      'levis': {
        name: 'Lévis / South Shore Quebec City',
        lat: '46.8000',
        lon: '-71.1833',
        locations: [ 'Lévis', 'Saint-Romuald', 'Charny', 'Saint-Nicolas', 'Saint-Jean-Chrysostome', 'Saint-Henri', 'Beaumont' ],
      },
      'gatineau': {
        name: 'Gatineau / Outaouais',
        lat: '45.4765',
        lon: '-75.7013',
        locations: [ 'Gatineau', 'Hull', 'Aylmer', 'Buckingham', 'Masson-Angers', 'Chelsea', 'Cantley', 'Val-des-Monts', 'Wakefield' ],
      },
      'sherbrooke': {
        name: 'Sherbrooke / Eastern Townships',
        lat: '45.4042',
        lon: '-71.8929',
        locations: [ 'Sherbrooke', 'Lennoxville', 'Rock Forest', 'Magog', 'Orford', 'Coaticook', 'Windsor', 'East Angus' ],
      },
      'granby': {
        name: 'Granby / Eastern Townships',
        lat: '45.4000',
        lon: '-72.7333',
        locations: [ 'Granby', 'Bromont', 'Cowansville', 'Sutton', 'Lac-Brome', 'Waterloo', 'Farnham' ],
      },
      'trois-rivieres': {
        name: 'Trois-Rivières / Mauricie',
        lat: '46.3432',
        lon: '-72.5429',
        locations: [ 'Trois-Rivières', 'Cap-de-la-Madeleine', 'Shawinigan', 'Grand-Mère', 'Louiseville', 'La Tuque' ],
      },
      'drummondville': {
        name: 'Drummondville / Centre-du-Québec',
        lat: '45.8833',
        lon: '-72.4833',
        locations: [ 'Drummondville', 'Victoriaville', 'Warwick', 'Plessisville', 'Princeville', 'Nicolet' ],
      },
      'saint-hyacinthe': {
        name: 'Saint-Hyacinthe / Montérégie',
        lat: '45.6167',
        lon: '-72.9500',
        locations: [ 'Saint-Hyacinthe', 'Beloeil', 'McMasterville', 'Mont-Saint-Hilaire', 'Saint-Basile-le-Grand', 'Acton Vale' ],
      },
      'saint-jean-sur-richelieu': {
        name: 'Saint-Jean-sur-Richelieu / Montérégie',
        lat: '45.3056',
        lon: '-73.2533',
        locations: [ 'Saint-Jean-sur-Richelieu', 'Iberville', 'Chambly', 'Carignan', 'Richelieu', 'Marieville' ],
      },
      'sorel-tracy': {
        name: 'Sorel-Tracy / Montérégie',
        lat: '46.0333',
        lon: '-73.1167',
        locations: [ 'Sorel-Tracy', 'Saint-Joseph-de-Sorel', 'Contrecoeur', 'Verchères' ],
      },
      'salaberry-de-valleyfield': {
        name: 'Salaberry-de-Valleyfield / Montérégie',
        lat: '45.2500',
        lon: '-74.1333',
        locations: [ 'Salaberry-de-Valleyfield', 'Beauharnois', 'Huntingdon', 'Coteau-du-Lac', 'Les Coteaux' ],
      },
      'saguenay': {
        name: 'Saguenay / Lac-Saint-Jean',
        lat: '48.4167',
        lon: '-71.0667',
        locations: [ 'Saguenay', 'Chicoutimi', 'Jonquière', 'La Baie', 'Alma', 'Roberval', 'Saint-Félicien', 'Dolbeau-Mistassini' ],
      },
      'rimouski': {
        name: 'Rimouski / Bas-Saint-Laurent',
        lat: '48.4489',
        lon: '-68.5244',
        locations: [ 'Rimouski', 'Mont-Joli', 'Matane', 'Amqui', 'Trois-Pistoles', 'Rivière-du-Loup', 'La Pocatière' ],
      },
      'gaspe': {
        name: 'Gaspésie',
        lat: '48.8333',
        lon: '-64.4833',
        locations: [ 'Gaspé', 'Percé', 'Chandler', 'New Richmond', 'Bonaventure', 'Carleton-sur-Mer', 'Sainte-Anne-des-Monts' ],
      },
      'cote-nord': {
        name: 'Côte-Nord',
        lat: '49.2167',
        lon: '-68.1500',
        locations: [ 'Baie-Comeau', 'Sept-Îles', 'Port-Cartier', 'Forestville', 'Havre-Saint-Pierre' ],
      },
      'abitibi-temiscamingue': {
        name: 'Abitibi-Témiscamingue',
        lat: '48.2333',
        lon: '-79.0167',
        locations: [ 'Rouyn-Noranda', 'Val-d\'Or', 'Amos', 'La Sarre', 'Malartic', 'Senneterre', 'Ville-Marie' ],
      },
      'chaudiere-appalaches': {
        name: 'Chaudière-Appalaches',
        lat: '46.1167',
        lon: '-70.6667',
        locations: [ 'Saint-Georges', 'Sainte-Marie', 'Thetford Mines', 'Montmagny', 'Saint-Joseph-de-Beauce' ],
      },
      'nord-du-quebec': {
        name: 'Nord-du-Québec',
        lat: '49.9167',
        lon: '-74.3667',
        locations: [ 'Chibougamau', 'Chapais', 'Matagami', 'Lebel-sur-Quévillon' ],
      },
    },
  },
  SK: {
    province: 'Saskatchewan',
    provinceCode: 'SK',
    regions: {
      'saskatoon': {
        name: 'Saskatoon / Central Saskatchewan',
        lat: '52.1332',
        lon: '-106.6700',
        locations: [ 'Saskatoon', 'Downtown Saskatoon', 'Sutherland', 'Stonebridge', 'Brighton', 'Warman', 'Martensville', 'Osler', 'Dalmeny', 'Langham', 'Clavet' ],
      },
      'regina': {
        name: 'Regina / Capital Region',
        lat: '50.4452',
        lon: '-104.6189',
        locations: [ 'Regina', 'Downtown Regina', 'Harbour Landing', 'Wascana', 'White City', 'Emerald Park', 'Pilot Butte', 'Balgonie', 'Lumsden', 'Pense' ],
      },
      'prince-albert': {
        name: 'Prince Albert / North Central',
        lat: '53.2033',
        lon: '-105.7531',
        locations: [ 'Prince Albert', 'Birch Hills', 'Shellbrook', 'Rosthern', 'Wakaw', 'St. Louis', 'Christopher Lake' ],
      },
      'moose-jaw': {
        name: 'Moose Jaw / South Central',
        lat: '50.3933',
        lon: '-105.5344',
        locations: [ 'Moose Jaw', 'Caronport', 'Pense', 'Rouleau', 'Avonlea', 'Central Butte', 'Assiniboia' ],
      },
      'lloydminster': {
        name: 'Lloydminster / West Central',
        lat: '53.2844',
        lon: '-110.0062',
        locations: [ 'Lloydminster', 'Marshall', 'Lashburn', 'Maidstone', 'Waseca', 'Paradise Hill', 'St. Walburg' ],
      },
      'north-battleford': {
        name: 'North Battleford / Battlefords',
        lat: '52.7783',
        lon: '-108.2972',
        locations: [ 'North Battleford', 'Battleford', 'Radisson', 'Borden', 'Wilkie', 'Unity', 'Cut Knife', 'Turtleford' ],
      },
      'yorkton': {
        name: 'Yorkton / East Central',
        lat: '51.2139',
        lon: '-102.4628',
        locations: [ 'Yorkton', 'Melville', 'Canora', 'Springside', 'Saltcoats', 'Churchbridge', 'Esterhazy', 'Kamsack', 'Preeceville' ],
      },
      'swift-current': {
        name: 'Swift Current / Southwest',
        lat: '50.2858',
        lon: '-107.7975',
        locations: [ 'Swift Current', 'Herbert', 'Gull Lake', 'Cabri', 'Shaunavon', 'Maple Creek', 'Leader', 'Ponteix' ],
      },
      'estevan': {
        name: 'Estevan / Southeast',
        lat: '49.1392',
        lon: '-102.9861',
        locations: [ 'Estevan', 'Bienfait', 'Midale', 'Lampman', 'Oxbow', 'Carnduff', 'Alameda', 'Arcola' ],
      },
      'weyburn': {
        name: 'Weyburn / Southeast',
        lat: '49.6639',
        lon: '-103.8536',
        locations: [ 'Weyburn', 'Yellow Grass', 'Milestone', 'Radville', 'Ogema', 'Pangman', 'Bengough' ],
      },
      'humboldt': {
        name: 'Humboldt / Central Saskatchewan',
        lat: '52.2019',
        lon: '-105.1231',
        locations: [ 'Humboldt', 'Muenster', 'Bruno', 'Lanigan', 'Watson', 'Annaheim', 'St. Brieux' ],
      },
      'melfort': {
        name: 'Melfort / Northeast',
        lat: '52.8564',
        lon: '-104.6100',
        locations: [ 'Melfort', 'Tisdale', 'Star City', 'Kinistino', 'Naicam', 'Nipawin', 'Carrot River' ],
      },
      'meadow-lake': {
        name: 'Meadow Lake / Northwest',
        lat: '54.1306',
        lon: '-108.4347',
        locations: [ 'Meadow Lake', 'Dorintosh', 'Green Lake', 'Loon Lake', 'Pierceland', 'Goodsoil', 'St. Walburg' ],
      },
      'nipawin': {
        name: 'Nipawin / Northeast',
        lat: '53.3622',
        lon: '-104.0153',
        locations: [ 'Nipawin', 'Carrot River', 'Choiceland', 'White Fox', 'Codette', 'Arborfield', 'Tisdale' ],
      },
      'kindersley': {
        name: 'Kindersley / West Central',
        lat: '51.4683',
        lon: '-109.1625',
        locations: [ 'Kindersley', 'Rosetown', 'Kerrobert', 'Eston', 'Eatonia', 'Dinsmore', 'Kyle', 'Outlook' ],
      },
      'rosetown': {
        name: 'Rosetown / West Central',
        lat: '51.5544',
        lon: '-108.0069',
        locations: [ 'Rosetown', 'Outlook', 'Biggar', 'Elrose', 'Dinsmore', 'Kyle', 'Zealandia' ],
      },
      'melville': {
        name: 'Melville / East Central',
        lat: '50.9292',
        lon: '-102.8053',
        locations: [ 'Melville', 'Yorkton', 'Lemberg', 'Balcarres', 'Grenfell', 'Fort Qu\'Appelle', 'Indian Head' ],
      },
      'fort-quappelle': {
        name: 'Fort Qu\'Appelle / Qu\'Appelle Valley',
        lat: '50.7686',
        lon: '-103.7917',
        locations: [ 'Fort Qu\'Appelle', 'Qu\'Appelle', 'Balcarres', 'Indian Head', 'Lebret', 'Regina Beach', 'Southey' ],
      },
      'moosomin': {
        name: 'Moosomin / Southeast',
        lat: '50.1436',
        lon: '-101.6664',
        locations: [ 'Moosomin', 'Rocanville', 'Wapella', 'Whitewood', 'Kipling', 'Redvers', 'Carlyle' ],
      },
      'la-ronge': {
        name: 'La Ronge / Northern Saskatchewan',
        lat: '55.1058',
        lon: '-105.2892',
        locations: [ 'La Ronge', 'Air Ronge', 'Pinehouse', 'Stanley Mission', 'Beauval', 'Île-à-la-Crosse' ],
      },
      'creighton': {
        name: 'Creighton / Northeast Saskatchewan',
        lat: '54.7572',
        lon: '-101.8839',
        locations: [ 'Creighton', 'Denare Beach', 'Pelican Narrows', 'Sandy Bay', 'Cumberland House' ],
      },
    },
  },
};

// Popular Canadian Cities displayed for empty queries
export const POPULAR_CANADIAN_CITIES: Array<{ city: string; province: string; provinceCode: string; lat: string; lon: string }> = [
  { city: 'Toronto', province: 'Ontario', provinceCode: 'ON', lat: '43.6532', lon: '-79.3832' },
  { city: 'Vancouver', province: 'British Columbia', provinceCode: 'BC', lat: '49.2827', lon: '-123.1207' },
  { city: 'Montreal', province: 'Quebec', provinceCode: 'QC', lat: '45.5017', lon: '-73.5673' },
  { city: 'Calgary', province: 'Alberta', provinceCode: 'AB', lat: '51.0447', lon: '-114.0719' },
  { city: 'Ottawa', province: 'Ontario', provinceCode: 'ON', lat: '45.4215', lon: '-75.6972' },
  { city: 'Edmonton', province: 'Alberta', provinceCode: 'AB', lat: '53.5461', lon: '-113.4938' },
  { city: 'Mississauga', province: 'Ontario', provinceCode: 'ON', lat: '43.5890', lon: '-79.6441' },
  { city: 'Winnipeg', province: 'Manitoba', provinceCode: 'MB', lat: '49.8951', lon: '-97.1384' },
  { city: 'Quebec City', province: 'Quebec', provinceCode: 'QC', lat: '46.8139', lon: '-71.2080' },
  { city: 'Hamilton', province: 'Ontario', provinceCode: 'ON', lat: '43.2557', lon: '-79.8711' },
  { city: 'Brampton', province: 'Ontario', provinceCode: 'ON', lat: '43.7315', lon: '-79.7624' },
  { city: 'Surrey', province: 'British Columbia', provinceCode: 'BC', lat: '49.1913', lon: '-122.8490' },
  { city: 'Halifax', province: 'Nova Scotia', provinceCode: 'NS', lat: '44.6488', lon: '-63.5752' },
  { city: 'Laval', province: 'Quebec', provinceCode: 'QC', lat: '45.6066', lon: '-73.7124' },
  { city: 'London', province: 'Ontario', provinceCode: 'ON', lat: '42.9849', lon: '-81.2453' },
  { city: 'Victoria', province: 'British Columbia', provinceCode: 'BC', lat: '48.4284', lon: '-123.3656' },
  { city: 'Saskatoon', province: 'Saskatchewan', provinceCode: 'SK', lat: '52.1332', lon: '-106.6700' },
  { city: 'Regina', province: 'Saskatchewan', provinceCode: 'SK', lat: '50.4452', lon: '-104.6189' },
  { city: 'St. John\'s', province: 'Newfoundland and Labrador', provinceCode: 'NL', lat: '47.5615', lon: '-52.7126' },
  { city: 'Charlottetown', province: 'Prince Edward Island', provinceCode: 'PE', lat: '46.2382', lon: '-63.1311' },
  { city: 'Fredericton', province: 'New Brunswick', provinceCode: 'NB', lat: '45.9636', lon: '-66.6431' },
  { city: 'Moncton', province: 'New Brunswick', provinceCode: 'NB', lat: '46.0878', lon: '-64.7782' },
];

/**
 * Pre-computes the complete flat index of all individual locations, sub-cities,
 * and regions across all 10 provinces.
 */
function buildLocationIndex(): LocationItem[] {
  const index: LocationItem[] = [];
  const seenKeys = new Set<string>();

  for (const [pCode, pData] of Object.entries(RAW_PROVINCE_DATA)) {
    const { province, provinceCode, regions } = pData;

    for (const [rKey, region] of Object.entries(regions)) {
      const parentCity = region.locations[0] || rKey;
      const defaultLat = region.lat || '45.4215';
      const defaultLon = region.lon || '-75.6972';

      for (let i = 0; i < region.locations.length; i++) {
        const locName = region.locations[i];
        const isMainCity = (i === 0);
        const uniqueKey = `${locName.toLowerCase()}|${provinceCode.toLowerCase()}`;

        if (!seenKeys.has(uniqueKey)) {
          seenKeys.add(uniqueKey);
          
          let displaySubtitle = '';
          if (isMainCity) {
            displaySubtitle = `${region.name} • ${provinceCode}`;
          } else {
            displaySubtitle = `${parentCity} Region • ${provinceCode}`;
          }

          index.push({
            name: locName,
            regionKey: rKey,
            regionName: region.name,
            province,
            provinceCode,
            isMainCity,
            parentCity,
            fullAddress: `${locName}, ${provinceCode}`,
            displayTitle: locName,
            displaySubtitle,
            lat: defaultLat,
            lon: defaultLon,
          });
        }
      }
    }
  }

  return index;
}

export const ALL_CANADIAN_LOCATIONS: LocationItem[] = buildLocationIndex();

/**
 * Pre-computes metro & sub-city relational mappings for bi-directional search expansion.
 */
function buildMetroMappings(): Record<string, string[]> {
  const mappings: Record<string, Set<string>> = {};

  for (const pData of Object.values(RAW_PROVINCE_DATA)) {
    for (const [rKey, region] of Object.entries(pData.regions)) {
      const parentCity = region.locations[0] || rKey;
      const parentKey = parentCity.toLowerCase().trim();
      const rKeyLower = rKey.toLowerCase().trim();

      if (!mappings[parentKey]) {
        mappings[parentKey] = new Set<string>();
      }
      if (!mappings[rKeyLower]) {
        mappings[rKeyLower] = new Set<string>();
      }

      for (const loc of region.locations) {
        mappings[parentKey].add(loc);
        mappings[rKeyLower].add(loc);

        const locKey = loc.toLowerCase().trim();
        if (!mappings[locKey]) {
          mappings[locKey] = new Set<string>();
        }
        mappings[locKey].add(loc);
        mappings[locKey].add(parentCity);
      }
    }
  }

  const result: Record<string, string[]> = {};
  for (const [k, vSet] of Object.entries(mappings)) {
    result[k] = Array.from(vSet);
  }
  return result;
}

export const CANADA_FULL_METRO_MAPPINGS: Record<string, string[]> = buildMetroMappings();

/**
 * Normalizes strings by removing accents, diacritics, and punctuation for ultra-accurate matching.
 */
export function normalizeString(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’`.]/g, '') // remove apostrophes & dots (e.g. St. John's -> st johns)
    .replace(/[-/]/g, ' ') // replace hyphens and slashes with spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Creates search-friendly token variations (e.g. "st" <-> "saint", "ste" <-> "sainte", "mt" <-> "mount")
 */
function getQueryAliases(cleaned: string): string[] {
  const variations = new Set<string>([cleaned]);
  
  if (/\bst\b/.test(cleaned)) {
    variations.add(cleaned.replace(/\bst\b/g, 'saint'));
  }
  if (/\bsaint\b/.test(cleaned)) {
    variations.add(cleaned.replace(/\bsaint\b/g, 'st'));
  }
  if (/\bste\b/.test(cleaned)) {
    variations.add(cleaned.replace(/\bste\b/g, 'sainte'));
  }
  if (/\bsainte\b/.test(cleaned)) {
    variations.add(cleaned.replace(/\bsainte\b/g, 'ste'));
  }
  if (/\bmt\b/.test(cleaned)) {
    variations.add(cleaned.replace(/\bmt\b/g, 'mount'));
  }
  if (/\bmount\b/.test(cleaned)) {
    variations.add(cleaned.replace(/\bmount\b/g, 'mt'));
  }

  return Array.from(variations);
}

/**
 * Instant Search Engine for Canadian Cities and Sub-Cities.
 * Executes in < 1ms with ranked relevance.
 */
export function searchCanadianLocations(query: string, limit: number = 10): LocationItem[] {
  if (!query || !query.trim()) {
    return POPULAR_CANADIAN_CITIES.slice(0, limit).map((pop) => ({
      name: pop.city,
      regionKey: pop.city.toLowerCase(),
      regionName: `${pop.city} Metro`,
      province: pop.province,
      provinceCode: pop.provinceCode,
      isMainCity: true,
      parentCity: pop.city,
      fullAddress: `${pop.city}, ${pop.provinceCode}`,
      displayTitle: pop.city,
      displaySubtitle: `Popular City • ${pop.provinceCode}`,
      lat: pop.lat,
      lon: pop.lon,
    }));
  }

  const cleanQuery = normalizeString(query);
  if (!cleanQuery) return [];

  const queryVariants = getQueryAliases(cleanQuery);
  const words = cleanQuery.split(' ').filter((w) => w.length > 0);

  // Match buckets for ranking:
  const exactMatches: LocationItem[] = [];
  const startsWithMatches: LocationItem[] = [];
  const wordStartsWithMatches: LocationItem[] = [];
  const includesMatches: LocationItem[] = [];
  const regionMatches: LocationItem[] = [];

  const matchedSet = new Set<string>();

  for (const item of ALL_CANADIAN_LOCATIONS) {
    const itemNorm = normalizeString(item.name);
    const regionNorm = normalizeString(item.regionName);
    const provNorm = normalizeString(item.province);
    const provCodeNorm = item.provinceCode.toLowerCase();
    const fullAddrNorm = normalizeString(item.fullAddress);
    const searchTarget = `${itemNorm} ${provNorm} ${provCodeNorm} ${regionNorm}`;

    const uniqueId = `${itemNorm}|${provCodeNorm}`;

    // Check against all query variants (e.g. "st john" and "saint john")
    let matched = false;

    for (const qVar of queryVariants) {
      // 1. Exact match on city/sub-city name
      if (itemNorm === qVar) {
        if (!matchedSet.has(uniqueId)) {
          matchedSet.add(uniqueId);
          exactMatches.push(item);
        }
        matched = true;
        break;
      }

      // 2. City name starts with query
      if (itemNorm.startsWith(qVar)) {
        if (!matchedSet.has(uniqueId)) {
          matchedSet.add(uniqueId);
          startsWithMatches.push(item);
        }
        matched = true;
        break;
      }
    }

    if (matched) continue;

    for (const qVar of queryVariants) {
      // 3. Any word in city name starts with first word of query
      const cityWords = itemNorm.split(' ');
      const qWords = qVar.split(' ');
      const isWordStart = cityWords.some((cw) => cw.startsWith(qWords[0]));
      
      if (isWordStart && (qWords.length === 1 || itemNorm.includes(qVar) || fullAddrNorm.includes(qVar))) {
        if (!matchedSet.has(uniqueId)) {
          matchedSet.add(uniqueId);
          wordStartsWithMatches.push(item);
        }
        matched = true;
        break;
      }

      // 4. Substring in city name or full address
      if (itemNorm.includes(qVar) || fullAddrNorm.includes(qVar)) {
        if (!matchedSet.has(uniqueId)) {
          matchedSet.add(uniqueId);
          includesMatches.push(item);
        }
        matched = true;
        break;
      }

      // 5. Region match
      if (regionNorm.includes(qVar) || searchTarget.includes(qVar)) {
        if (!matchedSet.has(uniqueId)) {
          matchedSet.add(uniqueId);
          regionMatches.push(item);
        }
        matched = true;
        break;
      }
    }
  }

  // Prioritize main cities within the buckets
  const sortBucket = (arr: LocationItem[]) =>
    arr.sort((a, b) => {
      if (a.isMainCity && !b.isMainCity) return -1;
      if (!a.isMainCity && b.isMainCity) return 1;
      return a.name.localeCompare(b.name);
    });

  const combined = [
    ...exactMatches,
    ...sortBucket(startsWithMatches),
    ...sortBucket(wordStartsWithMatches),
    ...sortBucket(includesMatches),
    ...sortBucket(regionMatches),
  ];

  return combined.slice(0, limit);
}

/**
 * Extracts clean city name from a location string (e.g. "Toronto, ON" -> "Toronto").
 */
export function extractCityName(locationStr: string): string {
  if (!locationStr) return '';
  const trimmed = locationStr.trim();
  if (
    !trimmed ||
    trimmed.toLowerCase() === 'all' ||
    trimmed.toLowerCase() === 'canada' ||
    trimmed.toLowerCase() === 'nationwide' ||
    trimmed.toLowerCase() === 'canada wide'
  ) {
    return '';
  }

  const parts = trimmed.split(',').map((p) => p.trim());
  if (parts.length > 1) {
    // If first part contains house/street numbers e.g. "123 Yonge St, Toronto, ON", city is second part
    if (/\d/.test(parts[0]) && parts[1]) {
      return parts[1].replace(/^city of\s+/i, '').trim();
    }
    return parts[0].replace(/^city of\s+/i, '').trim();
  }
  return trimmed.replace(/^city of\s+/i, '').trim();
}

/**
 * Returns all expanded keyword variations for a given location or city.
 * E.g., searching "Toronto" returns ['Toronto', 'Downtown Toronto', 'North York', 'Scarborough', ...],
 * and searching "Scarborough" returns ['Scarborough', 'Toronto', ...].
 */
export function getExpandedKeywordsForCity(input: string): string[] {
  if (!input) return [];
  const clean = input.trim();
  if (
    !clean ||
    clean.toLowerCase() === 'all' ||
    clean.toLowerCase() === 'canada' ||
    clean.toLowerCase() === 'nationwide' ||
    clean.toLowerCase() === 'canada wide'
  ) {
    return [];
  }

  // Extract base city
  const baseCity = extractCityName(clean);
  const baseNorm = normalizeString(baseCity || clean);

  if (CANADA_FULL_METRO_MAPPINGS[baseNorm]) {
    return CANADA_FULL_METRO_MAPPINGS[baseNorm];
  }

  // Check if it's a sub-city in any region
  for (const [key, cluster] of Object.entries(CANADA_FULL_METRO_MAPPINGS)) {
    const isInside = cluster.some((loc) => normalizeString(loc) === baseNorm);
    if (isInside) {
      return cluster;
    }
  }

  return [baseCity || clean];
}

/**
 * Determines whether an ad's location matches the selected location filter.
 * - When targetLocation is empty / 'all' / 'canada' / 'nationwide': matches any ad.
 * - When targetLocation is a specific city/area (e.g. "Toronto, ON"):
 *   Only returns true if the ad's location is in Toronto or its sub-districts (e.g. "North York", "Downtown Toronto").
 *   Returns false for other cities (e.g. "Brampton, ON", "Oakville, ON", "Mississauga, ON").
 */
export function isLocationMatch(
  adLocation: string | null | undefined,
  targetLocation: string | null | undefined
): boolean {
  if (!targetLocation) return true;
  const targetClean = targetLocation.trim();
  if (
    !targetClean ||
    targetClean.toLowerCase() === 'all' ||
    targetClean.toLowerCase() === 'canada' ||
    targetClean.toLowerCase() === 'nationwide' ||
    targetClean.toLowerCase() === 'canada wide'
  ) {
    return true;
  }

  if (!adLocation) return false;
  const adClean = adLocation.trim();
  if (!adClean) return false;

  const targetCity = extractCityName(targetClean);
  const adCity = extractCityName(adClean);

  const targetCityNorm = normalizeString(targetCity || targetClean);
  const adCityNorm = normalizeString(adCity || adClean);
  const adFullNorm = normalizeString(adClean);
  const targetFullNorm = normalizeString(targetClean);

  // 1. Direct city match or exact string match
  if (targetCityNorm && adCityNorm && targetCityNorm === adCityNorm) {
    return true;
  }
  if (targetFullNorm === adFullNorm) {
    return true;
  }

  // 2. Check expanded keywords of target location
  const targetKeywords = getExpandedKeywordsForCity(targetClean);
  if (targetKeywords.length > 0) {
    const isMatched = targetKeywords.some((kw) => {
      const kwNorm = normalizeString(kw);
      if (!kwNorm) return false;
      if (adCityNorm === kwNorm) return true;
      const regex = new RegExp(`(^|\\s)${kwNorm}(\\s|$)`, 'i');
      return regex.test(adFullNorm);
    });
    if (isMatched) return true;
  }

  // 3. Check expanded keywords of ad location (e.g. ad is "Scarborough", target is "Toronto")
  const adKeywords = getExpandedKeywordsForCity(adClean);
  if (adKeywords.length > 0) {
    const isMatched = adKeywords.some((kw) => {
      const kwNorm = normalizeString(kw);
      if (!kwNorm) return false;
      if (targetCityNorm === kwNorm) return true;
      const regex = new RegExp(`(^|\\s)${kwNorm}(\\s|$)`, 'i');
      return regex.test(targetFullNorm);
    });
    if (isMatched) return true;
  }

  return false;
}

