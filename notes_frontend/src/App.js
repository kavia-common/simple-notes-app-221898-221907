import React, { useEffect, useState } from 'react';
import './App.css';
import NotesApp from './components/NotesApp';

// PUBLIC_INTERFACE
function App() {
  /**
   * Root app for the Notes application.
   * Applies theme attribute on document root and renders the NotesApp.
   */
  const [theme, setTheme] = useState('dark'); // default to dark

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggle between light and dark theme; defaults to dark on load. */
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <header className="app-header-bar">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <span className="brand-text">Simple Notes</span>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>
      <main className="app-main">
        <NotesApp />
      </main>
    </div>
  );
}

export default App;
