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
**window_load_url** loads URL in the window that is passed in.
```JSON
CommandBody{
    "WindowID" : "numerical_ID",
    "URL" : "foo.com"
}
```

---
**window_load_complete** sent TO the controlling process when a window finishes loading a URL.
```JSON
CommandBody{
    "WindowID" : "numerical_ID"
}
```

---
**window_closed** is sent TO the controlling process when a window is closed.
```JSON
CommandBody{
    "WindowID" : "numerical_ID"
}
```

---

**window_open_dev_tools** notifies the window to open the Webkit developer tools.
```JSON
CommandBody{
    "WindowID" : "numerical_ID"
}
```

---

**window_close_dev_tools** notifies the window to close the Webkit developer tools.
```JSON
CommandBody{
    "WindowID" : "numerical_ID"
}
```

---

**window_send_message** sends a message to the renderer of a window (the web page that is hosted).
`MessageID` is the name of the message being sent.  `Message` is the message body.
```JSON
CommandBody{
    "WindowID" : "numerical_ID",
    "MessageID" : "message_ID",
    "Message" : "message_body"
}
```

---

**window_subscribe_message** adds a callback to get a message that CAN be sent by the renderer.
`MessageID` is the name of the message being sent.
```JSON
CommandBody{
    "WindowID" : "numerical_ID",
    "MessageID" : "message_ID",
}
```

---

**window_get_subscribed_message** sends a from the hosted web app TO the controlling process.
`MessageID` is the name of the message being sent.  `Message` is the message body.
```JSON
CommandBody{
    "WindowID" : "numerical_ID",
    "MessageID" : "message_ID",
    "Message" : "message_body"
}
```

---
