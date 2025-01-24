/**
 * Converts an HSL color string to a HEX color string.
 *
 * @param {string} hsl - The HSL color string (e.g., "hsl(120.5, 100%, 50%)").
 * @returns {string} The HEX color string (e.g., "#00ff00").
 */
function hslToHex(hsl) {
  // Parse the HSL string using a regular expression
  const hslRegex = /^hsl\(([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\)$/;
  const result = hsl.match(hslRegex);

  if (!result) {
    throw new Error("Invalid HSL string format");
  }

  // Extract HSL values from the match result
  let [, h, s, l] = result;
  h = parseFloat(h);
  s = parseFloat(s) / 100;
  l = parseFloat(l) / 100;

  // Convert HSL to RGB
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  // Convert RGB values to the range [0, 255] and add m (the offset)
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  // Convert RGB values to HEX string
  const toHex = (value) => {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default {
  hslToHex,
};
