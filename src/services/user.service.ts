import apiClient from '../lib/apiClient';
import { User } from '../types/user.types';

export const userService = {
  async updateProfile(data: { fullName?: string; gender?: string; dob?: string; profilePictureUrl?: string }): Promise<User> {
    const response = await apiClient.put<User>('/users/me', data);
    return response.data;
  },

  async changePassword(data: any): Promise<void> {
    await apiClient.post('/users/me/password', data);
  },

  async searchUsers(query: string): Promise<User[]> {
    const response = await apiClient.get<User[]>(`/users/search?q=${query}`);
    return response.data;
  },

  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  },
};
