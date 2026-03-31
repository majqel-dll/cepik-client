# cepik-api-client

A modern TypeScript/JavaScript library for retrieving data from the public API of the Polish National Vehicles Database (CEPIK). It provides a simple-to-use interface for querying vehicle information, driving licenses, files, permissions, dictionaries, and statistics.

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
import { CEPIKApiClient } from "cepik-api-client";
import { VoivodeshipEnum, DictionariesEnum } from "cepik-api-client";

const client = new CEPIKApiClient({ debug: true });

// Search for vehicles in Mazovia voivodeship from 2024
const vehicles = await client.getVehiclesData({
  voivodeship: VoivodeshipEnum.MAZOVIA,
  fromDate: '2024-01-01',
  toDate: '2024-03-31',
  limit: 100,
  page: 1
});

// Get specific vehicle by ID
const vehicleDetails = await client.getVehiclesData({
  vehicleId: 'ABC123DEF'
});

// Get vehicle files
const files = await client.getFilesData({
  limit: 50,
  page: 1
});

// Get driving licenses data
const licenses = await client.getDrivingLicencesData({
  limit: 50
});

// Get dictionaries (e.g., vehicle brands, types)
const brands = await client.getDictionariesData({
  dictionaryId: DictionariesEnum.BRAND
});

// Get statistics
const stats = await client.getStatistics();
```

## ⚙️ Configuration

```typescript
import { CEPIKApiClient } from "cepik-api-client";

const client = new CEPIKApiClient({
  // Enable debug logging to console
  debug: true
});
```

## 📊 Getting Vehicles Data (getVehiclesData)

The `getVehiclesData()` method allows you to search for vehicle information in the CEPIK database. You can search by voivodeship and date range, or retrieve a specific vehicle by ID.

### Search vehicles by voivodeship and date range

```typescript
// Search for vehicles in a specific voivodeship
const vehicles = await client.getVehiclesData({
  voivodeship: VoivodeshipEnum.MAZOVIA,
  fromDate: '2024-01-01',
  toDate: '2024-12-31',
  limit: 100,
  page: 1
});
```

### Get specific vehicle details

```typescript
// Get detailed information about a specific vehicle
const vehicleDetails = await client.getVehiclesData({
  vehicleId: 'WVW3AA170AD000000',
  fields: ['marka', 'model', 'rok-produkcji']
});
```

### Filter and sort results

```typescript
// Search with filtering and pagination
const vehicles = await client.getVehiclesData({
  voivodeship: VoivodeshipEnum.LOWER_SILESIA,
  fromDate: new Date('2024-01-01'),
  toDate: new Date(),
  isRegistered: true,
  showAllFields: true,
  limit: 50,
  page: 2,
  sort: ['marka', 'model']
});
```

## 📁 Getting Files Data (getFilesData)

The `getFilesData()` method allows you to retrieve file information from the CEPIK database.

### Search all files

```typescript
// Get all available files
const files = await client.getFilesData({
  limit: 100,
  page: 1
});
```

### Get specific file

```typescript
// Get details about a specific file
const fileDetails = await client.getFilesData({
  fileId: 'FILE123ABC'
});
```

### Filter files by date

```typescript
// Get files from a specific date range
const files = await client.getFilesData({
  fromDate: '2024-01-01',
  toDate: '2024-03-31',
  dateType: 0,  // 0 for creation date, 1 for modification date
  limit: 50,
  page: 1
});
```

## 🪪 Getting Driving Licenses Data (getDrivingLicencesData)

The `getDrivingLicencesData()` method provides access to driving license information.

### Search driving licenses

```typescript
// Search for driving licenses
const licenses = await client.getDrivingLicencesData({
  limit: 100,
  page: 1
});
```

### Get specific license details

```typescript
// Get detailed information about a specific license
const licenseDetails = await client.getDrivingLicencesData({
  drivingLicenceId: 'LICENSE123ABC'
});
```

### Filter licenses by date

```typescript
// Get licenses from a specific date range
const licenses = await client.getDrivingLicencesData({
  fromDate: '2024-01-01',
  toDate: '2024-03-31',
  isRegistered: true,
  limit: 50,
  page: 1
});
```

## 🔐 Getting Permissions Data (getPermissionsData)

The `getPermissionsData()` method allows you to retrieve permission information from the CEPIK database.

### Search permissions

```typescript
// Get available permissions
const permissions = await client.getPermissionsData({
  limit: 50,
  page: 1
});
```

### Get specific permission details

```typescript
// Get details about a specific permission
const permissionDetails = await client.getPermissionsData({
  permissionId: 'PERM123ABC'
});
```

## 📚 Getting Dictionaries (getDictionariesData)

The `getDictionariesData()` method provides access to reference dictionaries used in CEPIK.

### Get all dictionaries

```typescript
// List all available dictionaries
const allDictionaries = await client.getDictionariesData({
  limit: 100,
  page: 1
});
```

### Get specific dictionary

```typescript
import { DictionariesEnum } from "cepik-api-client";

// Get vehicle brands dictionary
const brands = await client.getDictionariesData({
  dictionaryId: DictionariesEnum.BRAND
});

// Get vehicle types dictionary
const types = await client.getDictionariesData({
  dictionaryId: DictionariesEnum.VEHICLE_TYPE
});

// Get fuel types dictionary
const fuels = await client.getDictionariesData({
  dictionaryId: DictionariesEnum.FUEL_TYPE
});
```

### Available dictionaries

- `VOIVODESHIPS` - Polish voivodeships
- `BRAND` - Vehicle brands
- `VEHICLE_TYPE` - Types of vehicles
- `FUEL_TYPE` - Fuel types
- `VEHICLE_ORIGIN` - Vehicle origin
- `PRODUCTION_METHOD` - Vehicle production methods

## 📊 Getting Statistics (getStatistics)

The `getStatistics()` method provides access to CEPIK statistics data.

### Get all statistics

```typescript
// Get overall statistics
const stats = await client.getStatistics();
```

### Get statistics for specific subject

```typescript
import { StatisticsSubjectEnum } from "cepik-api-client";

// Get vehicle statistics
const vehicleStats = await client.getStatistics({
  subject: StatisticsSubjectEnum.VEHICLES
});

// Get file statistics
const fileStats = await client.getStatistics({
  subject: StatisticsSubjectEnum.FILES
});

// Get activity statistics
const activityStats = await client.getStatistics({
  subject: StatisticsSubjectEnum.ACTIVITY
});

// Get dictionaries statistics
const dictStats = await client.getStatistics({
  subject: StatisticsSubjectEnum.DICTIONARIES
});
```

## 🔧 Advanced Configuration

### Debugging

```typescript
const client = new CEPIKApiClient({
  debug: true
});

// Logs with sent requests will appear in the console
// 2026-03-31 14:30:45 | CEPIK API Client | Request sent to: ...
```

## 📋 Supported Voivodeships

The library supports all Polish voivodeships (wojewódzwa):

```typescript
import { VoivodeshipEnum } from "cepik-api-client";

// Available voivodeships:
VoivodeshipEnum.LOWER_SILESIA         // 02
VoivodeshipEnum.KUYAVIA_POMERANIA     // 04
VoivodeshipEnum.LUBLIN                // 06
VoivodeshipEnum.LUBUSZ                // 08
VoivodeshipEnum.LODZ                  // 10
VoivodeshipEnum.LESSER_POLAND         // 12
VoivodeshipEnum.MAZOVIA               // 14
VoivodeshipEnum.OPOLE                 // 16
VoivodeshipEnum.SUBCARPATHIA          // 18
VoivodeshipEnum.PODLASIE              // 20
VoivodeshipEnum.POMERANIA             // 22
VoivodeshipEnum.SILESIA               // 24
VoivodeshipEnum.HOLY_CROSS            // 26
VoivodeshipEnum.WARMIA_MASURIA        // 28
VoivodeshipEnum.GREATER_POLAND        // 30
VoivodeshipEnum.WEST_POMERANIA        // 32
VoivodeshipEnum.UNKNOWN               // XX
```

## 📝 Types and Enums

### Enums

```typescript
import {
    VoivodeshipEnum,
    DictionariesEnum,
    VehicleBrandEnum,
    VehicleTypeEnum,
    FuelTypeEnum,
    VehicleOriginEnum,
    VehicleProductionMethodEnum,
    StatisticsSubjectEnum,
} from "cepik-api-client";

// Voivodeships
VoivodeshipEnum.MAZOVIA | VoivodeshipEnum.WARSAW | ...

// Dictionary types
DictionariesEnum.VOIVODESHIPS | DictionariesEnum.BRAND | DictionariesEnum.VEHICLE_TYPE | ...

// Statistics subjects
StatisticsSubjectEnum.VEHICLES | StatisticsSubjectEnum.FILES | StatisticsSubjectEnum.ACTIVITY | StatisticsSubjectEnum.DICTIONARIES
```

### Types

```typescript
import type {
    GetVehicleDataParams,
    GetFilesDataParams,
    GetDrivingLicenceDataParams,
    GetPermissionDataParams,
    GetDictionariesDataParams,
    GetStatisticsParams,
    GetVehicleDataResponse,
    GetFilesDataResponse,
    GetDrivingLicencesResponse,
    GetPermissionsResponse,
    GetDictionariesResponse,
    GetStatisticsResponse,
} from "cepik-api-client";
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

The compiled code is located in the `dist/` directory.

## 📚 Resources

- [Official CEPIK API](https://www.gov.pl/web/cepik/api-dla-centralnej-ewidencji-pojazdow-i-kierowcow-api-do-cepik)
- [CEPIK API Documentation](https://api.cepik.gov.pl/doc) - Details about endpoints, formats, and limitations
- [Dictionaries](https://api.cepik.gov.pl/slowniki) - Reference data and dictionaries used in the project
- [CEPIK Official Website](https://www.gov.pl/web/cepik) - Polish Central Register of Vehicles and Drivers

## 📄 License

[MIT © 2026](./LICENSE) [miqel-dll](https://github.com/miqel-dll)

## 🤝 Support

If you encounter a problem or have a suggestion, please open an [issue on GitHub](https://github.com/miqel-dll/cepik-client/issues).

---

**Author**: [miqel-dll](https://github.com/miqel-dll)
**Version**: 0.4.1
