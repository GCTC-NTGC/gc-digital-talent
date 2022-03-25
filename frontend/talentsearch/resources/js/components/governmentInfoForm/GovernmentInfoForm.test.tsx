/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import { fakeClassifications } from "@common/fakeData";
import GovInfoFormContainer from "./GovernmentInfoForm";
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

function renderGovernmentInfoForm() {
  return renderWithReactIntl(<GovInfoFormContainer />);
}

test("Test form display rendering", async () => {
  renderGovernmentInfoForm();

  const button = screen.getByText("Yes, I am a Government of Canada employee");
  const studentNotPresent = screen.queryByText("I am a student");
  expect(studentNotPresent).toBeNull();
  fireEvent.click(button); // Open the second form
  expect(screen.getByText("I am a student")).toBeTruthy();

  const button2 = screen.getByText("I have a term position");
  fireEvent.click(button2); // Open the other forms
  expect(
    screen.getByText(
      "Please indicate if you are interested in lateral deployment or secondment. Learn more about this.",
    ),
  ).toBeTruthy();
  expect(screen.getByText("Current Classification Level")).toBeTruthy();
});

test("Test form data", async () => {
  renderGovernmentInfoForm();

  const button = screen.getByText("Yes, I am a Government of Canada employee");
  fireEvent.click(button); // Open the second form

  const button2 = screen.getByText("I have a term position");
  fireEvent.click(button2); // Open the other forms

  const button3 = screen.getByLabelText("Current Classification Group");
});
