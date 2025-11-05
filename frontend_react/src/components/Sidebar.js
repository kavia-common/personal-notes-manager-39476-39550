import React, { useState } from "react";
import { useNotes } from "../context/NotesContext";

/** PUBLIC_INTERFACE: Sidebar navigation and tags list */
export default function Sidebar() {
  const { allTags, state, actions } = useNotes();
  const [newTag, setNewTag] = useState("");

  const go = (view) => {
    actions.setFilter({
      view,
      trash: view === "trash",
      favorites: view === "favorites",
      tag: view?.startsWith("tag:") ? view.split(":")[1] : null,
    });
  };

  const active = (view) => {
    const v = state.filter.view;
    return v === view ? "active" : "";
  };

  const addTag = (e) => {
    e.preventDefault();
    const tag = newTag.trim();
    if (!tag) return;
    actions.addTag(tag);
    setNewTag("");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h4>Navigation</h4>
        <nav className="sidebar-nav">
          <div className={`nav-item ${active("all")}`} onClick={() => go("all")}>📒 All Notes</div>
          <div className={`nav-item ${active("favorites")}`} onClick={() => go("favorites")}>⭐ Favorites</div>
          <div className={`nav-item ${active("trash")}`} onClick={() => go("trash")}>🗑️ Trash</div>
        </nav>
      </div>

      <div className="sidebar-section">
        <h4>Tags</h4>
        <nav className="sidebar-nav">
          {allTags.length === 0 && <div className="nav-item" style={{ color: "#9CA3AF" }}>No tags yet</div>}
          {allTags.map((t) => (
            <div key={t} className={`nav-item ${active(`tag:${t}`)}`} onClick={() => go(`tag:${t}`)}>
              # {t}
            </div>
          ))}
        </nav>
        <form onSubmit={addTag} style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <input className="input" placeholder="Add tag..." value={newTag} onChange={(e) => setNewTag(e.target.value)} />
          <button className="btn" type="submit">Add</button>
        </form>
      </div>
    </aside>
  );
}
