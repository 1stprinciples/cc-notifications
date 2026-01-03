# cc-notifications

Notification sounds for [Claude Code](https://claude.ai/code). Plays a pleasant sound when Claude finishes responding.

**Only notifies when you're away** - no sound if your terminal is focused. Works great for long-running tasks when you're multitasking.

## Requirements

- macOS (uses `afplay` for audio playback)
- Node.js
- Claude Code CLI

## Installation

```bash
git clone https://github.com/1stprinciples/cc-notifications.git
cd cc-notifications
./install.sh
```

This adds hooks to your Claude Code settings (`~/.claude/settings.json`):
- **Stop**: when Claude finishes responding
- **Notification**: when Claude asks questions or needs input

## Custom Sound

Create `~/.config/cc-notifications/config.json`:

```json
{
  "sound": "/path/to/your/sound.mp3"
}
```

Supports `.mp3`, `.wav`, `.aiff`, `.m4a`.

## Default Sound

Uses macOS system sound: `/System/Library/Sounds/Blow.aiff`

Other system sounds you can try:
- `/System/Library/Sounds/Glass.aiff`
- `/System/Library/Sounds/Ping.aiff`
- `/System/Library/Sounds/Pop.aiff`
- `/System/Library/Sounds/Submarine.aiff`
- `/System/Library/Sounds/Purr.aiff`

## Manual Installation

If you already have hooks configured, add this to your `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node /path/to/cc-notifications/src/notify.js"
          }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node /path/to/cc-notifications/src/notify.js"
          }
        ]
      }
    ]
  }
}
```

## Uninstall

Remove the `Stop` and `Notification` hooks from `~/.claude/settings.json`.

## License

MIT
