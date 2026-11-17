import ArchiveBoxIcon from "@heroicons/react/24/outline/ArchiveBoxIcon";
import ArrowDownTrayIcon from "@heroicons/react/24/outline/ArrowDownTrayIcon";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import NoSymbolIcon from "@heroicons/react/24/outline/NoSymbolIcon";
import type { StoryFn, Meta } from "@storybook/react-vite";

import {
  GLOBAL_A11Y_EXCLUDES,
  allModes,
} from "@gc-digital-talent/storybook-helpers";

import IconButton from "../Button/IconButton";
import Tooltip from "../Tooltip/Tooltip";
import Toolbar from "./Toolbar";

export default {
  component: Toolbar.Root,
  decorators: [
    (Story) => (
      <div className="p-12">
        <Story />
      </div>
    ),
  ],
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
    a11y: {
      context: {
        exclude: [...GLOBAL_A11Y_EXCLUDES],
      },
    },
  },
} as Meta;

const bordered =
  "rounded-md border border-gray-500 px-6 py-3 dark:border-gray-300";

export const Default: StoryFn<typeof Toolbar.Root> = () => (
  <Toolbar.Root aria-label="Bulk actions" className={bordered}>
    <Toolbar.Button
      render={
        <IconButton color="black" icon={ArrowDownTrayIcon} label="Download" />
      }
    />
    <Toolbar.Separator />
    <Toolbar.Group aria-label="Mark as">
      <Toolbar.Button
        render={
          <IconButton color="black" icon={BookmarkSquareIcon} label="Refer" />
        }
      />
      <Toolbar.Button
        render={
          <IconButton color="black" icon={ArchiveBoxIcon} label="Archive" />
        }
      />
      <Toolbar.Button
        render={
          <IconButton color="black" icon={NoSymbolIcon} label="Not selected" />
        }
      />
    </Toolbar.Group>
  </Toolbar.Root>
);

export const WithTooltips: StoryFn<typeof Toolbar.Root> = () => (
  <Tooltip.Provider>
    <Toolbar.Root aria-label="Bulk actions" className={bordered}>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <Toolbar.Button
              render={
                <IconButton
                  color="black"
                  icon={BookmarkSquareIcon}
                  label="Refer"
                />
              }
            />
          }
        />
        <Tooltip.Popup>Refer</Tooltip.Popup>
      </Tooltip.Root>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <Toolbar.Button
              render={
                <IconButton
                  color="black"
                  icon={ArchiveBoxIcon}
                  label="Archive"
                />
              }
            />
          }
        />
        <Tooltip.Popup>Archive</Tooltip.Popup>
      </Tooltip.Root>
    </Toolbar.Root>
  </Tooltip.Provider>
);
