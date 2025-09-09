export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
}

export interface Profile {
  id: string;
  name: string;
  role: string;
  companyName: string;
  companyId: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  profiles: Profile[];
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextType {
  user: User | null;
  profiles: Profile[];
  selectedProfile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  biometricEnabled: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithBiometric: () => Promise<void>;
  logout: () => Promise<void>;
  selectProfile: (profile: Profile) => void;
  enableBiometric: (enable: boolean) => Promise<void>;
}