package com.fspy.monitor.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Security
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.fspy.monitor.R
import com.fspy.monitor.manager.InstalledAppItem
import com.fspy.monitor.manager.NetworkStorageManager

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InstalledAppsScreen(
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val manager = remember { NetworkStorageManager(context) }
    var userConsentGranted by remember { mutableStateOf(true) }
    var appList by remember { mutableStateOf<List<InstalledAppItem>>(emptyList()) }

    LaunchedEffect(userConsentGranted) {
        appList = manager.getInstalledApplications(userConsentGranted)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Installed Applications", color = Color.White) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Back",
                            tint = Color.White
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF0F172A)
                )
            )
        },
        containerColor = Color(0xFF080C15)
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {
            // Explicit Consent Card
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Security,
                                contentDescription = null,
                                tint = Color(0xFF00D2FF),
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = stringResource(R.string.installed_apps_consent_title),
                                fontWeight = FontWeight.Bold,
                                color = Color.White,
                                fontSize = 15.sp
                            )
                        }
                        Switch(
                            checked = userConsentGranted,
                            onCheckedChange = { userConsentGranted = it }
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = stringResource(R.string.installed_apps_consent_body),
                        color = Color(0xFF94A3B8),
                        fontSize = 12.sp,
                        lineHeight = 16.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            if (!userConsentGranted) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Consent is currently disabled. Your family admin cannot view installed application lists.",
                        color = Color(0xFFEF4444),
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
            } else {
                Text(
                    text = "Authorized Installed Apps (${appList.size})",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(vertical = 8.dp)
                )

                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(appList) { app ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A)),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = app.appName,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Color.White,
                                        fontSize = 14.sp
                                    )
                                    Text(
                                        text = "${app.packageName} • v${app.versionName}",
                                        color = Color(0xFF64748B),
                                        fontSize = 11.sp
                                    )
                                }
                                Surface(
                                    color = Color(0xFF1E293B),
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Text(
                                        text = "${app.sizeMb} MB",
                                        color = Color(0xFF94A3B8),
                                        fontSize = 11.sp,
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
