import { useState, useRef, useEffect, useCallback } from 'react';
import { validateBarcodeInput } from './hardwareStorage';

/**
 * Keyboard-wedge scanner hook for Honeywell ScanPal EDA51 (and USB/Bluetooth HID scanners).
 * - Supports Enter suffix auto-submission.
 * - Guards against accidental duplicate scans within `duplicateCooldownMs`.
 * - Preserves fast consecutive scans and auto-focuses the input when enabled.
 */
export function useWedgeScanner({
  enabled = true,
  enterSuffix = true,
  duplicateCooldownMs = 1200,
  autoFocus = true,
  onScan,
  onDuplicateBlocked,
}) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const lastScanRef = useRef({ code: '', timestamp: 0 });

  const focusInput = useCallback(() => {
    if (inputRef.current && enabled) {
      inputRef.current.focus();
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled && autoFocus) {
      const t = setTimeout(() => focusInput(), 80);
      return () => clearTimeout(t);
    }
  }, [enabled, autoFocus, focusInput]);

  const submitCode = useCallback(
    (raw) => {
      const validation = validateBarcodeInput(raw);
      if (!validation.valid) {
        setInputValue('');
        return { accepted: false, reason: validation.error };
      }

      const now = Date.now();
      if (
        lastScanRef.current.code === validation.code &&
        now - lastScanRef.current.timestamp < duplicateCooldownMs
      ) {
        setInputValue('');
        if (onDuplicateBlocked) {
          onDuplicateBlocked(validation.code);
        }
        return { accepted: false, reason: 'Duplicate scan ignored within cooldown window' };
      }

      lastScanRef.current = { code: validation.code, timestamp: now };
      setInputValue('');
      if (onScan) {
        onScan(validation.code);
      }
      if (autoFocus) {
        setTimeout(() => focusInput(), 20);
      }
      return { accepted: true, code: validation.code };
    },
    [duplicateCooldownMs, onScan, onDuplicateBlocked, autoFocus, focusInput]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!enabled) return;
      if (enterSuffix && (e.key === 'Enter' || e.keyCode === 13)) {
        e.preventDefault();
        submitCode(inputValue);
      }
    },
    [enabled, enterSuffix, inputValue, submitCode]
  );

  return {
    inputRef,
    inputValue,
    setInputValue,
    handleKeyDown,
    submitCode,
    focusInput,
  };
}
