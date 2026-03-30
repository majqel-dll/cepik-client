import { CepikAddressResolver as AddressResolver } from "./cepik-address-resolver.js";
import {
    GetPermissionDataParams, GetSpecifiedVehicleDataResponse, GetStatisticsParams,
    GetDictionariesDataParams, GetDrivingLicenceDataParams, GetFilesDataParams,
    GetVehicleDataParams, GetVehicleDataResponse
} from "./types.js";
import { CepikHttpClient as HttpClient } from "./cepik-http-client.js";
import { CepikApiLogger as Logger } from "./cepik-api-logger.js";

export class CEPIKApiClient {

    private logger: Logger = new Logger({ context: `CEPIK API Client` });
    private httpClient: HttpClient = new HttpClient();
    private debug: boolean = false;

    constructor(config?: { debug?: boolean }) {

        if (config?.debug) {
            this.debug = config.debug;
        };

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

    public async getVehiclesData<T extends string | never = never>(
        params: GetVehicleDataParams<T>
    ): Promise<[T] extends [never]
        ? GetVehicleDataResponse
        : GetSpecifiedVehicleDataResponse
    > {

        const startTime = Date.now();
        let endpoint = 'vehicleId' in params
            ? AddressResolver.getEndpointForVehicle(params?.vehicleId)
            : AddressResolver.vehiclesEndpoint;

        if (!(`vehicleId` in params)) {

            const {
                voivodeship, limit, fromDate, toDate,
                dateType, isRegistered, page, sort,
                showAllFields,
            } = params;

            const startDate = this.formDate(fromDate);
            endpoint += `?wojewodztwo=${voivodeship}&data-od=${startDate}`;

            if (toDate && new Date(fromDate) > new Date(toDate)) {
                throw new Error(`The 'toDate' field can't be before 'fromDate'`);
            };

            if (toDate) {
                endpoint += `&data-do=${this.formDate(toDate)}`;
            };

            if (limit && limit !== 0 && !Number.isNaN(+limit)) {
                endpoint += `&limit=${limit}`;
            };

            if (dateType && !Number.isNaN(+dateType)) {
                endpoint += `&typ-daty=${dateType}`
            };

            if (isRegistered !== undefined && isRegistered !== null) {
                endpoint += `&tylko-zarejestrowane=${isRegistered}`
            };

            if (showAllFields !== undefined && showAllFields !== null) {
                endpoint += `&tylko-zarejestrowane=${showAllFields}`
            };

            if (page && page !== 0 && !Number.isNaN(+page)) {
                endpoint += `&page=${page}`;
            };

            if (sort && Array.isArray(sort)) {
                endpoint += `&sort=${sort.join(`,`)}`
            };

        };

        if (params?.fields && Array.isArray(params.fields)) {
            endpoint += `&fields=${params.fields.join(`,`)}`
        };

        if (this.debug) {
            this.logger.log(`Generated endpoint and query params: ${endpoint}`);
        };

        const response = await this.httpClient.get<[T] extends [never]
            ? GetVehicleDataResponse
            : GetSpecifiedVehicleDataResponse>(endpoint);

        if (response.meta && this.debug) {
            this.logger.log(`Received response in ${Date.now() - startTime} ms:`);
            this.logger.log(response.meta);
        };

        return response;
    };

    public async getFilesData(
        params: GetFilesDataParams
    ): Promise<unknown> {

        let endpoint = 'fileId' in params
            ? AddressResolver.getEndpointForVehicle(params?.fileId)
            : AddressResolver.vehiclesEndpoint;

        await this.httpClient.get(endpoint);

        return;
    };

    public async getDrivingLicencesData(
        params: GetDrivingLicenceDataParams
    ): Promise<unknown> {

        let endpoint = 'drivingLicenceId' in params
            ? AddressResolver.getEndpointForVehicle(params?.drivingLicenceId)
            : AddressResolver.vehiclesEndpoint;

        await this.httpClient.get(endpoint);

        return;
    };

    public async getPermissionsData(
        params: GetPermissionDataParams
    ): Promise<unknown> {

        let endpoint = 'permissionId' in params
            ? AddressResolver.getEndpointForVehicle(params?.permissionId)
            : AddressResolver.vehiclesEndpoint;

        await this.httpClient.get(endpoint);

        return;
    };

    public async getDictionariesData(
        params: GetDictionariesDataParams
    ): Promise<unknown> {

        let endpoint = 'dictionary' in params
            ? AddressResolver.getEndpointForVehicle(params?.dictionary)
            : AddressResolver.vehiclesEndpoint;

        await this.httpClient.get(endpoint);

        return;
    };

    public async getStatistics(
        params: GetStatisticsParams
    ): Promise<unknown> {

        let endpoint = 'subject' in params
            ? AddressResolver.getStatisticsEndpointFor(params?.subject)
            : AddressResolver.statisticsEndpoint;

        await this.httpClient.get(endpoint);

        return;
    };

}