import {
    GetDictionariesDataParams, GetDrivingLicenceDataParams, GetFilesDataParams,
    GetPermissionDataParams, GetStatisticsParams, GetVehicleDataParams
} from "./types.js";
import { CepikAddressResolver as AddressResolver } from "./cepik-address-resolver.js";
import { CepikApiLogger as Logger } from "./cepik-api-logger.js";
import { VoivodeshipEnum } from "./enums.js";

export class CEPIKApiClient {

    private logger: Logger;

    constructor() {
        this.logger = new Logger({ context: `CEPIK API Client` });
    }

    public async getVehiclesData(
        params: GetVehicleDataParams
    ): Promise<unknown> {

        const { vehicleId, voivodship, limit } = params;

        let endpoint = vehicleId
            ? AddressResolver.getEndpointForVehicle(vehicleId)
            : AddressResolver.vehiclesEndpoint;

        endpoint += `?wojewodztwo=${voivodship}`;

        this.logger.debug(endpoint);
        const data = await fetch(endpoint);
        this.logger.debug(data);
        console.debug(data);
        return;
    };

    public async getFilesData(
        params: GetFilesDataParams
    ): Promise<unknown> {
        return;
    };

    public async getDrivingLicencesData(
        params: GetDrivingLicenceDataParams
    ): Promise<unknown> {
        return;
    };

    public async getPermissionsData(
        params: GetPermissionDataParams
    ): Promise<unknown> {
        return;
    };

    public async getDictionariesData(
        params: GetDictionariesDataParams
    ): Promise<unknown> {
        return;
    };

    public async getStatistics(
        params: GetStatisticsParams
    ): Promise<unknown> {
        return;
    };

}

const client = new CEPIKApiClient();
await client.getVehiclesData({ voivodship: VoivodeshipEnum.OPOLE });