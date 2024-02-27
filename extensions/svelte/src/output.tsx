import { Detail, Toast, showToast } from "@raycast/api";
import { useExec } from "@raycast/utils";
import { create } from "create-svelte";
import { homedir } from "os";
import { join } from "path";
import { useState } from "react";
import packageJSON from "../package.json";
import { CreateOptions } from "./types";

const createSvelteVersions = packageJSON.dependencies["create-svelte"];

// Define markdown here to prevent unwanted indentation.
const markdown = `
# Pikachu

Pikachu that can generate powerful electricity have cheek sacs that are extra soft and super stretchy.
`;
// ![](https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png)

export default function Output({ directory, options }: { directory: string; options: CreateOptions }) {
  const [output, setOutput] = useState(markdown);
  const appendOutput = (text: string) => setOutput((output) => output + text);
  const [commandLs, runCommandLs] = useState(false);
  const cwd = join(directory, options.name);

  // npm create svelte-with-args
  const { isLoading, data, error, revalidate } = useExec("echo $PATH", {
    execute: commandLs,
    cwd: homedir(),
    onWillExecute: (willExecute) => {
      showToast({
        style: Toast.Style.Animated,
        title: "Creating Svelte App...",
        message: createSvelteVersions,
      });
      console.log({ willExecute });
    },
    onData: (data) => {
      console.log({ data });
      appendOutput(data);
    },
    onError: (error) => {
      console.error({ error });
      appendOutput(error?.message || error?.name || error?.stack || "An error occurred.");
    },
  });

  console.log({ cwd, options });
  create(cwd, options)
    .then(() => {
      showToast({
        style: Toast.Style.Success,
        title: "Your project is ready!",
        message: "Your project is ready!",
      });
      console.log("create: success");
    })
    .catch(() => {
      showToast({
        style: Toast.Style.Failure,
        title: "An error occurred.",
        message: "Get help at https://svelte.dev/chat",
      });
      console.log("create: error");
    })
    .finally(() => {
      runCommandLs(true);
      console.log("create: finally", { isLoading, data, error });
      //   revalidate();
    });
  //   const isError = output instanceof Error;
  //   if (isError) {
  //     showToast({
  //       style: Toast.Style.Failure,
  //       title: "An error occurred.",
  //       message: "Get help at https://svelte.dev/chat",
  //     });
  //   } else {
  //     showToast({
  //       style: Toast.Style.Success,
  //       title: "Your project is ready!",
  //       message: "Your project is ready!",
  //     });
  //   }
  return (
    <Detail
      isLoading={isLoading}
      markdown={output}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label text={`1' 04"`} title="Height" />
          <Detail.Metadata.Label text="13.2 lbs" title="Weight" />
          <Detail.Metadata.TagList title="Type">
            <Detail.Metadata.TagList.Item color={"#eed535"} text="Electric" />
          </Detail.Metadata.TagList>
          <Detail.Metadata.Separator />
          <Detail.Metadata.Link target="https://www.pokemon.com/us/pokedex/pikachu" text="Raichu" title="Evolution" />
        </Detail.Metadata>
      }
      navigationTitle="Pikachu"
    />
  );
}

/*
create-svelte version 6.0.9

┌  Welcome to SvelteKit!
│
◇  Where should we create your project?
│    (hit Enter to use current directory)
│
◇  Which Svelte app template?
│  ○ SvelteKit demo app
│  ● Skeleton project (Barebones scaffolding for your new SvelteKit app)
│  ○ Library project
│
◇  Add type checking with TypeScript?
│  ○ Yes, using JavaScript with JSDoc comments
│  ● Yes, using TypeScript syntax
│  ○ No
│
◇  Select additional options (use arrow keys/space bar)
│  ◼ Add ESLint for code linting
│  ◼ Add Prettier for code formatting
│  ◻ Add Playwright for browser testing
│  ◻ Add Vitest for unit testing
│  ◼ Try the Svelte 5 preview (unstable!)
│
└  Your project is ready!

✔ Typescript
  Inside Svelte components, use <script lang="ts">

✔ ESLint
  https://github.com/sveltejs/eslint-plugin-svelte

✔ Prettier
  https://prettier.io/docs/en/options.html
  https://github.com/sveltejs/prettier-plugin-svelte#options

Install community-maintained integrations:
  https://github.com/svelte-add/svelte-add

Next steps:
  1: cd test
  2: bun install
  3: git init && git add -A && git commit -m "Initial commit" (optional)
  4: bun run dev -- --open

To close the dev server, hit Ctrl-C

Stuck? Visit us at https://svelte.dev/chat
*/
