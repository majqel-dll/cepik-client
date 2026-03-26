import { CEPIKClient } from "./cepik-client.js";

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("CEPIKClient", () => {

    let client: CEPIKClient;

    beforeEach(() => {
        mockFetch.mockClear();
        client = new CEPIKClient();
    });

    describe("constructor", () => {

        it("Should initialize with default config", () => {
            const newClient = new CEPIKClient();
            expect(newClient).toBeInstanceOf(CEPIKClient);
        });

    });

});