import { DictionariesEnum, StatisticsSubjectEnum, VoivodeshipEnum } from "./enums.js";

export type CepikApiLoggerConfiguration = {
    context?: string,
};

export type BasicSearchParams = {
    limit?: number,
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
        page?: number,
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

export type GetVehicleDataResponse = {
    data: GetVehicleDataResponseData[],
    links: GetVehicleDataResponseLinks,
    meta: GetVehicleDataResponseMeta,
    rateLimitingRemaining: number,
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

type GetVehicleDataResponseLinks = {
    first: string,
    last: string,
    next: string,
    prev: string,
    self: string,
};

type GetVehicleDataResponseMeta = {
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

export type GetSpecifiedVehicleDataResponse = {
    data: GetSpecifiedVehicleDataResponseData[],
    links: GetVehicleDataResponseLinks,
    meta: GetVehicleDataResponseMeta,
    rateLimitingRemaining: number,
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
    subject: StatisticsSubjectEnum,
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
