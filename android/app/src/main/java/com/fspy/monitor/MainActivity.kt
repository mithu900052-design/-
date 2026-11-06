package com.fspy.monitor

import android.app.Activity
import android.content.Intent
import android.media.projection.MediaProjectionManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.fspy.monitor.data.AuthenticationRepository
import com.fspy.monitor.service.ScreenSharingService
import com.fspy.monitor.ui.DashboardScreen
import com.fspy.monitor.ui.DevicePairingScreen
import com.fspy.monitor.ui.InstalledAppsScreen

class MainActivity : ComponentActivity() {

    private lateinit var authRepo: AuthenticationRepository

    private val screenCaptureLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK && result.data != null) {
            val serviceIntent = Intent(this, ScreenSharingService::class.java).apply {
                action = ScreenSharingService.ACTION_START
                putExtra(ScreenSharingService.EXTRA_RESULT_CODE, result.resultCode)
                putExtra(ScreenSharingService.EXTRA_RESULT_DATA, result.data)
            }
            startForegroundService(serviceIntent)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        authRepo = AuthenticationRepository(this)

        setContent {
            val darkColors = darkColorScheme(
                primary = Color(0xFF0066FF),
                secondary = Color(0xFF00D2FF),
                background = Color(0xFF080C15),
                surface = Color(0xFF0F172A),
                onPrimary = Color.White,
                onBackground = Color.White,
                onSurface = Color.White
            )

            MaterialTheme(colorScheme = darkColors) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    var currentScreen by remember {
                        mutableStateOf(if (authRepo.isDevicePaired()) "dashboard" else "pairing")
                    }

                    when (currentScreen) {
                        "pairing" -> DevicePairingScreen(
                            authRepo = authRepo,
                            onPairedSuccess = { currentScreen = "dashboard" }
                        )
                        "dashboard" -> DashboardScreen(
                            onNavigateToApps = { currentScreen = "installed_apps" },
                            onStartScreenShare = { requestScreenCaptureConsent() }
                        )
                        "installed_apps" -> InstalledAppsScreen(
                            onBack = { currentScreen = "dashboard" }
                        )
                    }
                }
            }
        }
    }

    private fun requestScreenCaptureConsent() {
        val projectionManager =
            getSystemService(MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        screenCaptureLauncher.launch(projectionManager.createScreenCaptureIntent())
    }
}
