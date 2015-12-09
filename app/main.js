const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

// command handler.
const ioCommands = require('./iocommands.js')

// imports of local controllers.
const WindowControl = require('./windowcontrol.js')

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // start the controllers.
    WindowControl.Register()

    // TODO: Send a handshake "ready to go" message.
    // start the command processor.

  // TODO: move this to the beginning, once the handshake is in place.
  ioCommands.Start()
});
