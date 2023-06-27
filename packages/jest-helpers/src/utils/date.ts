import { fireEvent, within } from "@testing-library/react";

const changeDate = (
  container: HTMLElement,
  update: {
    year?: string;
    month?: string;
    day?: string;
  },
) => {
  if (update.year) {
    const year = within(container).getByRole("spinbutton", { name: /year/i });
    fireEvent.change(year, { target: { value: update.year } });
  }

  if (update.month) {
    const month = within(container).getByRole("combobox", { name: /month/i });
    fireEvent.change(month, { target: { value: update.month } });
  }

  if (update.day) {
    const day = within(container).getByRole("spinbutton", { name: /day/i });
    fireEvent.change(day, { target: { value: update.day } });
  }
};

export default changeDate;
