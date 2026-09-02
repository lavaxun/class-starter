// ── 数据模型 ─────────────────────────────
export type Customer = {
  id: string;
  name: string;
  purchase_date: string; // YYYY-MM-DD
  done: Record<string, boolean>; // key = 跟进天数偏移，例如 "1" "3" "5"
};

// 购买后第几天要跟进（电商客服常见的跟进节奏；可以改成你部门的节奏）
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

// ── 统一读写接口（数据存在你浏览器的 localStorage 里）──
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

  // 注意：按 id 定位，不是按 name（同名客户不会串台）
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
