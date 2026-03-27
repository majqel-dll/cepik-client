import { CEPIKApiClient } from "./cepik-client.js";

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("CEPIKApiClient", () => {

    let client: CEPIKApiClient;

    beforeEach(() => {
        mockFetch.mockClear();
        client = new CEPIKApiClient();
    });

    describe("constructor", () => {

        it("Should initialize with default config", () => {
            const newClient = new CEPIKApiClient();
            expect(newClient).toBeInstanceOf(CEPIKApiClient);
        });

    });

});