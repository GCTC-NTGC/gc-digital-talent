/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { IntlProvider, MessageFormatElement } from "react-intl";
import { Language, User, WorkRegion } from "../../api/generated";
import { render, screen, fireEvent, act } from "../../tests/testUtils";
import { WorkLocationPreferenceForm } from "./WorkLocationPreferenceForm";

const renderWithReactIntl = (
  component: React.ReactNode,
  locale?: "en" | "fr",
  messages?: Record<string, string> | Record<string, MessageFormatElement[]>,
) => {
  return act(() => {
    render(
      <IntlProvider locale={locale || "en"} messages={messages}>
        {component}
      </IntlProvider>,
    );
  });
};

const user: User = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  telephone: "+867365373244",
  preferredLang: Language.En,
  locationPreferences: [WorkRegion.Atlantic],
  locationExemptions: "",
};

const onClick = jest.fn();

const renderWorkLocationPreference = () => {
  return renderWithReactIntl(
    <WorkLocationPreferenceForm
      initialData={user}
      handleWorkLocationPreference={onClick}
    />,
  );
};

describe("Work Location Preference Form tests", () => {
  test("Can't submit unless form is valid (at least one location selected)", async () => {
    renderWorkLocationPreference();
    const saveAndGoButton = screen.getByText("Save and go back");
    act(() => {
      fireEvent.click(saveAndGoButton);
    });
    expect(saveAndGoButton).toBeTruthy();
    expect(onClick).not.toBeCalled();
    expect(onClick).toHaveBeenCalledTimes(0);
  });

  test("Can submit the form if at least one location is selected", async () => {
    renderWorkLocationPreference();

    const checkbox1 = screen.getByRole("checkbox", {
      name: /Virtual: Work from home/i,
    });
    expect(checkbox1).toBeTruthy();

    const saveAndGoButton = screen.getByRole("button", {
      name: /Save and go back/i,
    });
    expect(saveAndGoButton).toBeTruthy();

    const selectInput = screen.findByRole("checkbox", {
      name: "workLocations",
    });
    expect(selectInput).toBeTruthy();

    act(() => {
      fireEvent.click(checkbox1);
    });
    act(() => {
      fireEvent.click(saveAndGoButton);
    });
  });

  test("Form submits data in correct shape to submit handler when Save Changes is clicked.", () => {
    renderWorkLocationPreference();

    const saveAndGoButton = screen.getByRole("button", {
      name: /Save and go back/i,
    });
    expect(saveAndGoButton).toBeTruthy();

    const checkbox1 = screen.getByRole("checkbox", {
      name: /Virtual: Work from home/i,
    });
    expect(checkbox1).toBeInTheDocument();
    act(() => {
      fireEvent.click(checkbox1);
    });
    act(() => {
      fireEvent.click(saveAndGoButton);
    });
    const checkbox2 = screen.getByRole("checkbox", {
      name: /National Capital Region: Ottawa/i,
    });
    expect(checkbox2).toBeTruthy();
    act(() => {
      fireEvent.click(checkbox2);
    });
    act(() => {
      fireEvent.click(saveAndGoButton);
    });
    const checkbox3 = screen.getByRole("checkbox", {
      name: /Atlantic Region: New Brunswick/i,
    });
    expect(checkbox3).toBeTruthy();
    act(() => {
      fireEvent.click(checkbox3);
    });
    act(() => {
      fireEvent.click(saveAndGoButton);
    });
    const checkbox4 = screen.getByRole("checkbox", {
      name: /Quebec Region: excluding Gatineau/i,
    });
    expect(checkbox4).toBeTruthy();

    act(() => {
      fireEvent.click(checkbox4);
    });
    act(() => {
      fireEvent.click(saveAndGoButton);
    });
    const checkbox5 = screen.getByRole("checkbox", {
      name: /Ontario Region: excluding Ottawa/i,
    });
    expect(checkbox5).toBeTruthy();

    act(() => {
      fireEvent.click(checkbox5);
    });
    act(() => {
      fireEvent.click(saveAndGoButton);
    });
    const checkbox6 = screen.getByRole("checkbox", {
      name: /Prairie Region: Manitoba, Saskatchewan/i,
    });
    expect(checkbox6).toBeTruthy();
    act(() => {
      fireEvent.click(checkbox6);
    });
    act(() => {
      fireEvent.click(saveAndGoButton);
    });
    const checkbox7 = screen.getByRole("checkbox", {
      name: /British Columbia Region/i,
    });
    expect(checkbox7).toBeTruthy();
    act(() => {
      fireEvent.click(checkbox7);
    });
    act(() => {
      fireEvent.click(saveAndGoButton);
    });
    const checkbox8 = screen.getByRole("checkbox", {
      name: /North Region: Yukon/i,
    });
    expect(checkbox8).toBeTruthy();
    act(() => {
      fireEvent.click(checkbox8);
    });
    act(() => {
      fireEvent.click(saveAndGoButton);
    });
    const textarea1 = screen.getByLabelText(/Location exemptions/i);
    act(() => {
      fireEvent.change(textarea1, { target: { value: "Woodstock" } });
    });
    expect(textarea1).toHaveValue("Woodstock");
  });
});
