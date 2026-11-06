package com.fspy.monitor.service

import android.app.Activity
import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.fspy.monitor.FSpyApplication
import com.fspy.monitor.MainActivity
import com.fspy.monitor.R
import com.google.firebase.firestore.FirebaseFirestore

class ScreenSharingService : Service() {

    private var mediaProjection: MediaProjection? = null
    private val firestore = FirebaseFirestore.getInstance()

    companion object {
        const val NOTIFICATION_ID = 2002
        const val EXTRA_RESULT_CODE = "EXTRA_RESULT_CODE"
        const val EXTRA_RESULT_DATA = "EXTRA_RESULT_DATA"
        const val ACTION_START = "ACTION_START_SCREEN_SHARE"
        const val ACTION_STOP = "ACTION_STOP_SCREEN_SHARE"
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) {
            stopScreenCapture()
            return START_NOT_STICKY
        }

        val resultCode = intent?.getIntExtra(EXTRA_RESULT_CODE, Activity.RESULT_CANCELED) ?: Activity.RESULT_CANCELED
        val resultData = intent?.getParcelableExtra<Intent>(EXTRA_RESULT_DATA)

        if (resultCode == Activity.RESULT_OK && resultData != null) {
            startForeground(NOTIFICATION_ID, createScreenShareNotification())
            val projectionManager =
                getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
            mediaProjection = projectionManager.getMediaProjection(resultCode, resultData)

            updateScreenShareStatus(true)
        } else {
            stopSelf()
        }

        return START_NOT_STICKY
    }

    private fun updateScreenShareStatus(active: Boolean) {
        val deviceId = getSharedPreferences("fspy_prefs", MODE_PRIVATE).getString("device_id", null) ?: return
        firestore.collection("devices").document(deviceId)
            .update("screenSharingActive", active)
    }

    private fun stopScreenCapture() {
        mediaProjection?.stop()
        mediaProjection = null
        updateScreenShareStatus(false)
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    private fun createScreenShareNotification(): Notification {
        val stopIntent = Intent(this, ScreenSharingService::class.java).apply {
            action = ACTION_STOP
        }
        val stopPendingIntent = PendingIntent.getService(
            this,
            1,
            stopIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val launchIntent = Intent(this, MainActivity::class.java)
        val launchPendingIntent = PendingIntent.getActivity(
            this,
            0,
            launchIntent,
            PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, FSpyApplication.CHANNEL_SCREEN_SHARE_ID)
            .setContentTitle(getString(R.string.app_name))
            .setContentText(getString(R.string.screen_sharing_active))
            .setSmallIcon(android.R.drawable.ic_menu_camera)
            .setOngoing(true)
            .setContentIntent(launchPendingIntent)
            .addAction(
                android.R.drawable.ic_menu_close_clear_cancel,
                getString(R.string.stop_sharing),
                stopPendingIntent
            )
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()
    }

    override fun onDestroy() {
        super.onDestroy()
        stopScreenCapture()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
