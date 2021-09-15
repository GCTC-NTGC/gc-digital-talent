import { Meta } from "@storybook/react";
import React from "react";
import Button from "./Button";

export default {
  title: "Components/Button",
  component: Button,
} as Meta;

export const PrimaryButton = () => (
  <Button color="primary" mode="solid">
    Button
  </Button>
);
