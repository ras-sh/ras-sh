# Contributing to ras.sh

Thank you for your interest in contributing! This guide will help you get started with development and understand our contribution process.

## Development

### Prerequisites

- Node.js 22+
- pnpm

### Setup

```bash
git clone git@github.com:ras-sh/ras-sh.git
cd ras-sh
pnpm install
```

### Testing

```bash
# Run development server
pnpm dev

# Run linting
pnpm run check

# Fix linting issues
pnpm run fix

# Build the project
pnpm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all checks pass: `pnpm run check`
5. Submit a pull request

### Code Quality

This project uses:
- **Biome**: Fast formatter and linter
- **TypeScript**: Strict type checking
- **Ultracite**: Zero-config code quality
- **Lefthook**: Git hooks management

## License

MIT - see [LICENSE](LICENSE) file for details.
