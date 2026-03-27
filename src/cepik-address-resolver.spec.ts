import { CepikAddressResolver } from "./cepik-address-resolver.js";

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("CEPIKClient", () => {

    let client: CepikAddressResolver;

    beforeEach(() => {
        mockFetch.mockClear();
        client = new CepikAddressResolver();
    });

    describe("constructor", () => {

        it("Should initialize", () => {
            const newClient = new CepikAddressResolver();
            expect(newClient).toBeInstanceOf(CepikAddressResolver);
        });

    });

});