# electron control
minimal electron app that allows controlling the shell via stdin and stdout

## Protocol
The base of the protocol is base64 encoded JSON commands + bodies delimited by newline characters.

The structure of commands is:
```JSON
{
    "CommandID": "command_id",
    "CommandBody": "command_body"
}
```
