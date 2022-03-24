/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import { fakeClassifications } from "@common/fakeData";
import Form from "@common/components/form/BasicForm";
import GovernmentInfoForm, { FormValues } from "./GovernmentInfoForm";
import { Classification } from "../../api/generated";

const classificationsArray = fakeClassifications();

const renderWithReactIntl = (
  component: React.ReactNode,
  locale?: "en" | "fr",
  messages?: Record<string, string> | Record<string, MessageFormatElement[]>,
) => {
  return render(
    <IntlProvider locale={locale || "en"} messages={messages}>
      {component}
    </IntlProvider>,
  );
};

function renderGovernmentInfoForm(classifications: Classification[]) {
  return renderWithReactIntl(
    <Form
      onSubmit={(data: FormValues) => {
        return null;
      }}
    >
      <GovernmentInfoForm classifications={classifications} />
    </Form>,
  );
}

test("Test form display rendering", async () => {
  renderGovernmentInfoForm(classificationsArray);

  const button = screen.getByText("Yes, I am a Government of Canada employee");
  expect(screen.getByText("I am a student")).toBeFalsy();
  fireEvent.click(button); // Open the second form
  expect(screen.getByText("I am a student")).toBeTruthy();

  const button2 = screen.getByText("I have a term position");
  expect(screen.getByText("Level")).toBeFalsy();
  fireEvent.click(button2); // Open the other forms
  expect(
    screen.getByText(
      "Please indicate if you are interested in lateral deployment or secondment. Learn more about this.",
    ),
  ).toBeTruthy();
  expect(screen.getByText("Level")).toBeTruthy();
});
