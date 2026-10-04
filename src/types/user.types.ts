export interface User {
  userId: string;
  email: string | null;
  username: string | null;
  fullName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY' | null;
  dob: string | null;
  profilePictureUrl: string | null;
  emailVerified: boolean;
  isOnboarded: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  timestamp: string;
  status: number;
  message: string;
  path: string;
}
