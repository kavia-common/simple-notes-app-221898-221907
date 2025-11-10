import React from 'react';

/**
 * PUBLIC_INTERFACE
 * NotesList shows the list of notes with selection and updatedAt info.
 */
export default function NotesList({ notes, selectedId, onSelect }) {
  if (!notes.length) {
    return (
      <div className="empty-state" aria-live="polite">
        No notes found. Create your first note to get started.
      </div>
    );
  }

  return (
    <div className="notes-list" role="list">
      {notes.map((n) => {
        const selected = n.id === selectedId;
        const snippet = (n.content || '').replace(/\s+/g, ' ').trim();
        const updated = new Date(n.updatedAt);
        const updatedText = isNaN(updated.getTime()) ? '' : updated.toLocaleString();
        return (
          <div
            key={n.id}
            className={`note-item${selected ? ' selected' : ''}`}
            role="listitem"
            tabIndex={0}
            onClick={() => onSelect(n.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelect(n.id);
            }}
            aria-current={selected ? 'true' : undefined}
          >
            <h3 className="note-title">{n.title || 'Untitled'}</h3>
            <p className="note-snippet">{snippet || 'No content yet'}</p>
            <div className="note-updated">Last updated: {updatedText}</div>
          </div>
        );
      })}
    </div>
  );
}
