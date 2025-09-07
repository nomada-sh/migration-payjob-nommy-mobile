# Plan Comprehensive de Migración: Payjob → Nommy (Expo 2025)

## 🎯 Visión General

Migración completa de la aplicación legacy "payjob" (React Native CLI) a "nommy" (Expo SDK 53) utilizando las tecnologías más modernas y eficientes de 2025.

---

## 📊 Análisis de la Aplicación Legacy

### Funcionalidades Principales Identificadas:
- **Autenticación**: Login con email/password + autenticación biométrica
- **Navegación**: Tabs + Stack navigation compleja
- **Asistencia**: Check-in/out con geolocalización y notificaciones
- **Solicitudes**: Sistema de vacaciones y permisos
- **Beneficios**: Mapas con ubicaciones de beneficios
- **Perfil**: Gestión de usuario y configuraciones
- **Notificaciones Push**: Firebase Messaging + Notifee
- **Internacionalización**: i18next multi-idioma
- **Analytics**: App Center (crash reporting, analytics)

---

## 🚀 Arquitectura Moderna 2025

### Stack Tecnológico Nuevo:

#### **Core Framework**
- **Expo SDK 53** (React Native 0.79.6, React 19)
- **New Architecture** habilitada por defecto
- **Expo Router** para navegación file-based
- **TypeScript** strict mode

#### **State Management (Enfoque Híbrido)**
- **TanStack Query v5** para server state (reemplaza React Query)
- **Zustand** para client state (reemplaza Redux/Context API)
- **expo-secure-store** para persistencia segura

#### **Autenticación & Seguridad**
- **expo-local-authentication** para biométricos
- **expo-secure-store** para credentials
- **Clerk** o **Supabase Auth** para autenticación moderna
- **JWT + Refresh Tokens** pattern

#### **UI & Theming**
- **NativeWind** (Tailwind CSS para React Native)
- **expo-system-ui** para theming consistente
- **react-native-reanimated v3** para animaciones
- **expo-haptics** para feedback táctil

#### **Mapas & Geolocalización**
- **react-native-maps** (compatible con Expo)
- **expo-location** para geolocalización
- **expo-permissions** para manejo de permisos

#### **Notificaciones**
- **expo-notifications** con FCM V1
- **Development Build** requerido para push notifications
- **expo-device** para información del dispositivo

#### **Internacionalización**
- **expo-localization** + **i18next**
- **react-i18next** para componentes

---

## 📱 Estructura de Navegación (Expo Router)

```
nommy-employee/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── biometric-setup.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab Navigator
│   │   ├── home/
│   │   │   ├── index.tsx         # Home Screen
│   │   │   └── notifications.tsx
│   │   ├── attendance/
│   │   │   ├── index.tsx         # Check-in/out
│   │   │   ├── history.tsx
│   │   │   └── justification.tsx
│   │   ├── requests/
│   │   │   ├── index.tsx         # Solicitudes
│   │   │   ├── create.tsx
│   │   │   ├── [id].tsx          # Detalle
│   │   │   └── comments/[id].tsx
│   │   ├── benefits/
│   │   │   ├── index.tsx         # Lista beneficios
│   │   │   ├── map.tsx           # Mapa beneficios
│   │   │   └── [id].tsx          # Detalle beneficio
│   │   └── profile/
│   │       ├── index.tsx
│   │       ├── edit.tsx
│   │       └── settings.tsx
│   ├── _layout.tsx               # Root Layout
│   ├── +not-found.tsx
│   └── index.tsx                 # Landing/Auth Check
```

---

## 🔧 Plan de Migración por Fases

### **Fase 1: Configuración Base y Autenticación** (Semana 1-2)

#### 1.1 Setup Inicial ✅ COMPLETADO
```bash
# Configurar proyecto Expo
cd nommy-employee
npx expo install expo-router expo-constants expo-linking

# Instalar dependencias de autenticación
npx expo install expo-local-authentication expo-secure-store
npx expo install @tanstack/react-query zustand
```

#### 1.2 Configuración de Autenticación ✅ COMPLETADO
- [x] Implementar **expo-local-authentication** para biométricos
- [x] Configurar **expo-secure-store** para tokens
- [x] Migrar lógica de login desde `SignInScreen.tsx` legacy
- [ ] Implementar patrón JWT + Refresh Token (usando mock authentication)

#### 1.3 Estado Global Base
```typescript
// stores/authStore.ts (Zustand)
interface AuthState {
  user: User | null
  isAuthenticated: boolean
  biometricEnabled: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  enableBiometric: () => Promise<void>
}

// queries/authQueries.ts (TanStack Query)
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### **Fase 2: Navegación y UI Base** (Semana 2-3)

#### 2.1 Implementar Expo Router Navigation ✅ COMPLETADO
- [x] Configurar file-based routing
- [x] Migrar tab navigation a `(tabs)/_layout.tsx`
- [x] Implementar autenticación guards

#### 2.2 Sistema de Theming con NativeWind ⚠️ PENDIENTE
```bash
npx expo install nativewind
npx expo install tailwindcss
```

```typescript
// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        background: "#F8FAFC",
        card: "#FFFFFF",
      }
    }
  }
}
```

### **Fase 3: Funcionalidades Core** (Semana 3-5)

#### 3.1 Sistema de Asistencia
- Migrar hooks de check-in/out
- Implementar geolocalización con **expo-location**
- Configurar notificaciones locales para recordatorios

#### 3.2 Sistema de Solicitudes
- Migrar CRUD de vacation requests
- Implementar sistema de comentarios
- Configurar validaciones con **zod**

#### 3.3 Sistema de Beneficios
- Integrar **react-native-maps**
- Migrar markers y geolocalización
- Implementar filtros y búsqueda

### **Fase 4: Notificaciones Push** (Semana 5-6)

#### 4.1 Configuración FCM V1
```bash
# Requiere Development Build
npx expo install expo-notifications expo-device
eas build --platform android --profile development
```

#### 4.2 Implementación
- Configurar FCM V1 con Firebase
- Migrar lógica de topics subscription
- Implementar manejo de notificaciones en foreground/background

### **Fase 5: Features Avanzados** (Semana 6-7)

#### 5.1 Internacionalización
```bash
npx expo install expo-localization i18next react-i18next
```

#### 5.2 Animaciones y UX
```bash
npx expo install react-native-reanimated expo-haptics
```

#### 5.3 Formularios y Validaciones
```bash
npx expo install react-hook-form @hookform/resolvers zod
```

---

## 🚀 Deployment, Logs y Crash Reporting

### **EAS Build Configuration**

#### eas.json
```json
{
  "cli": {
    "version": ">= 7.8.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "buildConfiguration": "Debug"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### **Monitoring y Crash Reporting (Sentry)**

#### 1. Configuración Sentry
```bash
npx @sentry/wizard@latest -s -i expo
```

#### 2. EAS Integration
```bash
# Conectar Sentry account con EAS
# Projects > [Your Project] > Configuration > Project settings
# Link Sentry project
```

#### 3. Source Maps automáticos
- EAS Build sube automáticamente source maps a Sentry
- Configurar `SENTRY_AUTH_TOKEN` en environment variables

### **Logging Strategy**

#### Development
```typescript
// utils/logger.ts
import { __DEV__ } from 'react-native';

export const logger = {
  info: (message: string, extra?: any) => {
    if (__DEV__) {
      console.log(`[INFO] ${message}`, extra);
    }
  },
  error: (message: string, error?: Error) => {
    if (__DEV__) {
      console.error(`[ERROR] ${message}`, error);
    }
    // En producción, enviar a Sentry
    Sentry.captureException(error || new Error(message));
  }
}
```

#### Production Monitoring
- **Sentry**: Crash reporting y error tracking
- **EAS Insights**: Build and deployment analytics  
- **Expo Analytics**: User behavior tracking
- **Performance Monitoring**: React Native Performance

---

## 🔄 Comparativa: Legacy vs Moderno

| **Aspecto** | **Legacy (Payjob)** | **Moderno (Nommy)** |
|-------------|---------------------|---------------------|
| **Navigation** | React Navigation v6 | Expo Router (file-based) |
| **State Management** | React Query + Context | TanStack Query + Zustand |
| **Styling** | React Native Paper + Restyle | NativeWind (Tailwind) |
| **Auth** | react-native-biometrics | expo-local-authentication |
| **Push Notifications** | Firebase + Notifee | expo-notifications + FCM V1 |
| **Maps** | react-native-maps | react-native-maps + expo-location |
| **Storage** | react-native-keychain | expo-secure-store |
| **Build** | React Native CLI | EAS Build |
| **Crash Reporting** | App Center | Sentry + EAS Integration |
| **Bundle Size** | ~45MB | ~30MB (optimizado) |

---

## 📋 Checklist de Migración

### ✅ Preparación
- [x] Backup completo del proyecto legacy
- [ ] Configurar Expo Development Build
- [ ] Configurar EAS CLI y cuenta
- [ ] Configurar Sentry account

### ✅ Fase 1: Base
- [x] Configurar Expo Router navigation
- [x] Migrar sistema de autenticación
- [x] Implementar Zustand stores
- [x] Configurar TanStack Query
- [ ] Setup NativeWind theming

### ✅ Fase 2: Core Features
- [ ] Migrar sistema de asistencia
- [ ] Migrar sistema de solicitudes
- [ ] Migrar beneficios y mapas
- [ ] Implementar notificaciones push
- [ ] Migrar internacionalización

### ✅ Fase 3: UX/UI
- [ ] Implementar animaciones con Reanimated
- [ ] Configurar haptic feedback
- [ ] Optimizar performance
- [ ] Testing en dispositivos reales

### ✅ Fase 4: Production
- [ ] Configurar EAS Build profiles
- [ ] Setup Sentry monitoring
- [ ] Configurar CI/CD pipeline
- [ ] Deploy beta testing
- [ ] Release production

---

## 🎯 Beneficios de la Migración

### **Performance**
- **30% menor bundle size** con Expo managed workflow
- **Faster startup** con New Architecture
- **Better caching** con TanStack Query v5
- **Optimized builds** con EAS Build

### **Developer Experience**
- **File-based routing** simplifica navegación
- **Hot reload** mejorado con Expo
- **Better debugging** con Flipper/Expo DevTools
- **TypeScript strict** para mayor type safety

### **Maintainability**
- **Simplified dependencies** con Expo managed workflow
- **Unified API** para iOS/Android features
- **Better testing** con Expo Testing Library
- **Automated deployments** con EAS

### **Modern Features**
- **Push notifications** con FCM V1
- **Biometric authentication** nativo
- **Advanced animations** con Reanimated v3
- **Better offline support** con TanStack Query

---

## 🚨 Consideraciones y Riesgos

### **Limitaciones de Expo**
- Push notifications requieren Development Build (no Expo Go)
- Algunas librerías nativas pueden requerir config plugins
- iOS biométricos no funcionan en Expo Go

### **Breaking Changes**
- Navigation patterns completamente diferentes
- State management architecture cambió
- Theming system nuevo
- Build process diferente

### **Plan de Contingencia**
- Mantener app legacy funcionando durante migración
- Testing exhaustivo en dispositivos reales
- Rollback plan si surgen issues críticos
- Gradual rollout con feature flags

---

## 📚 Recursos y Documentación

- [Expo SDK 53 Documentation](https://docs.expo.dev/)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [TanStack Query v5](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand.pmnd.rs/)
- [NativeWind](https://www.nativewind.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Sentry for Expo](https://docs.expo.dev/guides/using-sentry/)

---

**Tiempo estimado total: 6-8 semanas**  
**Team recomendado: 2-3 developers**  
**Prioridad: High (modernización crítica)**