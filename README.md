# kuwot-api-js

A Node.js REST API built with TypeScript and Express.

## Getting Started

### Prerequisites

- Node.js >= 18
- npm

### Installation

```sh
npm install
```

### Configuration

1. Copy `.env.example` to `.env` and fill in your secrets:
   ```sh
   cp .env.example .env
   ```
2. Set your Unsplash access key and other variables in `.env`.

### Running the Server

```sh
npm start
```

### Formatting Code

```sh
npm run format
```

### Recommended VS Code Extensions

- ESLint
- Prettier

## Project Structure

```
kuwot-api-js/
├── src/
│   ├── index.ts         # Entry point
│   ├── routes.ts        # API routes
│   ├── types.d.ts       # Type definitions
│   └── data/
│       ├── db.ts        # Database logic
│       └── unsplash.ts  # Unsplash API integration
├── .env.example         # Example environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Project metadata and scripts
├── tsconfig.json        # TypeScript configuration
└── .vscode/
    ├── launch.json      # Debug configuration
    └── extensions.json  # Recommended extensions
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

ISC
