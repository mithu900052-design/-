package com.fspy.monitor.manager

import android.app.usage.UsageStats
import android.app.usage.UsageStatsManager
import android.content.Context
import java.util.Calendar

data class AppUsageRecord(
    val packageName: String,
    val appName: String,
    val totalTimeInForegroundMinutes: Long,
    val lastTimeUsed: Long
)

class UsageStatisticsManager(private val context: Context) {

    fun queryDailyUsage(): List<AppUsageRecord> {
        val usageStatsManager =
            context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
                ?: return emptyList()

        val calendar = Calendar.getInstance()
        val endTime = calendar.timeInMillis
        calendar.set(Calendar.HOUR_OF_DAY, 0)
        calendar.set(Calendar.MINUTE, 0)
        calendar.set(Calendar.SECOND, 0)
        val startTime = calendar.timeInMillis

        val usageStatsList: List<UsageStats> =
            usageStatsManager.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                endTime
            ) ?: return emptyList()

        val pm = context.packageManager
        val records = mutableListOf<AppUsageRecord>()

        for (stats in usageStatsList) {
            val foregroundMinutes = stats.totalTimeInForeground / (1000 * 60)
            if (foregroundMinutes > 0) {
                var appName = stats.packageName
                try {
                    val appInfo = pm.getApplicationInfo(stats.packageName, 0)
                    appName = pm.getApplicationLabel(appInfo).toString()
                } catch (e: Exception) {
                    // Use package name as fallback
                }
                records.add(
                    AppUsageRecord(
                        packageName = stats.packageName,
                        appName = appName,
                        totalTimeInForegroundMinutes = foregroundMinutes,
                        lastTimeUsed = stats.lastTimeUsed
                    )
                )
            }
        }

        return records.sortedByDescending { it.totalTimeInForegroundMinutes }
    }
}
