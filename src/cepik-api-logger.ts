import { CepikApiLoggerConfiguration, ColorCode } from "./types.js";

export class CepikApiLogger {

    private context: string = `CEPIK API LOGGER`;
    private colorCode: Record<ColorCode, string> = {
        RED: "\x1b[31m",
        YELLOW: "\x1b[33m",
        GREEN: "\x1b[32m",
        DEFAULT: "\x1b[0m",
        MAGENTA: "\x1b[35m"
    };

    constructor(
        configuration: CepikApiLoggerConfiguration = {}
    ) {

        const { context } = configuration;
        if (context) {
            this.context = context;
        }

    };

    private getTime = (): string => new Date().toISOString().replace("T", " ");

    private formatMessage(
        message: unknown
    ): string {

        if (typeof message === "string") {
            return message;
        }

        try {
            if (message === null || message === undefined) {
                return String(message);
            }
            if (typeof message === "object") {
                return JSON.stringify(message, null, 2);
            }
            return String(message);
        } catch {
            return "[unserializable message]";
        }
    }

    private print(
        level: "log" | "warn" | "error" | "debug",
        color: ColorCode,
        message: unknown
    ): void {
        const formattedMessage = this.formatMessage(message);
        const output = `${this.colorCode[color]} [${this.context}] ${this.getTime()} | ${formattedMessage}${this.colorCode.DEFAULT}`;
        console[level](output);
    };

    public log = (message: unknown): void => this.print("log", "GREEN", message);
    public warn = (message: unknown): void => this.print("warn", "YELLOW", message);
    public error = (message: unknown, error?: unknown): void => {

        this.print("error", "RED", message);
        if (error) {
            this.print("error", "RED", error);
        }
    }
    public debug = (message: unknown): void => this.print("debug", "MAGENTA", message);

};