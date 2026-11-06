package com.fspy.monitor.ui

import android.content.Context
import android.content.Intent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fspy.monitor.manager.NetworkStorageManager
import com.fspy.monitor.service.LocationService

@Composable
fun DashboardScreen(
    onNavigateToApps: () -> Unit,
    onStartScreenShare: () -> Unit
) {
    val context = LocalContext.current
    val networkStorageManager = remember { NetworkStorageManager(context) }
    val networkMetrics = remember { networkStorageManager.getNetworkMetrics() }
    val storageMetrics = remember { networkStorageManager.getStorageMetrics() }

    var isLocationActive by remember { mutableStateOf(true) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "F Spy Companion",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Text(
                    text = "Family Protection & Device Shield",
                    fontSize = 12.sp,
                    color = Color(0xFF00D2FF)
                )
            }
            Surface(
                color = Color(0xFF064E3B),
                shape = RoundedCornerShape(20.dp)
            ) {
                Text(
                    text = "PROTECTED",
                    color = Color(0xFF34D399),
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Device Telemetry Cards
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            // Network Card
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.weight(1f)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Wifi,
                            contentDescription = null,
                            tint = Color(0xFF3B82F6),
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "Network", fontSize = 12.sp, color = Color(0xFF94A3B8))
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = networkMetrics.ssid,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.White,
                        maxLines = 1
                    )
                    Text(
                        text = "${networkMetrics.linkSpeedMbps} Mbps • ${networkMetrics.type.uppercase()}",
                        fontSize = 11.sp,
                        color = Color(0xFF64748B)
                    )
                }
            }

            // Storage Card
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.weight(1f)
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Storage,
                            contentDescription = null,
                            tint = Color(0xFF10B981),
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "Free Storage", fontSize = 12.sp, color = Color(0xFF94A3B8))
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    val freeGb = storageMetrics.availableBytes / (1024 * 1024 * 1024)
                    val totalGb = storageMetrics.totalBytes / (1024 * 1024 * 1024)
                    Text(
                        text = "$freeGb GB Free",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.White
                    )
                    Text(
                        text = "Total $totalGb GB Capacity",
                        fontSize = 11.sp,
                        color = Color(0xFF64748B)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Location toggle card
        Card(
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = null,
                        tint = Color(0xFF0066FF),
                        modifier = Modifier.size(28.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Live GPS Telemetry",
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            fontSize = 15.sp
                        )
                        Text(
                            text = if (isLocationActive) "Transmitting every 30s to Guardian" else "Paused by user",
                            color = Color(0xFF94A3B8),
                            fontSize = 12.sp
                        )
                    }
                }
                Switch(
                    checked = isLocationActive,
                    onCheckedChange = { active ->
                        isLocationActive = active
                        val serviceIntent = Intent(context, LocationService::class.java).apply {
                            action = if (active) LocationService.ACTION_START else LocationService.ACTION_STOP
                        }
                        if (active) context.startForegroundService(serviceIntent) else context.startService(serviceIntent)
                    }
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Screen Sharing Action
        Button(
            onClick = onStartScreenShare,
            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0066FF)),
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
        ) {
            Icon(imageVector = Icons.Default.ScreenShare, contentDescription = null)
            Spacer(modifier = Modifier.width(10.dp))
            Text(text = "Approve Screen Sharing Session", fontWeight = FontWeight.Bold)
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Installed Apps Management Button
        OutlinedButton(
            onClick = onNavigateToApps,
            shape = RoundedCornerShape(12.dp),
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
        ) {
            Icon(imageVector = Icons.Default.Apps, contentDescription = null, tint = Color(0xFF00D2FF))
            Spacer(modifier = Modifier.width(10.dp))
            Text(text = "Manage Installed Apps Consent & View", color = Color(0xFF00D2FF))
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Privacy Guarantee Banner
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF1E293B), RoundedCornerShape(12.dp))
                .padding(14.dp)
        ) {
            Row(verticalAlignment = Alignment.Top) {
                Icon(
                    imageVector = Icons.Default.Info,
                    contentDescription = null,
                    tint = Color(0xFF38BDF8),
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Text(
                    text = "Family Privacy Notice: F Spy never logs private keystrokes, personal passwords, or chat conversations. All device owners have complete transparency and can revoke access anytime.",
                    color = Color(0xFFCBD5E1),
                    fontSize = 12.sp,
                    lineHeight = 16.sp
                )
            }
        }
    }
}
