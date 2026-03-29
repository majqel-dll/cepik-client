# cepik-api-client

A modern TypeScript/JavaScript library for retrieving data from the public API of the Polish National Vehicles Database (CEPIK).

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
import { CEPIKClient } from "cepik-api-client";


```

### 🛠️ Development

To run the full quality suite locally:

```bash
npm install
npm run build       # compile TypeScript to dist/
npm run lint        # static analysis
npm run test        # run unit tests
npm run coverage    # generate coverage report
```

The package also includes a `prepare` script so that if you install directly
directly from the Git repository (e.g. `npm install cepik-api-client`),
it will compile automatically.

### 🤝 Contributing

Please open issues for bugs or feature requests and send pull requests with
clear descriptions. The library follows semantic versioning; bump the
version in `package.json` and update the changelog when adding features or
fixes.

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
```

### Types

```typescript
import type {
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
- [CEPIK API Documentation](https://api.cepik.gov.pl/doc) - Details about endpoints, formats and limitations.
- [Dictionaries](https://api.cepik.gov.pl/slowniki) - all enums used in the project.

## 📄 License

[MIT © 2026](./LICENSE) [miqel-dll](https://github.com/miqel-dll)

## 🤝 Support

If you encounter a problem or have a suggestion, please open an [issue on GitHub](https://github.com/miqel-dll/cepik-client/issues).

Author: [miqel-dll](https://github.com/miqel-dll)
Version: 0.0.11
