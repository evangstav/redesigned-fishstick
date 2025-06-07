# Device Sync Guide

This guide explains how to synchronize your fitness tracking data between multiple devices using the export/import functionality.

## Overview

The fitness tracking app stores all data locally in your browser's localStorage. To access your data on multiple devices, you'll need to manually export and import your data.

## Export Your Data

1. Open the fitness app on your current device
2. Click the **"Export Data"** button in the app
3. This downloads a JSON file containing all your workout data, bodyweight history, and settings
4. Save this file in a location you can access from other devices (cloud storage, email, etc.)

## Import Data to New Device

1. Open the fitness app on your new device
2. Click the **"Import Data"** button
3. Select the JSON file you exported from your other device
4. Your complete workout history and data will be restored

## Sync Workflow

### One-Time Setup

1. Export data from your primary device
2. Import to all secondary devices
3. All devices now have the same starting data

### Regular Syncing

Since there's no automatic sync, choose one of these approaches:

#### Option A: Single Primary Device

- Always log workouts on your primary device
- Periodically export and import to secondary devices for viewing

#### Option B: Manual Sync After Each Workout

1. After logging a workout on any device, immediately export the data
2. Import this file to all other devices you use
3. This keeps all devices current but requires discipline

#### Option C: Weekly Sync

- Use any device throughout the week
- At week's end, choose the device with the most complete data
- Export from that device and import to all others

## Important Notes

- **No Automatic Sync**: Data doesn't sync automatically between devices
- **Manual Process**: You must export/import manually to keep devices in sync
- **Complete Replacement**: Import replaces all existing data on the target device
- **Backup Regularly**: Export data frequently as a backup

## Troubleshooting

### Data Conflicts

If you've logged different workouts on different devices:

1. Compare the data on each device
2. Manually combine the data in one location
3. Use that device as your new primary source
4. Export and import to sync all devices

### Lost Data

If you lose data on a device:

1. Use your most recent export file to restore
2. Manually re-enter any workouts logged since the last export

## Best Practices

- **Export after every workout** for maximum data safety
- **Store exports in cloud storage** for easy access across devices
- **Use consistent naming** for export files (e.g., "fitness-data-2025-01-15.json")
- **Test import process** on a secondary device before relying on it

## File Locations

- **Exported files**: Downloads folder on your device
- **Recommended storage**: Google Drive, iCloud, Dropbox, or email

The export file contains all your data in JSON format and can be opened in any text editor if needed for manual inspection or editing.

