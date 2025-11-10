const STORAGE_KEY = 'notes_app_v1';

const DEFAULT_STATE = { notes: [], selectedId: null, filterText: '' };

/**
 * Safely parse JSON strings and guarantee an object is returned.
 * @param {string|null} str
 * @param {any} fallback
 * @returns {any}
 */
function safeParse(str, fallback) {
  if (str == null) return fallback;
  try {
    const parsed = JSON.parse(str);
    // If parsed is not an object (could be null, string, number), fallback
    if (parsed === null || typeof parsed !== 'object') return fallback;
    return parsed;
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
    // Always store a safe default on failure to ensure next read is valid
    return JSON.stringify(DEFAULT_STATE);
  }
}

/**
 * Ensure a value is a string; otherwise coerce to safe default.
 * @param {any} v
 */
function asString(v) {
  return typeof v === 'string' ? v : '';
}

/**
 * Ensure a value is an array; otherwise return [].
 * @param {any} v
 */
function asArray(v) {
  return Array.isArray(v) ? v : [];
}

/**
 * PUBLIC_INTERFACE
 * Get persisted notes payload from localStorage.
 * The payload includes notes array, selectedId and filterText.
 * Always returns a valid, non-null structure.
 */
export function getStored() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const obj = safeParse(raw, DEFAULT_STATE);

  // Validate and normalize to guarantee safe structure
  const notes = asArray(obj.notes).map((n) => {
    // normalize each note to expected fields
    const id = asString(n && n.id) || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const title = asString(n && n.title);
    const content = asString(n && n.content);
    const updatedAt = asString(n && n.updatedAt) || new Date().toISOString();
    return { id, title, content, updatedAt };
  });

  const selectedId = obj.selectedId == null ? null : asString(obj.selectedId) || null;
  const filterText = asString(obj.filterText);

  return { notes, selectedId, filterText };
}

/**
 * PUBLIC_INTERFACE
 * Persist notes payload to localStorage.
 * @param {{notes: Array, selectedId: string|null, filterText: string}} payload
 */
export function setStored(payload) {
  const normalized = {
    notes: asArray(payload?.notes),
    selectedId: payload?.selectedId ?? null,
    filterText: asString(payload?.filterText),
  };
  window.localStorage.setItem(STORAGE_KEY, safeStringify(normalized));
}
