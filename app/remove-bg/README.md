![Banner](https://r2.ras.sh/banners/remove-bg.webp)

# remove-bg

Remove backgrounds from images using AI. Built with Next.js, TypeScript, and IMG.LY's background removal library.

## Features

- 🖼️ Drag and drop interface
- 🤖 AI-powered background removal (isnet model)
- 📊 Real-time progress tracking
- 📱 Responsive design
- ⚡ Automatic model preloading
- 💾 Download as PNG or WebP
- 🔒 Client-side processing (no uploads)
- ⏱️ Processing time metrics

**Try it live: [ras.sh/remove-bg](https://ras.sh/remove-bg)**

## How It Works

- Uses the isnet model (~80MB) via IMG.LY's background removal library
- ONNX Runtime runs the model directly in the browser
- WebAssembly enables high-performance client-side processing
- Model is automatically preloaded on page load and cached

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

MIT License - see the [LICENSE](LICENSE) file for details.
