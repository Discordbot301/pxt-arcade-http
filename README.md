# Arcade HTTP

A MakeCode Arcade extension providing simple HTTP GET and POST helpers, plus Discord webhook integration.

Notes:
- Works in the web simulator via the browser's fetch API.
- On hardware without networking, requests are not supported; handlers will receive status 0 and empty body.

## Blocks

### HTTP Requests
- HTTP GET url then do handler
- HTTP POST url body body content type contentType then do handler

### Discord Webhooks
- Discord webhook send message
- Discord webhook send embed (rich formatted message)
- Discord webhook send request (for account creation requests, etc.)

### Database/API Access
- Get data from database (with optional API key)
- Save data to database (with optional API key)
- Get variable from database (retrieves specific value by name)
- Set variable in database (saves specific value by name)

## Examples

### Basic HTTP GET
```ts
http.get("https://httpbin.org/get", (status, body) => {
    game.splash("Status: " + status)
})
```

### Send Discord Message
```ts
http.discordSendMessage(
    "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL",
    "Hello from MakeCode Arcade!",
    (status) => {
        if (status == 204) {
            game.splash("Message sent!")
        }
    }
)
```

### Send Account Creation Request
```ts
http.discordSendRequest(
    "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL",
    "player123",
    "player@example.com",
    "Account Creation",
    (status) => {
        if (status == 204) {
            game.splash("Request submitted!")
        }
    }
)
```

### Send Rich Embed
```ts
http.discordSendEmbed(
    "https://discord.com/api/webhooks/YOUR_WEBHOOK_URL",
    "Game Event",
    "Player reached level 10!",
    3447003, // Blue color
    (status) => {
        game.splash("Notification sent!")
    }
)
```

### Get Variable from Database
```ts
http.getVariable(
    "playerScore",
    "https://api.example.com/data",
    "your-api-key-here",  // Optional - leave empty "" if no key needed
    (success, value) => {
        if (success) {
            game.splash("Score: " + value)
        }
    }
)
```

### Save Variable to Database
```ts
http.setVariable(
    "playerScore",
    "1000",
    "https://api.example.com/data",
    "your-api-key-here",  // Optional - leave empty "" if no key needed
    (success) => {
        if (success) {
            game.splash("Score saved!")
        }
    }
)
```

### Get All Data from Database
```ts
http.getData(
    "https://api.example.com/data",
    "your-api-key-here",  // Optional - leave empty "" if no key needed
    (success, data) => {
        if (success) {
            game.splash("Data: " + data)
        }
    }
)
```
