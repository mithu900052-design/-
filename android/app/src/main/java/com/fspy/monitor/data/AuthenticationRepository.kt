package com.fspy.monitor.data

import android.content.Context
import android.os.Build
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await
import java.util.UUID

class AuthenticationRepository(private val context: Context) {

    private val auth = FirebaseAuth.getInstance()
    private val firestore = FirebaseFirestore.getInstance()
    private val prefs = context.getSharedPreferences("fspy_prefs", Context.MODE_PRIVATE)

    fun getDeviceId(): String {
        var id = prefs.getString("device_id", null)
        if (id == null) {
            id = "fspy_dev_" + UUID.randomUUID().toString().substring(0, 8)
            prefs.edit().putString("device_id", id).apply()
        }
        return id
    }

    suspend fun generatePairingCode(): String {
        val code = (100000..999999).random().toString()
        val deviceId = getDeviceId()
        val model = "${Build.MANUFACTURER} ${Build.MODEL}"

        val requestData = hashMapOf(
            "code" to code,
            "deviceId" to deviceId,
            "deviceName" to model,
            "createdAt" to java.util.Date(),
            "expiresAt" to java.util.Date(System.currentTimeMillis() + 10 * 60 * 1000),
            "status" to "pending"
        )

        firestore.collection("pairing_requests").document(code)
            .set(requestData)
            .await()

        return code
    }

    fun isDevicePaired(): Boolean {
        return prefs.getBoolean("is_paired", false)
    }

    fun setDevicePaired(paired: Boolean, adminId: String? = null) {
        prefs.edit()
            .putBoolean("is_paired", paired)
            .putString("paired_admin_id", adminId)
            .apply()
    }
}
