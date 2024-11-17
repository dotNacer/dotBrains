# dotBrains 🧠

A web application that helps me manage my thoughts and ideas, including a flow driven editor to capture my ideas coupled with a note taking system to record my thoughts.

## Tech Stack

-   [Svelte 5](https://svelte.dev/docs/svelte/overview)
-   [SvelteFlow](https://github.com/xyflow/xyflow/tree/svelte-5) - Flow based editor
-   [Tiptap](https://tiptap.dev/) - Rich text editor
-   [ShadCN-Svelte](https://next.shadcn-svelte.com/) - UI components
-   [Drizzle](https://orm.drizzle.team/) - Database

# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
