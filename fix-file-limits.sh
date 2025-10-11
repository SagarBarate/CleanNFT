#!/bin/bash

# Fix for EMFILE: too many open files error on macOS
# This script increases file watcher limits for React Native/Expo development

echo "Fixing file watcher limits for React Native/Expo development..."

# Increase system file limits (requires sudo)
echo "Increasing system file limits..."
sudo sysctl -w kern.maxfiles=65536
sudo sysctl -w kern.maxfilesperproc=32768

# Increase ulimit for current session
echo "Increasing ulimit for current session..."
ulimit -n 65536

# Verify the changes
echo "Current limits:"
echo "kern.maxfiles: $(sysctl -n kern.maxfiles)"
echo "kern.maxfilesperproc: $(sysctl -n kern.maxfilesperproc)"
echo "ulimit -n: $(ulimit -n)"

echo "File limits have been increased. You can now run your React Native/Expo app."
echo ""
echo "Note: These changes are temporary and will reset after reboot."
echo "For permanent changes, add the following to /etc/sysctl.conf:"
echo "kern.maxfiles=65536"
echo "kern.maxfilesperproc=32768"




