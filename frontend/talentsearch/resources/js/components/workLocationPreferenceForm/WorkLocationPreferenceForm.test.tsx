/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { IntlProvider, MessageFormatElement } from "react-intl";
import { render, screen, fireEvent } from "../../tests/testUtils";
import { WorkLocationPreferenceForm } from "./WorkLocationPreferenceForm";

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

const onClick = jest.fn();

const renderWorkLocationPreference = () => {
  return renderWithReactIntl(
    <WorkLocationPreferenceForm handleSubmit={onClick} />,
  );
};

describe("Work Location Preference Form tests", () => {
  test("Can't submit unless form is valid (at least one location selected)", () => {
    renderWorkLocationPreference();
    const saveAndGoButton = screen.getByText("Save and go back");
    fireEvent.click(saveAndGoButton);
    expect(saveAndGoButton).toBeTruthy();
    expect(onClick).not.toBeCalled();
    expect(onClick).toHaveBeenCalledTimes(0);
  });

  test("Form submits data in correct shape to submit handler when Save Changes is clicked.", () => {});
});
