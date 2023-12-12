import React from "react";
import { useIntl } from "react-intl";

import { useTheme } from "@gc-digital-talent/theme";
import { AlertImage } from "@gc-digital-talent/ui";

import lightImage from "~/assets/img/Holiday_2023_graphic_Light_mode.webp";
import darkImage from "~/assets/img/Holiday_2023_graphic_darkmode.webp";

const HolidayAlert = (): JSX.Element | null => {
  const { mode } = useTheme();
  const intl = useIntl();

  const dateNow = new Date();
  const endOfAlertTime = new Date("2024-01-08 12:00:00");
  const holidayAlertActive = dateNow.getTime() < endOfAlertTime.getTime();

  const message = (
    <div
      data-h2-justify-content="base(space-between)"
      data-h2-max-height="base(100%)"
    >
      <h2>
        {intl.formatMessage({
          defaultMessage: "Happy Holidays!",
          id: "tQseOY",
          description: "Happy holidays, seasons greetings heading",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage: "It's time for a well-deserved break; you earned it!",
          id: "Z72V0g",
          description: "Message conveying time to relax",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "There will be no job postings during the holidays (Dec 22-Jan 7).",
          id: "Vfj62k",
          description:
            "There will be no new postings over the holiday stretch, December 22 through January 7th",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "So kick back, relax, and enjoy the holiday season with your loved ones.",
          id: "nE+RKq",
          description:
            "Message suggesting the user relax and enjoy the holiday season",
        })}
      </p>
    </div>
  );

  if (holidayAlertActive) {
    return (
      <AlertImage
        message={message}
        image={mode === "dark" ? darkImage : lightImage}
      />
    );
  }
  return null;
};

export default HolidayAlert;
