import { Action, ActionPanel, Form, LocalStorage } from "@raycast/api";
import { useState } from "react";
import { ICON_ROOT_KEY } from "./constants";

export interface SettingValues {
  root: string;
}

interface Props {
  onUpdate?(values: SettingValues): void;
}

export default function Settings({ onUpdate }: Props) {
  const [pendingRoot, setPendingRoot] = useState("");

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            onSubmit={async (values: SettingValues) => {
              LocalStorage.setItem(ICON_ROOT_KEY, values.root);
              onUpdate?.(values);
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="root"
        title="Root folder"
        placeholder="Enter path to the icon folder"
        value={pendingRoot}
        onChange={setPendingRoot}
      />
    </Form>
  );
}
