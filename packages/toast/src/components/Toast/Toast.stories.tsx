import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";

import {
  allModes,
  OverlayOrDialogDecorator,
} from "@gc-digital-talent/storybook-helpers";

import toast from "../../toast";
import Toast from "./Toast";
import "./toast.css";
import { Link } from "@gc-digital-talent/ui";

const meta = {
  component: Toast,
  argTypes: {
    disableTransition: { control: "boolean" },
    autoClose: { control: "boolean" },
  },
  args: {
    disableTransition: true,
    autoClose: false,
  },
  decorators: [OverlayOrDialogDecorator],
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
      delay: 1500,
    },
  },
} satisfies Meta<typeof Toast>;
export default meta;

type Story = StoryObj<typeof Toast>;

const ToastWithLink = () => (
  <>
    Toast info with{" "}
    <Link href="https://talent.canada.ca" newTab>
      link
    </Link>
  </>
);

const Template = () => {
  useEffect(() => {
    setTimeout(() => {
      toast.info("Toast info text", { autoClose: false });
      toast.info(<ToastWithLink />, {
        autoClose: false,
      });
      toast.info(
        "Toast info with three sentences. Text sentence two. Toast text sentence three.",
        { autoClose: false },
      );
      toast.success("Toast success text", { autoClose: false });
      toast.warning("Toast warning text", { autoClose: false });
    }, 100);
  }, []);
  return <Toast />;
};

export const Default: Story = {
  render: () => <Template />,
};
