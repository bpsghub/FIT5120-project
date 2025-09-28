// Local Government Area coordinates mapping for Victoria, Australia
// Coordinates represent approximate geographic centers of each LGA

export const LGA_COORDINATES = {
  // North West Metro Region
  'Banyule': [-37.7414, 145.0915],
  'Brimbank': [-37.7535, 144.8269],
  'Darebin': [-37.7500, 145.0167],
  'Hobsons Bay': [-37.8397, 144.8269],
  'Hume': [-37.6565, 144.9269],
  'Maribyrnong': [-37.7630, 144.8869],
  'Melbourne': [-37.8136, 144.9631],
  'Melton': [-37.6830, 144.5769],
  'Merri-bek': [-37.7697, 144.9969],
  'Moonee Valley': [-37.7697, 144.9169],
  'Nillumbik': [-37.7197, 145.2169],
  'Whittlesea': [-37.5697, 145.1169],
  'Wyndham': [-37.9697, 144.6169],
  'Yarra': [-37.8197, 145.0069],

  // Eastern Region
  'Alpine': [-36.8697, 147.1169],
  'Bass Coast': [-38.5697, 145.6169],
  'Baw Baw': [-37.8697, 146.1169],
  'Benalla': [-36.5497, 145.9769],
  'Boroondara': [-37.8297, 145.0769],
  'East Gippsland': [-37.2697, 147.8169],
  'Greater Shepparton': [-36.3797, 145.3969],
  'Indigo': [-36.3297, 146.8169],
  'Knox': [-37.8797, 145.2469],
  'Latrobe': [-38.1997, 146.4169],
  'Manningham': [-37.7897, 145.1969],
  'Mansfield': [-37.0497, 146.0869],
  'Maroondah': [-37.8197, 145.2769],
  'Mitchell': [-37.3497, 145.0169],
  'Moira': [-36.1797, 145.8969],
  'Monash': [-37.8897, 145.1369],
  'Murrindindi': [-37.3097, 145.7169],
  'South Gippsland': [-38.4697, 146.0169],
  'Strathbogie': [-36.8797, 145.5169],
  'Towong': [-36.1797, 147.4169],
  'Wangaratta': [-36.3597, 146.3169],
  'Wellington': [-37.7697, 146.9169],
  'Whitehorse': [-37.8497, 145.1669],
  'Wodonga': [-36.1197, 146.8869],

  // Southern Metro Region
  'Bayside': [-37.9497, 145.0369],
  'Glen Eira': [-37.8897, 145.0769],
  'Kingston': [-37.9897, 145.1269],
  'Port Phillip': [-37.8564, 144.9612],
  'Stonnington': [-37.8564, 145.0264],

  // Western Region
  'Ballarat': [-37.5622, 143.8503],
  'Golden Plains': [-37.8333, 143.9167],
  'Moorabool': [-37.6833, 144.3167],

  // Additional LGAs that might appear in data
  'Cardinia': [-38.0833, 145.4833],
  'Casey': [-38.0833, 145.3500],
  'Frankston': [-38.1333, 145.1167],
  'Greater Dandenong': [-37.9833, 145.2167],
  'Mornington Peninsula': [-38.3500, 144.9833],

  // Rural/Regional LGAs
  'Ararat': [-37.2833, 142.9333],
  'Buloke': [-35.7333, 143.0833],
  'Campaspe': [-36.3833, 144.7500],
  'Central Goldfields': [-37.0500, 143.8000],
  'Colac Otway': [-38.3333, 143.5833],
  'Corangamite': [-38.2500, 143.2500],
  'Gannawarra': [-35.7167, 143.9333],
  'Glenelg': [-37.8333, 141.2833],
  'Greater Geelong': [-38.1500, 144.3500],
  'Hindmarsh': [-36.1000, 141.6167],
  'Horsham': [-36.7167, 142.1983],
  'Loddon': [-36.4167, 143.8333],
  'Macedon Ranges': [-37.4000, 144.6000],
  'Mildura': [-34.2000, 142.1500],
  'Mount Alexander': [-37.0833, 144.2667],
  'Northern Grampians': [-36.8833, 142.7833],
  'Pyrenees': [-37.2167, 143.2333],
  'Queenscliffe': [-38.2667, 144.6500],
  'Southern Grampians': [-37.7500, 142.0000],
  'Surf Coast': [-38.3167, 144.0000],
  'Swan Hill': [-35.3378, 143.5544],
  'Warrnambool': [-38.3833, 142.4833],
  'West Wimmera': [-36.5000, 141.1667],
  'Yarriambiack': [-36.0833, 142.5000]
}

// Function to get coordinates for an LGA
export const getLGACoordinates = (lgaName) => {
  // Clean the LGA name (remove extra spaces, handle variations)
  const cleanName = lgaName?.trim()
  
  if (!cleanName) {
    console.warn('Empty LGA name provided')
    return null
  }

  // Direct lookup
  if (LGA_COORDINATES[cleanName]) {
    return LGA_COORDINATES[cleanName]
  }

  // Try variations and common aliases
  const variations = {
    'City of Melbourne': 'Melbourne',
    'Melbourne City': 'Melbourne',
    'City of Banyule': 'Banyule',
    'City of Darebin': 'Darebin',
    'City of Hume': 'Hume',
    'City of Yarra': 'Yarra',
    'Shire of Nillumbik': 'Nillumbik',
    'City of Whittlesea': 'Whittlesea',
    'City of Wyndham': 'Wyndham',
    'Moreland': 'Merri-bek',  // Historical name change
    'City of Moreland': 'Merri-bek'
  }

  if (variations[cleanName]) {
    return LGA_COORDINATES[variations[cleanName]]
  }

  // Try case-insensitive lookup
  const foundKey = Object.keys(LGA_COORDINATES).find(
    key => key.toLowerCase() === cleanName.toLowerCase()
  )
  
  if (foundKey) {
    return LGA_COORDINATES[foundKey]
  }

  console.warn(`No coordinates found for LGA: ${cleanName}`)
  return null
}

// Function to get all LGA names
export const getAllLGANames = () => {
  return Object.keys(LGA_COORDINATES).sort()
}

// Function to validate if an LGA exists in our mapping
export const isValidLGA = (lgaName) => {
  return getLGACoordinates(lgaName) !== null
}

export default LGA_COORDINATES
