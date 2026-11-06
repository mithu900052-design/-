package com.fspy.monitor.service

import android.annotation.SuppressLint
import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.location.Location
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import com.fspy.monitor.FSpyApplication
import com.fspy.monitor.MainActivity
import com.fspy.monitor.R
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.SetOptions

class LocationService : Service() {

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback
    private val firestore = FirebaseFirestore.getInstance()

    companion object {
        const val NOTIFICATION_ID = 1001
        const val ACTION_START = "ACTION_START_LOCATION"
        const val ACTION_STOP = "ACTION_STOP_LOCATION"
    }

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                for (location in locationResult.locations) {
                    onNewLocation(location)
                }
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) {
            stopForeground(STOP_FOREGROUND_REMOVE)
            stopSelf()
            return START_NOT_STICKY
        }

        startForeground(NOTIFICATION_ID, createNotification())
        startLocationUpdates()
        return START_STICKY
    }

    @SuppressLint("MissingPermission")
    private fun startLocationUpdates() {
        val locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 30000L)
            .setMinUpdateIntervalMillis(15000L)
            .setMinUpdateDistanceMeters(10f)
            .build()

        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback,
                Looper.getMainLooper()
            )
        } catch (e: SecurityException) {
            stopSelf()
        }
    }

    private fun onNewLocation(location: Location) {
        val deviceId = getSharedPreferences("fspy_prefs", MODE_PRIVATE).getString("device_id", null) ?: return

        val locationData = hashMapOf(
            "latitude" to location.latitude,
            "longitude" to location.longitude,
            "accuracy" to location.accuracy,
            "speed" to location.speed * 3.6, // convert m/s to km/h
            "altitude" to location.altitude,
            "heading" to location.bearing,
            "timestamp" to java.util.Date()
        )

        firestore.collection("devices").document(deviceId)
            .set(mapOf("liveLocation" to locationData, "lastSync" to java.util.Date()), SetOptions.merge())

        firestore.collection("location_records").add(
            hashMapOf(
                "deviceId" to deviceId,
                "latitude" to location.latitude,
                "longitude" to location.longitude,
                "accuracy" to location.accuracy,
                "speed" to location.speed * 3.6,
                "altitude" to location.altitude,
                "timestamp" to java.util.Date()
            )
        )
    }

    private fun createNotification(): Notification {
        val launchIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            launchIntent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        return NotificationCompat.Builder(this, FSpyApplication.CHANNEL_LOCATION_ID)
            .setContentTitle(getString(R.string.app_name))
            .setContentText(getString(R.string.location_service_active))
            .setSmallIcon(android.R.drawable.ic_menu_mylocation)
            .setOngoing(true)
            .setContentIntent(pendingIntent)
            .build()
    }

    override fun onDestroy() {
        super.onDestroy()
        fusedLocationClient.removeLocationUpdates(locationCallback)
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
