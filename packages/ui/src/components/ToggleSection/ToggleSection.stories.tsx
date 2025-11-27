import type { StoryFn, Meta } from "@storybook/react-vite";
import AcademicCapIcon from "@heroicons/react/24/solid/AcademicCapIcon";
import { action } from "storybook/actions";

import Button from "../Button";
import ToggleSection from "./ToggleSection";

const Toggle = () => {
  const context = ToggleSection.useContext();

  return (
    <ToggleSection.Trigger>
      <Button mode="inline">{context?.open ? "Close" : "Open"} section</Button>
    </ToggleSection.Trigger>
  );
};

interface ToggleSectionRootAndHeader
  extends React.ComponentPropsWithoutRef<typeof ToggleSection.Root> {}

export default {
  component: ToggleSection.Root,
} as Meta;

const Template: StoryFn<ToggleSectionRootAndHeader> = () => {
  return (
    <ToggleSection.Root onOpenChange={(open) => action("onOpenToggle")(open)}>
      <ToggleSection.Header icon={AcademicCapIcon} toggle={<Toggle />}>
        Toggle section header
      </ToggleSection.Header>
      <ToggleSection.Content className="text-center">
        <ToggleSection.InitialContent>
          <p>The initial content.</p>
          <ToggleSection.Open>
            <Button mode="inline">Open</Button>
          </ToggleSection.Open>
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <p>The open content.</p>
          <ToggleSection.Close>
            <Button mode="inline">Close</Button>
          </ToggleSection.Close>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export const Default = Template.bind({});

const NestedTemplate: StoryFn<ToggleSectionRootAndHeader> = () => {
  return (
    <ToggleSection.Root onOpenChange={(open) => action("onOpenToggle")(open)}>
      <ToggleSection.Header icon={AcademicCapIcon} toggle={<Toggle />}>
        Toggle section header
      </ToggleSection.Header>
      <ToggleSection.Content className="text-center">
        <ToggleSection.InitialContent>
          <p>The initial content.</p>
          <ToggleSection.Open>
            <Button mode="inline">Open main content</Button>
          </ToggleSection.Open>
          <ToggleSection.Root>
            <ToggleSection.Trigger>
              <Button mode="inline">Toggle nested content</Button>
            </ToggleSection.Trigger>
            <ToggleSection.Content className="text-center">
              <ToggleSection.InitialContent>
                <p>The nested initial content.</p>
              </ToggleSection.InitialContent>
              <ToggleSection.OpenContent>
                <p>The nested open content.</p>
              </ToggleSection.OpenContent>
            </ToggleSection.Content>
          </ToggleSection.Root>
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <p>The open content.</p>
          <ToggleSection.Close>
            <Button mode="inline">Close</Button>
          </ToggleSection.Close>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export const Nested = NestedTemplate.bind({});
