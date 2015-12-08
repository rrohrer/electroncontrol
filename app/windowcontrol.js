// import electron and BrowserWindow.
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

// import the command processor.
const Commands = require('./iocommands.js')

// map of active windows that are cuttently spawned by this manager.
var activeWindows = {}

// current index of the next window to be created.
var activeWindowIndex = 0

// called to enable remote control of Atom's window management.
exports.Register = function () {
    Commands.Listen("window_create", windowCreate)
}

// creates a window based on the JSON that was recieved in the window_create command.
// responds with a window_create_response command.
var windowCreate = function (options) {
    // create the window
    browser = new BrowserWindow(options)

    // store it in the active windows table.
    responseIndex = activeWindowIndex
    activeWindows[activeWindowIndex] = browser
    activeWindowIndex = activeWindowIndex + 1

    // generate and send the response.
    Commands.Command("window_create_response", {WindowID: responseIndex})
}
