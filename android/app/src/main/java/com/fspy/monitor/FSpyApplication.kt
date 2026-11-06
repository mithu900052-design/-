package com.fspy.monitor

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build

class FSpyApplication : Application() {

    companion object {
        const val CHANNEL_LOCATION_ID = "fspy_location_channel"
        const val CHANNEL_SCREEN_SHARE_ID = "fspy_screen_share_channel"
        const val CHANNEL_SECURITY_ID = "fspy_security_alerts"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(NotificationManager::class.java)

            // Location Service Channel
            val locationChannel = NotificationChannel(
                CHANNEL_LOCATION_ID,
                "F Spy Family Location Protection",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Notifies device user when active background location is transmitting to family guardian"
            }

            // Screen Sharing Channel
            val screenChannel = NotificationChannel(
                CHANNEL_SCREEN_SHARE_ID,
                "F Spy Active Screen Sharing",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "High-visibility alert showing ongoing user-approved screen mirror"
            }

            // Security alerts
            val securityChannel = NotificationChannel(
                CHANNEL_SECURITY_ID,
                "F Spy Security & Consent Updates",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Alerts regarding pairing, consent changes and safety rules"
            }

            notificationManager.createNotificationChannels(listOf(locationChannel, screenChannel, securityChannel))
        }
    }
}
