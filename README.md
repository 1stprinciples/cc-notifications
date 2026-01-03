# cc-notifications

Notification sounds for [Claude Code](https://claude.ai/code). Plays a pleasant sound when Claude finishes responding.

Works great for long-running tasks when you're away from the terminal.

## Requirements

- macOS (uses `afplay` for audio playback)
- Node.js
- Claude Code CLI

## Installation

```bash
git clone https://github.com/YOUR_USERNAME/cc-notifications.git
cd cc-notifications
./install.sh
```

This adds a `Stop` hook to your Claude Code settings (`~/.claude/settings.json`).

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
    ]
  }
}
```

## Uninstall

Remove the `Stop` hook from `~/.claude/settings.json`.

## License

MIT
