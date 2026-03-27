import { CepikApiLoggerConfiguration, ColorCode } from "./types.js";

export class CepikApiLogger {

    private context: string = `CEPIK API LOGGER`;
    private colorCode: Record<ColorCode, string> = {
        RED: "\x1b[31m",
        YELLOW: "\x1b[33m",
        GREEN: "\x1b[32m",
        DEFAULT: "\x1b[0m",
        MAGENTA: "\x1b[35m"
    }

    constructor(
        configuration: CepikApiLoggerConfiguration = {}
    ) {

        const { context } = configuration;
        if (context) {
            this.context = context;
        }

    }

    private getTime(): string {
        return new Date().toISOString().replace("T", " ");
    }

    public log<T extends unknown>(message: T): void {
        console.log(`${this.colorCode.GREEN} [${this.context}] ${this.getTime()} | ${message}`)
    };

    public warn<T extends unknown>(message: T): void {
        console.warn(`${this.colorCode.YELLOW} [${this.context}] ${this.getTime()} | ${message}`);
    };

    public error<T extends unknown>(message: T): void {
        console.error(`${this.colorCode.RED} [${this.context}] ${this.getTime()} | ${message}`);
    };

    public debug<T extends unknown>(message: T): void {

        console.debug(`${this.colorCode.MAGENTA} [${this.context}] ${this.getTime()} | ${message}`);

    };

};