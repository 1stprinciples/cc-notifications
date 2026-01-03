#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_PATH = path.join(os.homedir(), '.config', 'cc-notifications', 'config.json');
const DEFAULT_SOUND = '/System/Library/Sounds/Blow.aiff';

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

function playSound(soundPath) {
  try {
    execSync(`afplay "${soundPath}"`, { stdio: 'ignore' });
  } catch (err) {
    // Silent fail - don't interrupt Claude
  }
}

function main() {
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
