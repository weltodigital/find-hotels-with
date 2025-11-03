// Location coordinates for map centering
export const LOCATION_COORDINATES = {
  // Countries
  countries: {
    england: { center: [52.5, -1.5], zoom: 6 },
    scotland: { center: [56.5, -4.0], zoom: 6 },
    wales: { center: [52.3, -3.7], zoom: 7 }
  },

  // Counties
  counties: {
    // England
    'hampshire': { center: [51.1, -1.3], zoom: 9 },
    'surrey': { center: [51.3, -0.5], zoom: 9 },
    'berkshire': { center: [51.4, -1.0], zoom: 9 },
    'kent': { center: [51.3, 0.5], zoom: 8 },
    'sussex': { center: [50.9, -0.2], zoom: 8 },
    'essex': { center: [51.8, 0.5], zoom: 8 },
    'hertfordshire': { center: [51.8, -0.2], zoom: 9 },
    'buckinghamshire': { center: [51.8, -0.8], zoom: 9 },
    'oxfordshire': { center: [51.8, -1.3], zoom: 9 },
    'gloucestershire': { center: [51.8, -2.2], zoom: 8 },
    'wiltshire': { center: [51.3, -2.0], zoom: 8 },
    'dorset': { center: [50.7, -2.3], zoom: 8 },
    'devon': { center: [50.7, -3.8], zoom: 7 },
    'cornwall': { center: [50.4, -4.8], zoom: 8 },
    'somerset': { center: [51.1, -3.0], zoom: 8 },
    'bristol': { center: [51.5, -2.6], zoom: 10 },
    'london': { center: [51.5, -0.1], zoom: 9 },
    'bedfordshire': { center: [52.0, -0.5], zoom: 9 },
    'cambridgeshire': { center: [52.4, 0.1], zoom: 8 },
    'lincolnshire': { center: [53.2, -0.5], zoom: 7 },
    'norfolk': { center: [52.6, 1.0], zoom: 8 },
    'suffolk': { center: [52.2, 1.0], zoom: 8 },
    'northamptonshire': { center: [52.3, -1.0], zoom: 9 },
    'warwickshire': { center: [52.3, -1.5], zoom: 9 },
    'leicestershire': { center: [52.7, -1.2], zoom: 9 },
    'nottinghamshire': { center: [53.1, -1.0], zoom: 9 },
    'derbyshire': { center: [53.2, -1.6], zoom: 8 },
    'staffordshire': { center: [52.8, -2.1], zoom: 8 },
    'shropshire': { center: [52.6, -2.8], zoom: 8 },
    'worcestershire': { center: [52.2, -2.2], zoom: 9 },
    'herefordshire': { center: [52.1, -2.8], zoom: 9 },
    'cheshire': { center: [53.2, -2.6], zoom: 8 },
    'manchester': { center: [53.5, -2.2], zoom: 10 },
    'lancashire': { center: [53.8, -2.6], zoom: 8 },
    'yorkshire': { center: [54.0, -1.5], zoom: 7 },
    'cumbria': { center: [54.5, -3.0], zoom: 7 },
    'northumberland': { center: [55.2, -2.1], zoom: 7 },
    'durham': { center: [54.7, -1.9], zoom: 8 },

    // Scotland
    'aberdeenshire': { center: [57.2, -2.5], zoom: 8 },
    'fife': { center: [56.3, -3.2], zoom: 9 },
    'perth-and-kinross': { center: [56.6, -3.8], zoom: 8 },
    'stirling': { center: [56.1, -4.0], zoom: 9 },
    'west-dunbartonshire': { center: [55.9, -4.6], zoom: 10 },
    'highland': { center: [57.5, -4.5], zoom: 6 },
    'argyll-and-bute': { center: [56.2, -5.1], zoom: 7 },
    'dumfries-and-galloway': { center: [55.0, -3.8], zoom: 7 },
    'scottish-borders': { center: [55.5, -2.8], zoom: 8 },
    'east-lothian': { center: [55.9, -2.8], zoom: 9 },
    'west-lothian': { center: [55.9, -3.5], zoom: 9 },
    'edinburgh': { center: [55.9, -3.2], zoom: 10 },
    'glasgow': { center: [55.9, -4.3], zoom: 10 },

    // Wales
    'gwynedd': { center: [52.9, -3.9], zoom: 8 },
    'newport': { center: [51.6, -3.0], zoom: 10 },
    'vale-of-glamorgan': { center: [51.4, -3.4], zoom: 9 },
    'cardiff': { center: [51.5, -3.2], zoom: 10 },
    'swansea': { center: [51.6, -3.9], zoom: 10 },
    'carmarthenshire': { center: [51.9, -4.2], zoom: 8 },
    'pembrokeshire': { center: [51.8, -4.9], zoom: 8 },
    'ceredigion': { center: [52.2, -4.1], zoom: 8 },
    'powys': { center: [52.4, -3.4], zoom: 7 },
    'monmouthshire': { center: [51.8, -2.9], zoom: 9 },
    'caerphilly': { center: [51.6, -3.2], zoom: 10 },
    'rhondda-cynon-taf': { center: [51.6, -3.4], zoom: 9 },
    'bridgend': { center: [51.5, -3.6], zoom: 10 },
    'neath-port-talbot': { center: [51.7, -3.8], zoom: 9 },
    'conwy': { center: [53.3, -3.8], zoom: 9 },
    'denbighshire': { center: [53.2, -3.4], zoom: 9 },
    'flintshire': { center: [53.2, -3.2], zoom: 9 },
    'wrexham': { center: [53.0, -3.0], zoom: 10 },
    'anglesey': { center: [53.3, -4.4], zoom: 9 }
  },

  // Major cities (some examples)
  cities: {
    'london': { center: [51.5074, -0.1278], zoom: 11 },
    'birmingham': { center: [52.4862, -1.8904], zoom: 11 },
    'manchester': { center: [53.4808, -2.2426], zoom: 11 },
    'glasgow': { center: [55.8642, -4.2518], zoom: 11 },
    'edinburgh': { center: [55.9533, -3.1883], zoom: 11 },
    'cardiff': { center: [51.4816, -3.1791], zoom: 11 },
    'bristol': { center: [51.4545, -2.5879], zoom: 11 },
    'liverpool': { center: [53.4084, -2.9916], zoom: 11 },
    'leeds': { center: [53.8008, -1.5491], zoom: 11 },
    'sheffield': { center: [53.3811, -1.4701], zoom: 11 },
    'newcastle': { center: [54.9783, -1.6178], zoom: 11 },
    'nottingham': { center: [52.9548, -1.1581], zoom: 11 },
    'southampton': { center: [50.9097, -1.4044], zoom: 11 },
    'portsmouth': { center: [50.8050, -1.0870], zoom: 11 },
    'plymouth': { center: [50.3755, -4.1427], zoom: 11 },
    'exeter': { center: [50.7184, -3.5339], zoom: 11 },
    'bath': { center: [51.3811, -2.3590], zoom: 12 },
    'cambridge': { center: [52.2053, 0.1218], zoom: 11 },
    'oxford': { center: [51.7520, -1.2577], zoom: 11 },
    'canterbury': { center: [51.2802, 1.0789], zoom: 11 },
    'winchester': { center: [51.0632, -1.3080], zoom: 11 },
    'basingstoke': { center: [51.2663, -1.0878], zoom: 11 },
    'reading': { center: [51.4543, -0.9781], zoom: 11 },
    'guildford': { center: [51.2362, -0.5704], zoom: 11 },
    'woking': { center: [51.3180, -0.5581], zoom: 11 },
    'epsom': { center: [51.3304, -0.2696], zoom: 11 },
    'brighton': { center: [50.8225, -0.1372], zoom: 11 },
    'hastings': { center: [50.8550, 0.5736], zoom: 11 },
    'maidstone': { center: [51.2704, 0.5227], zoom: 11 },
    'chelmsford': { center: [51.7356, 0.4685], zoom: 11 },
    'st-albans': { center: [51.7500, -0.3333], zoom: 11 },
    'luton': { center: [51.8787, -0.4200], zoom: 11 },
    'milton-keynes': { center: [52.0406, -0.7594], zoom: 11 },
    'banbury': { center: [52.0629, -1.3417], zoom: 11 },
    'gloucester': { center: [51.8642, -2.2381], zoom: 11 },
    'cheltenham': { center: [51.8994, -2.0783], zoom: 11 },
    'swindon': { center: [51.5558, -1.7797], zoom: 11 },
    'salisbury': { center: [51.0693, -1.7943], zoom: 11 },
    'bournemouth': { center: [50.7192, -1.8808], zoom: 11 },
    'poole': { center: [50.7150, -1.9872], zoom: 11 },
    'torquay': { center: [50.4619, -3.5253], zoom: 11 },
    'truro': { center: [50.2632, -5.0510], zoom: 11 },
    'taunton': { center: [51.0157, -3.1056], zoom: 11 },
    'aberdeen': { center: [57.1497, -2.0943], zoom: 11 },
    'dundee': { center: [56.4620, -2.9707], zoom: 11 },
    'stirling': { center: [56.1165, -3.9369], zoom: 11 },
    'perth': { center: [56.3962, -3.4370], zoom: 11 },
    'inverness': { center: [57.4778, -4.2247], zoom: 11 },
    'swansea': { center: [51.6214, -3.9436], zoom: 11 },
    'newport': { center: [51.5842, -2.9977], zoom: 11 },
    'wrexham': { center: [53.0465, -2.9915], zoom: 11 },
    'bangor': { center: [53.2280, -4.1289], zoom: 11 },
    'aberystwyth': { center: [52.4140, -4.0828], zoom: 11 }
  }
} as const

export type LocationLevel = 'countries' | 'counties' | 'cities'
export type LocationKey = keyof typeof LOCATION_COORDINATES[LocationLevel]

export function getLocationCoordinates(
  level: LocationLevel,
  key: string
): { center: [number, number]; zoom: number } | null {
  const normalizedKey = key.toLowerCase().replace(/\s+/g, '-')
  const coords = LOCATION_COORDINATES[level][normalizedKey as any]
  return coords || null
}