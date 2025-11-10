import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Debounce helper hook.
 */
function useDebouncedCallback(cb, delay) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  const timeout = useRef(null);

  return useMemo(() => {
    return (...args) => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        cbRef.current(...args);
      }, delay);
    };
  }, [delay]);
}

/**
 * PUBLIC_INTERFACE
 * Editor for a single note with autosave.
 */
export default function Editor({ note, onChange }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [lastSaved, setLastSaved] = useState(note?.updatedAt || null);

  const contentRef = useRef(null);
  const titleRef = useRef(null);

  // Update local state when the selected note changes
  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setLastSaved(note?.updatedAt || null);
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const debouncedSave = useDebouncedCallback((newTitle, newContent) => {
    if (!note) return;
    onChange(note.id, { title: newTitle, content: newContent });
    setLastSaved(new Date().toISOString());
  }, 400);

  useEffect(() => {
    debouncedSave(title, content);
  }, [title, content]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!note) {
    return (
      <div className="empty-state">
        Select a note from the left, or create a new one to begin writing.
      </div>
    );
  }

  return (
    <div className="editor" role="region" aria-label="Editor">
      <div className="editor-header">
        <input
          ref={titleRef}
          className="editor-title"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              contentRef.current?.focus();
            }
          }}
          aria-label="Note title"
        />
      </div>
      <div className="editor-body">
        <textarea
          ref={contentRef}
          className="editor-textarea"
          placeholder="Start typing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          aria-label="Note content"
        />
        <div className="editor-footer">
          <span>
            {lastSaved ? `Last saved ${new Date(lastSaved).toLocaleTimeString()}` : 'Not saved yet'}
          </span>
        </div>
      </div>
    </div>
  );
}
