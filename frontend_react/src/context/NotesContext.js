import React, { createContext, useContext, useMemo, useReducer, useEffect, useCallback } from "react";
import { NotesService } from "../services/NotesService";
import { EMPTY_NOTE } from "../utils/types";

const NotesCtx = createContext(null);

const initialState = {
  notes: [],
  tags: [],
  selectedId: null,
  query: "",
  filter: { view: "all", tag: null, favorites: false, trash: false },
};

function reducer(state, action) {
  switch (action.type) {
    case "init":
      return { ...state, ...action.payload };
    case "set-notes":
      return { ...state, notes: action.notes };
    case "set-tags":
      return { ...state, tags: action.tags };
    case "set-selected":
      return { ...state, selectedId: action.id };
    case "set-query":
      return { ...state, query: action.query };
    case "set-filter":
      return { ...state, filter: { ...state.filter, ...action.filter } };
    default:
      return state;
  }
}

/**
 * PUBLIC_INTERFACE
 * NotesProvider wraps the app and provides state + actions for notes.
 */
export function NotesProvider({ children }) {
  const service = useMemo(() => new NotesService(), []);
  const [state, dispatch] = useReducer(reducer, initialState);

  // Init from service
  useEffect(() => {
    const notes = service.list();
    const tags = service.listTags();
    dispatch({ type: "init", payload: { notes, tags } });
  }, [service]);

  // Actions
  const createNote = useCallback(() => {
    const base = EMPTY_NOTE();
    const created = service.create(base);
    dispatch({ type: "set-notes", notes: service.list() });
    dispatch({ type: "set-selected", id: created.id });
    return created;
  }, [service]);

  const updateNote = useCallback((id, patch) => {
    service.update(id, patch);
    dispatch({ type: "set-notes", notes: service.list({ includeDeleted: state.filter.trash }) });
    dispatch({ type: "set-tags", tags: service.listTags() });
  }, [service, state.filter.trash]);

  const deleteNote = useCallback((id) => {
    service.delete(id);
    const updated = service.list({ includeDeleted: state.filter.trash });
    dispatch({ type: "set-notes", notes: updated });
    if (state.selectedId === id) dispatch({ type: "set-selected", id: null });
  }, [service, state.filter.trash, state.selectedId]);

  const purgeNote = useCallback((id) => {
    service.purge(id);
    dispatch({ type: "set-notes", notes: service.list({ includeDeleted: true }) });
  }, [service]);

  const restoreNote = useCallback((id) => {
    service.restore(id);
    dispatch({ type: "set-notes", notes: service.list({ includeDeleted: true }) });
  }, [service]);

  const addTag = useCallback((tag) => {
    service.addTag(tag);
    dispatch({ type: "set-tags", tags: service.listTags() });
  }, [service]);

  const removeTag = useCallback((tag) => {
    service.removeTag(tag);
    dispatch({ type: "set-notes", notes: service.list({ includeDeleted: state.filter.trash }) });
    dispatch({ type: "set-tags", tags: service.listTags() });
  }, [service, state.filter.trash]);

  const setQuery = useCallback((query) => {
    dispatch({ type: "set-query", query });
  }, []);

  const setFilter = useCallback((filter) => {
    dispatch({ type: "set-filter", filter });
  }, []);

  const setSelected = useCallback((id) => {
    dispatch({ type: "set-selected", id });
  }, []);

  // Derived filtered notes
  const visibleNotes = useMemo(() => {
    let list = state.notes;
    const { trash, tag, favorites } = state.filter;
    const q = state.query.trim().toLowerCase();

    if (trash) {
      list = service.list({ includeDeleted: true }).filter(n => n.deleted);
    } else {
      list = service.list().filter(n => !n.deleted);
    }

    if (favorites) list = list.filter(n => n.favorite);
    if (tag) list = list.filter(n => n.tags.includes(tag));
    if (q) {
      list = list.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [state.notes, state.filter, state.query, service]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod) return;

      if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        createNote();
      }
      if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        // save is implicit via updateNote calls; provide a minor visual cue can be implemented if needed
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [createNote]);

  const value = {
    state,
    notes: visibleNotes,
    allTags: state.tags,
    selectedId: state.selectedId,
    actions: {
      createNote,
      updateNote,
      deleteNote,
      purgeNote,
      restoreNote,
      addTag,
      removeTag,
      setQuery,
      setFilter,
      setSelected,
    },
  };

  return <NotesCtx.Provider value={value}>{children}</NotesCtx.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useNotes returns the notes context.
 */
export function useNotes() {
  const ctx = useContext(NotesCtx);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
}
