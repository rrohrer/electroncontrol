# electron control
minimal electron app that allows controlling the shell via a remote process.
Uses stdin/stdout on non windows OS, and a named pipe on windows.

## Protocol
The base of the protocol is base64 encoded JSON commands + bodies delimited by newline characters.

The structure of commands is:
```JSON
{
    "CommandID": "command_id",
    "CommandBody": "command_body"
}
```
### Commands:
Commands are strings, all lower case with underscores ex: `command_name`.  Many commands have responses which are of the format:
`[command_name]_response`.

---
**window_create**: Creates a window with `new BrowserWindow(options)`. `CommandBody` should be an `options` object as defined in atom.io's BrowserWindow class.

Responds with **window_create_response**.

```JSON
CommandBody{
    "WindowID" : "numerical_ID"
}
```

---
