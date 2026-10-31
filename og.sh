#!/bin/sh
# Regenerate the share image (assets/og.png, 1200×630, light theme), then bump og.png?v= in index.html.
cd "$(dirname "$0")"
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=880,462 --force-device-scale-factor=1.3637 --virtual-time-budget=3000 \
  --screenshot="$PWD/assets/og.png" "file://$PWD/index.html#theme=light" 2>/dev/null
