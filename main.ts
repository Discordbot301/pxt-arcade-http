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
}
