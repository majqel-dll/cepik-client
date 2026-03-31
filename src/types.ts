import { DictionariesEnum, VoivodeshipEnum } from "./enums.js";

export type CepikApiLoggerConfiguration = {
    context?: string,
};

export type BasicSearchParams = {
    limit?: number,
    page?: number,
};

export interface AttachQueryParams<T extends string = string> {
    limit?: number;
    fromDate?: Date | string;
    toDate?: Date | string;
    dateType?: 0 | 1;
    isRegistered?: boolean;
    showAllFields?: boolean;
    fields?: T[];
    page?: number;
    sort?: T[];
    filter?: Record<string, string | number>;
}

export type GetVehicleDataParams<T extends string | never> = [T] extends [never]
    ? BasicSearchParams & {
        voivodeship: VoivodeshipEnum,
        fromDate: Date | string,
        toDate?: Date | string,
        dateType?: 0 | 1,
        isRegistered?: boolean,
        showAllFields?: boolean,
        fields?: Partial<GetVehicleDataResponseDataAttributes>[]
        sort?: Partial<GetVehicleDataResponseDataAttributes>[],
    } : {
        vehicleId: T,
        fields?: Partial<GetSpecifiedVehicleDataResponseAttributes>[]
    };

export type GetVehicleDataErrorResponse = {
    id: string,
    "errorr-result": string,
    "errorr-reason": string,
    "errorr-solution": string,
    "error-help": string,
    "error-code": string
};

type GetVehicleDataResponseData = {
    attributes: GetVehicleDataResponseDataAttributes,
    id: string,
    links: {
        self: string,
    },
    type: string,
};

type GetVehicleDataResponseDataAttributes = {
    "rejestracja-gmina": string,
    "rejestracja-powiat": string,
    "rejestracja-wojewodztwo": string,
    "data-ostatniej-rejestracji-w-kraju": string,
    "data-pierwszej-rejestracji": string,
    "data-pierwszej-rejestracjiwkraju": string,
    "data-pierwszej-rejestracji-za-granica": string,
    "data-wprowadzenia-danych": string,
    "data-wyrejestrowania-pojazdu": string,
    "dopuszczalna-ladownosc": number,
    "dopuszczalna-masa-calkowita": number,
    "dopuszczalna-masa-calkowita-zespolu-pojazdow": number,
    "poziom-emisji-co2": number,
    "poziom-emisji-co2-pierwsze-paliwo-alternatwne": number,
    "poziom-emisji-co2-drugie-paliwo-alternatwne": number,
    "kategoria-pojazdu": string,
    "kod-instytutu-transportu-samochodowego": string,
    "kod-rodzaj-podrodzaj-przeznaczenie": string,
    "liczba-miejsc-ogolem": number,
    "liczba-miejsc-siedzacych": number,
    "liczba-miejsc-stojacych": number,
    "liczba-osi": number,
    "maksymalna-ladownosc": number,
    "maksymalna-masa-calkowita": number,
    "max-masa-calkowita-ciagnietej-przyczepy-bez-hamulca": number,
    "max-masa-calkowita-przyczepy-bez-hamulca": number,
    "max-moc-netto-silnikow-pojazdu-hybrydowego": number,
    "max-rozstaw-kol": number,
    "moc-netto-silnika": number,
    "marka": string,
    "masa-pojazdu-gotowego-do-jazdy": number,
    "masa-wlasna": number,
    "min-rozstaw-kol": number,
    "model": string,
    "dopuszczalny-nacisk-osi": number,
    "maksymalny-nacisk-osi": number,
    "nazwa-producenta": string,
    "pochodzenie-pojazdu": string,
    "podrodzaj-pojazdu": string,
    "pojemnosc-skokowa-silnika": number,
    "przeznaczenie-pojazdu": string,
    "przyczyna-wyrejestrowania-pojazdu": string,
    "redukcja-emisji-spalin": number,
    "rodzaj-drugiego-paliwa-alternatywnego": string,
    "rodzaj-kodowania-rodzaj-podrodzaj-przeznaczenie": string,
    "rodzaj-paliwa": string,
    "rodzaj-pierwszego-paliwa-alternatywnego": string,
    "rodzaj-pojazdu": string,
    "rodzaj-tabliczki-znamionowej": string,
    "rodzaj-zwieszenia": string,
    "rok-produkcji": string,
    "rozstaw-kol-osi-kierowanej-pozostalych-osi": string,
    "wlasciciel-gmina": string,
    "wlasciciel-powiat": string,
    "wlasciciel-wojewodztwo": string,
    "sposob-produkcji": string,
    "avg-rozstaw-kol": number,
    "avg-zuzycie-paliwa": number,
    "stosunek-mocy-silnika-do-masy-wlasnej-motocykle": number,
    "typ": string,
    "wariant": string,
    "wersja": string,
    "wyposazenie-i-rodzaj-urzadzenia-radarowego": string,
    "kierownica-po-prawej-stronie": boolean,
    "kierownica-po-prawej-stronie-pierwotnie": boolean,
    "hak": boolean,
    "katalizator-pochlaniacz": boolean,
    "wojewodztwo-kod": string,
    "wlasciciel-wojewodztwo-kod": string
};

type ResponseLinks = {
    first: string,
    last: string,
    next: string,
    prev: string,
    self: string,
};

type ResponseMetadata = {
    "contentType": string,
    "count": number,
    "schema:dateModified": string,
    "schema:datePublished": string,
    "dc:description": string,
    "schema:isPartOf": string,
    "dc:language": string,
    "limit": number,
    "page": number,
    "schema:provider": string,
    "dc:title": string,
    "sY:updateBase": string,
    "sy:updateFrequency": string,
    "sy:updatePeriod": string
};

type GetSpecifiedVehicleDataResponseData = {
    attributes: GetSpecifiedVehicleDataResponseAttributes,
    id: string,
    links: {
        self: string,
    },
    type: string,
}

type GetSpecifiedVehicleDataResponseAttributes = {
    "rejestracja-gmina": string,
    "rejestracja-powiat": string,
    "rejestracja-wojewodztwo": string,
    "data-ostatniej-rejestracji-w-kraju": string,
    "data-pierwszej-rejestracji": string,
    "data-pierwszej-rejestracjiwkraju": string,
    "data-pierwszej-rejestracji-za-granica": string,
    "data-wprowadzenia-danych": string,
    "data-wyrejestrowania-pojazdu": string,
    "dopuszczalna-ladownosc": number,
    "dopuszczalna-masa-calkowita": number,
    "dopuszczalna-masa-calkowita-zespolu-pojazdow": number,
    "poziom-emisji-co2": number,
    "poziom-emisji-co2-pierwsze-paliwo-alternatwne": number,
    "poziom-emisji-co2-drugie-paliwo-alternatwne": number,
    "kategoria-pojazdu": string,
    "kod-instytutu-transportu-samochodowego": string,
    "kod-rodzaj-podrodzaj-przeznaczenie": string,
    "liczba-miejsc-ogolem": number,
    "liczba-miejsc-siedzacych": number,
    "liczba-miejsc-stojacych": number,
    "liczba-osi": number,
    "maksymalna-ladownosc": number,
    "maksymalna-masa-calkowita": number,
    "max-masa-calkowita-ciagnietej-przyczepy-bez-hamulca": number,
    "max-masa-calkowita-przyczepy-bez-hamulca": number,
    "max-moc-netto-silnikow-pojazdu-hybrydowego": number,
    "max-rozstaw-kol": number,
    "moc-netto-silnika": number,
    "marka": string,
    "masa-pojazdu-gotowego-do-jazdy": number,
    "masa-wlasna": number,
    "min-rozstaw-kol": number,
    "model": string,
    "dopuszczalny-nacisk-osi": number,
    "maksymalny-nacisk-osi": number,
    "nazwa-producenta": string,
    "pochodzenie-pojazdu": string,
    "podrodzaj-pojazdu": string,
    "pojemnosc-skokowa-silnika": number,
    "przeznaczenie-pojazdu": string,
    "przyczyna-wyrejestrowania-pojazdu": string,
    "redukcja-emisji-spalin": number,
    "rodzaj-drugiego-paliwa-alternatywnego": string,
    "rodzaj-kodowania-rodzaj-podrodzaj-przeznaczenie": string,
    "rodzaj-paliwa": string,
    "rodzaj-pierwszego-paliwa-alternatywnego": string,
    "rodzaj-pojazdu": string,
    "rodzaj-tabliczki-znamionowej": string,
    "rodzaj-zwieszenia": string,
    "rok-produkcji": string,
    "rozstaw-kol-osi-kierowanej-pozostalych-osi": string,
    "wlasciciel-gmina": string,
    "wlasciciel-powiat": string,
    "wlasciciel-wojewodztwo": string,
    "sposob-produkcji": string,
    "avg-rozstaw-kol": number,
    "avg-zuzycie-paliwa": number,
    "stosunek-mocy-silnika-do-masy-wlasnej-motocykle": number,
    "typ": string,
    "wariant": string,
    "wersja": string,
    "wyposazenie-i-rodzaj-urzadzenia-radarowego": string,
    "kierownica-po-prawej-stronie": boolean,
    "kierownica-po-prawej-stronie-pierwotnie": boolean,
    "hak": boolean,
    "katalizator-pochlaniacz": boolean,
    "wojewodztwo-kod": string,
    "wlasciciel-wojewodztwo-kod": string
}

export type GetVehicleDataResponse = {
    data: GetVehicleDataResponseData[],
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

export type GetSpecifiedVehicleDataResponse = {
    data: GetSpecifiedVehicleDataResponseData,
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

export type GetFilesDataParams<T extends string | never> = [T] extends [never]
    ? BasicSearchParams
    : {
        fileId: T,
    };

export type ErrorResponse = {
    id: string,
    "errorr-result": string,
    "errorr-reason": string,
    "errorr-solution": string,
    "error-help": string,
    "error-code": string
};

export type GetFilesDataResponseAttributes = {
    "url-do-pliku": string,
    "url-do-metadanych-pliku": string,
    "opis-zawartosci": string,
    "opis-formatu-pliku": string,
    "typ-zasobu-bedacego-zawartoscia": string,
    "data-utworzenia-pliku": string
};

export type GetFilesDataResponseData = {
    attributes: GetFilesDataResponseAttributes,
    id: string,
    links: {
        self: string
    },
    type: string
};

export type GetFilesDataResponse = {
    data: GetFilesDataResponseData[],
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

export type GetSpecifiedFileDataResponse = {
    data: GetFilesDataResponseData,
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

type DrivingLicenceResponseDataAttributes = {
    "data-statystyki": string,
    "wojewodztwo-kod": string,
    "wojewodztwo-nazwa": string,
    "plec": string,
    "wiek": number,
    "ilosc": number,
};

type DrivingLicenceResponseData = {
    attributes: DrivingLicenceResponseDataAttributes,
    id: string,
    links: { self: string },
    type: string,
};

export type GetDrivingLicenceDataParams<T extends string | never> = [T] extends [never]
    ? BasicSearchParams & {
        fields?: string[],
        sort?: string[],
        filter?: Record<string, string | number>,
    }
    : {
        drivingLicenceId: T,
        fields?: string[],
    };

export type GetDrivingLicencesResponse = {
    data: DrivingLicenceResponseData[],
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

export type GetSpecifiedDrivingLicenceResponse = {
    data: DrivingLicenceResponseData,
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

type PermissionResponseDataAttributes = {
    "data-statystyki": string,
    "wojewodztwo-kod": string,
    "wojewodztwo-nazwa": string,
    "kod-uprawnienia": string,
    "plec": string,
    "wiek": number,
    "ilosc": number,
};

type PermissionResponseData = {
    attributes: PermissionResponseDataAttributes,
    id: string,
    links: { self: string },
    type: string,
};

export type GetPermissionDataParams<T extends string | never> = [T] extends [never]
    ? BasicSearchParams & {
        fields?: string[],
        sort?: string[],
        filter?: Record<string, string | number>,
    }
    : {
        permissionId: T,
        fields?: string[],
    };

export type GetPermissionsResponse = {
    data: PermissionResponseData[],
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

export type GetSpecifiedPermissionResponse = {
    data: PermissionResponseData,
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

type DictionaryListItemAttributes = {
    "opis-slownika": string,
};

type DictionaryListItemData = {
    attributes: DictionaryListItemAttributes,
    id: string,
    links: { self: string },
    type: string,
};

type DictionaryElementAttributes = {
    "klucz-slownika": string,
    "wartosc-slownika": string,
    "liczba-wystapien": string,
    "slownik-powiazany": string,
};

type DictionarySpecificAttributes = {
    "dostepne-rekordy-slownika": DictionaryElementAttributes[],
    "ilosc-rekordow-slownika": number,
};

type DictionarySpecificData = {
    attributes: DictionarySpecificAttributes,
    id: string,
    links: { self: string },
    type: string,
};

export type GetDictionariesDataParams<T extends DictionariesEnum | never> = [T] extends [never]
    ? BasicSearchParams
    : {
        dictionary: T,
    };

export type GetDictionariesResponse = {
    data: DictionaryListItemData[],
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

export type GetSpecifiedDictionaryResponse = {
    data: DictionarySpecificData,
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

type StatisticsAttributes = {
    "data": string,
    "nazwa": string,
    "liczba-odslon": string,
    "liczba-wizyt": string,
};

type StatisticsResponseData = {
    attributes: StatisticsAttributes,
    id: string,
    links: { self: string },
    type: string,
};

export type GetStatisticsParams = BasicSearchParams & {
    fromDate?: Date | string,
    toDate?: Date | string,
};

export type GetStatisticsResponse = {
    data: StatisticsResponseData[],
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

type StatisticsVehicleAttributes = {
    "data-statystyki": string,
    "nazwa-wojewodztwa": string,
    "ilosc-wyszukan": string,
};

type StatisticsVehicleData = {
    attributes: StatisticsVehicleAttributes,
    id: string,
    links: { self: string },
    type: string,
};

export type GetVehicleStatisticsParams<T extends string | never> = [T] extends [never]
    ? BasicSearchParams & { statisticsDate: Date | string }
    : { statisticsDate: Date | string, voivodeship: T };

export type GetVehicleStatisticsResponse = {
    data: StatisticsVehicleData[],
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

export type GetSpecifiedVehicleStatisticsResponse = {
    data: StatisticsVehicleData,
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

type StatisticsFilesAttributes = {
    "data-statystyki": string,
    "nazwa-pliku": string,
    "opis-pliku": string,
    "liczba-pobran": number,
};

type StatisticsFilesData = {
    attributes: StatisticsFilesAttributes,
    id: string,
    links: { self: string },
    type: string,
};

export type GetFileStatisticsParams = BasicSearchParams & {
    fromDate?: Date | string,
    toDate?: Date | string,
    statisticsDate?: Date | string,
    fileId?: string,
};

export type GetFileStatisticsResponse = {
    data: StatisticsFilesData[],
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

export type GetSpecifiedFileStatisticsResponse = {
    data: StatisticsFilesData,
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

type StatisticsActivityDailyAttributes = {
    "dzien-tygodnia": string,
    "data-statystyki": string,
    "laczna-ilosc-wyswietlen": string,
};

type StatisticsActivityDailyData = {
    attributes: StatisticsActivityDailyAttributes,
    id: string,
    links: { self: string },
    type: string,
};

type StatisticsActivityHourlyAttributes = {
    "data-statystyki": string,
    "godzina-od": string,
    "godzina-do": string,
    "laczna-ilosc-wyswietlen": string,
};

type StatisticsActivityHourlyData = {
    attributes: StatisticsActivityHourlyAttributes,
    id: string,
    links: { self: string },
    type: string,
};

export type GetActivityStatisticsParams<T extends string | never> = [T] extends [never]
    ? BasicSearchParams & { statisticsDate: Date | string }
    : { statisticsDate: Date | string, id: T };

export type GetActivityStatisticsResponse = {
    data: StatisticsActivityDailyData[],
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

export type GetSpecifiedActivityStatisticsResponse = {
    data: StatisticsActivityHourlyData,
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

export type GetDictionaryStatisticsParams = BasicSearchParams & {
    statisticsDate: Date | string,
};

export type GetDictionaryStatisticsResponse = {
    data: DictionarySpecificData,
    links: ResponseLinks,
    meta: ResponseMetadata,
    rateLimitingRemaining: number,
};

export type ColorCode = `RED` | `YELLOW` | `GREEN` | `DEFAULT` | `MAGENTA`;
export interface HttpsRequestOptions {
    method?: string;
    headers?: Record<string, string>;
    ciphers?: string;
    minVersion?: string;
}

export interface IncomingMessage {
    statusCode?: number;
    headers: Record<string, string | string[] | undefined>;
    on(event: 'data', listener: (chunk: string) => void): void;
    on(event: 'end', listener: () => void): void;
}

export interface ClientRequest {
    on(event: 'error', listener: (error: Error) => void): void;
}

export interface HttpsModule {
    get(url: string, options: HttpsRequestOptions, callback: (res: IncomingMessage) => void): ClientRequest;
}

export type ApiVersions = `v1`

export type VersionResponse = {
    dateMod: string,
    deprecated: string,
    major: string,
    minor: string,
    patch: string,
};