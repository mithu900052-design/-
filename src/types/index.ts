export type Language = 'en' | 'bn';

export interface BatteryInfo {
  level: number; // 0 - 100
  isCharging: boolean;
  health: 'Good' | 'Fair' | 'Poor' | 'Overheat';
  temperature: number; // in Celsius
  voltage: number; // in mV (e.g. 4120)
  powerSource: 'AC' | 'USB' | 'Wireless' | 'Battery';
}

export interface NetworkInfo {
  type: 'wifi' | 'cellular' | 'none';
  isConnected: boolean;
  ssid: string; // e.g. "Home_5G_Protected" or "Cellular Network"
  ipAddress: string;
  signalStrength: number; // 0 - 100 % or -dBm
  carrier: string; // e.g. "Grameenphone", "Verizon", "T-Mobile", "Banglalink"
  linkSpeedMbps: number;
  frequencyGhz?: number;
}

export interface StorageInfo {
  totalBytes: number;
  availableBytes: number;
  usedBytes: number;
  internalTotalBytes: number;
  internalAvailableBytes: number;
  sdCardPresent: boolean;
  sdCardTotalBytes?: number;
  sdCardAvailableBytes?: number;
}

export interface InstalledApp {
  packageName: string;
  appName: string;
  versionName: string;
  versionCode: number;
  installTime: string;
  lastUpdateTime?: string;
  isSystemApp: boolean;
  sizeMb: number;
  category: 'Social' | 'Games' | 'Productivity' | 'Education' | 'Entertainment' | 'System' | 'Other';
  iconColor?: string;
}

export interface DevicePermissions {
  location: boolean;
  backgroundLocation: boolean;
  screenSharing: boolean;
  usageStats: boolean;
  installedApps: boolean;
  notifications: boolean;
}

export interface LiveLocation {
  latitude: number;
  longitude: number;
  accuracy: number; // in meters
  speed: number; // in km/h
  altitude: number; // in meters
  heading: number;
  timestamp: string;
  address: string;
}

export interface LocationRecord {
  id: string;
  deviceId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number;
  altitude: number;
  timestamp: string;
  address: string;
}

export interface AppUsageStat {
  id: string;
  deviceId: string;
  packageName: string;
  appName: string;
  dailyMinutes: number;
  weeklyMinutes: number;
  lastUsed: string;
  launchCount: number;
  category: string;
}

export interface DeviceActivityLog {
  id: string;
  deviceId: string;
  eventType: 'app_launch' | 'screen_unlock' | 'wifi_change' | 'battery_low' | 'location_update' | 'screen_share_start' | 'screen_share_stop' | 'permission_change';
  title: string;
  description: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'alert';
}

export interface NotificationItem {
  id: string;
  deviceId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'battery' | 'geofence' | 'screen_share' | 'permission' | 'system';
}

export interface Device {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  androidVersion: string;
  androidSdk: number;
  securityPatch: string;
  imeiMasked: string;
  status: 'online' | 'offline' | 'idle';
  battery: BatteryInfo;
  network: NetworkInfo;
  storage: StorageInfo;
  permissions: DevicePermissions;
  installedAppsConsent: boolean;
  installedAppsConsentGrantedAt?: string;
  installedApps: InstalledApp[];
  liveLocation: LiveLocation;
  screenSharingActive: boolean;
  screenSharingConsentGranted: boolean;
  lastSync: string;
  registeredAt: string;
  pairedWithAdminId: string;
  assignedFamilyMember: string;
}

export interface PairingRequest {
  code: string;
  deviceId: string;
  deviceName: string;
  model: string;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'Owner' | 'Guardian' | 'Viewer';
  twoFactorEnabled: boolean;
  lastLogin: string;
  avatarUrl?: string;
}

export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'pro';

export interface SubscriptionPlan {
  planId: SubscriptionTier;
  name: string;
  price: string;
  status: 'active' | 'expiring' | 'expired';
  billingCycle: 'monthly' | 'yearly';
  renewalDate: string;
  maxDevices: number;
  currentDevices: number;
  features: string[];
}
