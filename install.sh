#!/bin/bash

# cc-notifications installer
# Adds notification hooks to Claude Code settings

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NOTIFY_SCRIPT="$SCRIPT_DIR/src/notify.js"
SETTINGS_FILE="$HOME/.claude/settings.json"

echo "Installing cc-notifications..."

# Ensure .claude directory exists
mkdir -p "$HOME/.claude"

# Create config directory
mkdir -p "$HOME/.config/cc-notifications"

# Check if settings.json exists
if [ -f "$SETTINGS_FILE" ]; then
    # Check if our hooks already exist
    if grep -q '"Stop"' "$SETTINGS_FILE" 2>/dev/null || grep -q '"Notification"' "$SETTINGS_FILE" 2>/dev/null; then
        echo ""
        echo "Warning: Hooks already exist in $SETTINGS_FILE"
        echo "Please manually add the notification hooks if needed:"
        echo ""
        echo "Add to both Stop and Notification events:"
        echo '  {
    "type": "command",
    "command": "node '"$NOTIFY_SCRIPT"'"
  }'
        echo ""
        exit 0
    fi

    # Add hooks to existing settings using node
    node -e "
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('$SETTINGS_FILE', 'utf8'));
settings.hooks = settings.hooks || {};

const hook = {
  hooks: [{
    type: 'command',
    command: 'node $NOTIFY_SCRIPT'
  }]
};

// Stop: when Claude finishes responding
settings.hooks.Stop = [hook];

// Notification: when Claude needs user input (questions, permission prompts)
settings.hooks.Notification = [{ matcher: '*', ...hook }];

fs.writeFileSync('$SETTINGS_FILE', JSON.stringify(settings, null, 2));
"
    echo "Updated $SETTINGS_FILE with notification hooks"
else
    # Create new settings.json
    cat > "$SETTINGS_FILE" << EOF
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node $NOTIFY_SCRIPT"
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
            "command": "node $NOTIFY_SCRIPT"
          }
        ]
      }
    ]
  }
}
EOF
    echo "Created $SETTINGS_FILE with notification hooks"
fi

echo ""
echo "Installation complete!"
echo ""
echo "Hooks installed:"
echo "  - Stop: plays sound when Claude finishes"
echo "  - Notification: plays sound when Claude asks questions"
echo ""
echo "To customize the notification sound, create:"
echo "  ~/.config/cc-notifications/config.json"
echo ""
echo 'With content: {"sound": "/path/to/your/sound.mp3"}'
echo ""
echo "Testing notification sound..."
node "$NOTIFY_SCRIPT"
echo "Done!"
