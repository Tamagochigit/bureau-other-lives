#!/usr/bin/env bash
set -euo pipefail
capture_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$capture_root"
mkdir -p out/store-capture
cp android/app/build/outputs/apk/release/app-release-unsigned.apk out/store-capture/bureau-0.4.2-unsigned.apk
git rev-parse HEAD >out/store-capture/source-commit.txt
sdk_path="${ANDROID_HOME:?ANDROID_HOME must point to the SDK}"
capture_avd_root="$capture_root/out/android-store-avd"
mkdir -p "$capture_avd_root"
export ANDROID_AVD_HOME="$capture_avd_root"
capture_emulator_pid=""
cleanup_capture() {
  "$sdk_path/platform-tools/adb" -s emulator-5556 emu kill >/dev/null 2>&1 || true
  if [ -n "$capture_emulator_pid" ]; then kill "$capture_emulator_pid" 2>/dev/null || true; wait "$capture_emulator_pid" || true; fi
}
trap cleanup_capture EXIT
test -e /dev/kvm
if [ ! -w /dev/kvm ]; then sudo chown "$(id -u):$(id -g)" /dev/kvm; fi
printf 'no\n' | avdmanager create avd --force --name BureauStore --path "$capture_avd_root/BureauStore.avd" --package 'system-images;android-35;google_apis;x86_64'
test -f "$capture_avd_root/BureauStore.ini"
python3 - "$capture_avd_root/BureauStore.avd/config.ini" <<'PY'
from pathlib import Path
import sys
path=Path(sys.argv[1]);settings={'hw.lcd.width':'1080','hw.lcd.height':'2064','hw.lcd.density':'480','hw.mainKeys':'no'}
lines=[line for line in path.read_text().splitlines() if line.split('=',1)[0].strip() not in settings]
path.write_text('\n'.join(lines+[key+'='+value for key,value in settings.items()])+'\n')
PY
"$sdk_path/emulator/emulator" -list-avds | grep -qx BureauStore
"$sdk_path/emulator/emulator" -avd BureauStore -no-window -no-audio -no-snapshot -no-boot-anim -gpu swiftshader -accel on -memory 2048 -cores 2 -port 5556 >out/store-capture/emulator.log 2>&1 &
capture_emulator_pid=$!
adb="$sdk_path/platform-tools/adb"
if ! timeout 180 "$adb" -s emulator-5556 wait-for-device; then cat out/store-capture/emulator.log; exit 1; fi
capture_deadline=$((SECONDS + 240))
while [ "$("$adb" -s emulator-5556 shell -n getprop sys.boot_completed | tr -d '\r')" != "1" ]; do
  if [ "$SECONDS" -ge "$capture_deadline" ]; then "$adb" -s emulator-5556 logcat -d >out/store-capture/boot-logcat.txt; exit 1; fi
  sleep 2
done
"$adb" -s emulator-5556 shell -n wm density reset
"$adb" -s emulator-5556 shell -n wm size reset
"$adb" -s emulator-5556 shell -n settings put global window_animation_scale 0
"$adb" -s emulator-5556 shell -n settings put global transition_animation_scale 0
"$adb" -s emulator-5556 shell -n settings put global animator_duration_scale 0
"$adb" -s emulator-5556 shell -n input keyevent 82
"$adb" -s emulator-5556 install -r android/app/build/outputs/apk/debug/app-debug.apk
"$adb" -s emulator-5556 install -r android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk
"$adb" -s emulator-5556 shell -n am instrument -w -e class ru.bureau.otherlives.OfflineSmokeTest,ru.bureau.otherlives.StoreScreenshotsTest ru.bureau.otherlives.debug.test/androidx.test.runner.AndroidJUnitRunner | tee out/store-capture/instrumentation.txt
"$adb" -s emulator-5556 logcat -d >out/store-capture/logcat.txt
"$adb" -s emulator-5556 shell -n wm size >out/store-capture/display.txt
"$adb" -s emulator-5556 pull /sdcard/Android/data/ru.bureau.otherlives.debug/files/store-screens out/store-capture/screenshots
"$adb" -s emulator-5556 pull /sdcard/Android/data/ru.bureau.otherlives.debug/files/store-icon.png out/store-capture/icon-512.png
grep -q 'OK (4 tests)' out/store-capture/instrumentation.txt
test "$(find out/store-capture/screenshots -name '*.png' | wc -l)" -eq 5
