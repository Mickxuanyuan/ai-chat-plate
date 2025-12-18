import type { Meta, StoryObj } from "@storybook/react";
import ThemeProvider, { useTheme } from "./ThemeProvider";

const meta: Meta<typeof ThemeProvider> = {
  title: "app/ThemeProvider",
  component: ThemeProvider,
  args: {
    defaultMode: "system",
    storageKey: "theme-mode",
    attribute: "class",
    children: null,
  },
};

export default meta;
type Story = StoryObj<typeof ThemeProvider>;

function Demo() {
  const { mode, resolvedTheme, setMode } = useTheme();
  return (
    <div className="p-4">
      <div className="text-sm">
        mode: {mode} / resolved: {resolvedTheme}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="rounded border px-3 py-1 text-sm"
          onClick={() => setMode("system")}
        >
          system
        </button>
        <button
          type="button"
          className="rounded border px-3 py-1 text-sm"
          onClick={() => setMode("light")}
        >
          light
        </button>
        <button
          type="button"
          className="rounded border px-3 py-1 text-sm"
          onClick={() => setMode("dark")}
        >
          dark
        </button>
      </div>
    </div>
  );
}

export const Basic: Story = {
  render: (args) => (
    <ThemeProvider {...args}>
      <Demo />
    </ThemeProvider>
  ),
};
