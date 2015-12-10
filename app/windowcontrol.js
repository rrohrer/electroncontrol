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
    Commands.Listen("window_load_url", windowLoadUrl)
    Commands.Listen("window_open_dev_tools", windowOpenDevTools)
    Commands.Listen("window_close_dev_tools", windowCloseDevTools)
    Commands.Listen("window_send_message", windowSendMessage)
    Commands.Listen("window_subscribe_message", windowSubscribeMessage)
    Commands.Listen("window_close", windowClose)
}

// creates a window based on the JSON that was recieved in the window_create command.
// responds with a window_create_response command.
var windowCreate = function (options) {
    // create the window
    var browser = new BrowserWindow(JSON.parse(options))

    // store it in the active windows table.
    var responseIndex = activeWindowIndex
    activeWindows[activeWindowIndex] = browser
    activeWindowIndex = activeWindowIndex + 1

    // setup a callback for when this window is closed.
    browser.on("closed", function(){
        delete activeWindows[responseIndex]
        Commands.Command("window_closed", {WindowID: responseIndex})
    })

    // settup callbacks for when windows complete loading.
    browser.webContents.on("did-finish-load", function(){
        Commands.Command("window_load_complete", {WindowID: responseIndex})
    })

    // generate and send the response.
    Commands.Command("window_create_response", {WindowID: responseIndex})
}

var windowClose = function(options) {
    var obj = JSON.parse(options)

    // check to see if there is a window with the ID:
    if (obj.WindowID in activeWindows) {
        activeWindows[obj.WindowID].close()
    }
}

var windowLoadUrl = function (options) {
    var obj = JSON.parse(options)

    // check to see if there is a window with the ID:
    if (obj.WindowID in activeWindows) {
        activeWindows[obj.WindowID].loadURL(obj.URL)
    }
}

var windowOpenDevTools = function (options) {
    var obj = JSON.parse(options)

    if (obj.WindowID in activeWindows) {
        activeWindows[obj.WindowID].webContents.openDevTools()
    }
}

var windowCloseDevTools = function (options) {
    var obj = JSON.parse(options)

    if (obj.WindowID in activeWindows) {
        activeWindows[obj.WindowID].webContents.closeDevTools()
    }
}

var windowSendMessage = function (options) {
    var obj = JSON.parse(options)

    if (obj.WindowID in activeWindows) {
        activeWindows[obj.WindowID].webContents.send(obj.MessageID, obj.Message)
    }
}

var windowSubscribeMessage = function (options) {
    var obj = JSON.parse(options)

    electron.ipcMain.on(obj.MessageID, function(event, message){
        Commands.Command("window_get_subscribed_message", {WindowID: obj.WindowID, MessageID: obj.MessageID, Message: message})
    })
}
