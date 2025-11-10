import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Toolbar with actions and search input.
 */
export default function Toolbar({ onNew, onDelete, canDelete, filterText, onFilterChange }) {
  return (
    <div className="toolbar" role="toolbar" aria-label="Notes toolbar">
      <button className="btn primary" onClick={onNew}>
        New Note
      </button>
      <button className="btn danger" onClick={onDelete} disabled={!canDelete} aria-disabled={!canDelete}>
        Delete Note
      </button>
      <input
        className="input"
        type="search"
        placeholder="Search notes..."
        value={filterText}
        onChange={(e) => onFilterChange(e.target.value)}
        aria-label="Search notes"
      />
    </div>
  );
}
