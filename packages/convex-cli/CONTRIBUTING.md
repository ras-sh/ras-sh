# Contributing to Convex CLI

Thank you for your interest in contributing to the Convex CLI! This guide will help you get started with development and understand our contribution process.

## Development

### Prerequisites

- Node.js 20+
- pnpm

### Setup

```bash
git clone git@github.com:ras-sh/ras-sh.git
cd ras-sh/packages/convex-cli
pnpm install
```

### Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm run coverage

# Run linting
pnpm run check

# Fix linting issues
pnpm run fix

# Build the project
pnpm run build
```

## Examples

See the `examples/` directory for complete working examples:

- `examples/todo/`: Full-featured todo application with CLI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `pnpm test`
6. Run linting: `pnpm run check`
7. Submit a pull request

### Code Quality

This project uses:
- **Biome**: Fast formatter and linter
- **Vitest**: Modern testing framework
- **TypeScript**: Strict type checking
- **ts-morph**: TypeScript AST manipulation
- **Ultracite**: Zero-config code quality

## License

MIT - see [LICENSE](LICENSE) file for details.
