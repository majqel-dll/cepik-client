import {
    GetSpecifiedDrivingLicenceResponse, GetPermissionsResponse, GetSpecifiedPermissionResponse,
    GetDictionariesResponse, GetSpecifiedDictionaryResponse, GetSpecifiedFileDataResponse,
    GetDrivingLicencesResponse, GetStatisticsResponse, GetPermissionDataParams, ErrorResponse,
    GetSpecifiedVehicleDataResponse, GetStatisticsParams, GetDictionariesDataParams, ApiVersions,
    GetDrivingLicenceDataParams, GetFilesDataParams, GetVehicleDataParams, GetVehicleDataResponse,
    GetFilesDataResponse, AttachQueryParams, VersionResponse, GetVehicleStatisticsParams,
    GetVehicleStatisticsResponse, GetSpecifiedVehicleStatisticsResponse, GetFileStatisticsParams,
    GetFileStatisticsResponse, GetSpecifiedFileStatisticsResponse, GetActivityStatisticsParams,
    GetActivityStatisticsResponse, GetSpecifiedActivityStatisticsResponse, GetDictionaryStatisticsParams,
    GetDictionaryStatisticsResponse,
} from "./types.js";
import { CepikAddressResolver as AddressResolver } from "./cepik-address-resolver.js";
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

        if (Number.isNaN(dateObject.getTime())) {
            throw new Error(`Incorrect date format.`);
        }

        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, "0");
        const day = String(dateObject.getDate()).padStart(2, "0");

        return `${year}${month}${day}`;
    };

    private displayEndpointMessage(
        endpoint: string
    ): void {
        this.logger.log(`Generated endpoint and query params: ${endpoint}`);
    };

    private isErrorResponse(response: unknown): response is ErrorResponse {
        return typeof response === "object" && response !== null && "error-code" in (response as ErrorResponse);
    }

    private async request<T>(endpoint: string, startTime: number): Promise<T> {

        if (this.debug) {
            this.displayEndpointMessage(endpoint);
        };

        const response = await this.httpClient.get<T | ErrorResponse>(endpoint);

        if (this.isErrorResponse(response)) {
            throw response;
        };

        if (this.debug && typeof response === "object" && response !== null && "meta" in response) {
            const meta = (response as { meta?: Record<string, string | number> }).meta;
            if (meta) {
                this.displayMetadata(meta, startTime);
            };
        };

        return response as T;
    };

    private displayMetadata(
        metadata: Record<string, string | number>,
        startTime: number
    ): void {
        this.logger.log(`Received response in ${Date.now() - startTime} ms:`);
        this.logger.log(metadata);
    };

    private attachQueryParams(
        params: unknown = {},
        hasExistingQuery: boolean = false
    ): string {
        const queryPairs: string[] = [];
        const {
            limit, fromDate, toDate, dateType, isRegistered,
            page, sort, showAllFields, fields, filter,
        } = params as Partial<AttachQueryParams>;

        if (fromDate) {
            queryPairs.push(`data-od=${this.formDate(fromDate)}`);
        }

        if (toDate) {
            queryPairs.push(`data-do=${this.formDate(toDate)}`);
        }

        if (filter && typeof filter === "object") {
            for (const [key, value] of Object.entries(filter)) {
                queryPairs.push(`filter[${key}]=${encodeURIComponent(String(value))}`);
            }
        }

        if (limit !== undefined && limit !== null) {
            const limitNum = Number(limit);
            if (Number.isNaN(limitNum) || limitNum < 1 || limitNum > 500) {
                throw new Error(`limit must be an integer between 1 and 500.`);
            }
            queryPairs.push(`limit=${limitNum}`);
        }

        if (dateType !== undefined && dateType !== null) {
            const dateTypeNum = Number(dateType);
            if (Number.isNaN(dateTypeNum) || (dateTypeNum !== 0 && dateTypeNum !== 1)) {
                throw new Error(`dateType must be 0 or 1.`);
            }
            queryPairs.push(`typ-daty=${dateTypeNum}`);
        }

        if (isRegistered !== undefined && isRegistered !== null) {
            queryPairs.push(`tylko-zarejestrowane=${isRegistered}`);
        }

        if (showAllFields !== undefined && showAllFields !== null) {
            queryPairs.push(`pokaz-wszystkie-pola=${showAllFields}`);
        }

        if (page !== undefined && page !== null) {
            const pageNum = Number(page);
            if (Number.isNaN(pageNum) || pageNum < 1) {
                throw new Error(`page must be a positive integer.`);
            }
            queryPairs.push(`page=${pageNum}`);
        }

        if (sort && Array.isArray(sort) && sort.length > 0) {
            queryPairs.push(`sort=${sort.join(`,`)}`);
        }

        if (fields && Array.isArray(fields) && fields.length > 0) {
            queryPairs.push(`fields=${fields.join(`,`)}`);
        }

        if (!queryPairs.length) {
            return "";
        }

        return `${hasExistingQuery ? `&` : `?`}${queryPairs.join(`&`)}`;
    }

    public async getVehicles<T extends string | never = never>(
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

            const { fromDate: _skip, voivodeship: _skipVoiv, ...vehicleQueryParams } = params as any;
            endpoint += this.attachQueryParams({ ...vehicleQueryParams, toDate }, true);

        } else {
            endpoint += this.attachQueryParams(params, false);
        };

        return await this.request<[T] extends [never]
            ? GetVehicleDataResponse
            : GetSpecifiedVehicleDataResponse>(endpoint, startTime);
    };

    public async getFiles<T extends string | never = never>(
        params: GetFilesDataParams<T>
    ): Promise<[T] extends [never]
        ? GetFilesDataResponse
        : GetSpecifiedFileDataResponse
    > {

        const startTime = Date.now();
        let endpoint = 'fileId' in params
            ? AddressResolver.getEndpointForFile(params?.fileId)
            : AddressResolver.filesEndpoint;

        endpoint += this.attachQueryParams(params, false);

        return await this.request<[T] extends [never]
            ? GetFilesDataResponse
            : GetSpecifiedFileDataResponse>(endpoint, startTime);
    };

    public async getDrivingLicences<T extends string | never = never>(
        params: GetDrivingLicenceDataParams<T>
    ): Promise<[T] extends [never]
        ? GetDrivingLicencesResponse
        : GetSpecifiedDrivingLicenceResponse
    > {

        const startTime = Date.now();
        let endpoint = 'drivingLicenceId' in params
            ? AddressResolver.getEndpointForDrivingLicence((params as { drivingLicenceId: string }).drivingLicenceId)
            : AddressResolver.drivingLicencesEndpoint;

        endpoint += this.attachQueryParams(params, false);

        return await this.request<[T] extends [never]
            ? GetDrivingLicencesResponse
            : GetSpecifiedDrivingLicenceResponse>(endpoint, startTime);
    };

    public async getPermissions<T extends string | never = never>(
        params: GetPermissionDataParams<T>
    ): Promise<[T] extends [never]
        ? GetPermissionsResponse
        : GetSpecifiedPermissionResponse> {

        const startTime = Date.now();
        let endpoint = 'permissionId' in params
            ? AddressResolver.getEndpointForPermission((params as { permissionId: string }).permissionId)
            : AddressResolver.permissionsEndpoint;

        endpoint += this.attachQueryParams(params, false);

        return await this.request<[T] extends [never]
            ? GetPermissionsResponse
            : GetSpecifiedPermissionResponse>(endpoint, startTime);
    };

    public async getDictionaries<T extends import('./enums.js').DictionariesEnum | never = never>(
        params?: GetDictionariesDataParams<T>
    ): Promise<[T] extends [never]
        ? GetDictionariesResponse
        : GetSpecifiedDictionaryResponse> {

        const startTime = Date.now();
        let endpoint = params && 'dictionary' in params
            ? AddressResolver.getEndpointForDictionary((params as { dictionary: string }).dictionary)
            : AddressResolver.dictionariesEndpoint;

        endpoint += this.attachQueryParams(params, false);
        return await this.request<[T] extends [never]
            ? GetDictionariesResponse
            : GetSpecifiedDictionaryResponse>(endpoint, startTime);
    };

    public async getStatistics(
        params?: GetStatisticsParams
    ): Promise<GetStatisticsResponse> {

        const startTime = Date.now();
        const endpoint = AddressResolver.statisticsEndpoint + this.attachQueryParams(params, false);
        return await this.request<GetStatisticsResponse>(endpoint, startTime);
    };

    public async getVehicleStatistics<T extends string | never = never>(
        params: GetVehicleStatisticsParams<T>
    ): Promise<[T] extends [never]
        ? GetVehicleStatisticsResponse
        : GetSpecifiedVehicleStatisticsResponse> {

        const startTime = Date.now();
        const statisticsDate = this.formDate(params.statisticsDate);
        let endpoint: string;

        if ('voivodeship' in params) {
            endpoint = AddressResolver.getVehicleStatisticsForVoivodeshipEndpoint(
                statisticsDate,
                (params as { voivodeship: string }).voivodeship
            );
        } else {
            endpoint = AddressResolver.getVehicleStatisticsEndpoint(statisticsDate);
        }

        const { statisticsDate: _skip, voivodeship: _skipVoiv, ...queryParams } = params as any;
        endpoint += this.attachQueryParams(queryParams, false);

        return await this.request<[T] extends [never]
            ? GetVehicleStatisticsResponse
            : GetSpecifiedVehicleStatisticsResponse>(endpoint, startTime);
    };

    public async getFileStatistics(
        params?: GetFileStatisticsParams
    ): Promise<GetFileStatisticsResponse | GetSpecifiedFileStatisticsResponse> {

        const startTime = Date.now();
        let endpoint: string;

        if (params?.statisticsDate && params?.fileId) {

            endpoint = AddressResolver.getFileStatisticsForFileEndpoint(
                this.formDate(params.statisticsDate),
                params.fileId
            );
            const { statisticsDate: _s, fileId: _f, fromDate: _fd, toDate: _td, ...queryParams } = params as any;
            endpoint += this.attachQueryParams(queryParams, false);

        } else if (params?.statisticsDate) {

            endpoint = AddressResolver.getFileStatisticsEndpoint(this.formDate(params.statisticsDate));
            const { statisticsDate: _s, fromDate: _fd, toDate: _td, ...queryParams } = params as any;
            endpoint += this.attachQueryParams(queryParams, false);

        } else {

            endpoint = AddressResolver.fileStatisticsEndpoint;
            endpoint += this.attachQueryParams(params, false);

        }

        return await this.request<GetFileStatisticsResponse>(endpoint, startTime);
    };

    public async getActivityStatistics<T extends string | never = never>(
        params: GetActivityStatisticsParams<T>
    ): Promise<[T] extends [never]
        ? GetActivityStatisticsResponse
        : GetSpecifiedActivityStatisticsResponse> {

        const startTime = Date.now();
        const statisticsDate = this.formDate(params.statisticsDate);
        let endpoint: string;

        if ('id' in params) {
            endpoint = AddressResolver.getActivityStatisticsHourlyEndpoint(
                statisticsDate,
                (params as { id: string }).id
            );
        } else {
            endpoint = AddressResolver.getActivityStatisticsEndpoint(statisticsDate);
        }

        const { statisticsDate: _skip, id: _skipId, ...queryParams } = params as any;
        endpoint += this.attachQueryParams(queryParams, false);

        return await this.request<[T] extends [never]
            ? GetActivityStatisticsResponse
            : GetSpecifiedActivityStatisticsResponse>(endpoint, startTime);
    };

    public async getDictionaryStatistics(
        params: GetDictionaryStatisticsParams
    ): Promise<GetDictionaryStatisticsResponse> {

        const startTime = Date.now();
        const statisticsDate = this.formDate(params.statisticsDate);
        const endpoint = AddressResolver.getDictionaryStatisticsEndpoint(statisticsDate);
        const { statisticsDate: _skip, ...queryParams } = params as any;
        return await this.request<GetDictionaryStatisticsResponse>(
            endpoint + this.attachQueryParams(queryParams, false),
            startTime
        );
    };

    public async getVersion(
        version?: ApiVersions
    ): Promise<VersionResponse> {

        let endpoint: string = ((version: ApiVersions) => {
            switch (version) {
                case "v1": return AddressResolver.v1VersionEndpoint;
                default: return AddressResolver.versionEndpoint;
            }
        })(version);

        if (this.debug) {
            this.displayEndpointMessage(endpoint);
        };

        return await this.request<VersionResponse>(endpoint, Date.now());
    };

}