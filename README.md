# ML Playground

This project aims to provide a guiding interface for all your Machine Learning needs.

## Contributing

### Requirements

These are the recommended set of programs that should be used to contribute to the project.

```bash
# Node.js >= 18.0.0
node -v

# pnpm package manager
npm i -g pnpm
```

### Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

### Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
