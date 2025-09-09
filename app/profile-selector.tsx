import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Platform,
  TouchableNativeFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { PlatformCard, PlatformButton } from '../components/PlatformComponents';
import { PlatformColors, PlatformTypography, PlatformSpacing, PlatformRadius, PlatformShadows } from '../constants/PlatformTheme';

export default function ProfileSelectorScreen() {
  const { user, profiles, selectProfile, logout, isLoading } = useAuth();

  const handleProfileSelect = async (profile: any) => {
    await selectProfile(profile);
    router.replace('/(tabs)');
  };

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color={PlatformColors?.primary} 
          />
          <Text style={styles.loadingText}>
            {Platform.OS === 'ios' ? 'Loading Profiles...' : 'LOADING'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const ProfileCard = ({ profile }: { profile: any }) => {
    const cardContent = (
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {profile.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileRole}>{profile.role}</Text>
          <View style={styles.companyBadge}>
            <MaterialIcons 
              name="business" 
              size={12} 
              color={Platform.OS === 'ios' ? PlatformColors?.secondaryLabel : PlatformColors?.onSurfaceVariant} 
            />
            <Text style={styles.companyName}>{profile.companyName}</Text>
          </View>
        </View>
        
        <Ionicons 
          name={Platform.OS === 'ios' ? 'chevron-forward' : 'arrow-forward'} 
          size={Platform.OS === 'ios' ? 22 : 24} 
          color={Platform.OS === 'ios' ? PlatformColors?.systemGray3 : PlatformColors?.onSurfaceVariant} 
        />
      </View>
    );

    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback
          onPress={() => handleProfileSelect(profile)}
          background={TouchableNativeFeedback.Ripple('rgba(0,0,0,0.05)', false)}
        >
          {cardContent}
        </TouchableNativeFeedback>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => handleProfileSelect(profile)}
        activeOpacity={0.7}
      >
        {cardContent}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>
            {Platform.OS === 'ios' ? 'Welcome Back' : 'SELECT PROFILE'}
          </Text>
          <Text style={styles.userName}>
            {user?.name || user?.email}
          </Text>
          {Platform.OS === 'ios' && (
            <Text style={styles.instruction}>
              Choose a profile to continue
            </Text>
          )}
        </View>
        
        {Platform.OS === 'ios' && (
          <TouchableOpacity 
            style={styles.iosLogoutButton} 
            onPress={handleLogout}
          >
            <Text style={styles.iosLogoutText}>Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Profile List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.profilesContainer}
        showsVerticalScrollIndicator={Platform.OS === 'ios'}
      >
        {Platform.OS === 'android' && (
          <Text style={styles.androidSectionTitle}>
            {profiles.length} {profiles.length === 1 ? 'PROFILE' : 'PROFILES'} AVAILABLE
          </Text>
        )}

        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}

        {profiles.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <MaterialIcons 
                name="person-outline" 
                size={Platform.OS === 'ios' ? 64 : 72} 
                color={Platform.OS === 'ios' ? PlatformColors?.systemGray3 : PlatformColors?.onSurfaceVariant} 
              />
            </View>
            <Text style={styles.emptyStateText}>
              {Platform.OS === 'ios' ? 'No Profiles Available' : 'NO PROFILES FOUND'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {Platform.OS === 'ios' 
                ? 'Please contact your administrator for access'
                : 'Contact your administrator to assign profiles to your account'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Android FAB-style logout */}
      {Platform.OS === 'android' && (
        <View style={styles.androidBottomBar}>
          <PlatformButton
            title="SIGN OUT"
            onPress={handleLogout}
            variant="tertiary"
            size="medium"
            icon={
              <MaterialIcons 
                name="logout" 
                size={20} 
                color={PlatformColors?.error} 
              />
            }
            style={styles.androidLogoutButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.select({
      ios: PlatformColors?.systemGray6,
      android: PlatformColors?.background,
    }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: PlatformSpacing.md,
    ...Platform.select({
      ios: PlatformTypography?.subheadline,
      android: PlatformTypography?.labelMedium,
    }),
    color: Platform.select({
      ios: PlatformColors?.secondaryLabel,
      android: PlatformColors?.onSurfaceVariant,
    }),
  },
  header: {
    backgroundColor: Platform.select({
      ios: PlatformColors?.surface,
      android: PlatformColors?.surface,
    }),
    paddingHorizontal: Platform.select({
      ios: PlatformSpacing.lg,
      android: PlatformSpacing.md,
    }),
    paddingTop: PlatformSpacing.lg,
    paddingBottom: Platform.select({
      ios: PlatformSpacing.lg,
      android: PlatformSpacing.md,
    }),
    ...Platform.select({
      ios: {
        borderBottomWidth: 0.5,
        borderBottomColor: PlatformColors?.separator,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    ...Platform.select({
      ios: PlatformTypography?.caption1,
      android: PlatformTypography?.labelSmall,
    }),
    color: Platform.select({
      ios: PlatformColors?.secondaryLabel,
      android: PlatformColors?.onSurfaceVariant,
    }),
    textTransform: Platform.OS === 'android' ? 'uppercase' : 'none',
    marginBottom: Platform.select({
      ios: 4,
      android: 8,
    }),
  },
  userName: {
    ...Platform.select({
      ios: PlatformTypography?.largeTitle,
      android: PlatformTypography?.headlineMedium,
    }),
    color: Platform.select({
      ios: PlatformColors?.label,
      android: PlatformColors?.onSurface,
    }),
    marginBottom: Platform.select({
      ios: 8,
      android: 4,
    }),
  },
  instruction: {
    ...PlatformTypography?.subheadline,
    color: PlatformColors?.secondaryLabel,
  },
  iosLogoutButton: {
    position: 'absolute',
    top: PlatformSpacing.lg,
    right: PlatformSpacing.lg,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  iosLogoutText: {
    ...PlatformTypography?.subheadline,
    color: PlatformColors?.danger,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  profilesContainer: {
    paddingVertical: Platform.select({
      ios: PlatformSpacing.md,
      android: PlatformSpacing.sm,
    }),
    paddingHorizontal: Platform.select({
      ios: PlatformSpacing.lg,
      android: 0,
    }),
  },
  androidSectionTitle: {
    ...PlatformTypography?.labelSmall,
    color: PlatformColors?.onSurfaceVariant,
    paddingHorizontal: PlatformSpacing.md,
    paddingVertical: PlatformSpacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PlatformColors?.surface,
    paddingVertical: Platform.select({
      ios: PlatformSpacing.md,
      android: PlatformSpacing.md,
    }),
    paddingHorizontal: Platform.select({
      ios: PlatformSpacing.md,
      android: PlatformSpacing.md,
    }),
    marginBottom: Platform.select({
      ios: PlatformSpacing.sm,
      android: 1,
    }),
    ...Platform.select({
      ios: {
        borderRadius: PlatformRadius?.large,
        ...PlatformShadows?.small,
      },
      android: {
        borderBottomWidth: 1,
        borderBottomColor: PlatformColors?.outlineVariant,
      },
    }),
  },
  avatarContainer: {
    marginRight: PlatformSpacing.md,
  },
  avatar: {
    width: Platform.select({ ios: 52, android: 56 }),
    height: Platform.select({ ios: 52, android: 56 }),
    borderRadius: Platform.select({
      ios: PlatformRadius?.large,
      android: PlatformRadius?.round,
    }),
  },
  avatarPlaceholder: {
    backgroundColor: Platform.select({
      ios: PlatformColors?.primary,
      android: PlatformColors?.primaryContainer,
    }),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Platform.select({
      ios: '#fff',
      android: PlatformColors?.onPrimaryContainer,
    }),
    fontSize: Platform.select({ ios: 22, android: 24 }),
    fontWeight: Platform.select({
      ios: '700',
      android: '500',
    }),
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Platform.select({
      ios: PlatformTypography?.headline,
      android: PlatformTypography?.titleMedium,
    }),
    color: Platform.select({
      ios: PlatformColors?.label,
      android: PlatformColors?.onSurface,
    }),
    marginBottom: 2,
  },
  profileRole: {
    ...Platform.select({
      ios: PlatformTypography?.subheadline,
      android: PlatformTypography?.bodyMedium,
    }),
    color: Platform.select({
      ios: PlatformColors?.secondaryLabel,
      android: PlatformColors?.onSurfaceVariant,
    }),
    marginBottom: 4,
  },
  companyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    ...Platform.select({
      ios: PlatformTypography?.caption1,
      android: PlatformTypography?.labelSmall,
    }),
    color: Platform.select({
      ios: PlatformColors?.tertiaryLabel,
      android: PlatformColors?.onSurfaceVariant,
    }),
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Platform.select({
      ios: PlatformSpacing.xxl * 2,
      android: PlatformSpacing.xxl * 1.5,
    }),
    paddingHorizontal: PlatformSpacing.xl,
  },
  emptyIconContainer: {
    width: Platform.select({ ios: 100, android: 120 }),
    height: Platform.select({ ios: 100, android: 120 }),
    borderRadius: PlatformRadius?.round,
    backgroundColor: Platform.select({
      ios: PlatformColors?.systemGray5,
      android: PlatformColors?.surfaceVariant,
    }),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: PlatformSpacing.lg,
  },
  emptyStateText: {
    ...Platform.select({
      ios: PlatformTypography?.title3,
      android: PlatformTypography?.headlineSmall,
    }),
    color: Platform.select({
      ios: PlatformColors?.label,
      android: PlatformColors?.onSurface,
    }),
    marginBottom: PlatformSpacing.sm,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    ...Platform.select({
      ios: PlatformTypography?.body,
      android: PlatformTypography?.bodyMedium,
    }),
    color: Platform.select({
      ios: PlatformColors?.secondaryLabel,
      android: PlatformColors?.onSurfaceVariant,
    }),
    textAlign: 'center',
    paddingHorizontal: PlatformSpacing.lg,
  },
  androidBottomBar: {
    backgroundColor: PlatformColors?.surface,
    paddingHorizontal: PlatformSpacing.md,
    paddingVertical: PlatformSpacing.sm,
    borderTopWidth: 1,
    borderTopColor: PlatformColors?.outlineVariant,
  },
  androidLogoutButton: {
    alignSelf: 'flex-end',
  },
});
