net = require('net')
readline = require('readline')
const dialog = require('electron').dialog
const PIPE_PATH = "\\\\.\\pipe\\ElectronControl"
// hold all of the commands that are registered.
var commandMap =  {};
var read
var clientConnection

// Start - initializes and starts running the command queue.
exports.Start = function () {
    clientConnection = net.connect({path:PIPE_PATH})
    read = readline.createInterface({input: clientConnection})
    read.on('line', readlineCallback)
}

// Stop - stops listening on the stdin
exports.Stop = function () {
    read.Close()
}

// Listen - allows tne app to listen to a command that is sent to stdin.
exports.Listen = function (commandID, fn) {
    commandMap[commandID] = fn
}

// readlineCallback - is called whenever the server sends a message to stdin.
var readlineCallback = function (line) {
    // line is base64 encoded so it needs to be decoded.
    buffer = new Buffer(line, 'base64')
    jsonData = buffer.toString()

    // parse out the JSON into an object
    obj = JSON.parse(jsonData)

    // call the callback handler for that command.
    callback = commandMap[obj.CommandID]
    if (callback) callback(obj.CommandBody)
}

// Command - sends a command to stdout.
exports.Command = function (commandID, commandBody) {
    // make the command
    obj = {CommandID: commandID, CommandBody: commandBody}

    // serialize to JSON, base64 encode, write to stdout.
    jsonBuffer = new Buffer(JSON.stringify(obj));
    clientConnection.write(jsonBuffer.toString('base64') + "\n")
}
