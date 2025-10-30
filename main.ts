//% color=#0f6ad8 icon="\uf0e0"
namespace http {
    /**
     * Perform an HTTP GET and run a handler when it completes.
     */
    //% block="HTTP GET %url then do %handler" handlerStatement=1 weight=90
    export function get(url: string, handler: (status: number, body: string) => void): void {
        getAsync(url)
            .then(r => handler(r.status, r.body))
            .catch(_ => handler(0, ""))
    }

    /**
     * Async GET returning status and body.
     */
    export function getAsync(url: string): Promise<{ status: number, body: string }> {
        const f = (globalThis as any).fetch
        if (!f) return Promise.reject(new Error("HTTP not supported"))
        return f(url)
            .then((res: any) => res.text().then((body: string) => ({ status: (res.status | 0), body })))
    }

    /**
     * Perform an HTTP POST with body and optional content type, then run a handler.
     */
    //% block="HTTP POST %url body %body content type %contentType then do %handler" handlerStatement=1 weight=80
    export function post(url: string, body: string, contentType: string, handler: (status: number, response: string) => void): void {
        postAsync(url, body, contentType)
            .then(r => handler(r.status, r.body))
            .catch(_ => handler(0, ""))
    }

    /**
     * Async POST returning status and response body.
     */
    export function postAsync(url: string, body: string, contentType?: string): Promise<{ status: number, body: string }> {
        const f = (globalThis as any).fetch
        if (!f) return Promise.reject(new Error("HTTP not supported"))
        const headers: any = {}
        if (contentType) headers["Content-Type"] = contentType
        return f(url, { method: "POST", headers, body })
            .then((res: any) => res.text().then((t: string) => ({ status: (res.status | 0), body: t })))
    }

    /**
     * Send a simple text message to a Discord webhook.
     */
    //% block="Discord webhook %webhookUrl send message %message then do %handler" handlerStatement=1 weight=70
    export function discordSendMessage(webhookUrl: string, message: string, handler: (status: number) => void): void {
        discordSendMessageAsync(webhookUrl, message)
            .then(status => handler(status))
            .catch(_ => handler(0))
    }

    /**
     * Async function to send a simple text message to a Discord webhook.
     */
    export function discordSendMessageAsync(webhookUrl: string, message: string): Promise<number> {
        const payload = JSON.stringify({ content: message })
        return postAsync(webhookUrl, payload, "application/json")
            .then(r => r.status)
    }

    /**
     * Send a Discord embed message (rich formatted message).
     */
    //% block="Discord webhook %webhookUrl send embed title %title description %description color %color then do %handler" handlerStatement=1 weight=60
    export function discordSendEmbed(webhookUrl: string, title: string, description: string, color: number, handler: (status: number) => void): void {
        discordSendEmbedAsync(webhookUrl, title, description, color)
            .then(status => handler(status))
            .catch(_ => handler(0))
    }

    /**
     * Async function to send a Discord embed message.
     */
    export function discordSendEmbedAsync(webhookUrl: string, title: string, description: string, color: number): Promise<number> {
        const payload = JSON.stringify({
            embeds: [{
                title: title,
                description: description,
                color: color
            }]
        })
        return postAsync(webhookUrl, payload, "application/json")
            .then(r => r.status)
    }

    /**
     * Send a custom request (e.g., account creation request) to Discord with fields.
     */
    //% block="Discord webhook %webhookUrl send request username %username email %email type %requestType then do %handler" handlerStatement=1 weight=50
    export function discordSendRequest(webhookUrl: string, username: string, email: string, requestType: string, handler: (status: number) => void): void {
        discordSendRequestAsync(webhookUrl, username, email, requestType)
            .then(status => handler(status))
            .catch(_ => handler(0))
    }

    /**
     * Async function to send a custom request to Discord.
     */
    export function discordSendRequestAsync(webhookUrl: string, username: string, email: string, requestType: string): Promise<number> {
        const payload = JSON.stringify({
            embeds: [{
                title: "📋 New " + requestType + " Request",
                color: 3447003, // Blue color
                fields: [
                    { name: "Username", value: username, inline: true },
                    { name: "Email", value: email, inline: true },
                    { name: "Request Type", value: requestType, inline: false }
                ],
                timestamp: new Date().toISOString()
            }]
        })
        return postAsync(webhookUrl, payload, "application/json")
            .then(r => r.status)
    }
}
