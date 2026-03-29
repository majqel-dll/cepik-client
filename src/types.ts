import { DictionariesEnum, VoivodeshipEnum } from "./enums.js";

export type CepikApiLoggerConfiguration = {
    context?: string,
};

export type BasicSearchParams = {
    limit?: number,
}

export type GetVehicleDataParams = BasicSearchParams & {
    vehicleId?: string,
    voivodship: VoivodeshipEnum,
};

export type GetVehicleDataErrorResponse = {
    id: string,
    "errorr-result": string,
    "errorr-reason": string,
    "errorr-solution": string,
    "error-help": string,
    "error-code": string
};

export type GetVehicleDataResponse = {
    data: GetVehicleDataResponseData[],

};

type GetVehicleDataResponseData = {

};

export type GetFilesDataParams = BasicSearchParams & {
    fileId?: string,
};

export type GetDrivingLicenceDataParams = BasicSearchParams & {
    drivingLicenceId?: string,
};

export type GetPermissionDataParams = BasicSearchParams & {
    permissionId?: string,
};

export type GetDictionariesDataParams = BasicSearchParams & {
    dictionary: DictionariesEnum,
};

export type GetStatisticsParams = BasicSearchParams & {

};

export type ColorCode = `RED` | `YELLOW` | `GREEN` | `DEFAULT` | `MAGENTA`;
