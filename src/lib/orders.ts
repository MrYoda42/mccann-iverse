export type LoggedOrder = {
  id: string;
  date: string;
  name: string;
  email: string;
  address: string;
  shipping: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
};

const KEY = "mini-mccann-orders";

export function readOrders(): LoggedOrder[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function logOrder(order: LoggedOrder) {
  localStorage.setItem(KEY, JSON.stringify([order, ...readOrders()]));
}

export function clearOrders() {
  localStorage.removeItem(KEY);
}
