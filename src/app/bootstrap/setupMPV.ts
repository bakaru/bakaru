import * as path from 'path'
import { app } from 'electron'
import mpv = require('mpv.js');

// Absolute path to the plugin directory.
const pluginDir = path.join(path.dirname(require.resolve("mpv.js")), "build", "Release");

// See pitfalls section for details.
if (process.platform !== "linux") {
  process.chdir(pluginDir);
}

// To support a broader number of systems.
app.commandLine.appendSwitch("ignore-gpu-blacklist");
app.commandLine.appendSwitch("register-pepper-plugins", mpv.getPluginEntry(pluginDir));