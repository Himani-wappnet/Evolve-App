package com.evolve;
import com.facebook.react.bridge.ReadableMap;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import java.util.Map;
import java.util.HashMap;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.drawable.Drawable;
import android.util.Base64;
import java.io.ByteArrayOutputStream;
import android.graphics.Bitmap;
import android.graphics.Canvas;

public class UsageStatsModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public UsageStatsModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @Override
    public String getName() {
        return "UsageStatsModule";
    }

    @ReactMethod
    public void getUsageStats(ReadableMap config, com.facebook.react.bridge.Callback callback) {
        UsageStatsManager usm = (UsageStatsManager) reactContext.getSystemService(Context.USAGE_STATS_SERVICE);
        long currentTime = System.currentTimeMillis();
        long startTime = currentTime - (1000 * 60 * 60 * 24); // last 24 hours

        List<UsageStats> appList = usm.queryUsageStats(
                UsageStatsManager.INTERVAL_DAILY,
                startTime,
                currentTime
        );

        WritableArray result = Arguments.createArray();
        PackageManager pm = reactContext.getPackageManager();

        if (appList != null && !appList.isEmpty()) {
            for (UsageStats usageStats : appList) {
                long totalTimeMs = usageStats.getTotalTimeInForeground();

            if (totalTimeMs > 0) {
                WritableMap app = Arguments.createMap();
                long totalSeconds = totalTimeMs / 1000;

                long hours = totalSeconds / 3600;
                long minutes = (totalSeconds % 3600) / 60;
                long seconds = totalSeconds % 60;

                String packageName = usageStats.getPackageName();

                app.putString("packageName", usageStats.getPackageName());
                app.putInt("hours", (int) hours);
                app.putInt("minutes", (int) minutes);
                app.putInt("seconds", (int) seconds);
                app.putDouble("rawInSeconds", totalSeconds);

                 // Get and encode app icon
                    try {
                        ApplicationInfo appInfo = pm.getApplicationInfo(packageName, 0);
                        Drawable icon = pm.getApplicationIcon(appInfo);

                        Bitmap bitmap = Bitmap.createBitmap(icon.getIntrinsicWidth(), icon.getIntrinsicHeight(), Bitmap.Config.ARGB_8888);
                        Canvas canvas = new Canvas(bitmap);
                        icon.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
                        icon.draw(canvas);

                        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                        bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
                        byte[] byteArray = byteArrayOutputStream.toByteArray();
                        String encodedIcon = Base64.encodeToString(byteArray, Base64.DEFAULT);

                        app.putString("icon", encodedIcon);
                    } catch (Exception e) {
                        app.putString("icon", ""); // fallback if icon not found
                    }

                result.pushMap(app);
            }
            }
        }

        callback.invoke(null, result);
    }
}
