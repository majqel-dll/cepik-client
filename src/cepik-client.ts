import {
    GetPermissionDataParams, GetSpecifiedVehicleDataResponse, GetStatisticsParams,
    GetDictionariesDataParams, GetDrivingLicenceDataParams, GetFilesDataParams,
    GetVehicleDataParams, GetVehicleDataResponse
} from "./types.js";
import { CepikAddressResolver as AddressResolver } from "./cepik-address-resolver.js";
import { CepikApiLogger as Logger } from "./cepik-api-logger.js";
import { VoivodeshipEnum } from "./enums.js";

export class CEPIKApiClient {

    private logger: Logger;

    constructor() {
        this.logger = new Logger({ context: `CEPIK API Client` });
    }

    private formDate(date: string | Date): string {
        const dateObject = new Date(date);

        if (!dateObject) {
            throw new Error(`Incorrect date format.`);
        };

        const year = dateObject.getFullYear();

        const month = (dateObject.getMonth() + 1) >= 10
            ? (dateObject.getMonth() + 1)
            : `0${(dateObject.getMonth() + 1)}`;

        const day = dateObject.getDate() >= 10
            ? dateObject.getDate()
            : `0${dateObject.getDate()}`;

        return `${year}${month}${day}`;
    };

    public async getVehiclesData<T extends string | never>(
        params: GetVehicleDataParams<T>
    ): Promise<[T] extends [never]
        ? GetVehicleDataResponse
        : GetSpecifiedVehicleDataResponse
    > {

        let endpoint = 'vehicleId' in params
            ? AddressResolver.getEndpointForVehicle(params?.vehicleId)
            : AddressResolver.vehiclesEndpoint;

        if (!(`vehicleId` in params)) {

            const { voivodship, limit, fromDate, toDate } = params;

            const startDate = this.formDate(fromDate);
            endpoint += `?wojewodztwo=${voivodship}&data-od=${startDate}`;

            if (toDate) {
                endpoint += `&data-do=${this.formDate(toDate)}`;
            };

        };

        const requestInit: RequestInit = {
            method: "GET",
            headers: {
                Accept: "*/*",
                Connection: "keep-alive",
                "Accept-Encoding": "gzip, deflate, br",
            }
        };

        this.logger.debug(endpoint);
        const data = await fetch(endpoint, requestInit);

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