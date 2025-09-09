import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import api from './api';
import { API_CONFIG } from '../config/api';
import { LoginCredentials, AuthResponse, Profile } from '../types/auth';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(API_CONFIG.ENDPOINTS.LOGIN, credentials);
      const { accessToken, refreshToken, user, profiles } = response.data;
      
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      await SecureStore.setItemAsync('profiles', JSON.stringify(profiles));
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async loginWithBiometric(): Promise<AuthResponse | null> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      
      if (!hasHardware || !isEnrolled) {
        throw new Error('Biometric authentication not available');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access Nommy',
        fallbackLabel: 'Use password',
        cancelLabel: 'Cancel',
      });

      if (!result.success) {
        return null;
      }

      const storedCredentials = await SecureStore.getItemAsync('biometricCredentials');
      if (!storedCredentials) {
        throw new Error('No stored credentials found');
      }

      const credentials = JSON.parse(storedCredentials) as LoginCredentials;
      return await this.login(credentials);
    } catch (error) {
      console.error('Biometric login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const token = await SecureStore.getItemAsync('refreshToken');
      if (token) {
        await api.post(API_CONFIG.ENDPOINTS.LOGOUT, { refreshToken: token });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('user');
      await SecureStore.deleteItemAsync('profiles');
      await SecureStore.deleteItemAsync('selectedProfile');
    }
  }

  async getStoredUser() {
    const userStr = await SecureStore.getItemAsync('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  async getStoredProfiles(): Promise<Profile[]> {
    const profilesStr = await SecureStore.getItemAsync('profiles');
    return profilesStr ? JSON.parse(profilesStr) : [];
  }

  async getSelectedProfile(): Promise<Profile | null> {
    const profileStr = await SecureStore.getItemAsync('selectedProfile');
    return profileStr ? JSON.parse(profileStr) : null;
  }

  async saveSelectedProfile(profile: Profile): Promise<void> {
    await SecureStore.setItemAsync('selectedProfile', JSON.stringify(profile));
  }

  async saveBiometricCredentials(credentials: LoginCredentials): Promise<void> {
    await SecureStore.setItemAsync('biometricCredentials', JSON.stringify(credentials));
    await SecureStore.setItemAsync('biometricEnabled', 'true');
  }

  async removeBiometricCredentials(): Promise<void> {
    await SecureStore.deleteItemAsync('biometricCredentials');
    await SecureStore.setItemAsync('biometricEnabled', 'false');
  }

  async isBiometricEnabled(): Promise<boolean> {
    const enabled = await SecureStore.getItemAsync('biometricEnabled');
    return enabled === 'true';
  }

  async checkBiometricSupport(): Promise<{
    hasHardware: boolean;
    isEnrolled: boolean;
    supportedTypes: LocalAuthentication.AuthenticationType[];
  }> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    return { hasHardware, isEnrolled, supportedTypes };
  }
}

export default new AuthService();