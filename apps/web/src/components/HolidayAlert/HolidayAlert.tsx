import React from "react";
import { useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";
import AlertTwoSections from "@gc-digital-talent/ui/src/components/AlertTwoSections/AlertTwoSections";

import lightImage from "~/assets/img/holiday_2023_graphic_light.webp";
import darkImage from "~/assets/img/holiday_2023_graphic_dark.webp";

const HolidayAlert = (): JSX.Element | null => {
  const intl = useIntl();

  const dateNow = new Date();
  const endOfAlertTime = new Date("2024-01-08 12:00:00");
  const holidayAlertActive = dateNow.getTime() < endOfAlertTime.getTime();

  const message = (
    <div
      data-h2-justify-content="base(space-between)"
      data-h2-max-height="base(100%)"
      data-h2-padding="base(x1.5)"
    >
      <Heading size="h6" data-h2-margin-top="base(0)">
        {intl.formatMessage({
          defaultMessage: "Happy Holidays!",
          id: "pFOjuY",
          description: "Heading to exclaim holiday greetings",
        })}
      </Heading>
      <p data-h2-margin="base(x1 0 x.5 0)">
        {intl.formatMessage({
          defaultMessage:
            "It's time for a well-deserved break; you've earned it!",
          id: "ll4RKs",
          description: "Message conveying time to relax",
        })}
      </p>
      <p data-h2-margin="base(x.5 0)">
        {intl.formatMessage({
          defaultMessage:
            "There will be no job postings during the holidays from December 22, 2023 to January 7, 2024.",
          id: "kY+tnm",
          description:
            "Message to indicate period of time when no jobs will be posted on the website",
        })}
      </p>
      <p data-h2-margin="base(x.5 0)">
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

  const imageElement = (
    <>
      <div
        data-h2-min-height="base(25vh) p-tablet(100%)"
        data-h2-display="base(block) base:dark(none)"
        data-h2-box-shadow="base(holidayInset)"
        style={{
          backgroundImage: `url('${lightImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "bottom center",
        }}
      />
      <div
        data-h2-min-height="base(25vh) p-tablet(100%)"
        data-h2-display="base(none) base:dark(block)"
        data-h2-box-shadow="base(holidayInset)"
        style={{
          backgroundImage: `url('${darkImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "bottom center",
        }}
      />
    </>
  );

  if (holidayAlertActive) {
    return (
      <AlertTwoSections leftElement={message} rightElement={imageElement} />
    );
  }
  return null;
};

export default HolidayAlert;
