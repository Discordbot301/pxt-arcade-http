# Arcade HTTP

A MakeCode Arcade extension providing simple HTTP GET and POST helpers.

Notes:
- Works in the web simulator via the browser's fetch API.
- On hardware without networking, requests are not supported; handlers will receive status 0 and empty body.

Blocks:
- HTTP GET url then do handler
- HTTP POST url body body content type contentType then do handler

Example (TypeScript):

```ts
http.get("https://httpbin.org/get", (status, body) => {
    game.splash("Status: " + status)
})
```
