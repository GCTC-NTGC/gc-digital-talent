/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import {
  fakePoolCandidates,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { PoolCandidateStatus } from "@gc-digital-talent/graphql";

import {
  ApplicationStatusForm,
  type ApplicationStatusFormProps,
} from "./ApplicationStatusForm";

const mockApplications = fakePoolCandidates(1);
const mockApplication = mockApplications[0];
const mockSave = jest.fn();

const defaultProps: ApplicationStatusFormProps = {
  application: mockApplication,
  onSubmit: mockSave,
  isSubmitting: false,
};

const renderApplicationStatusForm = (props: ApplicationStatusFormProps) =>
  renderWithProviders(<ApplicationStatusForm {...props} />);

describe("ApplicationStatusForm", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderApplicationStatusForm(defaultProps);
    await axeTest(container);
  });

  it("should render fields", async () => {
    renderApplicationStatusForm(defaultProps);

    expect(
      screen.getByRole("combobox", { name: /candidate pool status/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("group", { name: /candidate expiry date/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("textbox", { name: /notes/i })).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });

  it("should submit with data", async () => {
    const mockSubmit = jest.fn();
    renderApplicationStatusForm({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: toLocalizedEnum(PoolCandidateStatus.QualifiedAvailable), // The Draft, DraftExpired, and Expired statuses are not valid options
      },
      onSubmit: mockSubmit,
    });

    const submitBtn = screen.getByRole("button", { name: /save changes/i });
    fireEvent.submit(submitBtn);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  it("should not submit without required data", async () => {
    const mockNoSubmit = jest.fn();
    renderApplicationStatusForm({
      ...defaultProps,
      onSubmit: mockNoSubmit,
      application: {
        ...mockApplication,
        status: undefined,
      },
    });

    const submitBtn = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(submitBtn);
    expect(mockNoSubmit).not.toHaveBeenCalled();
  });

  it("should have disabled submit with submitting", async () => {
    renderApplicationStatusForm({
      ...defaultProps,
      isSubmitting: true,
    });

    expect(screen.getByRole("button", { name: /saving.../i })).toBeDisabled();
  });
});
