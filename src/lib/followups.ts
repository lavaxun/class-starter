// ── Data model ─────────────────────────────
export type Customer = {
  id: string;
  name: string;
  purchase_date: string; // YYYY-MM-DD
  done: Record<string, boolean>; // key = follow-up day offset, e.g. "1" "3" "5"
};

// Days after purchase to follow up (a common e-commerce customer-service rhythm; change it to fit your team)
export const FOLLOWUP_OFFSETS = [1, 3, 5, 14, 30];

const LS_KEY = "followups";

function lsList(): Customer[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}
function lsSave(rows: Customer[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(rows));
}

// ── Single read/write interface (data lives in your browser's localStorage) ──
export const store = {
  configured: false,

  async list(): Promise<Customer[]> {
    return lsList();
  },

  async add(name: string, purchase_date: string): Promise<Customer> {
    const row: Customer = {
      id: crypto.randomUUID(),
      name,
      purchase_date,
      done: {},
    };
    const rows = lsList();
    rows.unshift(row);
    lsSave(rows);
    return row;
  },

  // Note: look up by id, not name (so two customers with the same name never get mixed up)
  async toggle(id: string, offset: number): Promise<Customer[]> {
    const rows = lsList();
    const target = rows.find((r) => r.id === id);
    if (!target) return rows;
    const key = String(offset);
    const nextDone = { ...target.done, [key]: !target.done[key] };
    const next = rows.map((r) => (r.id === id ? { ...r, done: nextDone } : r));
    lsSave(next);
    return next;
  },

  async remove(id: string): Promise<void> {
    lsSave(lsList().filter((r) => r.id !== id));
  },
};
