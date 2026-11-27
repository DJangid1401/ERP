// Device-specific localStorage keys (used strictly for local device settings & temporary device logs)
const KEYS = {
  SCANNER_SETTINGS: 'siona_erp_hw_scanner_settings_v1',
  PRINTER_SETTINGS: 'siona_erp_hw_printer_settings_v1',
  LOCAL_SCAN_LOGS: 'siona_erp_hw_local_scan_logs_v1',
  LOCAL_PRINT_JOBS: 'siona_erp_hw_local_print_jobs_v1',
};

export const DEFAULT_SCANNER_SETTINGS = {
  enterSuffix: true,
  duplicateCooldownMs: 1200,
  autoFocusLock: true,
  defaultWarehouse: 'Warehouse',
};

export const DEFAULT_PRINTER_SETTINGS = {
  printerName: 'Citizen CL-S631II (Thermal)',
  printerModel: 'Citizen CL-S631II',
  connectionType: 'Browser Print (Citizen Driver)',
  labelWidthMm: 50,
  labelHeightMm: 25,
  printDensity: 10,
  printSpeed: 4,
  barcodeType: 'CODE128',
  includeQr: true,
};

function safeReadJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function safeWriteJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota or private-mode errors
  }
}

export function loadScannerSettings() {
  return { ...DEFAULT_SCANNER_SETTINGS, ...safeReadJson(KEYS.SCANNER_SETTINGS, {}) };
}

export function saveScannerSettings(settings) {
  safeWriteJson(KEYS.SCANNER_SETTINGS, settings);
}

export function loadPrinterSettings() {
  return { ...DEFAULT_PRINTER_SETTINGS, ...safeReadJson(KEYS.PRINTER_SETTINGS, {}) };
}

export function savePrinterSettings(settings) {
  safeWriteJson(KEYS.PRINTER_SETTINGS, settings);
}

export function loadLocalScanLogs() {
  const arr = safeReadJson(KEYS.LOCAL_SCAN_LOGS, []);
  return Array.isArray(arr) ? arr : [];
}

export function saveLocalScanLogs(logs) {
  safeWriteJson(KEYS.LOCAL_SCAN_LOGS, Array.isArray(logs) ? logs.slice(0, 200) : []);
}

export function loadLocalPrintJobs() {
  const arr = safeReadJson(KEYS.LOCAL_PRINT_JOBS, []);
  return Array.isArray(arr) ? arr : [];
}

export function saveLocalPrintJobs(jobs) {
  safeWriteJson(KEYS.LOCAL_PRINT_JOBS, Array.isArray(jobs) ? jobs.slice(0, 100) : []);
}

/**
 * Sanitizes and validates scanned barcode input.
 */
export function validateBarcodeInput(raw) {
  if (typeof raw !== 'string') return { valid: false, code: '', error: 'Invalid barcode input type' };
  const cleaned = raw.replace(/[\r\n\t]/g, '').trim();
  if (!cleaned) return { valid: false, code: '', error: 'Empty barcode scanned' };
  if (cleaned.length > 128) return { valid: false, code: '', error: 'Barcode exceeds maximum length (128)' };
  return { valid: true, code: cleaned, error: '' };
}

/**
 * Matches a scanned barcode against the existing ERP Product Master (stockItems).
 * Reuses existing uniqueCode / sku identifiers without creating duplicate product records.
 */
export function findProductByBarcode(stockItems, rawCode) {
  const { valid, code } = validateBarcodeInput(rawCode);
  if (!valid || !Array.isArray(stockItems)) return null;
  const target = code.toLowerCase();
  return (
    stockItems.find(
      (item) =>
        (item.uniqueCode && item.uniqueCode.toLowerCase() === target) ||
        (item.sku && item.sku.toLowerCase() === target)
    ) || null
  );
}
