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

    /**
     * Get data from a database/API with optional authentication key.
     */
    //% block="get data from %url|with key %apiKey then do %handler" handlerStatement=1 weight=45
    //% apiKey.defl=""
    //% expandableArgumentMode="toggle"
    export function getData(url: string, apiKey: string, handler: (success: boolean, data: string) => void): void {
        getDataAsync(url, apiKey)
            .then(result => handler(result.success, result.data))
            .catch(_ => handler(false, ""))
    }

    /**
     * Async function to get data from a database/API.
     */
    export function getDataAsync(url: string, apiKey?: string): Promise<{ success: boolean, data: string }> {
        const f = (globalThis as any).fetch
        if (!f) return Promise.reject(new Error("HTTP not supported"))
        
        const headers: any = {}
        if (apiKey && apiKey !== "") {
            headers["Authorization"] = "Bearer " + apiKey
            headers["X-API-Key"] = apiKey
        }
        
        return f(url, { headers })
            .then((res: any) => res.text().then((body: string) => ({
                success: res.status >= 200 && res.status < 300,
                data: body
            })))
    }

    /**
     * Set/save data to a database/API with optional authentication key.
     */
    //% block="save data to %url|value %data|with key %apiKey then do %handler" handlerStatement=1 weight=40
    //% apiKey.defl=""
    //% expandableArgumentMode="toggle"
    export function saveData(url: string, data: string, apiKey: string, handler: (success: boolean, response: string) => void): void {
        saveDataAsync(url, data, apiKey)
            .then(result => handler(result.success, result.response))
            .catch(_ => handler(false, ""))
    }

    /**
     * Async function to save data to a database/API.
     */
    export function saveDataAsync(url: string, data: string, apiKey?: string): Promise<{ success: boolean, response: string }> {
        const f = (globalThis as any).fetch
        if (!f) return Promise.reject(new Error("HTTP not supported"))
        
        const headers: any = {
            "Content-Type": "application/json"
        }
        if (apiKey && apiKey !== "") {
            headers["Authorization"] = "Bearer " + apiKey
            headers["X-API-Key"] = apiKey
        }
        
        return f(url, { method: "POST", headers, body: data })
            .then((res: any) => res.text().then((body: string) => ({
                success: res.status >= 200 && res.status < 300,
                response: body
            })))
    }

    /**
     * Get a specific variable/value from a database by key.
     */
    //% block="get variable %variableName from %url|with key %apiKey then do %handler" handlerStatement=1 weight=35
    //% apiKey.defl=""
    //% expandableArgumentMode="toggle"
    export function getVariable(variableName: string, url: string, apiKey: string, handler: (success: boolean, value: string) => void): void {
        getVariableAsync(variableName, url, apiKey)
            .then(result => handler(result.success, result.value))
            .catch(_ => handler(false, ""))
    }

    /**
     * Async function to get a variable from a database.
     */
    export function getVariableAsync(variableName: string, url: string, apiKey?: string): Promise<{ success: boolean, value: string }> {
        // Build URL with variable name as query parameter or path
        const fullUrl = url.indexOf("?") >= 0 ? url + "&key=" + variableName : url + "?key=" + variableName
        
        return getDataAsync(fullUrl, apiKey)
            .then(result => {
                if (result.success) {
                    try {
                        // Try to parse as JSON and extract the variable
                        const parsed = JSON.parse(result.data)
                        const value = parsed[variableName] || parsed.value || result.data
                        return { success: true, value: String(value) }
                    } catch {
                        // If not JSON, return raw data
                        return { success: true, value: result.data }
                    }
                }
                return { success: false, value: "" }
            })
    }

    /**
     * Set/save a specific variable to a database.
     */
    //% block="set variable %variableName to %value at %url|with key %apiKey then do %handler" handlerStatement=1 weight=30
    //% apiKey.defl=""
    //% expandableArgumentMode="toggle"
    export function setVariable(variableName: string, value: string, url: string, apiKey: string, handler: (success: boolean) => void): void {
        setVariableAsync(variableName, value, url, apiKey)
            .then(success => handler(success))
            .catch(_ => handler(false))
    }

    /**
     * Async function to set a variable in a database.
     */
    export function setVariableAsync(variableName: string, value: string, url: string, apiKey?: string): Promise<boolean> {
        const payload = JSON.stringify({
            key: variableName,
            value: value
        })
        
        return saveDataAsync(url, payload, apiKey)
            .then(result => result.success)
    }
}
