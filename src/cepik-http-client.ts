import { CepikApiLogger as Logger } from "./cepik-api-logger.js";

export class CepikHttpClient {

    private logger: Logger = new Logger({ context: `CEPIK Http Client` });
    private isNode = typeof process !== 'undefined' && process.versions && !!process.versions.node;

    public async get<T>(
        url: string,
        headers: Record<string, string> = {}
    ): Promise<T> {
        return this.isNode
            ? this.nodeGet<T>(url, headers)
            : this.browserGet<T>(url, headers);
    };

    private async nodeGet<T>(
        url: string,
        headers: Record<string, string>
    ): Promise<T> {

        const https = await import('node:https');
        const options: any = {
            method: 'GET',
            ciphers: 'DEFAULT@SECLEVEL=0',
            minVersion: 'TLSv1',
            headers: {
                'Accept': 'application/json',
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive",
                ...headers
            },
        };

        return new Promise((resolve, reject) => {
            const req = https.get(url, options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {

                        try {

                            const isJson = res.headers['content-type']?.includes('application/json');
                            const rateLimitingRemaining = res.headers[`x-rate-limit-remaining`]
                                ? Number(res.headers[`x-rate-limit-remaining`])
                                : undefined;
                            resolve(isJson ? { ...JSON.parse(data), rateLimitingRemaining } : data as unknown as T);

                        } catch (error) {

                            this.logger.error(`Failed to parse response`, error)
                            reject(new Error("Failed to parse response"));

                        }

                    } else {

                        reject(new Error(`HTTP status ${res.statusCode}`));

                    }
                });
            });

            req.on('error', error => {
                this.logger.error("Node HTTPS Error:", error);
                reject(error);
            });
        });
    }

    private async browserGet<T>(
        url: string,
        headers: Record<string, string>
    ): Promise<T> {
        try {

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Accept-Encoding": "gzip, deflate, br",
                    Connection: "keep-alive",
                    ...headers
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const contentType = response.headers.get("content-type");
            return contentType?.includes("application/json")
                ? await response.json()
                : await response.text() as unknown as T;

        } catch (error) {

            this.logger.error("Browser Fetch Error:", error);
            throw error;

        }
    }
}