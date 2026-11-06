# F Spy Android Companion Application (`com.fspy.monitor`)

Complete native Android companion application built with Kotlin, Jetpack Compose, Material Design 3, and Firebase Firestore / Authentication.

---

## 1. Prerequisites
- **Android Studio**: Iguana (2023.2.1) or Hedgehog or newer
- **JDK**: Java Development Kit 17 (recommended: OpenJDK 17 or Temurin 17)
- **Android SDK**: Compile SDK 34 (Android 14) / Min SDK 26 (Android 8.0 Oreo)
- **Gradle**: 8.3.2+

---

## 2. Firebase Configuration
1. Open the [Firebase Console](https://console.firebase.google.com).
2. Create or select your Firebase Project.
3. Click **Add App** -> **Android**.
4. Set Android package name to:
   ```
   com.fspy.monitor
   ```
5. Download `google-services.json`.
6. Place `google-services.json` inside the `android/app/` directory:
   ```bash
   cp google-services.json android/app/google-services.json
   ```

---

## 3. Building Debug APK (Command Line)
Navigate to the `android/` directory and run:

```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
```
The output APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 4. Building Signed Release APK
To build a production signed release APK:

### Step 4.1: Generate Keystore
```bash
keytool -genkey -v -keystore fspy-release-key.jks -alias fspy_key \
  -keyalg RSA -keysize 2048 -validity 10000
```

### Step 4.2: Configure Signing in `app/build.gradle.kts`
```kotlin
android {
    signingConfigs {
        create("release") {
            storeFile = file("../fspy-release-key.jks")
            storePassword = System.getenv("KEYSTORE_PASSWORD") ?: "YourStorePass"
            keyAlias = "fspy_key"
            keyPassword = System.getenv("KEY_PASSWORD") ?: "YourKeyPass"
        }
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}
```

### Step 4.3: Build Signed Bundle/APK
```bash
./gradlew assembleRelease
# Or for Google Play Bundle:
./gradlew bundleRelease
```
The signed APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 5. Device Installation (ADB)
Connect an Android device with USB Debugging enabled:
```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

---

## 6. Pairing & Permissions Workflow
1. Launch **F Spy** on the Android device.
2. The user sees the Family Protection Transparency disclosure.
3. Tap **"Generate Pairing Code"** (e.g. `589214`).
4. Log into the **F Spy Web Admin Dashboard** and navigate to **My Devices** -> **Pair New Device**.
5. Input the 6-digit code.
6. The Android device confirms connection and begins syncing:
   - Real-time GPS location (via Foreground Location Service)
   - Battery health, voltage, temperature, and charging state
   - Wi-Fi SSID, link speed, and cellular network status
   - Available flash storage and memory metrics
   - Installed applications catalog with explicit user consent
   - App usage screen time (UsageStatsManager)
   - On-demand live screen sharing with MediaProjection consent.
