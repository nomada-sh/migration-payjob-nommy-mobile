import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { router } from 'expo-router';
import authService from '../services/authService';
import { User, Profile, LoginCredentials, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      setIsLoading(true);
      const storedUser = await authService.getStoredUser();
      const storedProfiles = await authService.getStoredProfiles();
      const storedSelectedProfile = await authService.getSelectedProfile();
      const isBiometricEnabled = await authService.isBiometricEnabled();
      
      if (storedUser) {
        setUser(storedUser);
        setProfiles(storedProfiles);
        setSelectedProfile(storedSelectedProfile);
        setBiometricEnabled(isBiometricEnabled);
        
        if (storedSelectedProfile) {
          router.replace('/(tabs)');
        } else if (storedProfiles.length > 0) {
          router.replace('/profile-selector');
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      setProfiles(response.profiles);
      
      if (response.profiles.length === 1) {
        await selectProfile(response.profiles[0]);
        router.replace('/(tabs)');
      } else {
        router.replace('/profile-selector');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithBiometric = async () => {
    try {
      setIsLoading(true);
      const response = await authService.loginWithBiometric();
      
      if (response) {
        setUser(response.user);
        setProfiles(response.profiles);
        
        const storedProfile = await authService.getSelectedProfile();
        if (storedProfile) {
          setSelectedProfile(storedProfile);
          router.replace('/(tabs)');
        } else if (response.profiles.length === 1) {
          await selectProfile(response.profiles[0]);
          router.replace('/(tabs)');
        } else {
          router.replace('/profile-selector');
        }
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setProfiles([]);
      setSelectedProfile(null);
      setBiometricEnabled(false);
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectProfile = async (profile: Profile) => {
    setSelectedProfile(profile);
    await authService.saveSelectedProfile(profile);
  };

  const enableBiometric = async (enable: boolean) => {
    try {
      if (enable) {
        const { hasHardware, isEnrolled } = await authService.checkBiometricSupport();
        
        if (!hasHardware || !isEnrolled) {
          throw new Error('Biometric authentication not available');
        }
        
        setBiometricEnabled(true);
      } else {
        await authService.removeBiometricCredentials();
        setBiometricEnabled(false);
      }
    } catch (error) {
      console.error('Enable biometric error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    profiles,
    selectedProfile,
    isLoading,
    isAuthenticated: !!user,
    biometricEnabled,
    login,
    loginWithBiometric,
    logout,
    selectProfile,
    enableBiometric,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};