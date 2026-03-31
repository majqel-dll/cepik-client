import { VoivodeshipEnum, DictionariesEnum } from "./enums.js";
import { CepikHttpClient } from "./cepik-http-client.js";
import { CepikApiLogger } from "./cepik-api-logger.js";
import { CEPIKApiClient } from "./cepik-client.js";

jest.mock("./cepik-http-client.js");
jest.mock("./cepik-api-logger.js", () => ({
    CepikApiLogger: jest.fn().mockImplementation(() => ({
        log: jest.fn(),
    })),
}));

const MockedHttpClient = CepikHttpClient as jest.MockedClass<typeof CepikHttpClient>;
const MockedLogger = CepikApiLogger as jest.MockedClass<typeof CepikApiLogger>;

describe("CEPIKApiClient", () => {

    let client: CEPIKApiClient;
    let mockGet: jest.MockedFunction<InstanceType<typeof CepikHttpClient>["get"]>;

    const mockListResponse = {
        data: [] as never[],
        links: { first: "", last: "", next: "", prev: "", self: "" },
        meta: { count: 0, page: 1, limit: 25 },
        rateLimitingRemaining: 100,
    };

    const mockErrorResponse = {
        id: "err-1",
        "errorr-result": "Error",
        "errorr-reason": "Not found",
        "errorr-solution": "Check the ID",
        "error-help": "https://api.cepik.gov.pl",
        "error-code": "404",
    };

    const getCalledUrl = () => mockGet.mock.calls[0][0] as string;

    beforeEach(() => {
        jest.clearAllMocks();
        client = new CEPIKApiClient();
        mockGet = MockedHttpClient.mock.instances[0].get as jest.MockedFunction<typeof mockGet>;
        mockGet.mockResolvedValue(mockListResponse as never);
    });

    describe("constructor", () => {

        it("Should initialize with default config", () => {
            expect(client).toBeInstanceOf(CEPIKApiClient);
        });

        it("Should initialize with debug enabled", () => {
            const debugClient = new CEPIKApiClient({ debug: true });
            expect(debugClient).toBeInstanceOf(CEPIKApiClient);
        });

    });

    describe("getVehicles", () => {

        describe("list (no vehicleId)", () => {

            it("Should call /pojazdy with wojewodztwo and data-od", async () => {
                await client.getVehicles({
                    voivodeship: VoivodeshipEnum.MAZOVIA,
                    fromDate: new Date(2023, 0, 15),
                });

                expect(getCalledUrl()).toContain("/pojazdy");
                expect(getCalledUrl()).toContain("wojewodztwo=14");
                expect(getCalledUrl()).toContain("data-od=20230115");
            });

            it("Should include data-do when toDate is provided", async () => {
                await client.getVehicles({
                    voivodeship: VoivodeshipEnum.LOWER_SILESIA,
                    fromDate: new Date(2023, 0, 1),
                    toDate: new Date(2023, 11, 31),
                });

                expect(getCalledUrl()).toContain("data-do=20231231");
            });

            it("Should append limit and page as query params", async () => {
                await client.getVehicles({
                    voivodeship: VoivodeshipEnum.MAZOVIA,
                    fromDate: new Date(2023, 0, 15),
                    limit: 50,
                    page: 3,
                });

                expect(getCalledUrl()).toContain("limit=50");
                expect(getCalledUrl()).toContain("page=3");
            });

            it("Should append sort and fields as query params", async () => {
                await client.getVehicles({
                    voivodeship: VoivodeshipEnum.MAZOVIA,
                    fromDate: new Date(2023, 0, 15),
                    sort: ["marka", "model"] as never[],
                    fields: ["marka", "rok-produkcji"] as never[],
                });

                expect(getCalledUrl()).toContain("sort=marka,model");
                expect(getCalledUrl()).toContain("fields=marka,rok-produkcji");
            });

            it("Should append typ-daty when dateType is provided", async () => {
                await client.getVehicles({
                    voivodeship: VoivodeshipEnum.MAZOVIA,
                    fromDate: new Date(2023, 0, 15),
                    dateType: 1,
                });

                expect(getCalledUrl()).toContain("typ-daty=1");
            });

            it("Should append typ-daty=0 when dateType is 0", async () => {
                await client.getVehicles({
                    voivodeship: VoivodeshipEnum.MAZOVIA,
                    fromDate: new Date(2023, 0, 15),
                    dateType: 0,
                });

                expect(getCalledUrl()).toContain("typ-daty=0");
            });

            it("Should append tylko-zarejestrowane when isRegistered is provided", async () => {
                await client.getVehicles({
                    voivodeship: VoivodeshipEnum.MAZOVIA,
                    fromDate: new Date(2023, 0, 15),
                    isRegistered: true,
                });

                expect(getCalledUrl()).toContain("tylko-zarejestrowane=true");
            });

            it("Should append pokaz-wszystkie-pola when showAllFields is provided", async () => {
                await client.getVehicles({
                    voivodeship: VoivodeshipEnum.MAZOVIA,
                    fromDate: new Date(2023, 0, 15),
                    showAllFields: true,
                });

                expect(getCalledUrl()).toContain("pokaz-wszystkie-pola=true");
            });

            it("Should NOT include voivodeship or fromDate twice in the URL", async () => {
                await client.getVehicles({
                    voivodeship: VoivodeshipEnum.MAZOVIA,
                    fromDate: new Date(2023, 0, 15),
                });

                const url = getCalledUrl();
                expect((url.match(/wojewodztwo/g) ?? []).length).toBe(1);
                expect((url.match(/data-od/g) ?? []).length).toBe(1);
            });

            it("Should throw when toDate is before fromDate", async () => {
                await expect(client.getVehicles({
                    voivodeship: VoivodeshipEnum.MAZOVIA,
                    fromDate: new Date(2023, 5, 15),
                    toDate: new Date(2023, 0, 1),
                })).rejects.toThrow("The 'toDate' field can't be before 'fromDate'");
            });

        });

        describe("specific (vehicleId)", () => {

            it("Should call /pojazdy/{vehicleId}", async () => {
                await client.getVehicles({ vehicleId: "VH-12345" });

                expect(getCalledUrl()).toContain("/pojazdy/VH-12345");
                expect(getCalledUrl()).not.toContain("wojewodztwo");
            });

            it("Should append fields query param when provided", async () => {
                await client.getVehicles({ vehicleId: "VH-12345", fields: ["marka", "model"] as never[] });

                expect(getCalledUrl()).toContain("fields=marka,model");
            });

        });

    });

    describe("getFiles", () => {

        it("Should call /pliki for list", async () => {
            await client.getFiles({});

            expect(getCalledUrl()).toMatch(/\/pliki(\?|$)/);
        });

        it("Should append limit and page for list", async () => {
            await client.getFiles({ limit: 10, page: 2 });

            expect(getCalledUrl()).toContain("limit=10");
            expect(getCalledUrl()).toContain("page=2");
        });

        it("Should call /pliki/{fileId} for specific file", async () => {
            await client.getFiles({ fileId: "file-001" });

            expect(getCalledUrl()).toContain("/pliki/file-001");
        });

    });

    describe("getDrivingLicences", () => {

        it("Should call /prawa-jazdy for list", async () => {
            await client.getDrivingLicences({});

            expect(getCalledUrl()).toContain("/prawa-jazdy");
        });

        it("Should append filter, sort and fields", async () => {
            await client.getDrivingLicences({
                filter: { plec: "K" },
                sort: ["wiek"],
                fields: ["ilosc"],
            });

            const url = getCalledUrl();
            expect(url).toContain("filter[plec]=K");
            expect(url).toContain("sort=wiek");
            expect(url).toContain("fields=ilosc");
        });

        it("Should call /prawa-jazdy/{drivingLicenceId} for specific licence", async () => {
            await client.getDrivingLicences({ drivingLicenceId: "DL-9999" });

            expect(getCalledUrl()).toContain("/prawa-jazdy/DL-9999");
        });

    });

    describe("getPermissions", () => {

        it("Should call /uprawnienia for list", async () => {
            await client.getPermissions({});

            expect(getCalledUrl()).toContain("/uprawnienia");
        });

        it("Should append filter, sort and fields", async () => {
            await client.getPermissions({
                filter: { "kod-uprawnienia": "B" },
                sort: ["wiek"],
                fields: ["ilosc"],
            });

            const url = getCalledUrl();
            expect(url).toContain("filter[kod-uprawnienia]=B");
            expect(url).toContain("sort=wiek");
            expect(url).toContain("fields=ilosc");
        });

        it("Should call /uprawnienia/{permissionId} for specific permission", async () => {
            await client.getPermissions({ permissionId: "P-001" });

            expect(getCalledUrl()).toContain("/uprawnienia/P-001");
        });

    });

    describe("getDictionaries", () => {

        it("Should call /slowniki when called without params", async () => {
            await client.getDictionaries();

            expect(getCalledUrl()).toMatch(/\/slowniki(\?|$)/);
        });

        it("Should append limit and page for list", async () => {
            await client.getDictionaries({ limit: 5, page: 1 });

            expect(getCalledUrl()).toContain("limit=5");
            expect(getCalledUrl()).toContain("page=1");
        });

        it("Should call /slowniki/{dictionary} for specific dictionary", async () => {
            await client.getDictionaries({ dictionary: DictionariesEnum.BRAND });

            expect(getCalledUrl()).toContain(`/slowniki/${DictionariesEnum.BRAND}`);
        });

    });

    describe("getStatistics", () => {

        it("Should call /statystyki when called without params", async () => {
            await client.getStatistics();

            expect(getCalledUrl()).toMatch(/\/statystyki(\?|$)/);
        });

        it("Should append data-od and data-do when date range provided", async () => {
            await client.getStatistics({
                fromDate: new Date(2023, 0, 1),
                toDate: new Date(2023, 11, 31),
            });

            expect(getCalledUrl()).toContain("data-od=20230101");
            expect(getCalledUrl()).toContain("data-do=20231231");
        });

        it("Should append limit and page", async () => {
            await client.getStatistics({ limit: 100, page: 2 });

            expect(getCalledUrl()).toContain("limit=100");
            expect(getCalledUrl()).toContain("page=2");
        });

    });

    describe("getVehicleStatistics", () => {

        it("Should call /statystyki/pojazdy/{date} when voivodeship is not provided", async () => {
            await client.getVehicleStatistics({ statisticsDate: new Date(2023, 0, 15) });

            expect(getCalledUrl()).toContain("/statystyki/pojazdy/20230115");
            expect(getCalledUrl()).not.toMatch(/\/statystyki\/pojazdy\/20230115\//);
        });

        it("Should call /statystyki/pojazdy/{date}/{voivodeship} when voivodeship is provided", async () => {
            await client.getVehicleStatistics({
                statisticsDate: new Date(2023, 0, 15),
                voivodeship: VoivodeshipEnum.MAZOVIA,
            });

            expect(getCalledUrl()).toContain("/statystyki/pojazdy/20230115/14");
        });

        it("Should append limit and page for list", async () => {
            await client.getVehicleStatistics({
                statisticsDate: new Date(2023, 0, 15),
                limit: 25,
                page: 2,
            });

            expect(getCalledUrl()).toContain("limit=25");
            expect(getCalledUrl()).toContain("page=2");
        });

    });

    describe("getFileStatistics", () => {

        it("Should call /statystyki/pliki when called without params", async () => {
            await client.getFileStatistics();

            expect(getCalledUrl()).toMatch(/\/statystyki\/pliki(\?|$)/);
        });

        it("Should append data-od and data-do when date range given without statisticsDate", async () => {
            await client.getFileStatistics({
                fromDate: new Date(2023, 0, 1),
                toDate: new Date(2023, 5, 30),
            });

            const url = getCalledUrl();
            expect(url).toMatch(/\/statystyki\/pliki\?/);
            expect(url).toContain("data-od=20230101");
            expect(url).toContain("data-do=20230630");
        });

        it("Should call /statystyki/pliki/{date} when statisticsDate is provided alone", async () => {
            await client.getFileStatistics({ statisticsDate: new Date(2023, 0, 15) });

            const url = getCalledUrl();
            expect(url).toContain("/statystyki/pliki/20230115");
            expect(url).not.toContain("data-od");
        });

        it("Should strip fromDate and toDate from query when statisticsDate is set", async () => {
            await client.getFileStatistics({
                statisticsDate: new Date(2023, 0, 15),
                fromDate: new Date(2022, 0, 1),
                toDate: new Date(2022, 11, 31),
            });

            const url = getCalledUrl();
            expect(url).toContain("/statystyki/pliki/20230115");
            expect(url).not.toContain("data-od");
            expect(url).not.toContain("data-do");
        });

        it("Should call /statystyki/pliki/{date}/{fileId} when both are provided", async () => {
            await client.getFileStatistics({
                statisticsDate: new Date(2023, 0, 15),
                fileId: "file-007",
            });

            expect(getCalledUrl()).toContain("/statystyki/pliki/20230115/file-007");
        });

        it("Should strip statisticsDate and fileId from query but keep remaining params", async () => {
            await client.getFileStatistics({
                statisticsDate: new Date(2023, 0, 15),
                fileId: "file-007",
                limit: 10,
            });

            const url = getCalledUrl();
            expect(url).toContain("/statystyki/pliki/20230115/file-007");
            expect(url).not.toContain("data-od");
            expect(url).toContain("limit=10");
        });

    });

    describe("getActivityStatistics", () => {

        it("Should call /statystyki/aktywnosc/{date} when id is not provided", async () => {
            await client.getActivityStatistics({ statisticsDate: new Date(2023, 0, 15) });

            const url = getCalledUrl();
            expect(url).toContain("/statystyki/aktywnosc/20230115");
            expect(url).not.toMatch(/\/statystyki\/aktywnosc\/20230115\//);
        });

        it("Should call /statystyki/aktywnosc/{date}/{id} when id is provided", async () => {
            await client.getActivityStatistics({
                statisticsDate: new Date(2023, 0, 15),
                id: "act-001",
            });

            expect(getCalledUrl()).toContain("/statystyki/aktywnosc/20230115/act-001");
        });

        it("Should append limit and page for list", async () => {
            await client.getActivityStatistics({
                statisticsDate: new Date(2023, 0, 15),
                limit: 50,
                page: 1,
            });

            expect(getCalledUrl()).toContain("limit=50");
            expect(getCalledUrl()).toContain("page=1");
        });

    });

    describe("getDictionaryStatistics", () => {

        it("Should call /statystyki/slowniki/{date}", async () => {
            await client.getDictionaryStatistics({ statisticsDate: new Date(2023, 0, 15) });

            expect(getCalledUrl()).toContain("/statystyki/slowniki/20230115");
        });

        it("Should append limit and page", async () => {
            await client.getDictionaryStatistics({
                statisticsDate: new Date(2023, 0, 15),
                limit: 20,
                page: 2,
            });

            expect(getCalledUrl()).toContain("limit=20");
            expect(getCalledUrl()).toContain("page=2");
        });

    });

    describe("getVersion", () => {

        it("Should call /version endpoint when no version arg is given", async () => {
            await client.getVersion();

            expect(getCalledUrl()).toMatch(/\/version$/);
            expect(getCalledUrl()).not.toContain("v1");
        });

        it("Should call /v1/version when version is 'v1'", async () => {
            await client.getVersion("v1");

            expect(getCalledUrl()).toContain("/v1/version");
        });

    });

    describe("error handling", () => {

        it("Should throw the ErrorResponse object when API returns error-code", async () => {
            mockGet.mockResolvedValueOnce(mockErrorResponse as never);

            await expect(client.getVehicles({ vehicleId: "BAD-ID" }))
                .rejects.toMatchObject({ "error-code": "404" });
        });

        it("Should throw 'Incorrect date format' when fromDate is an invalid string", async () => {
            await expect(client.getVehicles({
                voivodeship: VoivodeshipEnum.MAZOVIA,
                fromDate: "not-a-date",
            })).rejects.toThrow("Incorrect date format");
        });

        it("Should throw 'Incorrect date format' when statisticsDate is an invalid string", async () => {
            await expect(
                client.getVehicleStatistics({ statisticsDate: "not-a-date" })
            ).rejects.toThrow("Incorrect date format");
        });

    });

    describe("debug mode", () => {

        let debugClient: CEPIKApiClient;
        let debugMockGet: jest.MockedFunction<typeof mockGet>;
        let logMock: jest.Mock;

        beforeEach(() => {
            debugClient = new CEPIKApiClient({ debug: true });
            const httpInstances = MockedHttpClient.mock.instances;
            debugMockGet = httpInstances[httpInstances.length - 1].get as jest.MockedFunction<typeof debugMockGet>;
            debugMockGet.mockResolvedValue(mockListResponse as never);

            const loggerResults = MockedLogger.mock.results;
            logMock = (loggerResults[loggerResults.length - 1].value as { log: jest.Mock }).log;
        });

        it("Should log the endpoint URL before making a request", async () => {
            await debugClient.getFiles({});

            expect(logMock).toHaveBeenCalledWith(
                expect.stringContaining("pliki")
            );
        });

        it("Should log the response metadata when response contains meta", async () => {
            await debugClient.getFiles({});

            expect(logMock).toHaveBeenCalledTimes(3);
            expect(logMock).toHaveBeenCalledWith(
                expect.objectContaining({ count: 0 })
            );
        });

        it("Should NOT log when debug is false", async () => {
            await client.getFiles({});

            const clientLoggerResults = MockedLogger.mock.results;
            const clientLogMock = (clientLoggerResults[0].value as { log: jest.Mock }).log;
            expect(clientLogMock).not.toHaveBeenCalled();
        });

        it("Should still resolve the response correctly in debug mode", async () => {
            await expect(debugClient.getFiles({})).resolves.toEqual(mockListResponse);
        });

    });

    describe("attachQueryParams edge cases", () => {

        it("Should produce no query string when no params are provided", async () => {
            await client.getDrivingLicences({});

            expect(getCalledUrl()).not.toContain("?");
        });

        it("Should produce no query string when getStatistics is called without params", async () => {
            await client.getStatistics();

            expect(getCalledUrl()).not.toContain("?");
        });

        it("Should not append sort when sort array is empty", async () => {
            await client.getDrivingLicences({ sort: [] });

            expect(getCalledUrl()).not.toContain("sort");
        });

        it("Should not append fields when fields array is empty", async () => {
            await client.getDrivingLicences({ fields: [] });

            expect(getCalledUrl()).not.toContain("fields");
        });

        it("Should URI-encode special characters in filter values", async () => {
            await client.getDrivingLicences({ filter: { field: "value with spaces" } });

            expect(getCalledUrl()).toContain("filter[field]=value%20with%20spaces");
        });

        it("Should handle numeric filter values", async () => {
            await client.getDrivingLicences({ filter: { wiek: 25 } });

            expect(getCalledUrl()).toContain("filter[wiek]=25");
        });

        it("Should throw when limit is less than 1", async () => {
            await expect(client.getVehicles({
                voivodeship: VoivodeshipEnum.MAZOVIA,
                fromDate: new Date(2023, 0, 15),
                limit: 0,
            })).rejects.toThrow("limit must be an integer between 1 and 500");
        });

        it("Should throw when limit exceeds 500", async () => {
            await expect(client.getVehicles({
                voivodeship: VoivodeshipEnum.MAZOVIA,
                fromDate: new Date(2023, 0, 15),
                limit: 501,
            })).rejects.toThrow("limit must be an integer between 1 and 500");
        });

        it("Should throw when page is less than 1", async () => {
            await expect(client.getVehicles({
                voivodeship: VoivodeshipEnum.MAZOVIA,
                fromDate: new Date(2023, 0, 15),
                page: 0,
            })).rejects.toThrow("page must be a positive integer");
        });

        it("Should throw when dateType is not 0 or 1", async () => {
            await expect(client.getVehicles({
                voivodeship: VoivodeshipEnum.MAZOVIA,
                fromDate: new Date(2023, 0, 15),
                dateType: 2 as never,
            })).rejects.toThrow("dateType must be 0 or 1");
        });

    });

});