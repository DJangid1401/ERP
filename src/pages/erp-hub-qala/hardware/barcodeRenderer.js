// Pure SVG 1D Barcode Generator (Code 128 Set B & Code 39)
// Zero external dependencies; crisp vector output for Citizen CL-S631II 300 DPI thermal printing.

const CODE128_PATTERNS = [
  '212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
  '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
  '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
  '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
  '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
  '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
  '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
  '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
  '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
  '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
  '114131', '311141', '411131', '211412', '211214', '211232', '2331112',
];

const CODE39_MAP = {
  '0': '111221211', '1': '211211112', '2': '112211112', '3': '212211111', '4': '111221112',
  '5': '211221111', '6': '112221111', '7': '111211212', '8': '211211211', '9': '112211211',
  'A': '211112112', 'B': '112112112', 'C': '212112111', 'D': '111122112', 'E': '211122111',
  'F': '112122111', 'G': '111112212', 'H': '211112211', 'I': '112112211', 'J': '111122211',
  'K': '211111122', 'L': '112111122', 'M': '212111121', 'N': '111121122', 'O': '211121121',
  'P': '112121121', 'Q': '111111222', 'R': '211111221', 'S': '112111221', 'T': '111121221',
  'U': '221111112', 'V': '122111112', 'W': '222111111', 'X': '121121112', 'Y': '221121111',
  'Z': '122121111', '-': '121111212', '.': '221111211', ' ': '122111211', '$': '121212111',
  '/': '121211121', '+': '121112121', '%': '111212121', '*': '121121211',
};

function encodeCode128B(text) {
  const safe = String(text || 'PRD-0001').replace(/[^\x20-\x7E]/g, '');
  const codes = [104]; // Start Code B
  let checksum = 104;
  for (let i = 0; i < safe.length; i++) {
    const val = safe.charCodeAt(i) - 32;
    codes.push(val);
    checksum += val * (i + 1);
  }
  codes.push(checksum % 103);
  codes.push(106); // Stop

  const bars = [];
  let x = 0;
  for (const c of codes) {
    const pattern = CODE128_PATTERNS[c] || CODE128_PATTERNS[0];
    for (let i = 0; i < pattern.length; i++) {
      const w = parseInt(pattern[i], 10);
      if (i % 2 === 0) {
        bars.push({ x, w });
      }
      x += w;
    }
  }
  return { bars, totalWidth: x || 100 };
}

function encodeCode39(text) {
  const safe = `*${String(text || 'PRD-0001').toUpperCase().replace(/[^0-9A-Z\-. $/+%]/g, '')}*`;
  const bars = [];
  let x = 0;
  for (let idx = 0; idx < safe.length; idx++) {
    const pattern = CODE39_MAP[safe[idx]] || CODE39_MAP['-'];
    for (let i = 0; i < pattern.length; i++) {
      const w = parseInt(pattern[i], 10);
      if (i % 2 === 0) {
        bars.push({ x, w });
      }
      x += w;
    }
    x += 1; // inter-character gap
  }
  return { bars, totalWidth: x || 100 };
}

/**
 * Generates an inline SVG string for 1D barcodes (CODE128 or CODE39).
 */
export function generateBarcodeSvg(value, barcodeType = 'CODE128', height = 42) {
  const { bars, totalWidth } =
    barcodeType === 'CODE39' ? encodeCode39(value) : encodeCode128B(value);
  const rects = bars
    .map((b) => `<rect x="${b.x}" y="0" width="${b.w}" height="${height}" fill="#000000" />`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${height}" width="100%" height="${height}" preserveAspectRatio="none" style="display:block;shape-rendering:crispEdges;">${rects}</svg>`;
}
