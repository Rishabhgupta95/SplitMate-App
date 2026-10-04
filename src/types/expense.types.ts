import { User } from './user.types';

export interface Expense {
  expenseId: string;
  groupId: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  expenseDate: string;
  paidBy: User;
  createdBy: User;
  splits: ExpenseSplit[];
  createdAt: string;
}

export interface ExpenseSplit {
  splitId: string;
  userId: string;
  fullName: string;
  profilePictureUrl: string | null;
  amountOwed: number;
}

export interface DashboardBalance {
  netBalance: number;
  totalOwed: number;
  totalOwe: number;
}

export interface BalancePair {
  fromUser: User;
  toUser: User;
  amount: number;
}

export interface SettlementSummary {
  groupId: string;
  groupName: string;
  balances: BalancePair[];
}
