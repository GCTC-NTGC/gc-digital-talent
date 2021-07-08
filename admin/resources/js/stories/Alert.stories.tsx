import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Alert from "../components/H2Components/Alert";

export default {
  component: Alert,
  title: "Components/Alert",
  argTypes: {
    title: {
      control: { type: "text" },
    },
    body: {
      control: { type: "text" },
    },
    color: {
      table: {
        disable: true,
      },
    },
    dismissBtn: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const TemplateAlert: Story = (args) => {
  const { position, color, title, body } = args;
  return (
    <Alert
      position={position}
      color={color}
      dismissBtn={
        <Alert.DismissBtn onClick={action("Dismiss")}>Dismiss</Alert.DismissBtn>
      }
    >
      <p>{title}</p>
      <p>{body}</p>
    </Alert>
  );
};

const TemplateAlertTrigger: Story = (args) => {
  const { position, color, title, body } = args;
  const [showAlert, setShowAlert] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          setShowAlert(true);
        }}
      >
        Trigger alert
      </button>
      <button
        type="button"
        onClick={() => {
          setShowAlert(false);
        }}
      >
        Hide alert
      </button>
      {showAlert && (
        <Alert
          position={position}
          color={color}
          dismissBtn={
            <Alert.DismissBtn onClick={action("Dismiss")}>
              Dismiss
            </Alert.DismissBtn>
          }
        >
          <p>{title}</p>
          <p>{body}</p>
        </Alert>
      )}
    </>
  );
};

export const Informational = TemplateAlert.bind({});
export const Error = TemplateAlert.bind({});
export const AlertTrigger = TemplateAlertTrigger.bind({});

Informational.args = {
  position: "static",
  color: "blue",
  title: "Something To Be Aware Of",
  body: "Please note the information here before continuing.",
};

Error.args = {
  position: "static",
  color: "pink",
  title: "Something Went Wrong",
  body: "Please fix something before continuing.",
};

AlertTrigger.args = {
  position: "toast",
  color: "pink",
  title: "Something Went Wrong",
  body: "Please fix something before continuing.",
};
