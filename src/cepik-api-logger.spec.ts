import { CepikApiLogger } from "./cepik-api-logger.js";

describe("Cepik Api Logger", () => {

    let client: CepikApiLogger;

    beforeEach(() => {
        client = new CepikApiLogger();
    });

    describe("constructor", () => {

        it("Should initialize", () => {
            const newClient = new CepikApiLogger();
            expect(newClient).toBeInstanceOf(CepikApiLogger);
        });

    });

});