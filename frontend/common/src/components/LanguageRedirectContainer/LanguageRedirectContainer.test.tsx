/**
 * @jest-environment jsdom
 */

import React from "react";
import { screen, render } from "@testing-library/react";
import { FormattedMessage } from "react-intl";
import { createPath } from "history";
import { HISTORY } from "../../helpers/router";
import LanguageRedirectContainer from ".";

function renderContainer() {
  return render(
    <LanguageRedirectContainer messages={{ hello: "Bonjour" }}>
      <div>
        {/* eslint-disable-next-line formatjs/no-id */}
        <FormattedMessage id="hello" defaultMessage="Hello" />
      </div>
    </LanguageRedirectContainer>,
  );
}

describe("LanguageRedirectContainer tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("If url starts with /en, should render english messages", async () => {
    HISTORY.push("/en/home");
    renderContainer();
    const element = screen.getByText("Hello");
    expect(element).toBeTruthy();
  });
  test("If url starts with /fr, should render french messages", async () => {
    HISTORY.push("/fr/home");
    renderContainer();
    const element = screen.getByText("Bonjour");
    expect(element).toBeTruthy();
  });
  test("If url starts with /en, should put stored_locale=en in localStorage", async () => {
    HISTORY.push("/en/home");
    renderContainer();
    expect(localStorage.getItem("stored_locale")).toBe("en");
  });
  test("If url starts with /fr, should put stored_locale=fr in localStorage", async () => {
    HISTORY.push("/fr/home");
    renderContainer();
    expect(localStorage.getItem("stored_locale")).toBe("fr");
  });
  test("If url doesn't start with a lang, it should be redirected to '/en/...' by default", async () => {
    HISTORY.push("/home");
    renderContainer();
    expect(createPath(HISTORY.location)).toBe("/en/home");
  });
  test("If url doesn't start with a lang but localStorage.stored_locale == fr, then redirect to '/fr/...'", () => {
    localStorage.setItem("stored_locale", "fr");
    HISTORY.push("/home");
    renderContainer();
    expect(createPath(HISTORY.location)).toBe("/fr/home");
  });
  test("If localeStorage is empty and navigator.language returns fr, redirect to '/fr/...'", async () => {
    const languageGetter = jest.spyOn(navigator, "language", "get");
    languageGetter.mockReturnValue("fr");
    HISTORY.push("/home");
    renderContainer();
    expect(createPath(HISTORY.location)).toBe("/fr/home");
  });
  test("If localeStorage is empty and navigator.language returns anything besides fr, redirect to '/en/...'", async () => {
    const languageGetter = jest.spyOn(navigator, "language", "get");
    languageGetter.mockReturnValue("de");
    HISTORY.push("/home");
    renderContainer();
    expect(createPath(HISTORY.location)).toBe("/en/home");
  });
  test("After being redirected to /fr/... french messages should be rendered and localeStorage.stored_locale should be set", () => {
    localStorage.setItem("stored_locale", "fr");
    HISTORY.push("/home");
    renderContainer();
    const element = screen.getByText("Bonjour");
    expect(element).toBeTruthy();
    expect(localStorage.getItem("stored_locale")).toBe("fr");
  });
  test("If url has a search query it should be preserved", async () => {
    HISTORY.push("/home?token=xyz");
    renderContainer();
    expect(createPath(HISTORY.location)).toBe("/en/home?token=xyz");
  });
});
