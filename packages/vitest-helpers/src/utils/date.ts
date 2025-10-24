import { within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

const changeDate = async (
  container: HTMLElement,
  update: {
    year?: string;
    month?: string;
    day?: string;
  },
) => {
  const user = userEvent.setup();

  if (update.year) {
    const year = within(container).getByRole("spinbutton", { name: /year/i });
    await user.clear(year);
    await user.type(year, update.year);
  }

  if (update.month) {
    const month = within(container).getByRole("combobox", { name: /month/i });
    await user.selectOptions(month, update.month);
  }

  if (update.day) {
    const day = within(container).getByRole("spinbutton", { name: /day/i });
    await user.clear(day);
    await user.type(day, update.day);
  }
};

export default changeDate;
