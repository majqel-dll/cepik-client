import { CepikApiLogger } from "./cepik-api-logger.js";

export class CEPIKApiClient {

    private logger: CepikApiLogger;

    constructor() {
        this.logger = new CepikApiLogger({ context: `CEPIK API Client` });
    }

    public async getVehiclesData(): Promise<unknown> {
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