import { CepikHttpClient } from "./cepik-http-client.js";
import { EventEmitter } from "events";

jest.mock("./cepik-api-logger.js", () => ({
    CepikApiLogger: jest.fn(() => ({
        error: jest.fn(),
    })),
}));

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

jest.mock("node:https", () => ({
    get: jest.fn(),
}));

describe("CepikHttpClient", () => {
    let client: CepikHttpClient;

    beforeEach(() => {
        jest.clearAllMocks();
        client = new CepikHttpClient();
    });

    describe("constructor", () => {
        it("Should initialize", () => {
            const newClient = new CepikHttpClient();
            expect(newClient).toBeInstanceOf(CepikHttpClient);
        });
    });

    describe("get method - environment detection", () => {
        it("Should use nodeGet in Node.js environment", async () => {
            const originalProcess = global.process;

            const url = "https://example.com/test";
            const headers = { "Custom-Header": "value" };

            const mockResponse = new EventEmitter() as any;
            mockResponse.statusCode = 200;
            mockResponse.headers = {
                "content-type": "application/json",
                "x-rate-limit-remaining": "100",
            };

            const mockRequest = new EventEmitter() as any;
            const httpsModule = require("node:https");
            httpsModule.get.mockImplementation(
                (url: string, options: any, callback: any) => {
                    callback(mockResponse);
                    return mockRequest;
                }
            );

            setTimeout(() => {
                mockResponse.emit("data", '{"result":"success"}');
                mockResponse.emit("end");
            }, 10);

            const result = await client.get(url, headers);

            expect(result).toEqual({
                result: "success",
                rateLimitingRemaining: 100,
            });
            expect(httpsModule.get).toHaveBeenCalled();
        });

        it("Should use browserGet when Node.js is not available", async () => {

            const originalProcess = (global as any).process;
            (global as any).process = undefined;

            try {
                const browserClient = new CepikHttpClient();

                mockFetch.mockResolvedValueOnce({
                    ok: true,
                    status: 200,
                    headers: new Map([["content-type", "application/json"]]),
                    json: jest.fn().mockResolvedValueOnce({ result: "success" }),
                } as any);

                const result = await browserClient.get("https://example.com/test");

                expect(result).toEqual({ result: "success" });
                expect(mockFetch).toHaveBeenCalled();
            } finally {
                (global as any).process = originalProcess;
            }
        });
    });

    describe("nodeGet method", () => {
        beforeEach(() => {
            const httpsModule = require("node:https");
            httpsModule.get.mockClear();
        });

        it("Should successfully fetch and parse JSON response", async () => {
            const mockResponse = new EventEmitter() as any;
            mockResponse.statusCode = 200;
            mockResponse.headers = {
                "content-type": "application/json",
                "x-rate-limit-remaining": "50",
            };

            const mockRequest = new EventEmitter() as any;
            const httpsModule = require("node:https");
            httpsModule.get.mockImplementation(
                (url: string, options: any, callback: any) => {
                    callback(mockResponse);
                    return mockRequest;
                }
            );

            setTimeout(() => {
                mockResponse.emit("data", '{"data":"test"}');
                mockResponse.emit("end");
            }, 10);

            const result = await client.get("https://example.com/api");

            expect(result).toEqual({
                data: "test",
                rateLimitingRemaining: 50,
            });
        });

        it("Should handle responses without x-rate-limit-remaining header", async () => {
            const mockResponse = new EventEmitter() as any;
            mockResponse.statusCode = 200;
            mockResponse.headers = {
                "content-type": "application/json",
            };

            const mockRequest = new EventEmitter() as any;
            const httpsModule = require("node:https");
            httpsModule.get.mockImplementation(
                (url: string, options: any, callback: any) => {
                    callback(mockResponse);
                    return mockRequest;
                }
            );

            setTimeout(() => {
                mockResponse.emit("data", '{"data":"test"}');
                mockResponse.emit("end");
            }, 10);

            const result = await client.get("https://example.com/api");

            expect(result).toEqual({
                data: "test",
                rateLimitingRemaining: undefined,
            });
        });

        it("Should handle non-JSON responses", async () => {
            const mockResponse = new EventEmitter() as any;
            mockResponse.statusCode = 200;
            mockResponse.headers = {
                "content-type": "text/plain",
            };

            const mockRequest = new EventEmitter() as any;
            const httpsModule = require("node:https");
            httpsModule.get.mockImplementation(
                (url: string, options: any, callback: any) => {
                    callback(mockResponse);
                    return mockRequest;
                }
            );

            setTimeout(() => {
                mockResponse.emit("data", "plain text response");
                mockResponse.emit("end");
            }, 10);

            const result = await client.get<string>("https://example.com/api");

            expect(result).toBe("plain text response");
        });

        it("Should reject on HTTP error status codes", async () => {
            const mockResponse = new EventEmitter() as any;
            mockResponse.statusCode = 404;
            mockResponse.headers = {};

            const mockRequest = new EventEmitter() as any;
            const httpsModule = require("node:https");
            httpsModule.get.mockImplementation(
                (url: string, options: any, callback: any) => {
                    callback(mockResponse);
                    return mockRequest;
                }
            );

            setTimeout(() => {
                mockResponse.emit("data", "Not found");
                mockResponse.emit("end");
            }, 10);

            await expect(client.get("https://example.com/api")).rejects.toThrow(
                "HTTP status 404"
            );
        });

        it("Should reject on invalid JSON", async () => {
            const mockResponse = new EventEmitter() as any;
            mockResponse.statusCode = 200;
            mockResponse.headers = {
                "content-type": "application/json",
            };

            const mockRequest = new EventEmitter() as any;
            const httpsModule = require("node:https");
            httpsModule.get.mockImplementation(
                (url: string, options: any, callback: any) => {
                    callback(mockResponse);
                    return mockRequest;
                }
            );

            setTimeout(() => {
                mockResponse.emit("data", "invalid json");
                mockResponse.emit("end");
            }, 10);

            await expect(client.get("https://example.com/api")).rejects.toThrow(
                "Failed to parse response"
            );
        });

        it("Should reject on request error", async () => {
            const mockRequest = new EventEmitter() as any;
            const httpsModule = require("node:https");
            httpsModule.get.mockImplementation(
                (url: string, options: any, callback: any) => {
                    return mockRequest;
                }
            );

            setTimeout(() => {
                mockRequest.emit("error", new Error("Network error"));
            }, 10);

            await expect(client.get("https://example.com/api")).rejects.toThrow(
                "Network error"
            );
        });

        it("Should pass custom headers in options", async () => {
            const mockResponse = new EventEmitter() as any;
            mockResponse.statusCode = 200;
            mockResponse.headers = {
                "content-type": "application/json",
            };

            const mockRequest = new EventEmitter() as any;
            const httpsModule = require("node:https");
            httpsModule.get.mockImplementation(
                (url: string, options: any, callback: any) => {
                    callback(mockResponse);
                    return mockRequest;
                }
            );

            setTimeout(() => {
                mockResponse.emit("data", "{}");
                mockResponse.emit("end");
            }, 10);

            const customHeaders = { "Authorization": "Bearer token" };
            await client.get("https://example.com/api", customHeaders);

            const callArgs = httpsModule.get.mock.calls[0];
            expect(callArgs[1].headers).toMatchObject({
                Accept: "application/json",
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive",
                Authorization: "Bearer token",
            });
        });

        it("Should handle status codes 200-299 as success", async () => {
            const mockResponse = new EventEmitter() as any;
            mockResponse.statusCode = 201;
            mockResponse.headers = {
                "content-type": "application/json",
            };

            const mockRequest = new EventEmitter() as any;
            const httpsModule = require("node:https");
            httpsModule.get.mockImplementation(
                (url: string, options: any, callback: any) => {
                    callback(mockResponse);
                    return mockRequest;
                }
            );

            setTimeout(() => {
                mockResponse.emit("data", '{"status":"created"}');
                mockResponse.emit("end");
            }, 10);

            const result = await client.get("https://example.com/api");
            expect(result).toEqual({ status: "created" });
        });

        it("Should reject on status code 300+", async () => {
            const mockResponse = new EventEmitter() as any;
            mockResponse.statusCode = 500;
            mockResponse.headers = {};

            const mockRequest = new EventEmitter() as any;
            const httpsModule = require("node:https");
            httpsModule.get.mockImplementation(
                (url: string, options: any, callback: any) => {
                    callback(mockResponse);
                    return mockRequest;
                }
            );

            setTimeout(() => {
                mockResponse.emit("data", "Server error");
                mockResponse.emit("end");
            }, 10);

            await expect(client.get("https://example.com/api")).rejects.toThrow(
                "HTTP status 500"
            );
        });
    });

    describe("browserGet method", () => {
        beforeEach(() => {
            mockFetch.mockClear();
            const originalProcess = (global as any).process;
            (global as any).process = undefined;
            const browserClient = new CepikHttpClient();
            client = browserClient;
            (global as any).process = originalProcess;
        });

        it("Should successfully fetch JSON response", async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                headers: new Map([["content-type", "application/json"]]),
                json: jest.fn().mockResolvedValueOnce({ data: "test" }),
            } as any);

            const result = await client.get("https://example.com/api");

            expect(result).toEqual({ data: "test" });
            expect(mockFetch).toHaveBeenCalledWith(
                "https://example.com/api",
                expect.objectContaining({
                    method: "GET",
                    headers: expect.objectContaining({
                        Accept: "application/json",
                    }),
                })
            );
        });

        it("Should successfully fetch text response", async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                headers: new Map([["content-type", "text/plain"]]),
                text: jest.fn().mockResolvedValueOnce("plain text"),
            } as any);

            const result = await client.get<string>("https://example.com/api");

            expect(result).toBe("plain text");
        });

        it("Should reject on HTTP error", async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                headers: new Map(),
            } as any);

            await expect(client.get("https://example.com/api")).rejects.toThrow(
                "HTTP error! status: 404"
            );
        });

        it("Should reject on fetch error", async () => {
            mockFetch.mockRejectedValueOnce(new Error("Network failed"));

            await expect(client.get("https://example.com/api")).rejects.toThrow(
                "Network failed"
            );
        });

        it("Should pass custom headers", async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                headers: new Map([["content-type", "application/json"]]),
                json: jest.fn().mockResolvedValueOnce({}),
            } as any);

            const customHeaders = { Authorization: "Bearer token" };
            await client.get("https://example.com/api", customHeaders);

            expect(mockFetch).toHaveBeenCalledWith(
                "https://example.com/api",
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Accept: "application/json",
                        Authorization: "Bearer token",
                    }),
                })
            );
        });

        it("Should handle responses without content-type header", async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                headers: new Map(),
                text: jest.fn().mockResolvedValueOnce("response"),
            } as any);

            const result = await client.get<string>("https://example.com/api");

            expect(result).toBe("response");
        });

        it("Should include default headers", async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                headers: new Map([["content-type", "application/json"]]),
                json: jest.fn().mockResolvedValueOnce({}),
            } as any);

            await client.get("https://example.com/api");

            const callArgs = mockFetch.mock.calls[0];
            expect(callArgs[1].headers).toMatchObject({
                Accept: "application/json",
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive",
            });
        });

        it("Should include rateLimitingRemaining from x-rate-limit-remaining header", async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                headers: new Map([
                    ["content-type", "application/json"],
                    ["x-rate-limit-remaining", "42"],
                ]),
                json: jest.fn().mockResolvedValueOnce({ data: "test" }),
            } as any);

            const result = await client.get("https://example.com/api") as any;

            expect(result.rateLimitingRemaining).toBe(42);
            expect(result.data).toBe("test");
        });

        it("Should set rateLimitingRemaining to undefined when header is absent", async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                status: 200,
                headers: new Map([["content-type", "application/json"]]),
                json: jest.fn().mockResolvedValueOnce({ data: "test" }),
            } as any);

            const result = await client.get("https://example.com/api") as any;

            expect(result.rateLimitingRemaining).toBeUndefined();
        });
    });
});
