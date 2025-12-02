# uxpro-cli

CLI to install UI/UX Pro Max skill for AI coding assistants.

## Installation

```bash
npm install -g uxpro-cli
```

## Usage

```bash
# Install for specific AI assistant
uxpro init --ai claude      # Claude Code
uxpro init --ai cursor      # Cursor
uxpro init --ai windsurf    # Windsurf
uxpro init --ai antigravity # Antigravity
uxpro init --ai all         # All assistants

# Other commands
uxpro versions              # List available versions
uxpro update                # Update to latest version
uxpro init --version v1.0.0 # Install specific version
```

## Development

```bash
# Install dependencies
bun install

# Run locally
bun run src/index.ts --help

# Build
bun run build

# Link for local testing
bun link
```

## License

MIT
