SETLOCAL EnableDelayedExpansion
for /f "tokens=1" %%t in ('adb devices') do (set device=%%t
adb -s !device! shell pm clear com.android.chrome)

cmd/k

