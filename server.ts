import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Device, PairingRequest, LocationRecord, AppUsageStat, DeviceActivityLog, NotificationItem, SubscriptionPlan, AdminUser } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initial seed devices
const devices: Map<string, Device> = new Map();
const pairingRequests: Map<string, PairingRequest> = new Map();
const locationHistoryMap: Map<string, LocationRecord[]> = new Map();
const usageStatsMap: Map<string, AppUsageStat[]> = new Map();
const activityLogsMap: Map<string, DeviceActivityLog[]> = new Map();
const notificationsList: NotificationItem[] = [];
const webrtcSignals: Map<string, any[]> = new Map();

// Seed Device 1: Samsung Galaxy S24 Ultra
const sampleDevice1: Device = {
  id: 'dev_samsung_s24u',
  name: "Child Phone (Ayan's Galaxy)",
  model: 'SM-S928B (Galaxy S24 Ultra)',
  manufacturer: 'Samsung Electronics',
  androidVersion: 'Android 14 (Upside Down Cake)',
  androidSdk: 34,
  securityPatch: '2024-10-01',
  imeiMasked: '358249******812',
  status: 'online',
  assignedFamilyMember: 'Ayan Rahman (Son, Age 12)',
  pairedWithAdminId: 'admin_1',
  registeredAt: '2024-08-15T10:00:00Z',
  lastSync: new Date().toISOString(),
  screenSharingActive: false,
  screenSharingConsentGranted: true,
  installedAppsConsent: true,
  installedAppsConsentGrantedAt: '2024-08-15T10:05:00Z',
  battery: {
    level: 78,
    isCharging: false,
    health: 'Good',
    temperature: 31.4,
    voltage: 4180,
    powerSource: 'Battery'
  },
  network: {
    type: 'wifi',
    isConnected: true,
    ssid: 'Home_HighSpeed_5GHz',
    ipAddress: '192.168.1.145',
    signalStrength: 92,
    carrier: 'Grameenphone 4G LTE',
    linkSpeedMbps: 866,
    frequencyGhz: 5.2
  },
  storage: {
    totalBytes: 512 * 1024 * 1024 * 1024, // 512 GB
    availableBytes: 314 * 1024 * 1024 * 1024, // 314 GB free
    usedBytes: 198 * 1024 * 1024 * 1024,
    internalTotalBytes: 512 * 1024 * 1024 * 1024,
    internalAvailableBytes: 314 * 1024 * 1024 * 1024,
    sdCardPresent: false
  },
  permissions: {
    location: true,
    backgroundLocation: true,
    screenSharing: true,
    usageStats: true,
    installedApps: true,
    notifications: true
  },
  liveLocation: {
    latitude: 23.7937,
    longitude: 90.4066,
    accuracy: 4.8,
    speed: 0.0,
    altitude: 18.2,
    heading: 45,
    timestamp: new Date().toISOString(),
    address: 'Road 11, Banani, Dhaka 1213, Bangladesh'
  },
  installedApps: [
    {
      packageName: 'com.google.android.youtube',
      appName: 'YouTube',
      versionName: '19.42.34',
      versionCode: 1547892100,
      installTime: '2024-01-12T14:22:00Z',
      isSystemApp: true,
      sizeMb: 142.5,
      category: 'Entertainment',
      iconColor: '#FF0000'
    },
    {
      packageName: 'com.duolingo',
      appName: 'Duolingo: Language Lessons',
      versionName: '5.148.4',
      versionCode: 20241011,
      installTime: '2024-03-01T09:15:00Z',
      isSystemApp: false,
      sizeMb: 68.4,
      category: 'Education',
      iconColor: '#58CC02'
    },
    {
      packageName: 'com.whatsapp',
      appName: 'WhatsApp Messenger',
      versionName: '2.24.21.79',
      versionCode: 242179002,
      installTime: '2024-01-10T12:00:00Z',
      isSystemApp: false,
      sizeMb: 95.2,
      category: 'Social',
      iconColor: '#25D366'
    },
    {
      packageName: 'com.roblox.client',
      appName: 'Roblox',
      versionName: '2.646.687',
      versionCode: 2646687,
      installTime: '2024-05-18T16:40:00Z',
      isSystemApp: false,
      sizeMb: 184.0,
      category: 'Games',
      iconColor: '#E02424'
    },
    {
      packageName: 'com.google.android.apps.classroom',
      appName: 'Google Classroom',
      versionName: '8.0.421.04.90',
      versionCode: 8042104,
      installTime: '2024-01-15T08:30:00Z',
      isSystemApp: false,
      sizeMb: 48.7,
      category: 'Education',
      iconColor: '#10B981'
    },
    {
      packageName: 'com.khanacademy.android',
      appName: 'Khan Academy Kids',
      versionName: '4.3.0',
      versionCode: 4300,
      installTime: '2024-02-20T11:10:00Z',
      isSystemApp: false,
      sizeMb: 82.1,
      category: 'Education',
      iconColor: '#00BFA5'
    },
    {
      packageName: 'com.spotify.music',
      appName: 'Spotify: Music and Podcasts',
      versionName: '8.9.78.538',
      versionCode: 110482910,
      installTime: '2024-04-05T19:25:00Z',
      isSystemApp: false,
      sizeMb: 76.8,
      category: 'Entertainment',
      iconColor: '#1DB954'
    },
    {
      packageName: 'com.google.android.apps.maps',
      appName: 'Google Maps',
      versionName: '11.150.0101',
      versionCode: 1067482900,
      installTime: '2024-01-01T00:00:00Z',
      isSystemApp: true,
      sizeMb: 118.3,
      category: 'Productivity',
      iconColor: '#4285F4'
    },
    {
      packageName: 'com.android.chrome',
      appName: 'Google Chrome Browser',
      versionName: '130.0.6723.102',
      versionCode: 672310200,
      installTime: '2024-01-01T00:00:00Z',
      isSystemApp: true,
      sizeMb: 154.2,
      category: 'Productivity',
      iconColor: '#FBBC05'
    },
    {
      packageName: 'com.fspy.monitor',
      appName: 'F Spy Family Companion',
      versionName: '1.4.0-release',
      versionCode: 140,
      installTime: '2024-08-15T10:00:00Z',
      isSystemApp: false,
      sizeMb: 18.5,
      category: 'Productivity',
      iconColor: '#0066FF'
    }
  ]
};

// Seed Device 2: Google Pixel 8 Pro
const sampleDevice2: Device = {
  id: 'dev_pixel_8pro',
  name: "Teen Device (Zara's Pixel)",
  model: 'GC3VE (Pixel 8 Pro)',
  manufacturer: 'Google',
  androidVersion: 'Android 15 (Vanilla Ice Cream)',
  androidSdk: 35,
  securityPatch: '2024-11-01',
  imeiMasked: '354921******409',
  status: 'online',
  assignedFamilyMember: 'Zara Rahman (Daughter, Age 16)',
  pairedWithAdminId: 'admin_1',
  registeredAt: '2024-09-02T14:30:00Z',
  lastSync: new Date(Date.now() - 3 * 60000).toISOString(),
  screenSharingActive: false,
  screenSharingConsentGranted: false,
  installedAppsConsent: true,
  installedAppsConsentGrantedAt: '2024-09-02T14:35:00Z',
  battery: {
    level: 42,
    isCharging: true,
    health: 'Good',
    temperature: 33.2,
    voltage: 4020,
    powerSource: 'AC'
  },
  network: {
    type: 'cellular',
    isConnected: true,
    ssid: 'Banglalink 5G Fast',
    ipAddress: '100.84.21.90',
    signalStrength: 85,
    carrier: 'Banglalink Digital',
    linkSpeedMbps: 240
  },
  storage: {
    totalBytes: 256 * 1024 * 1024 * 1024, // 256 GB
    availableBytes: 94 * 1024 * 1024 * 1024, // 94 GB free
    usedBytes: 162 * 1024 * 1024 * 1024,
    internalTotalBytes: 256 * 1024 * 1024 * 1024,
    internalAvailableBytes: 94 * 1024 * 1024 * 1024,
    sdCardPresent: false
  },
  permissions: {
    location: true,
    backgroundLocation: true,
    screenSharing: false,
    usageStats: true,
    installedApps: true,
    notifications: true
  },
  liveLocation: {
    latitude: 23.7465,
    longitude: 90.3760,
    accuracy: 6.2,
    speed: 12.4,
    altitude: 12.0,
    heading: 190,
    timestamp: new Date().toISOString(),
    address: 'Dhanmondi Lake Road 27, Dhaka 1209, Bangladesh'
  },
  installedApps: [
    {
      packageName: 'com.instagram.android',
      appName: 'Instagram',
      versionName: '356.0.0.45.109',
      versionCode: 642891000,
      installTime: '2024-02-01T10:00:00Z',
      isSystemApp: false,
      sizeMb: 110.4,
      category: 'Social',
      iconColor: '#E1306C'
    },
    {
      packageName: 'com.zhiliaoapp.musically',
      appName: 'TikTok',
      versionName: '36.8.3',
      versionCode: 360803,
      installTime: '2024-02-14T11:20:00Z',
      isSystemApp: false,
      sizeMb: 168.2,
      category: 'Entertainment',
      iconColor: '#000000'
    },
    {
      packageName: 'com.duolingo',
      appName: 'Duolingo',
      versionName: '5.148.4',
      versionCode: 20241011,
      installTime: '2024-03-01T09:15:00Z',
      isSystemApp: false,
      sizeMb: 68.4,
      category: 'Education',
      iconColor: '#58CC02'
    },
    {
      packageName: 'com.fspy.monitor',
      appName: 'F Spy Family Companion',
      versionName: '1.4.0-release',
      versionCode: 140,
      installTime: '2024-09-02T14:30:00Z',
      isSystemApp: false,
      sizeMb: 18.5,
      category: 'Productivity',
      iconColor: '#0066FF'
    }
  ]
};

devices.set(sampleDevice1.id, sampleDevice1);
devices.set(sampleDevice2.id, sampleDevice2);

// Location history seed
const seedLocations1: LocationRecord[] = [
  {
    id: 'loc_1',
    deviceId: sampleDevice1.id,
    latitude: 23.7937,
    longitude: 90.4066,
    accuracy: 4.8,
    speed: 0.0,
    altitude: 18.2,
    timestamp: new Date().toISOString(),
    address: 'Road 11, Banani, Dhaka'
  },
  {
    id: 'loc_2',
    deviceId: sampleDevice1.id,
    latitude: 23.7915,
    longitude: 90.4045,
    accuracy: 5.1,
    speed: 18.4,
    altitude: 17.8,
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    address: 'Kamal Ataturk Ave, Banani, Dhaka'
  },
  {
    id: 'loc_3',
    deviceId: sampleDevice1.id,
    latitude: 23.7802,
    longitude: 90.4150,
    accuracy: 6.0,
    speed: 24.2,
    altitude: 16.5,
    timestamp: new Date(Date.now() - 75 * 60000).toISOString(),
    address: 'Gulshan 1 Circle, Dhaka'
  },
  {
    id: 'loc_4',
    deviceId: sampleDevice1.id,
    latitude: 23.7745,
    longitude: 90.3654,
    accuracy: 5.4,
    speed: 0.0,
    altitude: 14.1,
    timestamp: new Date(Date.now() - 140 * 60000).toISOString(),
    address: 'Dhaka Residential Model College, Mohammadpur'
  }
];
locationHistoryMap.set(sampleDevice1.id, seedLocations1);

// App Usage stats seed
const seedUsage1: AppUsageStat[] = [
  {
    id: 'use_1',
    deviceId: sampleDevice1.id,
    packageName: 'com.duolingo',
    appName: 'Duolingo: Language Lessons',
    dailyMinutes: 48,
    weeklyMinutes: 310,
    lastUsed: '15 mins ago',
    launchCount: 5,
    category: 'Education'
  },
  {
    id: 'use_2',
    deviceId: sampleDevice1.id,
    packageName: 'com.google.android.youtube',
    appName: 'YouTube',
    dailyMinutes: 62,
    weeklyMinutes: 430,
    lastUsed: '1 hour ago',
    launchCount: 4,
    category: 'Entertainment'
  },
  {
    id: 'use_3',
    deviceId: sampleDevice1.id,
    packageName: 'com.google.android.apps.classroom',
    appName: 'Google Classroom',
    dailyMinutes: 35,
    weeklyMinutes: 240,
    lastUsed: '3 hours ago',
    launchCount: 6,
    category: 'Education'
  },
  {
    id: 'use_4',
    deviceId: sampleDevice1.id,
    packageName: 'com.roblox.client',
    appName: 'Roblox',
    dailyMinutes: 28,
    weeklyMinutes: 195,
    lastUsed: 'Yesterday',
    launchCount: 2,
    category: 'Games'
  },
  {
    id: 'use_5',
    deviceId: sampleDevice1.id,
    packageName: 'com.whatsapp',
    appName: 'WhatsApp Messenger',
    dailyMinutes: 22,
    weeklyMinutes: 150,
    lastUsed: '25 mins ago',
    launchCount: 12,
    category: 'Social'
  }
];
usageStatsMap.set(sampleDevice1.id, seedUsage1);

// Activity logs seed
const seedActivities1: DeviceActivityLog[] = [
  {
    id: 'act_1',
    deviceId: sampleDevice1.id,
    eventType: 'wifi_change',
    title: 'Wi-Fi Network Connected',
    description: 'Switched to Home_HighSpeed_5GHz (Link Speed: 866 Mbps)',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    severity: 'info'
  },
  {
    id: 'act_2',
    deviceId: sampleDevice1.id,
    eventType: 'location_update',
    title: 'Arrived at Safe Zone (Home)',
    description: 'GPS pinned inside designated Safe Geofence "Home Banani"',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    severity: 'info'
  },
  {
    id: 'act_3',
    deviceId: sampleDevice1.id,
    eventType: 'app_launch',
    title: 'Educational App Launched',
    description: 'Duolingo: Language Lessons session started for 25 mins',
    timestamp: new Date(Date.now() - 85 * 60000).toISOString(),
    severity: 'info'
  },
  {
    id: 'act_4',
    deviceId: sampleDevice1.id,
    eventType: 'battery_low',
    title: 'Battery Level Telemetry',
    description: 'Battery steady at 78% with optimal temperature 31.4°C',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    severity: 'info'
  }
];
activityLogsMap.set(sampleDevice1.id, seedActivities1);

// Notification items seed
notificationsList.push(
  {
    id: 'notif_1',
    deviceId: sampleDevice1.id,
    title: 'Geofence Arrival',
    message: "Ayan's Galaxy reached Home Safe Zone at 15:45",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    read: false,
    type: 'geofence'
  },
  {
    id: 'notif_2',
    deviceId: sampleDevice2.id,
    title: 'Battery Low Warning',
    message: "Zara's Pixel battery dropped to 42%. Device is now charging via AC.",
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
    read: false,
    type: 'battery'
  },
  {
    id: 'notif_3',
    deviceId: sampleDevice1.id,
    title: 'Installed App Permission Granted',
    message: 'Device owner granted explicit consent to query installed applications.',
    timestamp: '2024-08-15T10:05:00Z',
    read: true,
    type: 'permission'
  }
);

// Admin user and subscriptions
let currentAdmin: AdminUser = {
  id: 'admin_1',
  email: 'mithu900052@gmail.com',
  name: 'Mithu Rahman (Family Guardian)',
  role: 'Owner',
  twoFactorEnabled: true,
  lastLogin: new Date().toISOString(),
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
};

let currentSubscription: SubscriptionPlan = {
  planId: 'premium',
  name: 'Premium Family Shield',
  price: '$12.99 / month',
  status: 'active',
  billingCycle: 'monthly',
  renewalDate: '2025-05-15',
  maxDevices: 5,
  currentDevices: 2,
  features: [
    'Up to 5 Android Devices',
    'Real-time GPS Tracking & Geofences',
    '30-day Location History Replay',
    'Interactive WebRTC Screen Sharing',
    'Full Installed Apps Catalog & Versions',
    'Wi-Fi & Cellular Connectivity Monitor',
    'Storage & Battery Telemetry',
    'App Usage Duration & Analytics',
    'Bilingual Support (English & Bengali)',
    'End-to-End Encrypted Sync'
  ]
};

// ================= API ROUTES =================

// Auth
app.get('/api/auth/me', (req, res) => {
  res.json({ user: currentAdmin, subscription: currentSubscription });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  currentAdmin.lastLogin = new Date().toISOString();
  res.json({ success: true, user: currentAdmin });
});

// Devices
app.get('/api/devices', (req, res) => {
  res.json(Array.from(devices.values()));
});

app.get('/api/devices/:id', (req, res) => {
  const device = devices.get(req.params.id);
  if (!device) {
    return res.status(404).json({ error: 'Device not found' });
  }
  res.json(device);
});

// Telemetry update (called by companion or simulator)
app.post('/api/devices/:id/telemetry', (req, res) => {
  const device = devices.get(req.params.id);
  if (!device) {
    return res.status(404).json({ error: 'Device not found' });
  }
  const { battery, network, storage, liveLocation, status } = req.body;
  if (battery) device.battery = { ...device.battery, ...battery };
  if (network) device.network = { ...device.network, ...network };
  if (storage) device.storage = { ...device.storage, ...storage };
  if (liveLocation) {
    device.liveLocation = { ...device.liveLocation, ...liveLocation };
    // also record in location history
    const history = locationHistoryMap.get(device.id) || [];
    history.unshift({
      id: `loc_${Date.now()}`,
      deviceId: device.id,
      latitude: liveLocation.latitude,
      longitude: liveLocation.longitude,
      accuracy: liveLocation.accuracy || 5.0,
      speed: liveLocation.speed || 0.0,
      altitude: liveLocation.altitude || 10.0,
      timestamp: new Date().toISOString(),
      address: liveLocation.address || 'Updated Location'
    });
    if (history.length > 50) history.pop();
    locationHistoryMap.set(device.id, history);
  }
  if (status) device.status = status;
  device.lastSync = new Date().toISOString();
  devices.set(device.id, device);
  res.json({ success: true, device });
});

// Consent toggle (Explicit user authorization for Installed Apps)
app.post('/api/devices/:id/consent', (req, res) => {
  const device = devices.get(req.params.id);
  if (!device) {
    return res.status(404).json({ error: 'Device not found' });
  }
  const { consentType, granted } = req.body;
  if (consentType === 'installedApps') {
    device.installedAppsConsent = Boolean(granted);
    device.permissions.installedApps = Boolean(granted);
    if (granted) {
      device.installedAppsConsentGrantedAt = new Date().toISOString();
    }
  } else if (consentType === 'screenSharing') {
    device.screenSharingConsentGranted = Boolean(granted);
    device.permissions.screenSharing = Boolean(granted);
  }
  devices.set(device.id, device);

  // Log activity
  const activities = activityLogsMap.get(device.id) || [];
  activities.unshift({
    id: `act_${Date.now()}`,
    deviceId: device.id,
    eventType: 'permission_change',
    title: `${consentType === 'installedApps' ? 'Installed Apps' : 'Screen Sharing'} Permission ${granted ? 'Granted' : 'Revoked'}`,
    description: `User explicitly ${granted ? 'authorized' : 'revoked'} access on Android companion device.`,
    timestamp: new Date().toISOString(),
    severity: granted ? 'info' : 'warning'
  });
  activityLogsMap.set(device.id, activities);

  res.json({ success: true, device });
});

// Installed apps update
app.post('/api/devices/:id/apps', (req, res) => {
  const device = devices.get(req.params.id);
  if (!device) {
    return res.status(404).json({ error: 'Device not found' });
  }
  if (!device.installedAppsConsent) {
    return res.status(403).json({
      error: 'Consent not granted',
      message: 'Android companion user has not granted explicit consent to query installed applications.'
    });
  }
  const { apps } = req.body;
  if (Array.isArray(apps)) {
    device.installedApps = apps;
    devices.set(device.id, device);
  }
  res.json({ success: true, count: device.installedApps.length });
});

// Location history
app.get('/api/devices/:id/location-history', (req, res) => {
  const history = locationHistoryMap.get(req.params.id) || [];
  res.json(history);
});

// Usage statistics
app.get('/api/devices/:id/usage', (req, res) => {
  const usage = usageStatsMap.get(req.params.id) || [];
  res.json(usage);
});

// Activities
app.get('/api/devices/:id/activities', (req, res) => {
  const activities = activityLogsMap.get(req.params.id) || [];
  res.json(activities);
});

// Notifications
app.get('/api/notifications', (req, res) => {
  res.json(notificationsList);
});

app.post('/api/notifications/clear', (req, res) => {
  notificationsList.length = 0;
  res.json({ success: true });
});

// Device Pairing System
app.post('/api/pairing/generate', (req, res) => {
  const { deviceName, model } = req.body;
  // Generate 6-digit random code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const tempDeviceId = `dev_${Date.now()}`;
  const pairingReq: PairingRequest = {
    code,
    deviceId: tempDeviceId,
    deviceName: deviceName || 'Android Smartphone',
    model: model || 'Android 14 Device',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 10 * 60000).toISOString(),
    status: 'pending'
  };
  pairingRequests.set(code, pairingReq);
  res.json({ success: true, code, expiresAt: pairingReq.expiresAt, deviceId: tempDeviceId });
});

app.post('/api/pairing/verify', (req, res) => {
  const { code, familyMember } = req.body;
  const request = pairingRequests.get(code);
  if (!request) {
    return res.status(404).json({ error: 'Invalid pairing code. Please generate a new code on your Android device.' });
  }
  if (new Date(request.expiresAt) < new Date()) {
    return res.status(400).json({ error: 'This pairing code has expired. Please regenerate on Android.' });
  }

  // Create new active device
  const newDevice: Device = {
    id: request.deviceId,
    name: request.deviceName,
    model: request.model,
    manufacturer: 'Android Device',
    androidVersion: 'Android 14',
    androidSdk: 34,
    securityPatch: '2024-10-01',
    imeiMasked: '359128******772',
    status: 'online',
    assignedFamilyMember: familyMember || 'Family Member',
    pairedWithAdminId: currentAdmin.id,
    registeredAt: new Date().toISOString(),
    lastSync: new Date().toISOString(),
    screenSharingActive: false,
    screenSharingConsentGranted: false,
    installedAppsConsent: true,
    installedAppsConsentGrantedAt: new Date().toISOString(),
    battery: {
      level: 95,
      isCharging: false,
      health: 'Good',
      temperature: 28.5,
      voltage: 4250,
      powerSource: 'Battery'
    },
    network: {
      type: 'wifi',
      isConnected: true,
      ssid: 'Family_Home_WiFi',
      ipAddress: '192.168.1.188',
      signalStrength: 95,
      carrier: 'Mobile Carrier',
      linkSpeedMbps: 650
    },
    storage: {
      totalBytes: 128 * 1024 * 1024 * 1024,
      availableBytes: 82 * 1024 * 1024 * 1024,
      usedBytes: 46 * 1024 * 1024 * 1024,
      internalTotalBytes: 128 * 1024 * 1024 * 1024,
      internalAvailableBytes: 82 * 1024 * 1024 * 1024,
      sdCardPresent: false
    },
    permissions: {
      location: true,
      backgroundLocation: true,
      screenSharing: false,
      usageStats: true,
      installedApps: true,
      notifications: true
    },
    liveLocation: {
      latitude: 23.8103,
      longitude: 90.4125,
      accuracy: 5.0,
      speed: 0.0,
      altitude: 15.0,
      heading: 0,
      timestamp: new Date().toISOString(),
      address: 'Gulshan 2, Dhaka, Bangladesh'
    },
    installedApps: [
      {
        packageName: 'com.google.android.youtube',
        appName: 'YouTube',
        versionName: '19.40.10',
        versionCode: 1547800000,
        installTime: '2024-03-10T10:00:00Z',
        isSystemApp: true,
        sizeMb: 120,
        category: 'Entertainment',
        iconColor: '#FF0000'
      },
      {
        packageName: 'com.duolingo',
        appName: 'Duolingo',
        versionName: '5.148.0',
        versionCode: 20241001,
        installTime: '2024-05-12T11:00:00Z',
        isSystemApp: false,
        sizeMb: 70,
        category: 'Education',
        iconColor: '#58CC02'
      },
      {
        packageName: 'com.fspy.monitor',
        appName: 'F Spy Family Companion',
        versionName: '1.4.0-release',
        versionCode: 140,
        installTime: new Date().toISOString(),
        isSystemApp: false,
        sizeMb: 18.5,
        category: 'Productivity',
        iconColor: '#0066FF'
      }
    ]
  };

  devices.set(newDevice.id, newDevice);
  request.status = 'approved';
  pairingRequests.delete(code);

  res.json({ success: true, device: newDevice });
});

// WebRTC Signaling for Screen Sharing
app.post('/api/webrtc/signal', (req, res) => {
  const { deviceId, signal, sender } = req.body;
  if (!deviceId || !signal) {
    return res.status(400).json({ error: 'Missing deviceId or signal' });
  }
  const queue = webrtcSignals.get(deviceId) || [];
  queue.push({ sender, signal, timestamp: Date.now() });
  webrtcSignals.set(deviceId, queue);

  // Update screen sharing state
  const device = devices.get(deviceId);
  if (device && signal.type === 'offer') {
    device.screenSharingActive = true;
    devices.set(deviceId, device);
  } else if (device && signal.type === 'bye') {
    device.screenSharingActive = false;
    devices.set(deviceId, device);
  }

  res.json({ success: true });
});

app.get('/api/webrtc/signal/:deviceId', (req, res) => {
  const deviceId = req.params.deviceId;
  const queue = webrtcSignals.get(deviceId) || [];
  webrtcSignals.set(deviceId, []); // drain queue
  res.json(queue);
});

// Subscription Management
app.get('/api/subscription', (req, res) => {
  res.json(currentSubscription);
});

app.post('/api/subscription/upgrade', (req, res) => {
  const { planId } = req.body;
  const plans: Record<string, { name: string; price: string; maxDevices: number }> = {
    free: { name: 'Free Trial Plan', price: '$0.00 / month', maxDevices: 1 },
    basic: { name: 'Basic Guardian Plan', price: '$6.99 / month', maxDevices: 2 },
    premium: { name: 'Premium Family Shield', price: '$12.99 / month', maxDevices: 5 },
    pro: { name: 'Professional Enterprise Guard', price: '$24.99 / month', maxDevices: 15 }
  };
  if (plans[planId]) {
    currentSubscription.planId = planId as any;
    currentSubscription.name = plans[planId].name;
    currentSubscription.price = plans[planId].price;
    currentSubscription.maxDevices = plans[planId].maxDevices;
    currentSubscription.status = 'active';
  }
  res.json({ success: true, subscription: currentSubscription });
});

// Mount Vite middleware for dev server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[F Spy Backend] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[F Spy Backend] Failed to start server:', err);
});
