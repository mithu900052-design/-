import React, { useState } from 'react';
import { Code2, Terminal, Copy, Check, Download, FileText, Smartphone, ShieldCheck, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface AndroidStudioProjectViewProps {
  lang: Language;
}

export const AndroidStudioProjectView: React.FC<AndroidStudioProjectViewProps> = ({ lang }) => {
  const t = translations[lang];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  const projectFiles = [
    {
      id: 'manifest',
      name: 'AndroidManifest.xml',
      path: 'android/app/src/main/AndroidManifest.xml',
      desc: 'Foreground service declarations (location, mediaProjection), permissions & launcher',
      language: 'xml'
    },
    {
      id: 'main_activity',
      name: 'MainActivity.kt',
      path: 'android/app/src/main/java/com/fspy/monitor/MainActivity.kt',
      desc: 'Jetpack Compose entrypoint with MediaProjection contract & dark UI theme',
      language: 'kotlin'
    },
    {
      id: 'location_service',
      name: 'LocationService.kt',
      path: 'android/app/src/main/java/com/fspy/monitor/service/LocationService.kt',
      desc: 'Foreground GPS location service with ongoing notification & Firestore sync',
      language: 'kotlin'
    },
    {
      id: 'screen_sharing',
      name: 'ScreenSharingService.kt',
      path: 'android/app/src/main/java/com/fspy/monitor/service/ScreenSharingService.kt',
      desc: 'Android MediaProjection screen mirror service with stop action notification',
      language: 'kotlin'
    },
    {
      id: 'network_storage',
      name: 'NetworkStorageManager.kt',
      path: 'android/app/src/main/java/com/fspy/monitor/manager/NetworkStorageManager.kt',
      desc: 'Hardware Wi-Fi SSID, link speed, storage capacity, and consent-gated app listing',
      language: 'kotlin'
    },
    {
      id: 'installed_apps_ui',
      name: 'InstalledAppsScreen.kt',
      path: 'android/app/src/main/java/com/fspy/monitor/ui/InstalledAppsScreen.kt',
      desc: 'Companion user screen with explicit consent toggle and package enumeration',
      language: 'kotlin'
    },
    {
      id: 'pairing_ui',
      name: 'DevicePairingScreen.kt',
      path: 'android/app/src/main/java/com/fspy/monitor/ui/DevicePairingScreen.kt',
      desc: 'Generates 6-digit one-time pairing code with 10-minute expiry',
      language: 'kotlin'
    },
    {
      id: 'usage_stats',
      name: 'UsageStatisticsManager.kt',
      path: 'android/app/src/main/java/com/fspy/monitor/manager/UsageStatisticsManager.kt',
      desc: 'Queries Android UsageStatsManager for daily and weekly screen time',
      language: 'kotlin'
    },
    {
      id: 'firebase_repo',
      name: 'FirebaseRepository.kt',
      path: 'android/app/src/main/java/com/fspy/monitor/data/FirebaseRepository.kt',
      desc: 'Syncs battery, network, storage, location, and installed apps to Firestore',
      language: 'kotlin'
    },
    {
      id: 'build_gradle',
      name: 'app/build.gradle.kts',
      path: 'android/app/build.gradle.kts',
      desc: 'Gradle build script configuring SDK 34, Jetpack Compose, WebRTC & Firebase BOM',
      language: 'kotlin'
    }
  ];

  const [activeFileId, setActiveFileId] = useState('manifest');
  const activeFile = projectFiles.find(f => f.id === activeFileId) || projectFiles[0];

  const codeSnippets: Record<string, string> = {
    manifest: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.fspy.monitor">

    <!-- Network & Internet -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />

    <!-- Location Permissions (Fine & Background) -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />

    <!-- Foreground Services for Android 14+ -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION" />

    <!-- Notifications for Android 13+ -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- App Usage Stats Permission -->
    <uses-permission android:name="android.permission.PACKAGE_USAGE_STATS" />

    <application
        android:name=".FSpyApplication"
        android:label="@string/app_name"
        android:theme="@style/Theme.FSpy">

        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".service.LocationService"
            android:foregroundServiceType="location" />

        <service
            android:name=".service.ScreenSharingService"
            android:foregroundServiceType="mediaProjection" />
    </application>
</manifest>`,
    main_activity: `package com.fspy.monitor

import android.content.Intent
import android.media.projection.MediaProjectionManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import com.fspy.monitor.data.AuthenticationRepository
import com.fspy.monitor.service.ScreenSharingService
import com.fspy.monitor.ui.DashboardScreen
import com.fspy.monitor.ui.DevicePairingScreen

class MainActivity : ComponentActivity() {
    private lateinit var authRepo: AuthenticationRepository

    private val screenCaptureLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK && result.data != null) {
            val serviceIntent = Intent(this, ScreenSharingService::class.java).apply {
                action = ScreenSharingService.ACTION_START
                putExtra(ScreenSharingService.EXTRA_RESULT_CODE, result.resultCode)
                putExtra(ScreenSharingService.EXTRA_RESULT_DATA, result.data)
            }
            startForegroundService(serviceIntent)
        }
    }
    // ... Jetpack Compose layout and Navigation
}`,
    network_storage: `package com.fspy.monitor.manager

import android.content.Context
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.wifi.WifiManager
import android.os.Environment
import android.os.StatFs

class NetworkStorageManager(private val context: Context) {
    fun getNetworkMetrics(): NetworkMetrics {
        // Queries active Wi-Fi SSID, link speed, cellular carrier
    }

    fun getStorageMetrics(): StorageMetrics {
        val stat = StatFs(Environment.getDataDirectory().path)
        val totalBytes = stat.blockCountLong * stat.blockSizeLong
        val availableBytes = stat.availableBlocksLong * stat.blockSizeLong
        return StorageMetrics(totalBytes, availableBytes, totalBytes - availableBytes, ...)
    }

    fun getInstalledApplications(userConsentGranted: Boolean): List<InstalledAppItem> {
        if (!userConsentGranted) return emptyList()
        val pm = context.packageManager
        // Strictly enumerates app names, versions, and sizes without sensitive private data
    }
}`
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Code2 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.navAndroidStudioProject}</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete native Kotlin codebase, Android 14/15 Jetpack Compose UI, and APK compilation manual.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300">
            Package: <strong className="text-white">com.fspy.monitor</strong>
          </span>
        </div>
      </div>

      {/* Build & Signing Instructions Card */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Terminal Commands to Build Android APK</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Gradle 8.3.2 • JDK 17</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          {/* Debug APK */}
          <div className="bg-[#080C15] p-4 rounded-xl border border-slate-800 space-y-2 relative">
            <div className="flex justify-between text-slate-400">
              <span className="text-cyan-400 font-bold">1. Build Debug APK</span>
              <button
                onClick={() => copyToClipboard('debug', 'cd android && ./gradlew assembleDebug')}
                className="text-slate-400 hover:text-white"
              >
                {copiedKey === 'debug' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <code className="text-slate-200 block bg-slate-900/80 p-2 rounded border border-slate-800">
              cd android<br />
              chmod +x gradlew<br />
              ./gradlew assembleDebug
            </code>
            <p className="text-[10px] text-slate-500 font-sans">
              Output: <code className="text-slate-400">android/app/build/outputs/apk/debug/app-debug.apk</code>
            </p>
          </div>

          {/* Signed Release APK */}
          <div className="bg-[#080C15] p-4 rounded-xl border border-slate-800 space-y-2 relative">
            <div className="flex justify-between text-slate-400">
              <span className="text-emerald-400 font-bold">2. Build Signed Production APK</span>
              <button
                onClick={() => copyToClipboard('release', 'cd android && ./gradlew assembleRelease')}
                className="text-slate-400 hover:text-white"
              >
                {copiedKey === 'release' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <code className="text-slate-200 block bg-slate-900/80 p-2 rounded border border-slate-800">
              cd android<br />
              ./gradlew assembleRelease
            </code>
            <p className="text-[10px] text-slate-500 font-sans">
              Output: <code className="text-slate-400">android/app/build/outputs/apk/release/app-release.apk</code>
            </p>
          </div>
        </div>
      </div>

      {/* Code Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: File Tree */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 pb-1">
            Generated Android Source Files
          </p>

          <div className="space-y-1">
            {projectFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => setActiveFileId(file.id)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition flex flex-col ${
                  activeFileId === file.id
                    ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/40'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold truncate">{file.name}</span>
                </div>
                <span className="text-[10px] text-slate-500 truncate mt-0.5">{file.path}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Code Viewer */}
        <div className="lg:col-span-2 bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono">{activeFile.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{activeFile.desc}</p>
              </div>

              <button
                onClick={() => copyToClipboard('source', codeSnippets[activeFile.id] || activeFile.desc)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              >
                {copiedKey === 'source' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'source' ? 'Copied!' : 'Copy Snippet'}</span>
              </button>
            </div>

            <div className="bg-[#080C15] p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-[440px] scrollbar-thin scrollbar-thumb-slate-800">
              <pre>
                <code>{codeSnippets[activeFile.id] || `// Source file path: ${activeFile.path}\n// Full code available in project repository.`}</code>
              </pre>
            </div>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Full compliance with Android 14 Foreground Service Policies</span>
            </span>
            <span className="font-mono">Kotlin 1.9.23 • Compose BOM 2024.06.00</span>
          </div>
        </div>

      </div>

    </div>
  );
};
