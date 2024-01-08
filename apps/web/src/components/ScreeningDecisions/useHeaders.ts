import { IntlShape, useIntl } from "react-intl";

import { FieldLabels } from "@gc-digital-talent/forms";
import { Maybe } from "@gc-digital-talent/graphql";

import { DialogType } from "./useDialogType";

type Args = {
  type?: DialogType;
  title?: string;
  customTitle?: Maybe<string>;
  candidateName?: Maybe<string>;
  skillName?: Maybe<string>;
  skillLevel?: Maybe<string>;
};

const getHeaders = (intl: IntlShape, args: Args) => {
  const { type, title, candidateName, skillName, skillLevel, customTitle } =
    args;
  const reviewAndRecord = intl.formatMessage(
    {
      defaultMessage: `Review and record {candidateName}'s results on "{skillName} at the "{skillLevel}" level.`,
      id: "YGE5XN",
      description:
        "Subtitle for education requirement screening decision dialog.",
    },
    { candidateName, skillName, skillLevel },
  );

  const genericTitle = customTitle
    ? intl.formatMessage(
        {
          defaultMessage: "{customTitle} ({title}) assessment - {skillName}",
          id: "B0OL/n",
          description: "Header for application screening decision dialog.",
        },
        { customTitle, title, skillName },
      )
    : intl.formatMessage(
        {
          defaultMessage: "{title} assessment - {skillName}",
          id: "WAcWqh",
          description: "Header for application screening decision dialog.",
        },
        { title, skillName },
      );

  switch (type) {
    case "EDUCATION":
      return {
        title: intl.formatMessage({
          defaultMessage: "Assess the candidate's education requirement",
          id: "wCzVDg",
          description:
            "Header for education requirement screening decision dialog.",
        }),
        subtitle: intl.formatMessage(
          {
            defaultMessage:
              "Review and assess {candidateName}'s evidence against the required education or equivalent experience.",
            id: "74Npts",
            description:
              "Subtitle for education requirement screening decision dialog.",
          },
          { candidateName },
        ),
      } as const;
    case "APPLICATION_SCREENING":
      return {
        title: intl.formatMessage(
          {
            defaultMessage: "Application screening - {skillName}",
            id: "gGwbvj",
            description: "Header for application screening decision dialog.",
          },
          { skillName },
        ),
        subtitle: reviewAndRecord,
      } as const;
    case "SCREENING_QUESTIONS":
      return {
        title: intl.formatMessage(
          {
            defaultMessage:
              "Screening questions (At the time of application) - {skillName}",
            id: "LF9xdK",
            description: "Header for application screening decision dialog.",
          },
          { skillName },
        ),
        subtitle: reviewAndRecord,
      } as const;
    default:
      return {
        title: genericTitle,
        subtitle: reviewAndRecord,
      } as const;
  }
};

const useHeaders = (args: Args) => {
  const intl = useIntl();
  const headers = getHeaders(intl, args ?? {}) satisfies FieldLabels;
  return headers;
};

export default useHeaders;
