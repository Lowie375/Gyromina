export type RGBCol = {
  r: number,
  g: number,
  b: number
};

export type HSLCol = {
  h: number,
  s: number,
  l: number
};

export type HSVCol = {
  h: number,
  s: number,
  v: number
}

export type CMYKCol = {
  c: number,
  m: number,
  y: number,
  k: number
};

export type HexCol = string | `#${string}`;

/** Converts a hexadecimal colour code to RGB format
 * @author Irisu (irisuwastaken)
 * @param hex Hexadecimal colour code
 * @return RGB colour object
 */
export function hexToRgb(hex: HexCol): RGBCol { 
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : {r: 0, g: 0, b: 0};
}

/** Converts an RGB colour code to hexadecimal format
 * @param rgb RGB colour object
 * @return Hexadecimal colour code
 */
export function rgbToHex(rgb: RGBCol): HexCol {
  let hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];
  return `${hex[0].length > 1 ? hex[0] : `0${hex[0]}`}${hex[1].length > 1 ? hex[1] : `0${hex[1]}`}${hex[2].length > 1 ? hex[2] : `0${hex[2]}`}`;
}

/** Converts a CMYK colour code to RGB format
 * @param cmyk CMYK colour object
 * @return RGB colour object
 */
export function cmykToRgb(cmyk: CMYKCol): RGBCol {
  let div = [cmyk.c/100, cmyk.m/100, cmyk.y/100, cmyk.k/100];

  let c = Math.min(1, div[0] * (1 - div[3]) + div[3]);
  let m = Math.min(1, div[1] * (1 - div[3]) + div[3]);
  let y = Math.min(1, div[2] * (1 - div[3]) + div[3]);

  return {
    r: Math.round((1 - c) * 255),
    g: Math.round((1 - m) * 255),
    b: Math.round((1 - y) * 255),
  };
}

/** Converts an RGB colour code to CMYK format
 * @param rgb RGB colour object
 * @return CMYK colour object
 */
export function rgbToCmyk(rgb: RGBCol): CMYKCol {
  let c = (255 - rgb.r) / 255;
  let m = (255 - rgb.g) / 255;
  let y = (255 - rgb.b) / 255;

  let k = Math.min(c, m, y);

  switch((1-k)*100) {
    case 0: {
      return {
        c: 0, m: 0, y: 0, k: 100
      };
    }
    default: {
      return {
        c: Math.round((c - k) / (1 - k) * 100),
        m: Math.round((m - k) / (1 - k) * 100),
        y: Math.round((y - k) / (1 - k) * 100),
        k: Math.round(k * 100)
      };
    }
  }
}

/** Converts a hexadecimal colour code to a colour integer
 * @param hex Hexadecimal colour code
 * @return Colour integer
 */
// TODO: split leading "#" if present
export function hexToInt(hex: HexCol): number {
  return parseInt(parseInt(hex, 16).toString(10));
}

/** Converts a colour integer to a hexadecimal colour code
 * @param int Colour integer
 * @return Hexadecimal colour code
 */
export function intToHex(int: number): HexCol {
  let res = int.toString(16)
  while (res.length < 6) {
    res = "0".concat(res);
  }
  return res;
}

/** Converts an RGB colour code to HSL format
 * @param rgb RGB colour object
 * @return HSL colour object
 */
export function rgbToHsl(rgb: RGBCol): HSLCol {
  let v = Math.max(rgb.r, rgb.g, rgb.b);
  let m = Math.min(rgb.r, rgb.g, rgb.b);
  let c = (v - m);

  let h: number;
  switch(v) {
    case m: h = 0; break;
    case rgb.r: h = ((rgb.g-rgb.b) / c) + 0; break;
    case rgb.g: h = ((rgb.b-rgb.r) / c) + 2; break;
    case rgb.b: h = ((rgb.r-rgb.g) / c) + 4; break;
  }
  if(h < 0) h += 6;
  if(h >= 6) h -= 6;

  let l = (v + m) * 0.5;
  let s: number;
  switch(l) {
    case 255:
    case 0:
      s = 0; break;
    default:
      s = c / (255 - Math.abs(2*l - 255)); break;
  }

  return {
    h: Math.round(h * 60),
    s: Math.round(s * 100),
    l: Math.round(l * 100/255),
  };
}

/** Converts an HSL colour code to RGB format
 * @param hsl HSL colour object
 * @return RGB colour object
 */
export function hslToRgb(hsl: HSLCol): RGBCol {
  let div = [hsl.h/60, hsl.s/100, hsl.l/100];
  let c = (1 - Math.abs(2 * div[2] - 1)) * div[1];
  let x = (1 - Math.abs(div[0] % 2 - 1)) * c;
  let rgb: number[];

  div[0] = div[0] % 6;
  while(div[0] < 0)
    div[0] += 6;

  if(div[0] >= 0 && div[0] < 1)
    rgb = [c, x, 0];
  else if(div[0] >= 1 && div[0] < 2)
    rgb = [x, c, 0];
  else if(div[0] >= 2 && div[0] < 3)
    rgb = [0, c, x];
  else if(div[0] >= 3 && div[0] < 4)
    rgb = [0, x, c];
  else if(div[0] >= 4 && div[0] < 5)
    rgb = [x, 0, c];
  else if(div[0] >= 5 && div[0] < 6)
    rgb = [c, 0, x];

  let m = div[2] - (c * 0.5)

  return {
    r: Math.round((rgb[0] + m) * 255),
    g: Math.round((rgb[1] + m) * 255),
    b: Math.round((rgb[2] + m) * 255)
  }
}

/** Converts an RGB colour code to HSV format
 * @param rgb RGB colour object
 * @return HSV colour object
 */
export function rgbToHsv(rgb: RGBCol): HSVCol {
  let v = Math.max(rgb.r, rgb.g, rgb.b);
  let m = Math.min(rgb.r, rgb.g, rgb.b);
  let c = (v - m);

  let h: number;
  switch(v) {
    case m: h = 0; break;
    case rgb.r: h = ((rgb.g-rgb.b) / c) + 0; break;
    case rgb.g: h = ((rgb.b-rgb.r) / c) + 2; break;
    case rgb.b: h = ((rgb.r-rgb.g) / c) + 4; break;
  }
  if(h < 0) h += 6;
  if(h >= 6) h -= 6;

  let s: number;
  switch(v) {
    case 0:
      s = 0; break;
    default:
      s = c / v; break;
  }
  
  return {
    h: Math.round(h * 60),
    s: Math.round(s * 100),
    v: Math.round(v * 100/255),
  };
}

/** Converts an HSV colour code to RGB format
 * @param hsv HSV colour object
 * @return RGB colour object
 */
export function hsvToRgb(hsv: HSVCol): RGBCol {
  let div = [hsv.h/60, hsv.s/100, hsv.v/100];
  let c = div[1] * div[2];
  let x = (1 - Math.abs(div[0] % 2 - 1)) * c;
  let rgb: number[];

  div[0] = div[0] % 6;
  while(div[0] < 0)
    div[0] += 6;

  if(div[0] >= 0 && div[0] < 1)
    rgb = [c, x, 0];
  else if(div[0] >= 1 && div[0] < 2)
    rgb = [x, c, 0];
  else if(div[0] >= 2 && div[0] < 3)
    rgb = [0, c, x];
  else if(div[0] >= 3 && div[0] < 4)
    rgb = [0, x, c];
  else if(div[0] >= 4 && div[0] < 5)
    rgb = [x, 0, c];
  else if(div[0] >= 5 && div[0] < 6)
    rgb = [c, 0, x];

  let m = div[2] - c;

  return {
    r: Math.round((rgb[0] + m) * 255),
    g: Math.round((rgb[1] + m) * 255),
    b: Math.round((rgb[2] + m) * 255)
  }  
}
