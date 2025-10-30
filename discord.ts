//% color=#5865F2 icon="\uf392" weight=95
//% block="Discord"
namespace discord {
    /**
     * Send a Discord webhook message and return the HTTP status as text (e.g., "204").
     */
    //% block="Discord send webhook to $link with message $message" weight=85
    //% blockSetVariable=status
    export function sendWebhook(link: string, message: string): string {
        let result = ""
        let done = false
        const payload = JSON.stringify({ content: message })
        http.postAsync(link, payload, "application/json")
            .then(r => { result = (r.status | 0).toString(); done = true })
            .catch(_ => { result = ""; done = true })
        pauseUntil(() => done, 5000)
        return result
    }
}
