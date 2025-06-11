import type { StoryFn } from "@storybook/react-vite";

// Helps Chromatic detect width for snapshots, as otherwise it just captures
// height of the button that opens dialog.
// See: https://www.chromatic.com/docs/faq#why-isn%E2%80%99t-my-modal-or-dialog-captured
export default function OverlayOrDialogDecorator(Story: StoryFn) {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Story />
    </div>
  );
}
