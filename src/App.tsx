import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DeviceSimulatorModal } from './components/DeviceSimulatorModal';
import { PairingModal } from './components/PairingModal';

// Views
import { OverviewView } from './views/OverviewView';
import { MyDevicesView } from './views/MyDevicesView';
import { DeviceInfoView } from './views/DeviceInfoView';
import { LiveLocationView } from './views/LiveLocationView';
import { LocationHistoryView } from './views/LocationHistoryView';
import { ScreenSharingView } from './views/ScreenSharingView';
import { AppUsageView } from './views/AppUsageView';
import { BatteryInfoView } from './views/BatteryInfoView';
import { DeviceActivityView } from './views/DeviceActivityView';
import { NotificationsView } from './views/NotificationsView';
import { UserManagementView } from './views/UserManagementView';
import { AccountSettingsView } from './views/AccountSettingsView';
import { SecuritySettingsView } from './views/SecuritySettingsView';
import { SubscriptionView } from './views/SubscriptionView';
import { AndroidStudioProjectView } from './views/AndroidStudioProjectView';

import { Device, Language, AdminUser, SubscriptionPlan, NotificationItem, DeviceActivityLog } from './types';
import { apiClient } from './api/client';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [lang, setLang] = useState<Language>('en');

  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionPlan | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activities, setActivities] = useState<DeviceActivityLog[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isPairingOpen, setIsPairingOpen] = useState(false);

  // Fetch initial telemetry and user auth
  const loadInitialData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [authData, deviceList, notifList] = await Promise.all([
        apiClient.getMe(),
        apiClient.getDevices(),
        apiClient.getNotifications()
      ]);

      setAdminUser(authData.user);
      setSubscription(authData.subscription);
      setDevices(deviceList);
      setNotifications(notifList);

      if (deviceList.length > 0) {
        setSelectedDevice((prev) => {
          if (prev) {
            const found = deviceList.find(d => d.id === prev.id);
            return found || deviceList[0];
          }
          return deviceList[0];
        });

        // Load activities for initial device
        const activeId = deviceList[0].id;
        apiClient.getActivities(activeId).then(setActivities).catch(console.error);
      }
    } catch (err) {
      console.error('Failed to load initial F Spy data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // When selected device changes, reload activities
  useEffect(() => {
    if (selectedDevice) {
      apiClient.getActivities(selectedDevice.id).then(setActivities).catch(console.error);
    }
  }, [selectedDevice?.id]);

  const handleDeviceUpdated = (updatedDevice: Device) => {
    setSelectedDevice(updatedDevice);
    setDevices(prev => prev.map(d => (d.id === updatedDevice.id ? updatedDevice : d)));
  };

  const handleDevicePaired = (newDevice: Device) => {
    setDevices(prev => [newDevice, ...prev]);
    setSelectedDevice(newDevice);
    setCurrentTab('device-info');
  };

  return (
    <div className="flex h-screen bg-[#080C15] text-slate-100 font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        unreadNotifsCount={notifications.filter(n => !n.read).length}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <Header
          devices={devices}
          selectedDevice={selectedDevice}
          onSelectDevice={(device) => setSelectedDevice(device)}
          lang={lang}
          setLang={setLang}
          adminUser={adminUser}
          notifications={notifications}
          onOpenPairing={() => setIsPairingOpen(true)}
          onRefresh={loadInitialData}
          isRefreshing={isRefreshing}
          onOpenNotifications={() => setCurrentTab('notifications')}
        />

        {/* Dynamic Views Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="max-w-7xl mx-auto pb-12">
            {currentTab === 'overview' && (
              <OverviewView
                devices={devices}
                selectedDevice={selectedDevice}
                onSelectDevice={(d) => setSelectedDevice(d)}
                activities={activities}
                adminUser={adminUser}
                subscription={subscription}
                lang={lang}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onOpenPairing={() => setIsPairingOpen(true)}
                onOpenSimulator={() => setIsSimulatorOpen(true)}
              />
            )}

            {currentTab === 'my-devices' && (
              <MyDevicesView
                devices={devices}
                selectedDevice={selectedDevice}
                onSelectDevice={(d) => setSelectedDevice(d)}
                lang={lang}
                onOpenPairing={() => setIsPairingOpen(true)}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onOpenSimulator={() => setIsSimulatorOpen(true)}
              />
            )}

            {currentTab === 'device-info' && (
              <DeviceInfoView
                device={selectedDevice}
                lang={lang}
                onRefresh={loadInitialData}
                onOpenSimulator={() => setIsSimulatorOpen(true)}
              />
            )}

            {currentTab === 'live-location' && (
              <LiveLocationView
                device={selectedDevice}
                lang={lang}
                onRefresh={loadInitialData}
                onOpenSimulator={() => setIsSimulatorOpen(true)}
              />
            )}

            {currentTab === 'location-history' && (
              <LocationHistoryView
                device={selectedDevice}
                lang={lang}
              />
            )}

            {currentTab === 'screen-sharing' && (
              <ScreenSharingView
                device={selectedDevice}
                lang={lang}
                onRefresh={loadInitialData}
                onOpenSimulator={() => setIsSimulatorOpen(true)}
              />
            )}

            {currentTab === 'app-usage' && (
              <AppUsageView
                device={selectedDevice}
                lang={lang}
              />
            )}

            {currentTab === 'battery-info' && (
              <BatteryInfoView
                device={selectedDevice}
                lang={lang}
                onOpenSimulator={() => setIsSimulatorOpen(true)}
              />
            )}

            {currentTab === 'device-activity' && (
              <DeviceActivityView
                device={selectedDevice}
                lang={lang}
              />
            )}

            {currentTab === 'notifications' && (
              <NotificationsView
                notifications={notifications}
                onRefresh={loadInitialData}
                lang={lang}
              />
            )}

            {currentTab === 'user-management' && (
              <UserManagementView
                adminUser={adminUser}
                lang={lang}
              />
            )}

            {currentTab === 'account-settings' && (
              <AccountSettingsView
                adminUser={adminUser}
                lang={lang}
                setLang={setLang}
              />
            )}

            {currentTab === 'security-settings' && (
              <SecuritySettingsView
                lang={lang}
              />
            )}

            {currentTab === 'subscription' && (
              <SubscriptionView
                subscription={subscription}
                onRefresh={loadInitialData}
                lang={lang}
              />
            )}

            {currentTab === 'android-code' && (
              <AndroidStudioProjectView
                lang={lang}
              />
            )}
          </div>
        </main>
      </div>

      {/* Interactive Companion Device Simulator Modal */}
      <DeviceSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        selectedDevice={selectedDevice}
        onDeviceUpdated={handleDeviceUpdated}
        lang={lang}
      />

      {/* 6-Digit Device Pairing Modal */}
      <PairingModal
        isOpen={isPairingOpen}
        onClose={() => setIsPairingOpen(false)}
        onDevicePaired={handleDevicePaired}
        lang={lang}
      />

    </div>
  );
}
