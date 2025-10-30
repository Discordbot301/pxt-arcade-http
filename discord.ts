//% color=#5865F2 icon="\uf0e0" weight=95
//% block="Discord"
namespace discord {
    /**
     * Send a Discord webhook message and return the HTTP status as text (e.g., "204").
     */
    //% block="Discord send webhook to $url with message $message" weight=85
    //% blockSetVariable=status
    export function sendWebhook(url: string, message: string): string {
        let result = ""
        let done = false
        const payload = JSON.stringify({ content: message })
        http.postAsync(url, payload, "application/json")
            .then(r => { result = ((r.status | 0) + ""); done = true })
            .catch(_ => { result = ""; done = true })
        pauseUntil(() => done, 5000)
        return result
    }
}
