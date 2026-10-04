import apiClient from '../lib/apiClient';
import { 
  Expense, 
  DashboardBalance, 
  SettlementSummary 
} from '../types/expense.types';

export const expenseService = {
  async getExpensesByGroup(groupId: string): Promise<Expense[]> {
    const response = await apiClient.get<Expense[]>(`/expenses/group/${groupId}`);
    return response.data;
  },

  async getAllExpenses(): Promise<Expense[]> {
    const response = await apiClient.get<Expense[]>('/expenses');
    return response.data;
  },

  async getExpenseById(expenseId: string): Promise<Expense> {
    const response = await apiClient.get<Expense>(`/expenses/${expenseId}`);
    return response.data;
  },

  async createExpense(data: any): Promise<Expense> {
    const response = await apiClient.post<Expense>('/expenses', data);
    return response.data;
  },

  async deleteExpense(expenseId: string): Promise<void> {
    await apiClient.delete(`/expenses/${expenseId}`);
  },

  async getDashboardBalance(): Promise<DashboardBalance> {
    const response = await apiClient.get<DashboardBalance>('/settlements/dashboard');
    return response.data;
  },

  async getGroupSettlement(groupId: string): Promise<SettlementSummary> {
    const response = await apiClient.get<SettlementSummary>(`/settlements/group/${groupId}`);
    return response.data;
  },

  async settle(data: { groupId: string; fromUserId: string; toUserId: string; amount: number }): Promise<void> {
    await apiClient.post('/settlements/settle', data);
  },
};
