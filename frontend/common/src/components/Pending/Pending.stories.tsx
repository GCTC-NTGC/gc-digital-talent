import React from "react";
import { Story, Meta } from "@storybook/react";
import type { CombinedError } from "urql";
import Pending from "./Pending";
import NotFound from "../NotFound";
import OverlayOrDialogDecorator from "../../../.storybook/decorators/OverlayOrDialogDecorator";

export default {
  component: Pending,
  title: "Components/Pending",
  decorators: [OverlayOrDialogDecorator],
  argTypes: {
    wait: {
      name: "wait",
      type: { name: "number", required: false },
    },
    error: {
      name: "error",
      type: { name: "boolean", required: false },
    },
    notFound: {
      name: "notFound",
      type: { name: "string", required: false },
    },
  },
} as Meta;

const TemplatePending: Story = (args) => {
  const [isLoading, setLoading] = React.useState<boolean>(true);

  const { wait, error, notFound } = args;

  const combinedError = error
    ? ({
        name: "Error",
        message: "There was an error fetching content.",
      } as CombinedError)
    : undefined;

  // Fake a network request
  React.useEffect(() => {
    if (wait) {
      setTimeout(() => {
        setLoading(false);
      }, wait);
    }
  }, [wait, setLoading]);

  return (
    <Pending fetching={isLoading} error={combinedError}>
      {notFound ? (
        <NotFound headingMessage="Not Found">{notFound}</NotFound>
      ) : (
        <p>Finished Loading!</p>
      )}
    </Pending>
  );
};

export const PendingFetching = TemplatePending.bind({});
export const PendingError = TemplatePending.bind({});
export const PendingNotFound = TemplatePending.bind({});
export const PendingSuccess = TemplatePending.bind({});

PendingFetching.args = {};

PendingError.args = {
  wait: 1000,
  error: true,
};

PendingNotFound.args = {
  wait: 1000,
  notFound: "Nothing found.",
};

PendingSuccess.args = {
  wait: 1000,
};
