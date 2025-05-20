import { IntlShape, useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";

import { Maybe } from "@gc-digital-talent/graphql";
import { FieldLabels } from "@gc-digital-talent/forms/types";

import { DialogType } from "./useDialogType";

interface Args {
  type?: DialogType;
  title?: string;
  customTitle?: Maybe<string>;
  candidateName?: Maybe<string>;
  skillName?: Maybe<string>;
  skillLevel?: Maybe<string>;
}

const getHeaders = (intl: IntlShape, args: Args) => {
  const { type, title, candidateName, skillName, skillLevel, customTitle } =
    args;
  let reviewAndRecord: string;
  if (!isEmpty(skillLevel)) {
    reviewAndRecord = intl.formatMessage(
      {
        defaultMessage: `Review and record {candidateName}'s results on "{skillName}" at the "{skillLevel}" level.`,
        id: "e1mxkv",
        description:
          "Subtitle for education requirement screening decision dialog.",
      },
      { candidateName, skillName, skillLevel },
    );
  } else {
    reviewAndRecord = intl.formatMessage(
      {
        defaultMessage: `Review and record {candidateName}'s results on "{skillName}"`,
        id: "cnoxKB",
        description:
          "Subtitle for education requirement screening decision dialog.",
      },
      { candidateName, skillName },
    );
  }
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
