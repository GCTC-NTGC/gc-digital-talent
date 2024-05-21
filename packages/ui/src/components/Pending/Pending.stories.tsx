import { useState, useEffect } from "react";
import { StoryFn, Meta } from "@storybook/react";
import type { CombinedError } from "urql";
import isChromatic from "chromatic/isChromatic";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import NotFound from "../NotFound";
import Pending, { PendingProps } from "./Pending";

type PendingArgs = Omit<PendingProps, "error"> & {
  wait?: number;
  error?: boolean | PendingProps["error"];
  notFound?: string;
};

export default {
  component: Pending,
  decorators: [OverlayOrDialogDecorator],
  argTypes: {
    pause: {
      name: "pause",
      type: { name: "boolean", required: false },
    },
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
  parameters: {
    chromatic: { delay: 1500 },
  },
} as Meta;

const TemplatePending: StoryFn<PendingArgs> = (args) => {
  const [isLoading, setLoading] = useState<boolean>(true);

  const { wait, error, notFound, pause } = args;

  const combinedError = error
    ? ({
        name: "Error",
        message: "There was an error fetching content.",
      } as CombinedError)
    : undefined;

  // Fake a network request
  useEffect(() => {
    if (wait) {
      setTimeout(() => {
        setLoading(false);
      }, wait);
    }
  }, [wait, setLoading]);

  return (
    <Pending fetching={isLoading} error={combinedError} pause={pause}>
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

PendingFetching.args = {
  pause: isChromatic(),
};

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
