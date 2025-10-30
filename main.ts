//% color=#0f6ad8 icon="\uf0e0" weight=100
// Allow referencing the browser fetch in simulator without TS lib errors
declare const fetch: any

namespace http {
    /**
     * Async GET returning status and body.
     */
    export function getDataAsync(url: string, apiKey?: string): Promise<any> {
        const f = (fetch as any)
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
     * Async POST returning status and response body.
     */
    export function postAsync(url: string, body: string, contentType?: string): Promise<any> {
        const f = (fetch as any)
        if (!f) return Promise.reject(new Error("HTTP not supported"))
        const headers: any = {}
        if (contentType) headers["Content-Type"] = contentType
        return f(url, { method: "POST", headers, body })
            .then((res: any) => res.text().then((t: string) => ({ status: (res.status | 0), body: t })))
    }

    /**
     * Async function to save data to a database/API.
     */
    export function saveDataAsync(url: string, data: string, apiKey?: string): Promise<any> {
        const f = (fetch as any)
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
     * Simple HTTP GET that returns the response as a string (pauses until complete).
     */
    //% block="HTTP GET $url key $apiKey" weight=100
    //% apiKey.defl=""
    //% blockSetVariable=response
    export function httpGet(url: string, apiKey: string): string {
        let result = ""
        let done = false
        
        getDataAsync(url, apiKey)
            .then(r => {
                result = r.data
                done = true
            })
            .catch(_ => {
                result = ""
                done = true
            })
        
        pauseUntil(() => done, 5000)
        return result
    }

    /**
     * Simple HTTP POST that sends data and returns true if successful.
     */
    //% block="HTTP POST $url value $data key $apiKey" weight=90
    //% apiKey.defl=""
    export function httpPost(url: string, data: string, apiKey: string): boolean {
        let success = false
        let done = false
        
        saveDataAsync(url, data, apiKey)
            .then(r => {
                success = r.success
                done = true
            })
            .catch(_ => {
                success = false
                done = true
            })
        
        pauseUntil(() => done, 5000)
        return success
    }

    /**
     * Send a message to a webhook (Discord, Slack, etc) and return the HTTP status as text (e.g., "204").
     */
    //% block="Send webhook to $link With message $message" weight=80
    //% blockSetVariable=status
    export function sendWebhook(link: string, message: string): string {
        let result = ""
        let done = false
        const payload = JSON.stringify({ content: message })
        postAsync(link, payload, "application/json")
            .then(r => { result = (r.status | 0).toString(); done = true })
            .catch(_ => { result = ""; done = true })
        pauseUntil(() => done, 5000)
        return result
    }

    /**
     * Legacy: send webhook and return success flag (hidden in Blocks).
     */
    //% blockHidden=true
    export function sendWebhookStatus(link: string, message: string): boolean {
        let success = false
        let done = false
        const payload = JSON.stringify({ content: message })
        postAsync(link, payload, "application/json")
            .then(r => { success = r.status >= 200 && r.status < 300; done = true })
            .catch(_ => { success = false; done = true })
        pauseUntil(() => done, 5000)
        return success
    }
}
