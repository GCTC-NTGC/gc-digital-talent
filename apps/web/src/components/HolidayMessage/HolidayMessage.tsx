import { ReactNode } from "react";
import { useIntl } from "react-intl";

import { Heading, Image } from "@gc-digital-talent/ui";
import { useTheme } from "@gc-digital-talent/theme";

import lightImage from "~/assets/img/holiday_graphic_light.webp";
import darkImage from "~/assets/img/holiday_graphic_dark.webp";

import MessageTwoSections from "./MessageTwoSections";

const HolidayMessage = (): ReactNode => {
  const intl = useIntl();
  const { mode } = useTheme();

  const imgPath = mode === "dark" ? darkImage : lightImage;

  const message = (
    <div className="max-h-full justify-between p-9">
      <Heading size="h6" className="m-0">
        {intl.formatMessage({
          defaultMessage: "Happy Holidays!",
          id: "pFOjuY",
          description: "Heading to exclaim holiday greetings",
        })}
      </Heading>
      <p className="mt-6 mb-3">
        {intl.formatMessage({
          defaultMessage:
            "It's time for a well-deserved break; you've earned it!",
          id: "ll4RKs",
          description: "Message conveying time to relax",
        })}
      </p>
      <p className="my-3">
        {intl.formatMessage({
          defaultMessage: "There will be no job postings during the holidays.",
          id: "0fjeXG",
          description:
            "Message to indicate period of time when no jobs will be posted on the website",
        })}
      </p>
      <p className="my-3">
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

  const imageElement = <Image src={imgPath} aria-hidden="true" />;

  return (
    <MessageTwoSections leftElement={message} rightElement={imageElement} />
  );
};

export default HolidayMessage;
