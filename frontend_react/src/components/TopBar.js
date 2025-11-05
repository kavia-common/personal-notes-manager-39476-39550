import React, { useMemo, useState } from "react";
import { debounce } from "../utils/debounce";
import { useNotes } from "../context/NotesContext";

/** PUBLIC_INTERFACE: TopBar with New Note and debounced search */
export default function TopBar() {
  const { actions } = useNotes();
  const [input, setInput] = useState("");

  const debounced = useMemo(
    () =>
      debounce((q) => {
        actions.setQuery(q);
      }, 300),
    [actions]
  );

  const onChange = (e) => {
    const q = e.target.value;
    setInput(q);
    debounced(q);
  };

  return (
    <header className="topbar">
      <button className="btn btn-primary" onClick={actions.createNote}>＋ New Note (Ctrl/Cmd+N)</button>
      <div className="search">
        <span role="img" aria-label="search">🔎</span>
        <input placeholder="Search notes, titles, #tags..." value={input} onChange={onChange} />
      </div>
    </header>
  );
}
