const STORAGE_KEY = "pnm.notes.v1";
const TAGS_KEY = "pnm.tags.v1";

/**
 * PUBLIC_INTERFACE
 * NotesService provides a persistence abstraction for notes.
 * Currently uses localStorage; can be swapped later to API using REACT_APP_API_BASE.
 */
export class NotesService {
  constructor() {
    this.apiBase = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || null;
  }

  _load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    try { return raw ? JSON.parse(raw) : []; } catch { return []; }
  }

  _save(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }

  _loadTags() {
    const raw = localStorage.getItem(TAGS_KEY);
    try { return raw ? JSON.parse(raw) : []; } catch { return []; }
  }

  _saveTags(tags) {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  }

  // PUBLIC_INTERFACE
  list({ includeDeleted = false } = {}) {
    const notes = this._load();
    return notes
      .filter(n => includeDeleted ? true : !n.deleted)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  // PUBLIC_INTERFACE
  get(id) {
    return this._load().find(n => n.id === id) || null;
  }

  // PUBLIC_INTERFACE
  create(note) {
    const notes = this._load();
    notes.unshift(note);
    this._save(notes);
    this._mergeTagsFromNote(note);
    return note;
  }

  // PUBLIC_INTERFACE
  update(id, patch) {
    const notes = this._load();
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return null;
    notes[idx] = { ...notes[idx], ...patch, updatedAt: new Date().toISOString() };
    this._save(notes);
    this._mergeTagsFromNote(notes[idx]);
    return notes[idx];
  }

  // PUBLIC_INTERFACE
  delete(id) {
    const notes = this._load();
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return false;
    notes[idx].deleted = true;
    notes[idx].updatedAt = new Date().toISOString();
    this._save(notes);
    return true;
  }

  // PUBLIC_INTERFACE
  purge(id) {
    const notes = this._load();
    const next = notes.filter(n => n.id !== id);
    const changed = next.length !== notes.length;
    if (changed) this._save(next);
    return changed;
  }

  // PUBLIC_INTERFACE
  restore(id) {
    return this.update(id, { deleted: false });
  }

  // PUBLIC_INTERFACE
  listTags() {
    const tags = this._loadTags();
    // Keep only unique strings
    return Array.from(new Set(tags)).sort((a, b) => a.localeCompare(b));
  }

  // PUBLIC_INTERFACE
  addTag(tag) {
    const tags = this._loadTags();
    if (!tags.includes(tag)) {
      tags.push(tag);
      this._saveTags(tags);
    }
    return this.listTags();
  }

  // PUBLIC_INTERFACE
  removeTag(tag) {
    const notes = this._load().map(n => ({ ...n, tags: n.tags.filter(t => t !== tag) }));
    this._save(notes);
    const tags = this._loadTags().filter(t => t !== tag);
    this._saveTags(tags);
    return this.listTags();
  }

  _mergeTagsFromNote(note) {
    if (!note?.tags?.length) return;
    const tags = new Set(this._loadTags());
    note.tags.forEach(t => tags.add(t));
    this._saveTags(Array.from(tags));
  }
}
