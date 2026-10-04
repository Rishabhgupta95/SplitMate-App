export type Member = {
  id: string;
  name: string;
  initials: string;
  color: string; // hsl background tint
};

export type Expense = {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string; // member id
  date: string; // ISO
  category: "Food" | "Accommodation" | "Transport" | "Entertainment" | "Other";
  splits: { memberId: string; amount: number }[];
};

export type Group = {
  id: string;
  name: string;
  emoji: string;
  description?: string;
  memberIds: string[];
  createdAt: string;
};

export const currentUserId = "u1";

export const members: Member[] = [
  { id: "u1", name: "You",      initials: "YO", color: "160 84% 55%" },
  { id: "u2", name: "Aarav",    initials: "AA", color: "265 80% 65%" },
  { id: "u3", name: "Priya",    initials: "PR", color: "20 90% 60%" },
  { id: "u4", name: "Rohan",    initials: "RO", color: "200 85% 60%" },
  { id: "u5", name: "Sneha",    initials: "SN", color: "330 75% 65%" },
  { id: "u6", name: "Karan",    initials: "KA", color: "45 90% 60%" },
];

export const groups: Group[] = [
  {
    id: "g1",
    name: "Goa Trip",
    emoji: "🏝️",
    description: "Beach getaway, March",
    memberIds: ["u1", "u2", "u3", "u4"],
    createdAt: "2026-03-12",
  },
  {
    id: "g2",
    name: "Apartment 4B",
    emoji: "🏠",
    description: "Roommates monthly",
    memberIds: ["u1", "u5", "u6"],
    createdAt: "2026-01-04",
  },
  {
    id: "g3",
    name: "Office Lunch Club",
    emoji: "🥗",
    description: "Weekday lunches",
    memberIds: ["u1", "u2", "u4", "u6"],
    createdAt: "2026-02-20",
  },
];

const equal = (amount: number, ids: string[]) => {
  const share = +(amount / ids.length).toFixed(2);
  return ids.map((memberId) => ({ memberId, amount: share }));
};

export const expenses: Expense[] = [
  { id: "e1", groupId: "g1", description: "Beach resort booking", amount: 24000, paidBy: "u1", date: "2026-04-20", category: "Accommodation", splits: equal(24000, ["u1","u2","u3","u4"]) },
  { id: "e2", groupId: "g1", description: "Sunday brunch",        amount: 3200,  paidBy: "u2", date: "2026-04-21", category: "Food",          splits: equal(3200, ["u1","u2","u3","u4"]) },
  { id: "e3", groupId: "g1", description: "Scuba diving",         amount: 9600,  paidBy: "u3", date: "2026-04-22", category: "Entertainment", splits: equal(9600, ["u1","u2","u3","u4"]) },
  { id: "e4", groupId: "g1", description: "Cab to airport",       amount: 1800,  paidBy: "u1", date: "2026-04-23", category: "Transport",     splits: equal(1800, ["u1","u2","u3","u4"]) },

  { id: "e5", groupId: "g2", description: "April rent",           amount: 45000, paidBy: "u5", date: "2026-04-01", category: "Accommodation", splits: equal(45000, ["u1","u5","u6"]) },
  { id: "e6", groupId: "g2", description: "Electricity bill",     amount: 2400,  paidBy: "u1", date: "2026-04-08", category: "Other",         splits: equal(2400, ["u1","u5","u6"]) },
  { id: "e7", groupId: "g2", description: "Wifi",                 amount: 1500,  paidBy: "u6", date: "2026-04-10", category: "Other",         splits: equal(1500, ["u1","u5","u6"]) },
  { id: "e8", groupId: "g2", description: "Groceries",            amount: 3800,  paidBy: "u1", date: "2026-04-18", category: "Food",          splits: equal(3800, ["u1","u5","u6"]) },

  { id: "e9",  groupId: "g3", description: "Tuesday salads",      amount: 1600, paidBy: "u4", date: "2026-04-15", category: "Food", splits: equal(1600, ["u1","u2","u4","u6"]) },
  { id: "e10", groupId: "g3", description: "Friday pizza",        amount: 2200, paidBy: "u1", date: "2026-04-19", category: "Food", splits: equal(2200, ["u1","u2","u4","u6"]) },
];

export const memberById = (id: string) => members.find((m) => m.id === id)!;
export const groupById = (id: string) => groups.find((g) => g.id === id);
export const expensesForGroup = (gid: string) => expenses.filter((e) => e.groupId === gid);

/** Net balance for the current user inside a single group. + = owed to you, - = you owe. */
export function groupBalanceForUser(gid: string, userId = currentUserId) {
  let net = 0;
  for (const e of expensesForGroup(gid)) {
    const myShare = e.splits.find((s) => s.memberId === userId)?.amount ?? 0;
    if (e.paidBy === userId) net += e.amount - myShare;
    else net -= myShare;
  }
  return Math.round(net * 100) / 100;
}

/** Per-member net inside a group from current user's perspective. */
export function perMemberBalance(gid: string, userId = currentUserId) {
  const map = new Map<string, number>();
  for (const e of expensesForGroup(gid)) {
    const myShare = e.splits.find((s) => s.memberId === userId)?.amount ?? 0;
    if (e.paidBy === userId) {
      for (const s of e.splits) {
        if (s.memberId === userId) continue;
        map.set(s.memberId, (map.get(s.memberId) ?? 0) + s.amount);
      }
    } else {
      // someone else paid; you owe them your share
      map.set(e.paidBy, (map.get(e.paidBy) ?? 0) - myShare);
    }
  }
  return Array.from(map.entries()).map(([memberId, amount]) => ({
    memberId,
    amount: Math.round(amount * 100) / 100,
  }));
}

export function totalsForUser(userId = currentUserId) {
  let owed = 0;
  let owe = 0;
  for (const g of groups) {
    const bal = groupBalanceForUser(g.id, userId);
    if (bal > 0) owed += bal;
    else owe += -bal;
  }
  return { owed: +owed.toFixed(2), owe: +owe.toFixed(2), net: +(owed - owe).toFixed(2) };
}

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
