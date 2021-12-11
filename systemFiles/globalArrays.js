// CONVERSION
// Convert array V4: unitNames[array][object] + metricNames[array][object] --> converter[array][object] + metrics[array][object]
// - 10 elements per row (0-9/10-19/20-29/etc.)

/** A list of unit-index pairs for conversions  
 * unitNames[array][object] --> converter[array][object]
 * @summary [0] = input name, [1] = output index
 */
exports.unitNames = [
  ["metres", "meters", "m", "inches", "in", "foot", "feet", "ft", "yards", "yds",
   "miles", "mi", "nauticalmiles", "nmi", "seconds", "secs", "s", "minutes", "mins", "hours",
   "hrs", "days", "d", "weeks", "wks", "years", "yrs", "gradians", "grads", "gon",
   "degrees", "degs", "°", "radians", "rads", "mil", "\"", "\'", "litres", "liters",
   "L", "cubicmetres", "cubicmeters", "metrescubed", "meterscubed", "metercubed", "metrecubed", "m³", "m3", "m^3",
   "in³", "in3", "in^3", "cubicinches", "inchescubed", "inchcubed", "ft³", "ft3", "ft^3", "cubicfoot", 
   "cubicfeet", "feetcubed", "footcubed", "gallons", "usgallons", "gallonsus", "gallonus", "gal", "usgal", "galus",
   "quarts", "usquarts", "quartsus", "quartus", "qt", "usqt", "qtus", "fluidounces", "floz", "usfluidounces",
   "usfloz", "fluidouncesus", "fluidounceus", "flozus", "pints", "uspints", "pt", "uspt", "pintsus", "pintus",
   "ptus", "tablespoons", "ustablespoons", "tbsp", "ustbsp", "tablespoonsus", "tablespoonus","tbspus", "teaspoons", "usteaspoons",
   "tsp", "ustsp", "teaspoonsus", "teaspoonus", "tspus", "impgallons", "gallonsimp", "gallonimp", "impgal", "galimp",
   "impquarts", "quartsimp", "quartimp", "impqt", "qtimp", "imppints", "pintsimp", "pintimp", "imppt", "ptimp",
   "impfluidounces", "fluidouncesimp", "fluidounceimp", "impfloz", "flozimp", "imptablespoons", "tablespoonsimp", "tablepsoonimp", "imptbsp", "tbspimp",
   "impteaspoons", "teaspoonsimp", "teaspoonimp", "tspimp", "imptsp", "uscups", "cupsus", "cupus", "usc", "cus",
   "uslegalcups", "legalcupsus", "legalcupus", "cups", "impcups", "cupsimp", "cupimp","impc", "cimp", "pascals", 
   "Pa", "atmospheres", "atm", "torr", "bar", "mmHg", "psi", "lb/sqin","lb/in^2", "lb/in²",
   "lb/in2", "mb", "mbar", "millibar", "squaremetres", "squaremeters", "metressquared", "meterssquared", "metersquared", "metresquared",
   "m²", "m^2", "m2", "squareinches", "inchessquared", "inchsquared", "in²", "in^2", "in2", "squarefeet",
   "squarefoot", "feetsquared", "footsquared", "ft²", "ft^2", "ft2", "squareyards", "yardssquared", "yardsquared", "yd²",
   "yd^2", "yd2", "squaremiles", "milessquared", "milesquared", "mi²", "mi^2", "mi2", "acres", "ac",
   "hectares", "ha", "grams", "g", "ustons", "tonsus", "tonus", "imptons", "tonsimp", "tonimp",
   "tons", "pounds", "lb", "ounces", "oz", "stones", "st", "tonnes", "t", "slug",
   "sl", "joules", "j", "watthours", "w•hr", "w·hr", "whr", "calories", "cal", "gramcalories",
   "smallcalories", "btu", "britishthermalunits", "britishtherm", "imptherm", "thermimp", "quad", "quadrillionbtu", "ustherm", "thermus",
   "electronvolts", "ev", "footpounds", "ftlb", "ft⋅lb", "ft•lb", "celcius", "centigrade", "degreescelcius", "degreecelcius",
   "c", "°c", "fahrenheit", "degreesfahrenheit", "degreefahrenheit", "f", "°f", "kelvins", "k", "rankines",
   "degreesrankine", "degreerankine", "r", "ra", "°r", "°ra", "watts", "watt", "w", "horsepower",
   "hp", "mechanicalhorsepower", "tonsofcooling", "tonofcooling", "coolingtons", "tonsofrefrigeration", "tonofrefrigeration", "refrigerationtons", "tr", "tor",
   "britishthermalunitsperhour", "btuperhour", "btu/hr", "britishthermalunitperhour", "h", "newtons", "n", "gramsforce", "gramforce", "gramsofforce",
   "gramofforce", "gf", "ouncesforce", "ounceforce", "ouncesofforce", "ounceofforce", "ozf", "poundsforce", "poundforce", "poundsofforce",
   "poundofforce", "lbf", "ustonsforce", "ustonforce", "tonsforceus", "tonforceus", "ustonsofforce", "ustonofforce", "tonsofforceus", "tonofforceus",
   "ustonf", "tonfus", "imptonsforce", "imptonforce", "tonsforceimp", "tonforceimp", "imptonsofforce", "imptonofforce", "tonsofforceimp", "tonofforceimp",
   "imptonf", "tonfimp", "tonsforce", "tonforce", "tonsofforce", "tonofforce", "tonf", "ukgallons", "gallonsuk", "gallonuk",
   "ukgal", "galuk", "ukquarts", "quartsuk", "quartuk", "ukqt", "qtuk", "ukpints", "pintsuk", "pintuk",
   "ukpt", "ptuk", "ukfluidounces", "fluidouncesuk", "fluidounceuk", "ukfloz", "flozuk", "uktablespoons", "tablespoonsuk", "tablepsoonuk",
   "uktbsp", "tbspuk", "ukteaspoons", "teaspoonsuk", "teaspoonuk", "tspuk", "uktsp", "ukcups", "cupsuk", "cupuk",
   "ukc", "cuk", "quadrillionbritishthermalunits", "uktons", "tonsuk", "tonuk", "uktherm", "thermuk", "uktonsforce", "uktonforce",
   "tonsforceuk", "tonforceuk", "uktonsofforce", "uktonofforce", "tonsofforceuk", "tonofforceuk", "uktonf", "tonfuk", "l", "angstroms",
   "Å", "A", "a", "å"
  ],
  ["d000", "d000", "d000", "d001", "d001", "d002", "d002", "d002", "d003", "d003",
   "d004", "d004", "d005", "d005", "t006", "t006", "t006", "t007", "t007", "t008",
   "t008", "t009", "t009", "t010", "t010", "t011", "t011", "n012", "n012", "n012",
   "n013", "n013", "n013", "n014", "n014", "n015", "d001", "d002", "v016", "v016",
   "v016", "v017", "v017", "v017", "v017", "v017", "v017", "v017", "v017", "v017",
   "v018", "v018", "v018", "v018", "v018", "v018", "v019", "v019", "v019", "v019",
   "v019", "v019", "v019", "v026", "v020", "v020", "v020", "v026", "v020", "v020",
   "v027", "v021", "v021", "v021", "v027", "v021", "v021", "v028", "v028", "v022",
   "v022", "v022", "v022", "v022", "v029", "v023", "v029", "v023", "v023", "v023",
   "v023", "v030", "v024", "v030", "v024", "v024", "v024", "v024", "v031", "v025",
   "v031", "v025", "v025", "v025", "v025", "v026", "v026", "v026", "v026", "v026",
   "v027", "v027", "v027", "v027", "v027", "v029", "v029", "v029", "v029", "v029",
   "v028", "v028", "v028", "v028", "v028", "v030", "v030", "v030", "v030", "v030",
   "v031", "v031", "v031", "v031", "v031", "v032", "v032", "v032", "v032", "v032",
   "v033", "v033", "v033", "v034", "v034", "v034", "v034", "v034", "v034", "p035",
   "p035", "p036", "p036", "p037", "p038", "p037", "p039", "p039", "p039", "p039",
   "p039", "p040", "p040", "p040", "a041", "a041", "a041", "a041", "a041", "a041",
   "a041", "a041", "a041", "a042", "a042", "a042", "a042", "a042", "a042", "a043",
   "a043", "a043", "a043", "a043", "a043", "a043", "a044", "a044", "a044", "a044",
   "a044", "a044", "a045", "a045", "a045", "a045", "a045", "a045", "a046", "a046",
   "a047", "a047", "m048", "m048", "m049", "m049", "m049", "m050", "m050", "m050",
   "m050", "m051", "m051", "m052", "m052", "m053", "m053", "m054", "m054", "m055",
   "m055", "e056", "e056", "e057", "e057", "e057", "e057", "e058", "e058", "e058",
   "e058", "e059", "e059", "e060", "e060", "e060", "e061", "e061", "e062", "e062",
   "e063", "e063", "e064", "e064", "e064", "e064", "k065", "k065", "k065", "k065",
   "k065", "k065", "k066", "k066", "k066", "k066", "k066", "k067", "k067", "k068",
   "k068", "k068", "k068", "k068", "k068", "k068", "w069", "w069", "w069", "w070",
   "w070", "w070", "w071", "w071", "w071", "w071", "w071", "w071", "w071", "w071",
   "w072", "w072", "w072", "w072", "t008", "f073", "f073", "f074", "f074", "f074",
   "f074", "f074", "f075", "f075", "f075", "f075", "f075", "f076", "f076", "f076",
   "f076", "f076", "f077", "f077", "f077", "f077", "f077", "f077", "f077", "f077",
   "f077", "f077", "f078", "f078", "f078", "f078", "f078", "f078", "f078", "f078",
   "f078", "f078", "f078", "f078", "f078", "f078", "f078", "v026", "v026", "v026",
   "v026", "v026", "v027", "v027", "v027", "v027", "v027", "v029", "v029", "v029",
   "v029", "v029", "v028", "v028", "v028", "v028", "v028", "v030", "v030", "v030",
   "v030", "v030", "v031", "v031", "v031", "v031", "v031", "v034", "v034", "v034",
   "v034", "v034", "e061", "m050", "m050", "m050", "e060", "e060", "f078", "f078",
   "f078", "f078", "f078", "f078", "f078", "f078", "f078", "f078", "v016", "d079",
   "d079", "d079", "d079", "d079"
  ]
]; // d=distance // t=time // n=angle // v=vol // p=pressure // a=area // m=mass // e=energy // k=temperature // w=power // f=force/weight //

/** A list of unit ratios for conversions  
 * unitNames[array][object] --> converter[array][object]
 * @summary [0] = cleaned units, [1] = conversion factors
 */
exports.converter = [
  ["m", "in", "ft", "yd", "mi", "nmi", "/sec", " min", " hrs", " days",
   " wks", " yrs", " gon", "°", "/rads", " mil", "L", "m³", "in³", "ft³",
   " US gal", " US qt", " US floz", " US pt", " US tbsp", " US tsp", " Imperial gal", " Imperial qt", " Imperial floz", "Imperial pt",
   " Imperial tbsp", "Imperial tsp", " US cup", " US legal cup", " Imperial cup", "Pa", "atm", "torr", "bar", "psi",
   "mbar", "m²", "in²", "ft²", "yd²", "mi²", "ac", "ha", "g", " US ton",
   " Imperial ton", "lb", "oz", "st", "t", "sl", "J", "W·h", "cal", "BTU",
   " Imperial therm", "quad", " US therm", "ev", "ft⋅lb", "°C", "°F", "K", "°R", "W",
   "hp", "TR", "BTU/h", "N", "gf", "ozf", "lbf", " US tonf", " Imperial tonf", "Å"],
  [1609.344, 63360, 5280, 1760, 1, 1609.344/1852, 604800, 10080, 168, 7,
   1, 7/365, 200, 180, "π", "π*1000", 1, 0.001, 1/0.016387064, 1/28.316846592,
   1/3.785411784, 4/3.785411784, 128/3.785411784, 8/3.785411784, 256/3.785411784, 768/3.785411784, 1/4.546, 4/4.546, 160/4.546, 8/4.546,
   256/4.546, 768/4.546, 16/3.785411784, 1/0.24, 16/4.546, 101325, 1, 760, 1.01325, 14.6959409,
   1013.25, 2589988.110336, 4014489600, 27878400, 3097600, 1, 1/640, 258.9988110336, 907184.74, 1,
   1/1.12, 2000, 32000, 2000/14, 90.718474, 907184.74/14593.903, 1, 1/3600, 1/4.184, 100/1.65923500225396087980032,
   10000000/1.65923500225396087980032, Math.pow(10, 17)/1.65923500225396087980032, 10000000/1.659631173184781539, Math.pow(10, 19)/1.602176565, 0.73756214927726542848, null, null, null, null, 1,
   0.0013410220895949744128, 0.000284345136094, 3.412141633, 9.80665, 1000, 32000000/907184.74, 2000000/907184.74, 1000/907184.74, 1000/1016046.9088, 1609.344*Math.pow(10, 10)] 
];

/** A list of prefix-index pairs for conversions  
 * metricNames[array][object] --> metrics[array][object]
 * @summary [0] = prefix name, [1] = prefix index
 */
exports.metricNames = [
  ["deci", "d", "centi", "c", "milli", "m", "kilo", "k", "mega", "M",
   "giga", "G", "tera", "T", "peta", "P", "exa", "E", "zetta", "Z",
   "yotta", "Y", "hecto", "h", "nano", "n", "pico", "p", "femto", "f", 
   "atto", "a", "zepto", "z", "yocto", "y", "micro", "μ", "u", "deka",
   "deca", "da"],
  [00, 00, 01, 01, 02, 02, 03, 03, 04, 04,
   05, 05, 06, 06, 07, 07, 08, 08, 09, 09,
   10, 10, 11, 11, 12, 12, 13, 13, 14, 14,
   15, 15, 16, 16, 17, 17, 18, 18, 18, 19,
   19, 19]
];

/** A list of metric prefix ratios for conversions  
 * metricNames[array][object] --> metrics[array][object]
 * @summary [0] = cleaned prefix, [1] = conversion factor
 */
exports.metrics = [
  ["d", "c", "m", "k", "M", "G", "T", "P", "E", "Z", 
   "Y", "h", "n", "p", "f", "a", "z", "y", "μ", "da"],
  [Math.pow(10, 1), Math.pow(10, 2), Math.pow(10, 3), Math.pow(10, -3), Math.pow(10, -6),
     Math.pow(10, -9), Math.pow(10, -12), Math.pow(10, -15), Math.pow(10, -18), Math.pow(10, -21),
   Math.pow(10, -24), Math.pow(10, -2), Math.pow(10, 9), Math.pow(10, 12), Math.pow(10, 15),
     Math.pow(10, 18), Math.pow(10, 21), Math.pow(10, 24), Math.pow(10, 6), Math.pow(10, -1)]
];

/** A list of units that can be modified with metric prefixes in conversions
 */
exports.registeredMetrics = ["meters", "meters", "m", "seconds", "secs", "s", "radians", "rads", "litres", "liters",
  "L", "cubicmetres", "cubicmeters", "metrescubed", "meterscubed", "metercubed", "metrecubed", "m³", "m3", "m^3",
  "pascals", "Pa", "squaremetres", "squaremeters", "metressquared", "meterssquared", "metersquared", "metresquared", "m²", "m^2",
  "m2", "grams", "g", "joules", "j", "watthours", "w•hr", "w·hr", "whr", "calories",
  "cal", "watts", "w", "newtons", "n", "gramsforce", "gramforce", "gramsofforce", "gramofforce", "gf",
  "l"];

/** A list of units that must have their metric prefix modifiers doubled in conversions
 */
exports.metricDoubles = ["squaremetres", "squaremeters", "metressquared", "meterssquared", "metersquared", "metresquared", "m²", "m^2", "m2"];

/** A list of units that must have their metric prefix modifiers tripled in conversions
 */
exports.metricTriples = ["cubicmetres", "cubicmeters", "metrescubed", "meterscubed", "metercubed", "metrecubed", "m³", "m3", "m^3"];

// COLOUR

/** A list of colour names and their corresponding hex codes  
 * (Colour data taken from https://www.w3schools.com/colors/colors_hex.asp)
 * @summary [0] = name, [1] = hex code
 */
exports.colNames = [ 
  [ // web block
   "Black", "Navy", "DarkBlue", "MediumBlue", "Blue", "DarkGreen", "Green", "Teal", "DarkCyan", "DeepSkyBlue",
   "DarkTurquoise", "MediumSpringGreen", "Lime", "SpringGreen", "Aqua", "Cyan", "MidnightBlue", "DodgerBlue", "LightSeaGreen", "ForestGreen",
   "SeaGreen", "DarkSlateGray", "DarkSlateGrey", "LimeGreen", "MediumSeaGreen", "Turquoise", "RoyalBlue", "SteelBlue", "DarkSlateBlue", "MediumTurquoise",
   "Indigo", "DarkOliveGreen", "CadetBlue", "CornflowerBlue", "RebeccaPurple", "MediumAquaMarine", "DimGray", "DimGrey", "SlateBlue", "OliveDrab",
   "SlateGray", "SlateGrey", "LightSlateGray", "LightSlateGrey", "MediumSlateBlue", "LawnGreen", "Chartreuse", "Aquamarine", "Maroon", "Purple",
   "Olive", "Gray", "Grey", "SkyBlue", "LightSkyBlue", "BlueViolet", "DarkRed", "DarkMagenta", "SaddleBrown", "DarkSeaGreen",
   "LightGreen", "MediumPurple", "DarkViolet", "PaleGreen", "DarkOrchid", "YellowGreen", "Sienna", "Brown", "DarkGray", "DarkGrey",
   "LightBlue", "GreenYellow", "PaleTurquoise", "LightSteelBlue", "PowderBlue", "FireBrick", "DarkGoldenRod", "MediumOrchid", "RosyBrown", "DarkKhaki",
   "Silver", "MediumVioletRed", "IndianRed", "Peru", "Chocolate", "Tan", "LightGray", "LightGrey", "Thistle", "Orchid",
   "GoldenRod", "PaleVioletRed", "Crimson", "Gainsboro", "Plum", "BurlyWood", "LightCyan", "Lavender", "DarkSalmon", "Violet",
   "PaleGoldenRod", "LightCoral", "Khaki", "AliceBlue", "HoneyDew", "Azure", "SandyBrown", "Wheat", "Beige", "WhiteSmoke",
   "MintCream", "GhostWhite", "Salmon", "AntiqueWhite", "Linen", "LightGoldenRodYellow", "OldLace", "Red", "Fuchsia", "Magenta",
   "DeepPink", "OrangeRed", "Tomato", "HotPink", "Coral", "DarkOrange", "LightSalmon", "Orange", "LightPink", "Pink",
   "Gold", "PeachPuff", "NavajoWhite", "Moccasin", "Bisque", "MistyRose", "BlanchedAlmond", "PapayaWhip", "LavenderBlush", "SeaShell",
   "Cornsilk", "LemonChiffon", "FloralWhite", "Snow", "Yellow", "LightYellow", "Ivory", "White",
    // custom block
   "DiscordOldBlurple", "DiscordOldDarkBlurple", "DiscordBlurple", "DiscordGreen", "DiscordYellow", "DiscordFuchsia", "DiscordRed",
   "Gyromina's favourite colour", "Gyromina's favorite color", "Gyromina's favourite color", "Gyromina's favorite colour",
  ],
  [ // web block
   "000000", "000080", "00008B", "0000cd", "0000ff", "006400", "008000", "008080", "008b8b", "00bfff",
   "00ced1", "00fa9a", "00ff00", "00ff7f", "00ffff", "00ffff", "191970", "1e90ff", "20b2aa", "228b22",
   "2e8b57", "2f4f4f", "2f4f4f", "32cd32", "3cb371", "40e0d0", "4169e1", "4682b4", "483d8b", "48d1cc",
   "4b0082", "556b2f", "5f9ea0", "6495ed", "663399", "66cdaa", "696969", "696969", "6a5acd", "6b8e23",
   "708090", "708090", "778899", "778899", "7b68ee", "7cfc00", "7fff00", "7fffd4", "800000", "800080",
   "808000", "808080", "808080", "87ceeb", "87cefa", "8a2be2", "8b0000", "8b008b", "8B4513", "8FBC8F",
   "90ee90", "9370db", "9400d3", "98fb98", "9932cc", "9acd32", "a0522d", "a52a2a", "a9a9a9", "a9a9a9",
   "add8e6", "adff2f", "afeeee", "b0c4de", "b0e0e6", "b22222", "b8860b", "ba55d3", "bc8f8f", "bdb76b",
   "c0c0c0", "c71585", "cd5c5c", "cd853f", "d2691e", "d2b48c", "d3d3d3", "d3d3d3", "d8bfd8", "da70d6",
   "daa520", "db7093", "dc143c", "dcdcdc", "dda0dd", "deb887", "e0ffff", "e6e6fa", "e9967a", "ee82ee",
   "eee88a", "f08080", "f0e68c", "f0f8ff", "f0fff0", "f0ffff", "f4a460", "f5deb3", "f5f5dc", "f5f5f5",
   "f5fffa", "f8f8ff", "fa8072", "faebd7", "faf0e6", "fafad2", "fdf5e6", "ff0000", "ff00ff", "ff00ff",
   "ff1493", "ff4500", "ff6347", "ff69b4", "ff7f50", "ff8c00", "ffa07a", "ffa500", "ffb6c1", "ffc0cb",
   "ffd700", "ffdab9", "ffdead", "ffe4b5", "ffe4c4", "ffe4e1", "ffebcd", "ffefd5", "fff0f5", "fff5ee",
   "fff8dc", "fffacd", "fffaf0", "fffafa", "ffff00", "ffffe0", "fffff0", "ffffff",
    // custom block
   "7289da", "4e5d94", "5865f2", "57f287", "fee75c", "eb459e", "ed4245",
   "009663", "009663", "009663", "009663",
  ]
];

// MISC

/** A list of statuses for Gyromina to rotate through on each dyno refresh
 * @summary [0] = standard, [1] = experimental mode
 */
exports.statBlock = [
  ["with threads!", "with dice!", "with slashes!", "critical hit!", "nat 1, sad…",
   "with buttons!", "with fancy links!", "with Discord!", "with HSV colours!", "with HSL colours!",
   "with new colours!", "shiny math rocks!", "with new stuff!"
  ],
  ["with the debugger!", "with variables!", "in experimental mode!", "in the editor!", "with programmers!",
   "with bugs!", "around with code!", "console.log(\"haha\");", "console.log(\"oops\");", "with breakpoints!",
   "with environment variables!", "with brand new code!", "the \"crash\" challenge", "with errors!", "in the backend!",
   "spot the difference!", "red light, green light!", "the waiting game…"]
];

/** A list of additional statuses to add to stat block rotations based on season
 * @summary [0] = default/forced, [1] = pride, [2] = winter, [3] = blurple
 */
 exports.seasonalStatBlock = [
   [],
   ["happy pride month!", "with pronouns!", "gay rights!", "trans rights!", "with colours!", "with flags!"],
   ["happy holidays!", "with snowflakes!", "in the snow!"],
   ["happy birthday Discord!", "with blurple!", "with Wumpus!"]
 ];
