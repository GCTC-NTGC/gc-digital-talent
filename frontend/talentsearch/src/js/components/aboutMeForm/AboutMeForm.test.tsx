/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";
import { fakeUsers } from "@common/fakeData";
import { render, axeTest } from "@common/helpers/testUtils";
import { AboutMeForm, AboutMeFormProps } from "./AboutMeForm";

const mockUser = fakeUsers()[0];

const renderAboutMeForm = ({
  initialUser,
  onUpdateAboutMe,
}: AboutMeFormProps) =>
  render(
    <AboutMeForm initialUser={initialUser} onUpdateAboutMe={onUpdateAboutMe} />,
  );

describe("AboutMeForm", () => {
  it("should have no accessibility errors", async () => {
    const mockSave = jest.fn();
    await act(async () => {
      const { container } = renderAboutMeForm({
        initialUser: mockUser,
        onUpdateAboutMe: mockSave,
      });
      await axeTest(container);
    });
  });

  it("should render fields", async () => {
    const mockSave = jest.fn();

    await act(async () => {
      renderAboutMeForm({
        initialUser: mockUser,
        onUpdateAboutMe: mockSave,
      });
    });

    expect(
      await screen.getByRole("combobox", {
        name: /communication/i,
      }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("combobox", {
        name: /interview/i,
      }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("combobox", {
        name: /exam/i,
      }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("combobox", { name: /province/i }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("textbox", { name: /city/i }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("textbox", { name: /telephone/i }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("textbox", { name: /first name/i }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("textbox", { name: /last name/i }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("textbox", { name: /email/i }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("radio", {
        name: /I am not a member of the CAF/i,
      }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("radio", {
        name: /I am an active member of the CAF/i,
      }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("radio", {
        name: /I am a veteran of the CAF/i,
      }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("radio", {
        name: /I am a Canadian citizen/i,
      }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("radio", {
        name: /I am a permanent resident of Canada/i,
      }),
    ).toBeInTheDocument();

    expect(
      await screen.getByRole("radio", {
        name: /Other/i,
      }),
    ).toBeInTheDocument();
  });

  it("Should not submit with empty fields.", async () => {
    const mockSave = jest.fn();
    await act(async () => {
      renderAboutMeForm({
        initialUser: {
          id: "",
          preferredLang: undefined,
          preferredLanguageForInterview: undefined,
          preferredLanguageForExam: undefined,
          currentProvince: undefined,
          currentCity: undefined,
          telephone: "",
          firstName: "",
          lastName: "",
          email: "",
          citizenship: null,
          armedForcesStatus: null,
        },
        onUpdateAboutMe: mockSave,
      });
    });

    fireEvent.submit(await screen.getByRole("button", { name: /save/i }));
    expect(await screen.findAllByRole("alert")).toHaveLength(12);
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("Should submit successfully with required fields", async () => {
    const mockSave = jest.fn(() => Promise.resolve(mockUser));

    act(() => {
      renderAboutMeForm({
        initialUser: mockUser,
        onUpdateAboutMe: mockSave,
      });
    });

    fireEvent.submit(await screen.getByRole("button", { name: /save/i }));
    await waitFor(() => {
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
