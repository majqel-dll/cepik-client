import { CepikAddressResolver as AddressResolver } from "./cepik-address-resolver.js";
import { CepikApiLogger as Logger } from "./cepik-api-logger.js";
import { GetVehicleDataParams } from "./types.js";

export class CEPIKApiClient {

    private logger: Logger;

    constructor() {
        this.logger = new Logger({ context: `CEPIK API Client` });
    }

    public async getVehiclesData(
        params: GetVehicleDataParams = {}
    ): Promise<unknown> {

        const { vehicleId } = params;

        const endpoint = vehicleId
            ? AddressResolver.getEndpointForVehicle(vehicleId)
            : AddressResolver.vehiclesEndpoint;

        this.logger.debug(endpoint);
        const data = await fetch(endpoint);
        this.logger.debug(data);
        console.debug(data);
        return;
    };

    public async getFilesData(): Promise<unknown> {
        return;
    };

    public async getDrivingLicencesData(): Promise<unknown> {
        return;
    };

    public async getPermissionsData(): Promise<unknown> {
        return;
    };

    public async getDictionariesData(): Promise<unknown> {
        return;
    };

    public async getStatistics(): Promise<unknown> {
        return;
    };

}

const client = new CEPIKApiClient();
await client.getVehiclesData();