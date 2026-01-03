#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_PATH = path.join(os.homedir(), '.config', 'cc-notifications', 'config.json');
const DEFAULT_SOUND = '/System/Library/Sounds/Blow.aiff';

// Terminal apps to check - if any of these are frontmost, user is "in tab"
const TERMINAL_APPS = ['Terminal', 'iTerm', 'iTerm2', 'Alacritty', 'kitty', 'Hyper', 'Warp'];

function getConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const content = fs.readFileSync(CONFIG_PATH, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    // Ignore errors, use defaults
  }
  return {};
}

function isTerminalFocused() {
  try {
    const script = 'tell application "System Events" to get name of first application process whose frontmost is true';
    const frontApp = execSync(`osascript -e '${script}'`, { encoding: 'utf8' }).trim();
    return TERMINAL_APPS.some(app => frontApp.toLowerCase().includes(app.toLowerCase()));
  } catch (err) {
    // If we can't determine, assume not focused (play sound)
    return false;
  }
}

function playSound(soundPath) {
  try {
    execSync(`afplay "${soundPath}"`, { stdio: 'ignore' });
  } catch (err) {
    // Silent fail - don't interrupt Claude
  }
}

function main() {
  // Only play sound if user is away from terminal
  if (isTerminalFocused()) {
    return;
  }

  const config = getConfig();
  const soundPath = config.sound || DEFAULT_SOUND;

  // Verify file exists
  if (!fs.existsSync(soundPath)) {
    // Fall back to default if custom sound not found
    playSound(DEFAULT_SOUND);
    return;
  }

  playSound(soundPath);
}

main();
