import { CepikAddressResolver as AddressResolver } from "./cepik-address-resolver.js";
import {
    GetPermissionDataParams, GetSpecifiedVehicleDataResponse, GetStatisticsParams,
    GetDictionariesDataParams, GetDrivingLicenceDataParams, GetFilesDataParams,
    GetVehicleDataParams, GetVehicleDataResponse,
    GetFilesDataResponse,
    GetSpecifiedFileDataResponse,
    AttachQueryParams
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

    private displayEndpointMessage(
        endpoint: string
    ): void {
        this.logger.log(`Generated endpoint and query params: ${endpoint}`);
    };

    private displayMetadata(
        metadata: Record<string, string | number>,
        startTime: number
    ): void {
        this.logger.log(`Received response in ${Date.now() - startTime} ms:`);
        this.logger.log(metadata);
    };

    private attachQueryParams(
        params: AttachQueryParams = {}
    ): string {
        let queryParams = ``;
        const {
            limit, toDate, dateType, isRegistered,
            page, sort, showAllFields,
        } = params;

        if (toDate) {
            queryParams += `&data-do=${this.formDate(toDate)}`;
        };

        if (limit && limit !== 0 && !Number.isNaN(+limit)) {
            queryParams += `&limit=${limit}`;
        };

        if (dateType && !Number.isNaN(+dateType)) {
            queryParams += `&typ-daty=${dateType}`
        };

        if (isRegistered !== undefined && isRegistered !== null) {
            queryParams += `&tylko-zarejestrowane=${isRegistered}`
        };

        if (showAllFields !== undefined && showAllFields !== null) {
            queryParams += `&tylko-zarejestrowane=${showAllFields}`
        };

        if (page && page !== 0 && !Number.isNaN(+page)) {
            queryParams += `&page=${page}`;
        };

        if (sort && Array.isArray(sort)) {
            queryParams += `&sort=${sort.join(`,`)}`
        };

        if (params?.fields && Array.isArray(params.fields)) {
            queryParams += `&fields=${params.fields.join(`,`)}`
        };

        return queryParams;
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

            const { voivodeship, fromDate, toDate } = params;
            const startDate = this.formDate(fromDate);

            endpoint += `?wojewodztwo=${voivodeship}&data-od=${startDate}`;

            if (toDate && new Date(fromDate) > new Date(toDate)) {
                throw new Error(`The 'toDate' field can't be before 'fromDate'`);
            };

        };

        endpoint += this.attachQueryParams(params);

        if (this.debug) {
            this.displayEndpointMessage(endpoint);
        };

        const response = await this.httpClient.get<[T] extends [never]
            ? GetVehicleDataResponse
            : GetSpecifiedVehicleDataResponse>(endpoint);

        if (response.meta && this.debug) {
            this.displayMetadata(response.meta, startTime);
        };

        return response;
    };

    public async getFilesData<T extends string | never = never>(
        params: GetFilesDataParams<T>
    ): Promise<[T] extends [never]
        ? GetFilesDataResponse
        : GetSpecifiedFileDataResponse
    > {

        const startTime = Date.now();
        let endpoint = 'fileId' in params
            ? AddressResolver.getEndpointForVehicle(params?.fileId)
            : AddressResolver.vehiclesEndpoint;

        if (this.debug) {
            this.displayEndpointMessage(endpoint);
        };

        const response = await this.httpClient.get(endpoint);

        if (response.meta && this.debug) {
            this.displayMetadata(response.meta, startTime);
        };

        return;
    };

    public async getDrivingLicencesData(
        params: GetDrivingLicenceDataParams
    ): Promise<unknown> {

        const startTime = Date.now();
        let endpoint = 'drivingLicenceId' in params
            ? AddressResolver.getEndpointForVehicle(params?.drivingLicenceId)
            : AddressResolver.vehiclesEndpoint;

        if (this.debug) {
            this.displayEndpointMessage(endpoint);
        };

        const response = await this.httpClient.get(endpoint);

        if (response.meta && this.debug) {
            this.displayMetadata(response.meta, startTime);
        };

        return;
    };

    public async getPermissionsData(
        params: GetPermissionDataParams
    ): Promise<unknown> {

        const startTime = Date.now();
        let endpoint = 'permissionId' in params
            ? AddressResolver.getEndpointForVehicle(params?.permissionId)
            : AddressResolver.vehiclesEndpoint;

        if (this.debug) {
            this.displayEndpointMessage(endpoint);
        };

        const response = await this.httpClient.get(endpoint);

        if (response.meta && this.debug) {
            this.displayMetadata(response.meta, startTime);
        };

        return;
    };

    public async getDictionariesData(
        params: GetDictionariesDataParams
    ): Promise<unknown> {

        const startTime = Date.now();
        let endpoint = 'dictionary' in params
            ? AddressResolver.getEndpointForVehicle(params?.dictionary)
            : AddressResolver.vehiclesEndpoint;

        if (this.debug) {
            this.displayEndpointMessage(endpoint);
        };

        const response = await this.httpClient.get(endpoint);

        if (response.meta && this.debug) {
            this.displayMetadata(response.meta, startTime);
        };

        return;
    };

    public async getStatistics(
        params: GetStatisticsParams
    ): Promise<unknown> {

        const startTime = Date.now();
        let endpoint = 'subject' in params
            ? AddressResolver.getStatisticsEndpointFor(params?.subject)
            : AddressResolver.statisticsEndpoint;

        if (this.debug) {
            this.displayEndpointMessage(endpoint);
        };

        const response = await this.httpClient.get(endpoint);

        if (response.meta && this.debug) {
            this.displayMetadata(response.meta, startTime);
        };

        return;
    };

}