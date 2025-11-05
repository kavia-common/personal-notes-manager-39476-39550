/**
 * PUBLIC_INTERFACE
 * EMPTY_NOTE creates a new note skeleton with defaults.
 */
export const EMPTY_NOTE = () => ({
  id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  title: "",
  content: "",
  tags: [],
  favorite: false,
  deleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export function nowISO() {
  return new Date().toISOString();
}
