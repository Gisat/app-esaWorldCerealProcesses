# AGENTS.md

## Running the Dev Server

This is a Next.js project. The dev server **must** be started as a background process via the Kilo CLI `background_process` tool — do not run `npm run dev` directly in a foreground shell.

### Start

```
background_process(action="start", command="npm run dev", description="Next.js dev server")
```

The server starts on http://localhost:3000 by default. The `ready` probe is not needed — Next.js prints its URL immediately.

### Stop

```
background_process(action="stop", id="<process-id>")
```

### Logs

```
background_process(action="logs", id="<process-id>")
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (use via `background_process`) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm test` | Jest tests |
