# Running in TV / Kiosk Mode

## Chrome / Edge kiosk mode (Windows Mini PC, Raspberry Pi)

```bash
chromium-browser --kiosk --incognito \
  --noerrdialogs --disable-infobars \
  --autoplay-policy=no-user-gesture-required \
  "https://YOUR-USERNAME.github.io/mtc-live-display/"
```

- `--kiosk` — true fullscreen, no browser chrome.
- `--incognito` — avoids stale cache issues between updates.
- `--autoplay-policy=no-user-gesture-required` — needed for the (future)
  video slide support to autoplay without a click.

## Raspberry Pi (Chromium kiosk)

1. Flash Raspberry Pi OS, enable auto-login to desktop.
2. Add the command above to `~/.config/lxsession/LXDE-pi/autostart`:
   ```
   @chromium-browser --kiosk --incognito --noerrdialogs --disable-infobars "https://YOUR-USERNAME.github.io/mtc-live-display/"
   ```
3. Disable screen blanking: `xset s off`, `xset -dpms`, `xset s noblank`
   (also add these lines to the same autostart file).

## Samsung / LG Smart TV browsers

Most Smart TV browsers don't support command-line flags. Instead:
1. Open the built-in browser app.
2. Navigate to your GitHub Pages URL.
3. Use the browser's own "fullscreen" option if available, or rely on the
   TV's native kiosk/URL-launcher app if your TV model supports one
   (common on hospitality/business TV firmware).

## Android TV / Fire TV

Use a kiosk browser app from the store (e.g. "Fully Kiosk Browser" or
"Kiosk Browser Lockdown") pointed at your GitHub Pages URL, with auto-launch
on boot enabled in the app's settings.

## Preventing sleep / screensaver

Whatever device you use, disable:
- OS-level screen blanking / screensaver
- Display sleep / power-saving timers
- Browser "save data" or aggressive tab-suspension extensions

## Auto-restart on crash or reboot

For Raspberry Pi / mini PC setups, consider a small watchdog (e.g. a cron
job or systemd service) that relaunches the browser if the process exits,
and configure the OS to boot directly into the kiosk browser so the display
recovers automatically after a power cycle.
