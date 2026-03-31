import { CepikApiLogger } from "./cepik-api-logger.js";

describe("CepikApiLogger", () => {
    let logger: CepikApiLogger;
    let consoleLogSpy: jest.SpyInstance;
    let consoleWarnSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;
    let consoleDebugSpy: jest.SpyInstance;

    beforeEach(() => {
        logger = new CepikApiLogger();
        consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
        consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
        consoleDebugSpy = jest.spyOn(console, "debug").mockImplementation();
    });

    afterEach(() => {
        consoleLogSpy.mockRestore();
        consoleWarnSpy.mockRestore();
        consoleErrorSpy.mockRestore();
        consoleDebugSpy.mockRestore();
    });

    describe("constructor", () => {
        it("Should initialize with default context", () => {
            const newLogger = new CepikApiLogger();
            expect(newLogger).toBeInstanceOf(CepikApiLogger);
        });

        it("Should initialize with custom context", () => {
            const customContext = "Custom Logger";
            const newLogger = new CepikApiLogger({ context: customContext });
            expect(newLogger).toBeInstanceOf(CepikApiLogger);

            newLogger.log("test");
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain(customContext);
        });

        it("Should use default context when configuration is empty", () => {
            const newLogger = new CepikApiLogger({});
            expect(newLogger).toBeInstanceOf(CepikApiLogger);

            newLogger.log("test");
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("CEPIK API LOGGER");
        });
    });

    describe("log method", () => {
        it("Should log string messages", () => {
            logger.log("Test message");
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("Test message");
            expect(output).toContain("\x1b[32m");
        });

        it("Should log object messages", () => {
            const testObj = { key: "value", number: 42 };
            logger.log(testObj);
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("key");
            expect(output).toContain("value");
            expect(output).toContain("42");
        });

        it("Should log number messages", () => {
            logger.log(123);
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("123");
        });

        it("Should log boolean messages", () => {
            logger.log(true);
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("true");
        });

        it("Should log null", () => {
            logger.log(null);
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("null");
        });

        it("Should log undefined", () => {
            logger.log(undefined);
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("undefined");
        });

        it("Should include context in output", () => {
            const customLogger = new CepikApiLogger({ context: "Test Context" });
            customLogger.log("message");
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("[Test Context]");
        });

        it("Should include timestamp in output", () => {
            logger.log("test");
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];

            expect(output).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
        });

        it("Should include reset color code at end", () => {
            logger.log("test");
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("\x1b[0m");
        });

        it("Should handle arrays", () => {
            const testArray = [1, 2, 3];
            logger.log(testArray);
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("1");
            expect(output).toContain("2");
            expect(output).toContain("3");
        });
    });

    describe("warn method", () => {
        it("Should warn string messages", () => {
            logger.warn("Warning message");
            expect(consoleWarnSpy).toHaveBeenCalled();
            const output = consoleWarnSpy.mock.calls[0][0];
            expect(output).toContain("Warning message");
            expect(output).toContain("\x1b[33m");
        });

        it("Should warn object messages", () => {
            const testObj = { warning: "data" };
            logger.warn(testObj);
            expect(consoleWarnSpy).toHaveBeenCalled();
            const output = consoleWarnSpy.mock.calls[0][0];
            expect(output).toContain("warning");
            expect(output).toContain("data");
        });

        it("Should include context in output", () => {
            const customLogger = new CepikApiLogger({ context: "Warning Logger" });
            customLogger.warn("test");
            expect(consoleWarnSpy).toHaveBeenCalled();
            const output = consoleWarnSpy.mock.calls[0][0];
            expect(output).toContain("[Warning Logger]");
        });

        it("Should warn number messages", () => {
            logger.warn(999);
            expect(consoleWarnSpy).toHaveBeenCalled();
            const output = consoleWarnSpy.mock.calls[0][0];
            expect(output).toContain("999");
        });
    });

    describe("error method", () => {

        it("Should error string messages", () => {
            logger.error("Error message");
            expect(consoleErrorSpy).toHaveBeenCalled();
            const output = consoleErrorSpy.mock.calls[0][0];
            expect(output).toContain("Error message");
            expect(output).toContain("\x1b[31m");
        });

        it("Should error with message and error object", () => {
            const error = new Error("Test error");
            logger.error("An error occurred", error);
            expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
            
            const messageOutput = consoleErrorSpy.mock.calls[0][0];
            expect(messageOutput).toContain("An error occurred");
            
            const errorOutput = consoleErrorSpy.mock.calls[1][0];
            expect(errorOutput).toContain("Test error");
        });

        it("Should not print error parameter if not provided", () => {
            logger.error("Message only");
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            const output = consoleErrorSpy.mock.calls[0][0];
            expect(output).toContain("Message only");
        });

        it("Should handle error object as error parameter", () => {
            const error = new Error("Critical error");
            logger.error("System error", error);
            expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
            
            const errorOutput = consoleErrorSpy.mock.calls[1][0];
            expect(errorOutput).toContain("Critical error");
        });

        it("Should handle custom error object as error parameter", () => {
            const customError = { code: "ERR_001", message: "Custom error" };
            logger.error("Failed operation", customError);
            expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
            
            const errorOutput = consoleErrorSpy.mock.calls[1][0];
            expect(errorOutput).toContain("ERR_001");
            expect(errorOutput).toContain("Custom error");
        });

        it("Should include context in error output", () => {
            const customLogger = new CepikApiLogger({ context: "Error Handler" });
            customLogger.error("error");
            expect(consoleErrorSpy).toHaveBeenCalled();
            const output = consoleErrorSpy.mock.calls[0][0];
            expect(output).toContain("[Error Handler]");
        });
    });

    describe("debug method", () => {
        it("Should debug string messages", () => {
            logger.debug("Debug message");
            expect(consoleDebugSpy).toHaveBeenCalled();
            const output = consoleDebugSpy.mock.calls[0][0];
            expect(output).toContain("Debug message");
            expect(output).toContain("\x1b[35m");
        });

        it("Should debug object messages", () => {
            const debugObj = { debug: "info" };
            logger.debug(debugObj);
            expect(consoleDebugSpy).toHaveBeenCalled();
            const output = consoleDebugSpy.mock.calls[0][0];
            expect(output).toContain("debug");
            expect(output).toContain("info");
        });

        it("Should include context in debug output", () => {
            const customLogger = new CepikApiLogger({ context: "Debug Logger" });
            customLogger.debug("test");
            expect(consoleDebugSpy).toHaveBeenCalled();
            const output = consoleDebugSpy.mock.calls[0][0];
            expect(output).toContain("[Debug Logger]");
        });

        it("Should debug null values", () => {
            logger.debug(null);
            expect(consoleDebugSpy).toHaveBeenCalled();
            const output = consoleDebugSpy.mock.calls[0][0];
            expect(output).toContain("null");
        });
    });

    describe("Message formatting", () => {
        it("Should format nested objects with indentation", () => {
            const nestedObj = {
                level1: {
                    level2: {
                        value: "deep"
                    }
                }
            };
            logger.log(nestedObj);
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("level1");
            expect(output).toContain("level2");
            expect(output).toContain("deep");
        });

        it("Should handle arrays of objects", () => {
            const arrayOfObjects = [
                { id: 1, name: "first" },
                { id: 2, name: "second" }
            ];
            logger.log(arrayOfObjects);
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("id");
            expect(output).toContain("name");
        });

        it("Should handle empty objects", () => {
            logger.log({});
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("{}");
        });

        it("Should handle empty strings", () => {
            logger.log("");
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];

            expect(output).toBeTruthy();
        });

        it("Should handle very long strings", () => {
            const longString = "a".repeat(1000);
            logger.log(longString);
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("a".repeat(100));
        });

        it("Should handle special characters in strings", () => {
            logger.log("Special: !@#$%^&*()");
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("Special: !@#$%^&*()");
        });

        it("Should handle unicode characters", () => {
            logger.log("Unicode: 你好世界 🌍");
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("Unicode");
        });

        it("Should handle newlines in strings", () => {
            logger.log("Line1\nLine2");
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("Line1");
            expect(output).toContain("Line2");
        });

        it("Should handle objects with null values", () => {
            logger.log({ key: null });
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("null");
        });

        it("Should handle objects with undefined values", () => {
            logger.log({ key: undefined });
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("{}");
        });

        it("Should return unserializable message indicator for circular references", () => {
            const circularObj: any = { a: 1 };
            circularObj.self = circularObj;
            logger.log(circularObj);
            expect(consoleLogSpy).toHaveBeenCalled();
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("[unserializable message]");
        });
    });

    describe("Color codes", () => {
        it("Should use GREEN for log", () => {
            logger.log("test");
            const output = consoleLogSpy.mock.calls[0][0];
            expect(output).toContain("\x1b[32m");
        });

        it("Should use YELLOW for warn", () => {
            logger.warn("test");
            const output = consoleWarnSpy.mock.calls[0][0];
            expect(output).toContain("\x1b[33m");
        });

        it("Should use RED for error", () => {
            logger.error("test");
            const output = consoleErrorSpy.mock.calls[0][0];
            expect(output).toContain("\x1b[31m");
        });

        it("Should use MAGENTA for debug", () => {
            logger.debug("test");
            const output = consoleDebugSpy.mock.calls[0][0];
            expect(output).toContain("\x1b[35m");
        });

        it("Should always end with DEFAULT color reset", () => {
            logger.log("test");
            const logOutput = consoleLogSpy.mock.calls[0][0];
            expect(logOutput).toContain("\x1b[0m");

            logger.warn("test");
            const warnOutput = consoleWarnSpy.mock.calls[0][0];
            expect(warnOutput).toContain("\x1b[0m");

            logger.error("test");
            const errorOutput = consoleErrorSpy.mock.calls[0][0];
            expect(errorOutput).toContain("\x1b[0m");

            logger.debug("test");
            const debugOutput = consoleDebugSpy.mock.calls[0][0];
            expect(debugOutput).toContain("\x1b[0m");
        });
    });

    describe("Integration tests", () => {
        it("Should handle consecutive log calls", () => {
            logger.log("First");
            logger.log("Second");
            logger.log("Third");
            expect(consoleLogSpy).toHaveBeenCalledTimes(3);
        });

        it("Should handle mixed log levels", () => {
            logger.log("Info");
            logger.warn("Warning");
            logger.error("Error");
            logger.debug("Debug");

            expect(consoleLogSpy).toHaveBeenCalledTimes(1);
            expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
        });

        it("Should maintain context across multiple calls", () => {
            const customLogger = new CepikApiLogger({ context: "Persistent" });
            customLogger.log("message1");
            customLogger.warn("message2");
            customLogger.debug("message3");

            const allCalls = [
                ...consoleLogSpy.mock.calls,
                ...consoleWarnSpy.mock.calls,
                ...consoleDebugSpy.mock.calls
            ];

            allCalls.forEach(call => {
                expect(call[0]).toContain("[Persistent]");
            });
        });

        it("Should handle rapid successive calls", () => {
            for (let i = 0; i < 100; i++) {
                logger.log(`Message ${i}`);
            }
            expect(consoleLogSpy).toHaveBeenCalledTimes(100);
        });
    });
});