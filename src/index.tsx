import { Action, ActionPanel, Form, Grid, Icon, LocalStorage } from "@raycast/api";
import glob from "glob-promise";
import path from "path";
import { useEffect, useState } from "react";
import { ICON_ROOT_KEY } from "./constants";
import Settings from "./Settings";

export default function Command() {
  const [iconRoot, setIconRoot] = useState<string>();
  useEffect(() => {
    LocalStorage.getItem<string>(ICON_ROOT_KEY).then((root) => setIconRoot(root));
  }, []);

  const [itemSize, setItemSize] = useState<Grid.ItemSize>(Grid.ItemSize.Small);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    if (!iconRoot) return;
    glob.promise("**/*.@(svg|jpe?g|png)", { cwd: iconRoot, absolute: true }).then(setFiles);
  }, [iconRoot]);

  if (!iconRoot) {
    return (
      <Settings
        onUpdate={(values) => {
          setIconRoot(values.root);
        }}
      />
    );
  }

  return (
    <Grid
      itemSize={itemSize}
      inset={Grid.Inset.Large}
      isLoading={isLoading}
      searchBarAccessory={
        <Grid.Dropdown
          tooltip="Grid Item Size"
          storeValue
          onChange={(newValue) => {
            setItemSize(newValue as Grid.ItemSize);
            setIsLoading(false);
          }}
        >
          <Grid.Dropdown.Item title="Small" value={Grid.ItemSize.Small} />
          <Grid.Dropdown.Item title="Medium" value={Grid.ItemSize.Medium} />
          <Grid.Dropdown.Item title="Large" value={Grid.ItemSize.Large} />
        </Grid.Dropdown>
      }
    >
      {files.map((file) => {
        const name = path.basename(file, path.extname(file));
        return (
          <Grid.Item
            key={name}
            content={file}
            title={name}
            subtitle={name}
            actions={
              // TODO Allow to configure pattern
              <ActionPanel>
                <Action.CopyToClipboard title="Copy Element" content={`<Icons.${name} />`} />
                <Action.OpenInBrowser url={file} />
                <Action
                  title="Reset Root Folder"
                  icon={Icon.RotateAntiClockwise}
                  onAction={() => {
                    LocalStorage.setItem(ICON_ROOT_KEY, "");
                    setIconRoot("");
                  }}
                />
              </ActionPanel>
            }
          />
        );
      })}
    </Grid>
  );
}
