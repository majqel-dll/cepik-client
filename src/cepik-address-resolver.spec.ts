import { CepikAddressResolver } from "./cepik-address-resolver.js";
import { StatisticsSubjectEnum } from "./enums.js";

describe("CepikAddressResolver", () => {
    describe("constructor", () => {
        it("Should initialize", () => {
            const resolver = new CepikAddressResolver();
            expect(resolver).toBeInstanceOf(CepikAddressResolver);
        });
    });

    describe("host", () => {
        it("Should return the decoded host URL", () => {
            const host = (CepikAddressResolver as any).host;
            expect(host).toBe("https://api.cepik.gov.pl");
        });

        it("Should be a valid URL", () => {
            const host = (CepikAddressResolver as any).host;
            expect(host).toMatch(/^https?:\/\//);
        });
    });

    describe("vehiclesEndpoint", () => {
        it("Should return vehicles endpoint", () => {
            const endpoint = CepikAddressResolver.vehiclesEndpoint;
            expect(endpoint).toBe("https://api.cepik.gov.pl/pojazdy");
        });

        it("Should include host", () => {
            const endpoint = CepikAddressResolver.vehiclesEndpoint;
            const host = (CepikAddressResolver as any).host;
            expect(endpoint).toContain(host);
        });

        it("Should have correct path", () => {
            const endpoint = CepikAddressResolver.vehiclesEndpoint;
            expect(endpoint).toMatch(/\/pojazdy$/);
        });
    });

    describe("getEndpointForVehicle", () => {
        it("Should return endpoint for specific vehicle", () => {
            const vehicleId = "ABC123DEF";
            const endpoint = CepikAddressResolver.getEndpointForVehicle(vehicleId);
            expect(endpoint).toBe("https://api.cepik.gov.pl/pojazdy/ABC123DEF");
        });

        it("Should append vehicle ID to vehicles endpoint", () => {
            const vehicleId = "XYZ789";
            const endpoint = CepikAddressResolver.getEndpointForVehicle(vehicleId);
            expect(endpoint).toContain(CepikAddressResolver.vehiclesEndpoint);
            expect(endpoint).toMatch(new RegExp(`${vehicleId}$`));
        });

        it("Should handle different vehicle ID formats", () => {
            const testIds = ["12345", "ABC456", "test-id-123", "ID_WITH_UNDERSCORE"];
            testIds.forEach(id => {
                const endpoint = CepikAddressResolver.getEndpointForVehicle(id);
                expect(endpoint).toMatch(new RegExp(`${id}$`));
            });
        });

        it("Should handle empty vehicle ID", () => {
            const endpoint = CepikAddressResolver.getEndpointForVehicle("");
            expect(endpoint).toBe("https://api.cepik.gov.pl/pojazdy/");
        });
    });

    describe("filesEndpoint", () => {
        it("Should return files endpoint", () => {
            const endpoint = CepikAddressResolver.filesEndpoint;
            expect(endpoint).toBe("https://api.cepik.gov.pl/pliki");
        });

        it("Should include host", () => {
            const endpoint = CepikAddressResolver.filesEndpoint;
            const host = (CepikAddressResolver as any).host;
            expect(endpoint).toContain(host);
        });

        it("Should have correct path", () => {
            const endpoint = CepikAddressResolver.filesEndpoint;
            expect(endpoint).toMatch(/\/pliki$/);
        });

        it("Should be different from vehicles endpoint", () => {
            expect(CepikAddressResolver.filesEndpoint).not.toBe(CepikAddressResolver.vehiclesEndpoint);
        });
    });

    describe("getEndpointForFile", () => {
        it("Should return endpoint for specific file", () => {
            const fileId = "FILE123";
            const endpoint = CepikAddressResolver.getEndpointForFile(fileId);
            expect(endpoint).toBe("https://api.cepik.gov.pl/pliki/FILE123");
        });

        it("Should append file ID to files endpoint", () => {
            const fileId = "doc456";
            const endpoint = CepikAddressResolver.getEndpointForFile(fileId);
            expect(endpoint).toContain(CepikAddressResolver.filesEndpoint);
            expect(endpoint).toMatch(new RegExp(`${fileId}$`));
        });

        it("Should handle different file ID formats", () => {
            const testIds = ["file-001", "FILE_002", "003", "uuid-123-456"];
            testIds.forEach(id => {
                const endpoint = CepikAddressResolver.getEndpointForFile(id);
                expect(endpoint).toMatch(new RegExp(`${id}$`));
            });
        });
    });

    describe("drivingLicencesEndpoint", () => {
        it("Should return driving licences endpoint", () => {
            const endpoint = CepikAddressResolver.drivingLicencesEndpoint;
            expect(endpoint).toBe("https://api.cepik.gov.pl/prawa-jazdy");
        });

        it("Should include host", () => {
            const endpoint = CepikAddressResolver.drivingLicencesEndpoint;
            const host = (CepikAddressResolver as any).host;
            expect(endpoint).toContain(host);
        });

        it("Should have correct path", () => {
            const endpoint = CepikAddressResolver.drivingLicencesEndpoint;
            expect(endpoint).toMatch(/\/prawa-jazdy$/);
        });

        it("Should be different from other endpoints", () => {
            expect(CepikAddressResolver.drivingLicencesEndpoint).not.toBe(CepikAddressResolver.vehiclesEndpoint);
            expect(CepikAddressResolver.drivingLicencesEndpoint).not.toBe(CepikAddressResolver.filesEndpoint);
        });
    });

    describe("getEndpointForDrivingLicence", () => {
        it("Should return endpoint for specific driving licence", () => {
            const licenceId = "LICENCE123";
            const endpoint = CepikAddressResolver.getEndpointForDrivingLicence(licenceId);
            expect(endpoint).toBe("https://api.cepik.gov.pl/prawa-jazdy/LICENCE123");
        });

        it("Should append licence ID to driving licences endpoint", () => {
            const licenceId = "lic456";
            const endpoint = CepikAddressResolver.getEndpointForDrivingLicence(licenceId);
            expect(endpoint).toContain(CepikAddressResolver.drivingLicencesEndpoint);
            expect(endpoint).toMatch(new RegExp(`${licenceId}$`));
        });

        it("Should handle different licence ID formats", () => {
            const testIds = ["PL123456789", "licence_001", "DL-2026-03-31"];
            testIds.forEach(id => {
                const endpoint = CepikAddressResolver.getEndpointForDrivingLicence(id);
                expect(endpoint).toMatch(new RegExp(`${id}$`));
            });
        });
    });

    describe("permissionsEndpoint", () => {
        it("Should return permissions endpoint", () => {
            const endpoint = CepikAddressResolver.permissionsEndpoint;
            expect(endpoint).toBe("https://api.cepik.gov.pl/uprawnienia");
        });

        it("Should include host", () => {
            const endpoint = CepikAddressResolver.permissionsEndpoint;
            const host = (CepikAddressResolver as any).host;
            expect(endpoint).toContain(host);
        });

        it("Should have correct path", () => {
            const endpoint = CepikAddressResolver.permissionsEndpoint;
            expect(endpoint).toMatch(/\/uprawnienia$/);
        });

        it("Should be different from other endpoints", () => {
            expect(CepikAddressResolver.permissionsEndpoint).not.toBe(CepikAddressResolver.vehiclesEndpoint);
            expect(CepikAddressResolver.permissionsEndpoint).not.toBe(CepikAddressResolver.drivingLicencesEndpoint);
        });
    });

    describe("getEndpointForPermission", () => {
        it("Should return endpoint for specific permission", () => {
            const permissionId = "PERM123";
            const endpoint = CepikAddressResolver.getEndpointForPermission(permissionId);
            expect(endpoint).toBe("https://api.cepik.gov.pl/uprawnienia/PERM123");
        });

        it("Should append permission ID to permissions endpoint", () => {
            const permissionId = "perm456";
            const endpoint = CepikAddressResolver.getEndpointForPermission(permissionId);
            expect(endpoint).toContain(CepikAddressResolver.permissionsEndpoint);
            expect(endpoint).toMatch(new RegExp(`${permissionId}$`));
        });

        it("Should handle different permission ID formats", () => {
            const testIds = ["admin", "user_manager", "001-002-003"];
            testIds.forEach(id => {
                const endpoint = CepikAddressResolver.getEndpointForPermission(id);
                expect(endpoint).toMatch(new RegExp(`${id}$`));
            });
        });
    });

    describe("dictionariesEndpoint", () => {
        it("Should return dictionaries endpoint", () => {
            const endpoint = CepikAddressResolver.dictionariesEndpoint;
            expect(endpoint).toBe("https://api.cepik.gov.pl/slowniki");
        });

        it("Should include host", () => {
            const endpoint = CepikAddressResolver.dictionariesEndpoint;
            const host = (CepikAddressResolver as any).host;
            expect(endpoint).toContain(host);
        });

        it("Should have correct path", () => {
            const endpoint = CepikAddressResolver.dictionariesEndpoint;
            expect(endpoint).toMatch(/\/slowniki$/);
        });

        it("Should be different from other endpoints", () => {
            expect(CepikAddressResolver.dictionariesEndpoint).not.toBe(CepikAddressResolver.vehiclesEndpoint);
            expect(CepikAddressResolver.dictionariesEndpoint).not.toBe(CepikAddressResolver.permissionsEndpoint);
        });
    });

    describe("getEndpointForDictionary", () => {
        it("Should return endpoint for specific dictionary", () => {
            const dictionaryId = "wojewodztwa";
            const endpoint = CepikAddressResolver.getEndpointForDictionary(dictionaryId);
            expect(endpoint).toBe("https://api.cepik.gov.pl/slowniki/wojewodztwa");
        });

        it("Should append dictionary ID to dictionaries endpoint", () => {
            const dictionaryId = "marka";
            const endpoint = CepikAddressResolver.getEndpointForDictionary(dictionaryId);
            expect(endpoint).toContain(CepikAddressResolver.dictionariesEndpoint);
            expect(endpoint).toMatch(new RegExp(`${dictionaryId}$`));
        });

        it("Should handle different dictionary types", () => {
            const dictionaryIds = ["wojewodztwa", "marka", "rodzaj-pojazdu", "rodzaj-paliwa"];
            dictionaryIds.forEach(id => {
                const endpoint = CepikAddressResolver.getEndpointForDictionary(id);
                expect(endpoint).toMatch(new RegExp(`${id}$`));
            });
        });
    });

    describe("statisticsEndpoint", () => {
        it("Should return statistics endpoint", () => {
            const endpoint = CepikAddressResolver.statisticsEndpoint;
            expect(endpoint).toBe("https://api.cepik.gov.pl/statystyki");
        });

        it("Should include host", () => {
            const endpoint = CepikAddressResolver.statisticsEndpoint;
            const host = (CepikAddressResolver as any).host;
            expect(endpoint).toContain(host);
        });

        it("Should have correct path", () => {
            const endpoint = CepikAddressResolver.statisticsEndpoint;
            expect(endpoint).toMatch(/\/statystyki$/);
        });
    });

    describe("getStatisticsEndpointFor", () => {
        it("Should return endpoint for VEHICLES statistics", () => {
            const endpoint = CepikAddressResolver.getStatisticsEndpointFor(StatisticsSubjectEnum.VEHICLES);
            expect(endpoint).toBe("https://api.cepik.gov.pl/pojazdy");
        });

        it("Should return endpoint for FILES statistics", () => {
            const endpoint = CepikAddressResolver.getStatisticsEndpointFor(StatisticsSubjectEnum.FILES);
            expect(endpoint).toBe("https://api.cepik.gov.pl/pliki");
        });

        it("Should return endpoint for ACTIVITY statistics", () => {
            const endpoint = CepikAddressResolver.getStatisticsEndpointFor(StatisticsSubjectEnum.ACTIVITY);
            expect(endpoint).toBe("https://api.cepik.gov.pl/aktywnosc");
        });

        it("Should return endpoint for DICTIONARIES statistics", () => {
            const endpoint = CepikAddressResolver.getStatisticsEndpointFor(StatisticsSubjectEnum.DICTIONARIES);
            expect(endpoint).toBe("https://api.cepik.gov.pl/slowniki");
        });

        it("Should include host for all subjects", () => {
            const subjects = Object.values(StatisticsSubjectEnum);
            const host = (CepikAddressResolver as any).host;
            subjects.forEach(subject => {
                const endpoint = CepikAddressResolver.getStatisticsEndpointFor(subject);
                expect(endpoint).toContain(host);
            });
        });

        it("Should return different endpoints for different subjects", () => {
            const points = Object.values(StatisticsSubjectEnum).map(
                subject => CepikAddressResolver.getStatisticsEndpointFor(subject)
            );
            const uniquePoints = new Set(points);
            expect(uniquePoints.size).toBe(points.length);
        });
    });

    describe("versionEndpoint", () => {
        it("Should return version endpoint", () => {
            const endpoint = CepikAddressResolver.versionEndpoint;
            expect(endpoint).toBe("https://api.cepik.gov.pl/version");
        });

        it("Should include host", () => {
            const endpoint = CepikAddressResolver.versionEndpoint;
            const host = (CepikAddressResolver as any).host;
            expect(endpoint).toContain(host);
        });

        it("Should have correct path", () => {
            const endpoint = CepikAddressResolver.versionEndpoint;
            expect(endpoint).toMatch(/\/version$/);
        });

        it("Should not match v1VersionEndpoint", () => {
            expect(CepikAddressResolver.versionEndpoint).not.toBe(CepikAddressResolver.v1VersionEndpoint);
        });
    });

    describe("v1VersionEndpoint", () => {
        it("Should return v1 version endpoint", () => {
            const endpoint = CepikAddressResolver.v1VersionEndpoint;
            expect(endpoint).toBe("https://api.cepik.gov.pl/v1/version");
        });

        it("Should include host", () => {
            const endpoint = CepikAddressResolver.v1VersionEndpoint;
            const host = (CepikAddressResolver as any).host;
            expect(endpoint).toContain(host);
        });

        it("Should have v1 in path", () => {
            const endpoint = CepikAddressResolver.v1VersionEndpoint;
            expect(endpoint).toMatch(/\/v1\/version$/);
        });

        it("Should include version in path", () => {
            const endpoint = CepikAddressResolver.v1VersionEndpoint;
            expect(endpoint).toContain("version");
        });

        it("Should not match versionEndpoint", () => {
            expect(CepikAddressResolver.v1VersionEndpoint).not.toBe(CepikAddressResolver.versionEndpoint);
        });
    });

    describe("Integration tests", () => {
        it("Should have consistent host across all endpoints", () => {
            const host = (CepikAddressResolver as any).host;
            expect(CepikAddressResolver.vehiclesEndpoint).toContain(host);
            expect(CepikAddressResolver.filesEndpoint).toContain(host);
            expect(CepikAddressResolver.drivingLicencesEndpoint).toContain(host);
            expect(CepikAddressResolver.permissionsEndpoint).toContain(host);
            expect(CepikAddressResolver.dictionariesEndpoint).toContain(host);
            expect(CepikAddressResolver.statisticsEndpoint).toContain(host);
            expect(CepikAddressResolver.versionEndpoint).toContain(host);
            expect(CepikAddressResolver.v1VersionEndpoint).toContain(host);
        });

        it("Should have unique endpoints for different resources", () => {
            const endpoints = [
                CepikAddressResolver.vehiclesEndpoint,
                CepikAddressResolver.filesEndpoint,
                CepikAddressResolver.drivingLicencesEndpoint,
                CepikAddressResolver.permissionsEndpoint,
                CepikAddressResolver.dictionariesEndpoint,
                CepikAddressResolver.statisticsEndpoint,
                CepikAddressResolver.versionEndpoint,
                CepikAddressResolver.v1VersionEndpoint,
            ];
            const uniqueEndpoints = new Set(endpoints);
            expect(uniqueEndpoints.size).toBe(endpoints.length);
        });

        it("Should build hierarchical endpoints correctly", () => {
            const vehicleId = "TEST123";
            const vehicleEndpoint = CepikAddressResolver.getEndpointForVehicle(vehicleId);
            expect(vehicleEndpoint).toContain(CepikAddressResolver.vehiclesEndpoint);
            expect(vehicleEndpoint).toBe(`${CepikAddressResolver.vehiclesEndpoint}/${vehicleId}`);
        });

        it("Should handle base endpoints without trailing slashes", () => {
            const endpoints = [
                CepikAddressResolver.vehiclesEndpoint,
                CepikAddressResolver.filesEndpoint,
                CepikAddressResolver.drivingLicencesEndpoint,
                CepikAddressResolver.permissionsEndpoint,
                CepikAddressResolver.dictionariesEndpoint,
                CepikAddressResolver.statisticsEndpoint,
                CepikAddressResolver.versionEndpoint,
                CepikAddressResolver.v1VersionEndpoint,
            ];

            endpoints.forEach(endpoint => {
                expect(endpoint).not.toMatch(/\/$/);
            });
        });

        it("Should be static and not require instantiation", () => {
            // All methods should be accessible without instantiation
            expect(CepikAddressResolver.vehiclesEndpoint).toBeDefined();
            expect(CepikAddressResolver.filesEndpoint).toBeDefined();
            expect(CepikAddressResolver.drivingLicencesEndpoint).toBeDefined();
            expect(CepikAddressResolver.permissionsEndpoint).toBeDefined();
            expect(CepikAddressResolver.dictionariesEndpoint).toBeDefined();
            expect(CepikAddressResolver.statisticsEndpoint).toBeDefined();
            expect(CepikAddressResolver.versionEndpoint).toBeDefined();
            expect(CepikAddressResolver.v1VersionEndpoint).toBeDefined();
        });

        it("Should return valid HTTPS URLs", () => {
            const endpoints = [
                CepikAddressResolver.vehiclesEndpoint,
                CepikAddressResolver.filesEndpoint,
                CepikAddressResolver.drivingLicencesEndpoint,
                CepikAddressResolver.permissionsEndpoint,
                CepikAddressResolver.dictionariesEndpoint,
                CepikAddressResolver.statisticsEndpoint,
                CepikAddressResolver.versionEndpoint,
                CepikAddressResolver.v1VersionEndpoint,
            ];

            endpoints.forEach(endpoint => {
                expect(endpoint).toMatch(/^https:\/\//);
            });
        });

        it("Should contain api.cepik.gov.pl domain", () => {
            const endpoints = [
                CepikAddressResolver.vehiclesEndpoint,
                CepikAddressResolver.filesEndpoint,
                CepikAddressResolver.drivingLicencesEndpoint,
                CepikAddressResolver.permissionsEndpoint,
                CepikAddressResolver.dictionariesEndpoint,
                CepikAddressResolver.statisticsEndpoint,
                CepikAddressResolver.versionEndpoint,
                CepikAddressResolver.v1VersionEndpoint,
            ];

            endpoints.forEach(endpoint => {
                expect(endpoint).toContain("api.cepik.gov.pl");
            });
        });
    });
});