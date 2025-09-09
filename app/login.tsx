import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import { PlatformButton, PlatformTextInput } from '../components/PlatformComponents';
import { PlatformColors, PlatformTypography, PlatformSpacing, PlatformRadius } from '../constants/PlatformTheme';

export default function LoginScreen() {
  const { login, loginWithBiometric, biometricEnabled } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const { hasHardware, isEnrolled, supportedTypes } = await authService.checkBiometricSupport();
      
      if (hasHardware && isEnrolled) {
        setBiometricAvailable(true);
        
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType(Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint');
        } else {
          setBiometricType('Biometric');
        }
        
        if (biometricEnabled) {
          setTimeout(handleBiometricLogin, 500);
        }
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        Platform.OS === 'ios' ? 'Required Fields' : 'Missing Information',
        'Please enter your email and password',
        [{ text: 'OK', style: Platform.OS === 'ios' ? 'default' : 'cancel' }]
      );
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });
      
      if (biometricAvailable && !biometricEnabled) {
        Alert.alert(
          Platform.OS === 'ios' ? `Enable ${biometricType}?` : 'Biometric Authentication',
          Platform.OS === 'ios' 
            ? `Use ${biometricType} to sign in faster next time.`
            : `Enable ${biometricType} for quick and secure access to your account.`,
          [
            { 
              text: Platform.OS === 'ios' ? 'Not Now' : 'SKIP', 
              style: 'cancel' 
            },
            {
              text: Platform.OS === 'ios' ? 'Enable' : 'ENABLE',
              onPress: async () => {
                await authService.saveBiometricCredentials({ email, password });
              },
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert(
        Platform.OS === 'ios' ? 'Sign In Failed' : 'Authentication Error',
        error.response?.data?.message || 'Please check your credentials and try again.',
        [{ text: 'OK', style: Platform.OS === 'ios' ? 'default' : 'cancel' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithBiometric();
    } catch (error: any) {
      Alert.alert(
        Platform.OS === 'ios' ? 'Authentication Required' : 'Biometric Failed',
        error.message || `${biometricType} authentication failed. Please try again or use your password.`,
        [{ text: 'OK', style: Platform.OS === 'ios' ? 'default' : 'cancel' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo/Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <MaterialIcons 
                  name="work" 
                  size={Platform.OS === 'ios' ? 48 : 56} 
                  color={PlatformColors?.primary} 
                />
              </View>
            </View>
            <Text style={styles.appName}>Nommy HR</Text>
            <Text style={styles.tagline}>
              {Platform.OS === 'ios' ? 'Employee Management System' : 'Your workplace companion'}
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            <PlatformTextInput
              label={Platform.OS === 'ios' ? 'Email' : 'Email address'}
              placeholder={Platform.OS === 'ios' ? 'your@email.com' : 'Enter your email'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              icon={
                <Ionicons 
                  name={Platform.OS === 'ios' ? 'mail-outline' : 'mail'} 
                  size={20} 
                  color={PlatformColors?.placeholderText || PlatformColors?.onSurfaceVariant} 
                />
              }
            />

            <PlatformTextInput
              label="Password"
              placeholder={Platform.OS === 'ios' ? 'Enter your password' : 'Password'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isLoading}
              icon={
                <Ionicons 
                  name={Platform.OS === 'ios' ? 'lock-closed-outline' : 'lock'} 
                  size={20} 
                  color={PlatformColors?.placeholderText || PlatformColors?.onSurfaceVariant} 
                />
              }
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 
                      (Platform.OS === 'ios' ? 'eye-outline' : 'visibility') : 
                      (Platform.OS === 'ios' ? 'eye-off-outline' : 'visibility-off')
                    }
                    size={20}
                    color={PlatformColors?.placeholderText || PlatformColors?.onSurfaceVariant}
                  />
                </TouchableOpacity>
              }
            />

            <PlatformButton
              title={Platform.OS === 'ios' ? 'Sign In' : 'LOGIN'}
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading || !email || !password}
              variant="primary"
              size="large"
              fullWidth
              style={styles.loginButton}
            />

            {biometricAvailable && biometricEnabled && (
              <PlatformButton
                title={`Sign in with ${biometricType}`}
                onPress={handleBiometricLogin}
                disabled={isLoading}
                variant="secondary"
                size="large"
                fullWidth
                icon={
                  <Ionicons
                    name={biometricType === 'Face ID' ? 'scan' : 'finger-print'}
                    size={24}
                    color={Platform.OS === 'ios' ? PlatformColors?.primary : PlatformColors?.onSecondaryContainer}
                  />
                }
                style={styles.biometricButton}
              />
            )}

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>
                {Platform.OS === 'ios' ? 'Forgot Password?' : 'FORGOT PASSWORD?'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          {Platform.OS === 'ios' && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By signing in, you agree to our{' '}
                <Text style={styles.link}>Terms of Service</Text> and{' '}
                <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Android Bottom Sheet Style Footer */}
      {Platform.OS === 'android' && (
        <View style={styles.androidFooter}>
          <View style={styles.androidFooterDivider} />
          <TouchableOpacity style={styles.androidFooterButton}>
            <Text style={styles.androidFooterText}>Need help? Contact Support</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.select({
      ios: PlatformColors?.background,
      android: PlatformColors?.background,
    }),
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Platform.select({
      ios: PlatformSpacing.lg,
      android: PlatformSpacing.md,
    }),
    paddingTop: Platform.select({
      ios: PlatformSpacing.xxl,
      android: PlatformSpacing.lg,
    }),
  },
  header: {
    alignItems: 'center',
    marginBottom: Platform.select({
      ios: PlatformSpacing.xxl,
      android: PlatformSpacing.xl,
    }),
  },
  logoContainer: {
    marginBottom: PlatformSpacing.md,
  },
  logo: {
    width: Platform.select({ ios: 100, android: 120 }),
    height: Platform.select({ ios: 100, android: 120 }),
    borderRadius: Platform.select({
      ios: PlatformRadius?.xl,
      android: PlatformRadius?.round,
    }),
    backgroundColor: Platform.select({
      ios: PlatformColors?.systemGray6,
      android: PlatformColors?.primaryContainer,
    }),
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  appName: {
    ...Platform.select({
      ios: PlatformTypography?.largeTitle,
      android: PlatformTypography?.displaySmall,
    }),
    color: PlatformColors?.label || PlatformColors?.onBackground,
    marginBottom: PlatformSpacing.xs,
  },
  tagline: {
    ...Platform.select({
      ios: PlatformTypography?.subheadline,
      android: PlatformTypography?.bodyLarge,
    }),
    color: Platform.select({
      ios: PlatformColors?.secondaryLabel,
      android: PlatformColors?.onSurfaceVariant,
    }),
    textAlign: 'center',
  },
  form: {
    width: '100%',
    flex: 1,
  },
  loginButton: {
    marginTop: PlatformSpacing.md,
    marginBottom: PlatformSpacing.sm,
  },
  biometricButton: {
    marginBottom: PlatformSpacing.md,
  },
  forgotPassword: {
    alignItems: 'center',
    paddingVertical: PlatformSpacing.md,
  },
  forgotPasswordText: {
    ...Platform.select({
      ios: PlatformTypography?.subheadline,
      android: PlatformTypography?.labelLarge,
    }),
    color: PlatformColors?.primary,
    fontWeight: Platform.select({
      ios: '600',
      android: '500',
    }),
  },
  footer: {
    paddingTop: PlatformSpacing.xl,
    paddingBottom: PlatformSpacing.lg,
    paddingHorizontal: PlatformSpacing.lg,
  },
  footerText: {
    ...PlatformTypography?.caption1,
    color: PlatformColors?.tertiaryLabel,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: PlatformColors?.link,
    fontWeight: '500',
  },
  androidFooter: {
    backgroundColor: PlatformColors?.surface,
    paddingBottom: PlatformSpacing.md,
  },
  androidFooterDivider: {
    height: 1,
    backgroundColor: PlatformColors?.outlineVariant,
    marginBottom: PlatformSpacing.sm,
  },
  androidFooterButton: {
    paddingVertical: PlatformSpacing.md,
    alignItems: 'center',
  },
  androidFooterText: {
    ...PlatformTypography?.labelLarge,
    color: PlatformColors?.primary,
    textTransform: 'uppercase',
  },
});