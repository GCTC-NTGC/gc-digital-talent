/**
 * @jest-environment jsdom
 */
import { BasicForm } from "@common/components/form";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import React from "react";
import { IntlProvider, MessageFormatElement } from "react-intl";
import { fakeClassifications, fakeUsers } from "@common/fakeData";
import { Classification } from "@common/api/generated";

import GovInfoFormContainer, { GovernmentInfoForm } from "./GovernmentInfoForm";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";

const renderWithReactIntl = (
  component: React.ReactNode,
  locale?: "en" | "fr",
  messages?: Record<string, string> | Record<string, MessageFormatElement[]>,
) => {
  return (
    <IntlProvider locale={locale || "en"} messages={messages}>
      {component}
    </IntlProvider>
  );
};

let container: HTMLDivElement;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

test("Test form display rendering", async () => {
  // timeout for hopefully things to load first then test?
  act(() => {
    render(renderWithReactIntl(<GovInfoFormContainer />));
  });
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((r) => setTimeout(r, 1000));

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
  expect(screen.getByText("Current Classification Group")).toBeTruthy();
});

// used Eric's AboutMe component to add further stuff below this point
// aboutMeForm/AboutMeForm.test.tsx
const mockClassifications = fakeClassifications();
const mockUser = fakeUsers()[0];

const mockSave = jest.fn(() => Promise.resolve(mockUser));

type renderGovInfoProps = {
  classificationsArray: Classification[];
  updateFunction: () => void;
};

const renderGovInfoForm = ({
  classificationsArray,
  updateFunction,
}: renderGovInfoProps) => (
  <>
    {renderWithReactIntl(
      <BasicForm
        onSubmit={updateFunction}
        options={{ defaultValues: { govEmployeeYesNo: "no" } }}
      >
        <GovernmentInfoForm classifications={classificationsArray} />
        <ProfileFormFooter mode="saveButton" />
      </BasicForm>,
    )}
  </>
);

it("Should submit successfully with required fields", async () => {
  act(() => {
    render(
      renderGovInfoForm({
        classificationsArray: mockClassifications,
        updateFunction: mockSave,
      }),
    );
  });

  fireEvent.submit(screen.getByRole("button", { name: /save/i }));
  await waitFor(() => {
    expect(mockSave).toHaveBeenCalled();
  });
});
