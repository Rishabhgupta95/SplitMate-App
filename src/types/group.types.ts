export interface Group {
  groupId: string;
  groupName: string;
  currency: string;
  description: string | null;
  inviteCode: string;
  memberCount: number;
  createdAt: string;
  members?: GroupMember[];
}

export interface GroupMember {
  userId: string;
  fullName: string;
  email: string | null;
  profilePictureUrl: string | null;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: string;
}

export interface GroupSummary {
  groupId: string;
  groupName: string;
  currency: string;
  memberCount: number;
  balance: number;
  description: string | null;
}
