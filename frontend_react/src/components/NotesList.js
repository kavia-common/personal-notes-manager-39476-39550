import React from "react";
import { useNotes } from "../context/NotesContext";

/** PUBLIC_INTERFACE: NotesList shows filtered notes and supports selection */
export default function NotesList() {
  const { notes, selectedId, actions, state } = useNotes();

  const onSelect = (id) => {
    actions.setSelected(id);
  };

  const fmtDate = (iso) => new Date(iso).toLocaleString();

  return (
    <div className="notes-list">
      {notes.length === 0 ? (
        <div className="card" style={{ padding: 16 }}>
          {state.filter.trash ? "Trash is empty." : "No notes yet. Create one to get started."}
        </div>
      ) : (
        notes.map(n => (
          <div key={n.id} className={`note-item ${selectedId === n.id ? "active" : ""}`} onClick={() => onSelect(n.id)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {n.favorite && <span title="Favorite">⭐</span>}
                <strong>{n.title || "Untitled note"}</strong>
              </div>
              <span className="badge">Updated {fmtDate(n.updatedAt)}</span>
            </div>
            <div style={{ color: "#6B7280", marginTop: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {n.content || "No content"}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {n.tags.map(t => (
                <span key={t} className="tag-chip">#{t}</span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
