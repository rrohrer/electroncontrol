const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

// map of active windows that are cuttently spawned by this manager.
var activeWindows = {}

// called to enable remote control of Atom's window management.
exports.RegisterWindowControl = function () {

}

// creates a window based on the JSON that was recieved in the window_create command.
// responds with a window_create_response command.
