import React, { useEffect, useMemo, useState } from "react";
import { useNotes } from "../context/NotesContext";
import { debounce } from "../utils/debounce";

/** PUBLIC_INTERFACE: NoteEditor for editing title, content, tags, and actions */
export default function NoteEditor() {
  const { notes, selectedId, actions, state } = useNotes();
  const note = useMemo(() => notes.find(n => n.id === selectedId) || null, [notes, selectedId]);

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const doSave = useMemo(
    () => debounce((id, patch) => actions.updateNote(id, patch), 250),
    [actions]
  );

  useEffect(() => {
    if (!note) return;
    doSave(note.id, { title, content });
  }, [title, content, note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!note) {
    return (
      <div className="card" style={{ padding: 20, height: "100%" }}>
        Select a note from the list or create a new one.
      </div>
    );
  }

  const toggleFavorite = () => actions.updateNote(note.id, { favorite: !note.favorite });
  const onDelete = () => actions.deleteNote(note.id);
  const onRestore = () => actions.restoreNote(note.id);
  const onPurge = () => actions.purgeNote(note.id);

  const addTag = (e) => {
    e.preventDefault();
    const t = tagInput.trim();
    if (!t) return;
    const tags = Array.from(new Set([...(note.tags || []), t]));
    actions.updateNote(note.id, { tags });
    actions.addTag(t);
    setTagInput("");
  };
  const removeTag = (t) => {
    const tags = (note.tags || []).filter(x => x !== t);
    actions.updateNote(note.id, { tags });
  };

  return (
    <div className="editor">
      <div className="editor-header">
        <input
          className="input editor-title"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btn" onClick={toggleFavorite}>{note.favorite ? "⭐ Unfavorite" : "☆ Favorite"}</button>
        {!state.filter.trash && <button className="btn" onClick={onDelete}>🗑️ Delete</button>}
        {state.filter.trash && (
          <>
            <button className="btn" onClick={onRestore}>↩️ Restore</button>
            <button className="btn btn-danger" onClick={onPurge}>❌ Delete Forever</button>
          </>
        )}
      </div>

      <div style={{ margin: "8px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(note.tags || []).map(t => (
          <span key={t} className="tag-chip">
            #{t}
            <button
              aria-label={`Remove tag ${t}`}
              className="btn btn-ghost"
              style={{ padding: "0 4px" }}
              onClick={() => removeTag(t)}
            >
              ✕
            </button>
          </span>
        ))}

        {!state.filter.trash && (
          <form onSubmit={addTag} style={{ display: "inline-flex", gap: 8 }}>
            <input
              className="input"
              style={{ maxWidth: 200 }}
              placeholder="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <button className="btn" type="submit">Add</button>
          </form>
        )}
      </div>

      <div className="editor-content">
        <textarea
          className="editor-textarea"
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>
  );
}
