const STORAGE_KEY = 'notes_app_v1';

/**
 * Safely parse JSON strings.
 * @param {string} str
 * @param {any} fallback
 * @returns {any}
 */
function safeParse(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Safely stringify objects.
 * @param {any} value
 * @returns {string}
 */
function safeStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return 'null';
  }
}

/**
 * PUBLIC_INTERFACE
 * Get persisted notes payload from localStorage.
 * The payload includes notes array, selectedId and filterText.
 */
export function getStored() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return safeParse(raw, { notes: [], selectedId: null, filterText: '' });
}

/**
 * PUBLIC_INTERFACE
 * Persist notes payload to localStorage.
 * @param {{notes: Array, selectedId: string|null, filterText: string}} payload
 */
export function setStored(payload) {
  window.localStorage.setItem(STORAGE_KEY, safeStringify(payload));
}
