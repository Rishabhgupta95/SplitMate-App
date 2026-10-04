import apiClient from '../lib/apiClient';
import { Group, GroupSummary, GroupMember } from '../types/group.types';

export const groupService = {
  async getMyGroups(): Promise<GroupSummary[]> {
    const response = await apiClient.get<GroupSummary[]>('/groups');
    return response.data;
  },

  async getGroupById(groupId: string): Promise<Group> {
    const response = await apiClient.get<Group>(`/groups/${groupId}`);
    return response.data;
  },

  async createGroup(data: { groupName: string; currency: string; description?: string }): Promise<Group> {
    const response = await apiClient.post<Group>('/groups', data);
    return response.data;
  },

  async addMember(groupId: string, data: { email?: string; userId?: string }): Promise<GroupMember> {
    const response = await apiClient.post<GroupMember>(`/groups/${groupId}/members`, data);
    return response.data;
  },

  async joinByCode(inviteCode: string): Promise<Group> {
    const response = await apiClient.post<Group>('/groups/join', { inviteCode });
    return response.data;
  },
};
