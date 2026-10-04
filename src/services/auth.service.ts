import apiClient from '../lib/apiClient';
import { AuthResponse, User } from '../types/user.types';

export const authService = {
  async signupEmail(data: any): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signup/email', data);
    return response.data;
  },

  async signupUsername(data: any): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/signup/username', data);
    return response.data;
  },

  async login(data: any): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async completeOnboarding(data: any): Promise<User> {
    const response = await apiClient.post<User>('/auth/onboarding', data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  async googleLogin(idToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/google', { idToken });
    return response.data;
  },
};
