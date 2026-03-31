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

    public static getVehicleStatisticsEndpoint(date: string): string {
        return `${this.statisticsEndpoint}/${atob(`cG9qYXpkeQ==`)}/${date}`;
    };

    public static getVehicleStatisticsForVoivodeshipEndpoint(date: string, voivodeship: string): string {
        return `${this.statisticsEndpoint}/${atob(`cG9qYXpkeQ==`)}/${date}/${voivodeship}`;
    };

    public static get fileStatisticsEndpoint(): string {
        return `${this.statisticsEndpoint}/${atob(`cGxpa2k=`)}`;
    };

    public static getFileStatisticsEndpoint(date: string): string {
        return `${this.fileStatisticsEndpoint}/${date}`;
    };

    public static getFileStatisticsForFileEndpoint(date: string, fileId: string): string {
        return `${this.fileStatisticsEndpoint}/${date}/${fileId}`;
    };

    public static getActivityStatisticsEndpoint(date: string): string {
        return `${this.statisticsEndpoint}/${atob(`YWt0eXdub3Nj`)}/${date}`;
    };

    public static getActivityStatisticsHourlyEndpoint(date: string, id: string): string {
        return `${this.statisticsEndpoint}/${atob(`YWt0eXdub3Nj`)}/${date}/${id}`;
    };

    public static getDictionaryStatisticsEndpoint(date: string): string {
        return `${this.statisticsEndpoint}/${atob(`c2xvd25pa2k=`)}/${date}`;
    };

    public static get versionEndpoint(): string {
        return `${this.host}/${atob(`dmVyc2lvbg==`)}`;
    };

    public static get v1VersionEndpoint(): string {
        return `${this.host}/${atob(`djEvdmVyc2lvbg==`)}`;
    };

};