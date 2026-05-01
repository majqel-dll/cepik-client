# cepik-api-client

A modern TypeScript/JavaScript library for retrieving data from the public API of the Polish National Vehicles Database (CEPIK). It provides a simple-to-use interface for querying vehicle information, driving licences, files, permissions, dictionaries, and statistics.

The library is fully typed, written in modern JavaScript (ES Modules), and production-ready with complete tree-shaking support.

## 📦 Installation

```bash
npm install cepik-api-client
```

```bash
yarn add cepik-api-client
```

```bash
pnpm add cepik-api-client
```

## 🚀 Quick Start

```typescript
import { CEPIKApiClient, VoivodeshipEnum, DictionariesEnum } from "cepik-api-client";

const client = new CEPIKApiClient({ debug: true });

// Search for vehicles in Mazovia voivodeship from 2024
const vehicles = await client.getVehicles({
  voivodeship: VoivodeshipEnum.MAZOVIA,
  fromDate: '2024-01-01',
  toDate: '2024-03-31',
  limit: 100,
  page: 1,
});

// Get a specific vehicle by ID
const vehicle = await client.getVehicles({ vehicleId: 'ABC123DEF' });

// Get driving licences
const licences = await client.getDrivingLicences({ limit: 50 });

// Get a specific dictionary
const brands = await client.getDictionaries({ dictionary: DictionariesEnum.BRAND });

// Get general statistics
const stats = await client.getStatistics();

// Get vehicle statistics for a date
const vehicleStats = await client.getVehicleStatistics({ statisticsDate: '2024-01-01' });
```

## ⚙️ Configuration

```typescript
import { CEPIKApiClient } from "cepik-api-client";

const client = new CEPIKApiClient({
  debug: true, // Enable request/response logging to console
});
```

When `debug` is enabled, the client logs the full request URL and response metadata (timing, pagination) to the console for every call.

---

## 📊 `getVehicles(params)`

Search for vehicles by voivodeship and date range, or retrieve a specific vehicle by ID.

### List vehicles

```typescript
const vehicles = await client.getVehicles({
  voivodeship: VoivodeshipEnum.MAZOVIA,  // required
  fromDate: '2024-01-01',                // required
  toDate: '2024-12-31',                  // optional
  dateType: 0,                           // 0 = registration date, 1 = introduction date
  isRegistered: true,
  showAllFields: true,
  sort: ['marka', 'model'],
  fields: ['marka', 'model', 'rok-produkcji'],
  limit: 100,
  page: 1,
});
```

### Get a specific vehicle

```typescript
const vehicle = await client.getVehicles({
  vehicleId: 'WVW3AA170AD000000',
  fields: ['marka', 'model', 'rok-produkcji'],
});
```

---

## 📁 `getFiles(params)`

Retrieve the list of data files available for download, or get details of a specific file.

### List files

```typescript
const files = await client.getFiles({ limit: 100, page: 1 });
```

### Get a specific file

```typescript
const file = await client.getFiles({ fileId: 'FILE123ABC' });
```

---

## 🪪 `getDrivingLicences(params)`

Access driving licence statistics data.

### List driving licences

```typescript
const licences = await client.getDrivingLicences({
  filter: { 'wojewodztwo-kod': '14' },
  sort: ['wiek'],
  fields: ['plec', 'wiek', 'ilosc'],
  limit: 100,
  page: 1,
});
```

### Get a specific driving licence record

```typescript
const licence = await client.getDrivingLicences({ drivingLicenceId: 'ID123' });
```

---

## 🔐 `getPermissions(params)`

Access driving permission (category) statistics data.

### List permissions

```typescript
const permissions = await client.getPermissions({
  filter: { 'kod-uprawnienia': 'B' },
  sort: ['wiek'],
  fields: ['kod-uprawnienia', 'plec', 'wiek', 'ilosc'],
  limit: 50,
  page: 1,
});
```

### Get a specific permission record

```typescript
const permission = await client.getPermissions({ permissionId: 'ID456' });
```

---

## 📚 `getDictionaries(params?)`

Access CEPIK reference dictionaries.

### List all available dictionaries

```typescript
const all = await client.getDictionaries({ limit: 100, page: 1 });
```

### Get a specific dictionary

```typescript
import { DictionariesEnum } from "cepik-api-client";

const brands   = await client.getDictionaries({ dictionary: DictionariesEnum.BRAND });
const types    = await client.getDictionaries({ dictionary: DictionariesEnum.VEHICLE_TYPE });
const fuels    = await client.getDictionaries({ dictionary: DictionariesEnum.FUEL_TYPE });
const origins  = await client.getDictionaries({ dictionary: DictionariesEnum.VEHICLE_ORIGIN });
const methods  = await client.getDictionaries({ dictionary: DictionariesEnum.PRODUCTION_METHOD });
const regions  = await client.getDictionaries({ dictionary: DictionariesEnum.VOIVODESHIPS });
```

---

## 📈 `getStatistics(params?)`

Retrieve general CEPIK access statistics (page views and visits aggregated by date).

```typescript
// All statistics
const stats = await client.getStatistics();

// With date range and pagination
const stats = await client.getStatistics({
  fromDate: '2024-01-01',
  toDate: '2024-03-31',
  limit: 50,
  page: 1,
});
```

---

## 🚗 `getVehicleStatistics(params)`

Retrieve vehicle search statistics, optionally broken down by voivodeship.

### National statistics for a date

```typescript
const stats = await client.getVehicleStatistics({
  statisticsDate: '2024-01-15',
  limit: 50,
  page: 1,
});
```

### Statistics for a specific voivodeship

```typescript
const stats = await client.getVehicleStatistics({
  statisticsDate: '2024-01-15',
  voivodeship: VoivodeshipEnum.MAZOVIA,
});
```

---

## 📂 `getFileStatistics(params?)`

Retrieve file download statistics. The endpoint used depends on which parameters are provided:

| Parameters provided         | Endpoint                                                      |
| --------------------------- | ------------------------------------------------------------- |
| none                        | `/statystyki/pliki` — global list                             |
| `statisticsDate`            | `/statystyki/pliki/{date}` — all files for a date             |
| `statisticsDate` + `fileId` | `/statystyki/pliki/{date}/{fileId}` — specific file on a date |
| `fromDate` / `toDate`       | `/statystyki/pliki` with date range query params              |

```typescript
// Global list with date range
const stats = await client.getFileStatistics({
  fromDate: '2024-01-01',
  toDate: '2024-03-31',
  limit: 50,
});

// All files for a specific statistics date
const statsForDate = await client.getFileStatistics({
  statisticsDate: '2024-01-15',
});

// A specific file on a specific date
const fileStats = await client.getFileStatistics({
  statisticsDate: '2024-01-15',
  fileId: 'FILE123ABC',
});
```

---

## 🕐 `getActivityStatistics(params)`

Retrieve API activity statistics. Without an `id`, returns daily aggregates; with an `id`, returns hourly breakdown for that day.

### Daily activity for a date

```typescript
const daily = await client.getActivityStatistics({
  statisticsDate: '2024-01-15',
  limit: 50,
  page: 1,
});
```

### Hourly breakdown for a specific activity record

```typescript
const hourly = await client.getActivityStatistics({
  statisticsDate: '2024-01-15',
  id: 'RECORD_ID',
});
```

---

## 📖 `getDictionaryStatistics(params)`

Retrieve statistics about dictionary usage for a given date.

```typescript
const stats = await client.getDictionaryStatistics({
  statisticsDate: '2024-01-15',
  limit: 50,
  page: 1,
});
```

---

## 🔢 `getVersion(version?)`

Retrieve the current API version info.

```typescript
// Default version endpoint
const version = await client.getVersion();

// v1 endpoint
const v1 = await client.getVersion('v1');
```

---

## 📋 Supported Voivodeships

```typescript
import { VoivodeshipEnum } from "cepik-api-client";

VoivodeshipEnum.LOWER_SILESIA         // "02"
VoivodeshipEnum.KUYAVIA_POMERANIA     // "04"
VoivodeshipEnum.LUBLIN                // "06"
VoivodeshipEnum.LUBUSZ                // "08"
VoivodeshipEnum.LODZ                  // "10"
VoivodeshipEnum.LESSER_POLAND         // "12"
VoivodeshipEnum.MAZOVIA               // "14"
VoivodeshipEnum.OPOLE                 // "16"
VoivodeshipEnum.SUBCARPATHIA          // "18"
VoivodeshipEnum.PODLASIE              // "20"
VoivodeshipEnum.POMERANIA             // "22"
VoivodeshipEnum.SILESIA               // "24"
VoivodeshipEnum.HOLY_CROSS            // "26"
VoivodeshipEnum.WARMIA_MASURIA        // "28"
VoivodeshipEnum.GREATER_POLAND        // "30"
VoivodeshipEnum.WEST_POMERANIA        // "32"
VoivodeshipEnum.UNKNOWN               // "XX"
```

## 📝 Types and Enums

### Enums

```typescript
import {
  VoivodeshipEnum,
  DictionariesEnum,
  VehicleBrandEnum,
} from "cepik-api-client";
```

### Parameter types

```typescript
import type {
  GetVehicleDataParams,
  GetFilesDataParams,
  GetDrivingLicenceDataParams,
  GetPermissionDataParams,
  GetDictionariesDataParams,
  GetStatisticsParams,
  GetVehicleStatisticsParams,
  GetFileStatisticsParams,
  GetActivityStatisticsParams,
  GetDictionaryStatisticsParams,
} from "cepik-api-client";
```

### Response types

```typescript
import type {
  GetVehicleDataResponse,
  GetSpecifiedVehicleDataResponse,
  GetFilesDataResponse,
  GetSpecifiedFileDataResponse,
  GetDrivingLicencesResponse,
  GetSpecifiedDrivingLicenceResponse,
  GetPermissionsResponse,
  GetSpecifiedPermissionResponse,
  GetDictionariesResponse,
  GetSpecifiedDictionaryResponse,
  GetStatisticsResponse,
  GetVehicleStatisticsResponse,
  GetSpecifiedVehicleStatisticsResponse,
  GetFileStatisticsResponse,
  GetSpecifiedFileStatisticsResponse,
  GetActivityStatisticsResponse,
  GetSpecifiedActivityStatisticsResponse,
  GetDictionaryStatisticsResponse,
  ErrorResponse,
  VersionResponse,
} from "cepik-api-client";
```

### Error handling

When the API returns an error, the client throws an `ErrorResponse` object:

```typescript
import type { ErrorResponse } from "cepik-api-client";

try {
  const vehicles = await client.getVehicles({
    voivodeship: VoivodeshipEnum.MAZOVIA,
    fromDate: '2024-01-01',
  });
} catch (error) {
  const err = error as ErrorResponse;
  console.error(err['error-code'], err['errorr-reason']);
}
```

## 🧪 Testing

```bash
npm run test
```

## 🔍 Linting

```bash
npm run lint
```

## 🏗️ Building

```bash
npm run build
```

The compiled output is placed in the `dist/` directory.

## 📚 Resources

- [CEPIK on gov.pl](https://www.gov.pl/web/cepik/api-dla-centralnej-ewidencji-pojazdow-i-kierowcow-api-do-cepik)
- [CEPIK API Documentation](https://api.cepik.gov.pl/doc) - Details about endpoints, formats, and limitations
- [Dictionaries](https://api.cepik.gov.pl/slowniki) - Reference data and dictionaries used in the project
- [CEPIK Official Website](https://www.gov.pl/web/cepik) - Polish Central Register of Vehicles and Drivers

## 📄 License

[MIT](./LICENSE) © 2026 [majqel-dll](https://github.com/majqel-dll)

---

**Author**: [majqel-dll](https://github.com/majqel-dll)
**Version**: 1.0.3
