import React from "react";
import "./styles/theme.css";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import NotesList from "./components/NotesList";
import NoteEditor from "./components/NoteEditor";
import { NotesProvider } from "./context/NotesContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * App is the Personal Notes Manager shell with Ocean Professional theme.
 * Routes:
 *  - / (All)
 *  - /favorites
 *  - /trash
 *  - /tag/:tag
 */
function Shell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <TopBar />
      <main className="main">
        <div className="notes-layout">
          <div className="card" style={{ overflow: "hidden", padding: 12 }}>
            <NotesList />
          </div>
          <div className="card" style={{ padding: 12 }}>
            <NoteEditor />
          </div>
        </div>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <NotesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Shell />} />
          <Route path="/favorites" element={<Shell />} />
          <Route path="/trash" element={<Shell />} />
          <Route path="/tag/:tag" element={<Shell />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </NotesProvider>
  );
}

export default App;
