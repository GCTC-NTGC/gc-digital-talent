/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { fireEvent, act, screen } from "@testing-library/react";

/**
 * Selects first available option from a given SelectField, or a specific option when label provided.
 * @param fieldLabel label of filter to choose option from.
 * @param optionLabel label for dropdown option to select. (optional)
 */
export const selectFilterOption = async (
  fieldLabel: string | RegExp,
  optionLabel?: string,
) => {
  fireEvent.mouseDown(
    await screen.getByRole("combobox", { name: fieldLabel }),
    {
      button: 0,
    },
  );
  const elem = optionLabel
    ? await screen.getByText(optionLabel)
    : document.body.querySelector(".react-select__menu");
  if (elem)
    fireEvent.keyDown(elem, {
      keyCode: 13,
      key: "Enter",
    });
};

/**
 * Run submitting for a filter dialog
 */
export const submitFilters = async () => {
  await act(async () => {
    fireEvent.click(
      await screen.getByRole("button", { name: /show results/i }),
    );
  });
};
