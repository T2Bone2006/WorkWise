export const UK_POSTCODE_AREAS: Record<string, string> = {
    // London
    E: "East London",
    EC: "East Central London",
    N: "North London",
    NW: "North West London",
    SE: "South East London",
    SW: "South West London",
    W: "West London",
    WC: "West Central London",

    // South East England
    BR: "Bromley",
    CR: "Croydon",
    DA: "Dartford",
    EN: "Enfield",
    HA: "Harrow",
    IG: "Ilford",
    KT: "Kingston upon Thames",
    RM: "Romford",
    SM: "Sutton",
    TW: "Twickenham",
    UB: "Uxbridge",
    WD: "Watford",

    AL: "St Albans",
    BN: "Brighton",
    CB: "Cambridge",
    CM: "Chelmsford",
    CO: "Colchester",
    CT: "Canterbury",
    GU: "Guildford",
    HP: "Hemel Hempstead",
    IP: "Ipswich",
    LU: "Luton",
    ME: "Medway",
    MK: "Milton Keynes",
    NR: "Norwich",
    OX: "Oxford",
    PE: "Peterborough",
    PO: "Portsmouth",
    RG: "Reading",
    RH: "Redhill",
    SG: "Stevenage",
    SL: "Slough",
    SO: "Southampton",
    SS: "Southend-on-Sea",
    TN: "Tonbridge",

    // South West England
    BA: "Bath",
    BH: "Bournemouth",
    BS: "Bristol",
    DT: "Dorchester",
    EX: "Exeter",
    GL: "Gloucester",
    PL: "Plymouth",
    SN: "Swindon",
    SP: "Salisbury",
    TA: "Taunton",
    TQ: "Torquay",
    TR: "Truro",

    // West Midlands
    B: "Birmingham",
    CV: "Coventry",
    DY: "Dudley",
    HR: "Hereford",
    ST: "Stoke-on-Trent",
    SY: "Shrewsbury",
    TF: "Telford",
    WR: "Worcester",
    WS: "Walsall",
    WV: "Wolverhampton",

    // East Midlands
    DE: "Derby",
    DN: "Doncaster",
    LE: "Leicester",
    LN: "Lincoln",
    NG: "Nottingham",
    NN: "Northampton",

    // Yorkshire and the Humber
    BD: "Bradford",
    HD: "Huddersfield",
    HG: "Harrogate",
    HU: "Hull",
    HX: "Halifax",
    LS: "Leeds",
    S: "Sheffield",
    WF: "Wakefield",
    YO: "York",

    // North West England
    BB: "Blackburn",
    BL: "Bolton",
    CA: "Carlisle",
    CH: "Chester",
    CW: "Crewe",
    FY: "Blackpool",
    L: "Liverpool",
    LA: "Lancaster",
    M: "Manchester",
    OL: "Oldham",
    PR: "Preston",
    SK: "Stockport",
    WA: "Warrington",
    WN: "Wigan",

    // North East England
    DH: "Durham",
    DL: "Darlington",
    NE: "Newcastle",
    SR: "Sunderland",
    TS: "Teesside",

    // Wales
    CF: "Cardiff",
    LD: "Llandrindod Wells",
    LL: "Llandudno",
    NP: "Newport",
    SA: "Swansea",

    // Scotland
    AB: "Aberdeen",
    DD: "Dundee",
    DG: "Dumfries",
    EH: "Edinburgh",
    FK: "Falkirk",
    G: "Glasgow",
    HS: "Outer Hebrides",
    IV: "Inverness",
    KA: "Kilmarnock",
    KW: "Kirkwall",
    KY: "Kirkcaldy",
    ML: "Motherwell",
    PA: "Paisley",
    PH: "Perth",
    TD: "Galashiels",
    ZE: "Lerwick (Shetland)",

    // Northern Ireland
    BT: "Belfast",
};

// Helper function to extract postcode area
export function extractPostcodeArea(postcode: string): string {
    return postcode.match(/^[A-Z]{1,2}/i)?.[0].toUpperCase() || "OTHER";
}

// Helper function to get region name
export function getRegionName(postcodeArea: string): string {
    return UK_POSTCODE_AREAS[postcodeArea] || postcodeArea;
}