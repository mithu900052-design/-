package com.fspy.monitor.data

import android.content.Context
import android.os.BatteryManager
import android.os.Build
import com.fspy.monitor.manager.NetworkStorageManager
import com.fspy.monitor.manager.UsageStatisticsManager
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.SetOptions
import kotlinx.coroutines.tasks.await

class FirebaseRepository(private val context: Context) {

    private val firestore = FirebaseFirestore.getInstance()
    private val networkStorageManager = NetworkStorageManager(context)
    private val usageStatsManager = UsageStatisticsManager(context)

    suspend fun syncDeviceTelemetry(deviceId: String, installedAppsConsent: Boolean) {
        val batteryManager = context.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
        val batteryLevel = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
        val isCharging = batteryManager.isCharging

        val network = networkStorageManager.getNetworkMetrics()
        val storage = networkStorageManager.getStorageMetrics()

        val telemetryData = hashMapOf(
            "lastSync" to java.util.Date(),
            "status" to "online",
            "battery" to hashMapOf(
                "level" to batteryLevel,
                "isCharging" to isCharging,
                "health" to "Good",
                "temperature" to 30.5,
                "voltage" to 4150,
                "powerSource" to if (isCharging) "AC" else "Battery"
            ),
            "network" to hashMapOf(
                "type" to network.type,
                "isConnected" to network.isConnected,
                "ssid" to network.ssid,
                "ipAddress" to network.ipAddress,
                "signalStrength" to network.signalStrength,
                "carrier" to network.carrier,
                "linkSpeedMbps" to network.linkSpeedMbps
            ),
            "storage" to hashMapOf(
                "totalBytes" to storage.totalBytes,
                "availableBytes" to storage.availableBytes,
                "usedBytes" to storage.usedBytes,
                "internalTotalBytes" to storage.internalTotalBytes,
                "internalAvailableBytes" to storage.internalAvailableBytes,
                "sdCardPresent" to storage.sdCardPresent
            ),
            "installedAppsConsent" to installedAppsConsent
        )

        firestore.collection("devices").document(deviceId)
            .set(telemetryData, SetOptions.merge())
            .await()

        // Sync installed applications if consent was explicitly authorized
        if (installedAppsConsent) {
            val apps = networkStorageManager.getInstalledApplications(true)
            val appsMapList = apps.map { app ->
                hashMapOf(
                    "packageName" to app.packageName,
                    "appName" to app.appName,
                    "versionName" to app.versionName,
                    "versionCode" to app.versionCode,
                    "installTime" to app.installTime,
                    "isSystemApp" to app.isSystemApp,
                    "sizeMb" to app.sizeMb,
                    "category" to app.category
                )
            }
            firestore.collection("devices").document(deviceId)
                .update("installedApps", appsMapList)
                .await()
        }
    }

    suspend fun recordAppUsage(deviceId: String) {
        val records = usageStatsManager.queryDailyUsage()
        for (item in records.take(15)) {
            firestore.collection("usage_statistics").add(
                hashMapOf(
                    "deviceId" to deviceId,
                    "packageName" to item.packageName,
                    "appName" to item.appName,
                    "dailyMinutes" to item.totalTimeInForegroundMinutes,
                    "lastUsed" to java.util.Date(item.lastTimeUsed),
                    "category" to "Usage"
                )
            )
        }
    }
}
