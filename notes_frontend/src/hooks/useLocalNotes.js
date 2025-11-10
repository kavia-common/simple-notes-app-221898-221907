/**
 * Hook that manages notes persisted to localStorage.
 * State shape:
 * - notes: [{ id, title, content, updatedAt }]
 * - selectedId: string | null
 * - filterText: string
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getStored, setStored } from '../utils/storage';

/**
 * Create a unique id using timestamp and random.
 */
function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Returns the next selected id when deleting a note.
 */
function getNextSelection(notes, deletedId) {
  if (!notes.length) return null;
  const idx = notes.findIndex(n => n.id === deletedId);
  if (idx === -1) return notes[0].id;
  const neighbor = notes[idx + 1] || notes[idx - 1];
  return neighbor ? neighbor.id : null;
}

/**
 * PUBLIC_INTERFACE
 * useLocalNotes hook.
 */
export default function useLocalNotes() {
  // Load once from storage and guarantee a safe object
  const init = useMemo(() => {
    const loaded = getStored();
    // Double-guard in case storage changes in future
    return loaded && typeof loaded === 'object'
      ? {
          notes: Array.isArray(loaded.notes) ? loaded.notes : [],
          selectedId: typeof loaded.selectedId === 'string' ? loaded.selectedId : null,
          filterText: typeof loaded.filterText === 'string' ? loaded.filterText : '',
        }
      : { notes: [], selectedId: null, filterText: '' };
  }, []);

  const [notes, setNotes] = useState(init.notes);
  const [selectedId, setSelectedId] = useState(init.selectedId);
  const [filterText, setFilterText] = useState(init.filterText);

  // Persist to localStorage when any relevant state changes.
  useEffect(() => {
    setStored({ notes, selectedId, filterText });
  }, [notes, selectedId, filterText]);

  // PUBLIC_INTERFACE
  const createNote = useCallback(() => {
    const now = new Date().toISOString();
    const newNote = {
      id: makeId(),
      title: '',
      content: '',
      updatedAt: now,
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedId(newNote.id);
    return newNote.id;
  }, []);

  // PUBLIC_INTERFACE
  const updateNote = useCallback((id, patch) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n))
    );
  }, []);

  // PUBLIC_INTERFACE
  const deleteNote = useCallback((id) => {
    setNotes(prev => {
      const next = prev.filter(n => n.id !== id);
      const nextSel = getNextSelection(prev, id);
      setSelectedId(nextSel && next.find(n => n.id === nextSel) ? nextSel : (next[0]?.id ?? null));
      return next;
    });
  }, []);

  // PUBLIC_INTERFACE
  const selectNote = useCallback((id) => {
    setSelectedId(id);
  }, []);

  // PUBLIC_INTERFACE
  const setFilter = useCallback((text) => {
    setFilterText(text);
  }, []);

  const selectedNote = useMemo(
    () => notes.find(n => n.id === selectedId) || null,
    [notes, selectedId]
  );

  const filteredNotes = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(n => {
      const t = (n.title || '').toLowerCase();
      const c = (n.content || '').toLowerCase();
      return t.includes(q) || c.includes(q);
    });
  }, [notes, filterText]);

  return {
    notes,
    selectedId,
    selectedNote,
    filterText,
    filteredNotes,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    setFilter,
  };
}
