import React, { useEffect, useRef } from 'react';
import useLocalNotes from '../hooks/useLocalNotes';
import Toolbar from './Toolbar';
import NotesList from './NotesList';
import Editor from './Editor';

/**
 * PUBLIC_INTERFACE
 * NotesApp orchestrates the split-view notes UI.
 */
export default function NotesApp() {
  const {
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
  } = useLocalNotes();

  const titleFocusRef = useRef(false);

  const handleNew = () => {
    titleFocusRef.current = true;
    const newId = createNote();
    // selection is handled by hook; effect below will focus title input on mount
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteNote(selectedId);
    }
  };

  // Focus the title field after creating a note
  useEffect(() => {
    if (titleFocusRef.current && selectedNote && selectedNote.title === '' && selectedNote.content === '') {
      // Defer to next tick so Editor mounts first
      setTimeout(() => {
        const el = document.querySelector('input.editor-title');
        if (el) el.focus();
      }, 0);
    }
    titleFocusRef.current = false;
  }, [selectedNote?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="notes-container" aria-label="Notes application">
      <aside className="sidebar" aria-label="Notes list">
        <Toolbar
          onNew={handleNew}
          onDelete={handleDelete}
          canDelete={!!selectedId}
          filterText={filterText}
          onFilterChange={setFilter}
        />
        <NotesList
          notes={filteredNotes}
          selectedId={selectedId}
          onSelect={selectNote}
        />
      </aside>
      <section className="editor" aria-label="Editor section">
        <Editor note={selectedNote} onChange={updateNote} />
      </section>
    </section>
  );
}
