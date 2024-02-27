import { Action, ActionPanel, Form, LaunchProps, environment, useNavigation } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import { existsSync, lstatSync } from "fs";

import Output from "./output";
import { CreateOptions, RaycastValues } from "./types";

export default function Command(props: LaunchProps<{ draftValues: RaycastValues }>) {
  const { push } = useNavigation();
  const { draftValues } = props;
  //   getApplications().then((apps) =>
  //     console.log(apps.flatMap((a) => (a.path.toLowerCase().endsWith(".app") ? [] : a.path)).join("\n")),
  //   );

  const { handleSubmit, itemProps } = useForm<RaycastValues>({
    async onSubmit(values) {
      const directory = values.directory[0];
      const options = {
        name: values.name,
        template: values.template as CreateOptions["template"],
        types: (values.types === "null" ? null : values.types) as CreateOptions["types"],
        prettier: values.prettier,
        eslint: values.eslint,
        playwright: values.playwright,
        vitest: values.vitest,
        svelte5: values.svelte5,
      };
      push(<Output directory={directory} options={options} />);
    },
    initialValues: {
      template: "skeleton",
      types: "typescript",
      eslint: true,
      prettier: true,
      svelte5: true,
      ...(environment.isDevelopment && { name: "my-new-app" }),
    },
    validation: {
      directory: (values) => {
        // make sure a directory is selected
        if (!values?.length) {
          return "No directory selected.";
        }
        // get the path from the FilePicker directory
        const path = values[0];
        // make sure the path exists
        if (!existsSync(path)) {
          return "Path does not exist.";
        }
        // make sure the path is a directory
        if (!lstatSync(path).isDirectory()) {
          return "Path is not a directory.";
        }
      },
      name: (value) => (value?.trim() ? undefined : "Project name is required."),
      template: FormValidation.Required,
      types: FormValidation.Required,
      eslint: FormValidation.Required,
      prettier: FormValidation.Required,
      playwright: FormValidation.Required,
      vitest: FormValidation.Required,
      svelte5: FormValidation.Required,
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
      enableDrafts
      searchBarAccessory={
        <Form.LinkAccessory target="https://www.npmjs.com/package/create-svelte" text="Open Documentation" />
      }
    >
      <Form.FilePicker
        allowMultipleSelection={false}
        canChooseDirectories
        canChooseFiles={false}
        defaultValue={draftValues?.directory}
        info="The project folder will be created inside this directory."
        storeValue
        title="Directory"
        {...itemProps.directory}
      />
      <Form.TextField
        autoFocus
        defaultValue={draftValues?.name}
        info="The name of the project folder."
        placeholder="my-new-app"
        title="Project"
        {...itemProps.name}
      />
      {/* <Form.Separator /> */}
      {/* <Form.Description text="" /> */}
      <Form.Dropdown defaultValue={draftValues?.template} title="Template" {...itemProps.template}>
        <Form.Dropdown.Item title="SvelteKit Demo App" value="default" />
        <Form.Dropdown.Item title="Skeleton Project" value="skeleton" />
        <Form.Dropdown.Item title="Library Project" value="skeletonlib" />
      </Form.Dropdown>
      <Form.Dropdown defaultValue={draftValues?.types} title="Types" {...itemProps.types}>
        <Form.Dropdown.Item title="Javascript with JSDoc comments" value="checkjs" />
        <Form.Dropdown.Item title="TypeScript" value="typescript" />
        <Form.Dropdown.Item title="None" value="null" />
      </Form.Dropdown>
      <Form.Checkbox
        defaultValue={draftValues?.eslint}
        label="Add ESLint for code linting"
        title="ESLint"
        {...itemProps.eslint}
      />
      <Form.Checkbox
        defaultValue={draftValues?.prettier}
        label="Add Prettier for code formatting"
        title="Prettier"
        {...itemProps.prettier}
      />
      <Form.Checkbox
        defaultValue={draftValues?.playwright}
        label="Add Playwright for browser testing"
        title="Playwright"
        {...itemProps.playwright}
      />
      <Form.Checkbox
        defaultValue={draftValues?.vitest}
        label="Add Vitest for unit testing"
        title="Vitest"
        {...itemProps.vitest}
      />
      <Form.Checkbox
        defaultValue={draftValues?.svelte5}
        label="Try the Svelte 5 preview (unstable!)"
        title="Svelte 5"
        {...itemProps.svelte5}
      />
    </Form>
  );
}
