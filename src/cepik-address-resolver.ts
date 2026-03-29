import { StatisticsSubjectEnum } from "./enums.js";

export class CepikAddressResolver {

    private static get host(): string {
        return atob(`aHR0cHM6Ly9hcGkuY2VwaWsuZ292LnBs`);
    };

    public static get vehiclesEndpoint(): string {
        return `${this.host}/${atob(`cG9qYXpkeQ==`)}`;
    };

    public static getEndpointForVehicle(vehicleId: string): string {
        return `${this.vehiclesEndpoint}/${vehicleId}`;
    };

    public static get filesEndpoint(): string {
        return `${this.host}/${atob(`cGxpa2k=`)}`
    }

    public static getEndpointForFile(fileId: string): string {
        return `${this.filesEndpoint}/${fileId}`;
    };

    public static get drivingLicencesEndpoint(): string {
        return `${this.host}/${atob(`cHJhd2EtamF6ZHk=`)}`;
    };

    public static getEndpointForDrivingLicence(licenceId: string): string {
        return `${this.drivingLicencesEndpoint}/${licenceId}`;
    };

    public static get permissionsEndpoint(): string {
        return `${this.host}/${atob(`dXByYXduaWVuaWE=`)}`;
    };

    public static getEndpointForPermission(permissionId: string): string {
        return `${this.permissionsEndpoint}/${permissionId}`;
    };

    public static get dictionariesEndpoint(): string {
        return `${this.host}/${atob(`c2xvd25pa2k=`)}`;
    };

    public static getEndpointForDictionary(dictionaryId: string): string {
        return `${this.dictionariesEndpoint}/${dictionaryId}`
    };

    public static get statisticsEndpoint(): string {
        return `${this.host}/${atob(`c3RhdHlzdHlraQ==`)}`;
    };

    public static getStatisticsEndpointFor(subject: StatisticsSubjectEnum): string {
        return `${this.host}/${subject}`
    }

    public static get versionEndpoint(): string {
        return `${this.host}/${atob(`dmVyc2lvbg==`)}`;
    };

    public static get v1VersionEndpoint(): string {
        return `${this.host}/${atob(`djEvdmVyc2lvbg==`)}`;
    };

};