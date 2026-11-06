import { Device, PairingRequest, LocationRecord, AppUsageStat, DeviceActivityLog, NotificationItem, SubscriptionPlan, AdminUser } from '../types';

export const apiClient = {
  // Auth
  async getMe(): Promise<{ user: AdminUser; subscription: SubscriptionPlan }> {
    const res = await fetch('/api/auth/me');
    if (!res.ok) throw new Error('Failed to fetch auth');
    return res.json();
  },

  // Devices
  async getDevices(): Promise<Device[]> {
    const res = await fetch('/api/devices');
    if (!res.ok) throw new Error('Failed to fetch devices');
    return res.json();
  },

  async getDevice(id: string): Promise<Device> {
    const res = await fetch(`/api/devices/${id}`);
    if (!res.ok) throw new Error('Failed to fetch device');
    return res.json();
  },

  async updateTelemetry(id: string, telemetry: Partial<Device>): Promise<{ success: boolean; device: Device }> {
    const res = await fetch(`/api/devices/${id}/telemetry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telemetry)
    });
    if (!res.ok) throw new Error('Failed to update telemetry');
    return res.json();
  },

  async updateConsent(id: string, consentType: 'installedApps' | 'screenSharing', granted: boolean): Promise<{ success: boolean; device: Device }> {
    const res = await fetch(`/api/devices/${id}/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consentType, granted })
    });
    if (!res.ok) throw new Error('Failed to update consent');
    return res.json();
  },

  async getLocationHistory(deviceId: string): Promise<LocationRecord[]> {
    const res = await fetch(`/api/devices/${deviceId}/location-history`);
    if (!res.ok) throw new Error('Failed to fetch location history');
    return res.json();
  },

  async getUsageStats(deviceId: string): Promise<AppUsageStat[]> {
    const res = await fetch(`/api/devices/${deviceId}/usage`);
    if (!res.ok) throw new Error('Failed to fetch usage stats');
    return res.json();
  },

  async getActivities(deviceId: string): Promise<DeviceActivityLog[]> {
    const res = await fetch(`/api/devices/${deviceId}/activities`);
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
  },

  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch('/api/notifications');
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async clearNotifications(): Promise<{ success: boolean }> {
    const res = await fetch('/api/notifications/clear', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to clear notifications');
    return res.json();
  },

  // Pairing
  async generatePairingCode(deviceName: string, model: string): Promise<{ success: boolean; code: string; expiresAt: string; deviceId: string }> {
    const res = await fetch('/api/pairing/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceName, model })
    });
    if (!res.ok) throw new Error('Failed to generate pairing code');
    return res.json();
  },

  async verifyPairingCode(code: string, familyMember: string): Promise<{ success: boolean; device: Device }> {
    const res = await fetch('/api/pairing/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, familyMember })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to verify pairing code');
    }
    return res.json();
  },

  // WebRTC
  async sendWebRTCSignal(deviceId: string, signal: any, sender: string): Promise<{ success: boolean }> {
    const res = await fetch('/api/webrtc/signal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, signal, sender })
    });
    if (!res.ok) throw new Error('Failed to send WebRTC signal');
    return res.json();
  },

  async pollWebRTCSignals(deviceId: string): Promise<any[]> {
    const res = await fetch(`/api/webrtc/signal/${deviceId}`);
    if (!res.ok) throw new Error('Failed to poll signals');
    return res.json();
  },

  // Subscription
  async getSubscription(): Promise<SubscriptionPlan> {
    const res = await fetch('/api/subscription');
    if (!res.ok) throw new Error('Failed to fetch subscription');
    return res.json();
  },

  async upgradeSubscription(planId: string): Promise<{ success: boolean; subscription: SubscriptionPlan }> {
    const res = await fetch('/api/subscription/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId })
    });
    if (!res.ok) throw new Error('Failed to upgrade subscription');
    return res.json();
  }
};
