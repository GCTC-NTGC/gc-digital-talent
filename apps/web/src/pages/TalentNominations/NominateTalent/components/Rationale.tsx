import ChatBubbleBottomCenterTextIcon from "@heroicons/react/24/outline/ChatBubbleBottomCenterTextIcon";
import { defineMessage, useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  Maybe,
  Scalars,
  TalentNominationStep,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Combobox, TextArea } from "@gc-digital-talent/forms";
import { errorMessages, getLocale } from "@gc-digital-talent/i18n";

import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

import { BaseFormValues } from "../types";
import useCurrentStep from "../useCurrentStep";
import UpdateForm, { SubmitDataTransformer } from "./UpdateForm";
import SubHeading from "./SubHeading";
import messages from "../messages";

interface FormValues extends BaseFormValues {
  nominationRationale?: Maybe<string>;
  skills?: Scalars["UUID"]["input"][];
  additionalComments?: Maybe<string>;
}

const NominateTalentSkills_Fragment = graphql(/* GraphQL */ `
  fragment NominateTalentSkill on Skill {
    id
    name {
      localized
    }
  }
`);

const NominateTalentRationale_Fragment = graphql(/* GraphQL */ `
  fragment NominateTalentRationale on TalentNomination {
    id
    skills {
      id
    }
    nominationRationale
    additionalComments
    talentNominationEvent {
      includeLeadershipCompetencies
    }
  }
`);

const leadershipSkillsRangeError = defineMessage({
  defaultMessage: "Please select exactly 3 leadership competencies",
  id: "FSvySJ",
  description:
    "Error message when the incorrect number of leadership competencies is selected",
});

const transformSubmitData: SubmitDataTransformer<FormValues> = (values) => {
  return {
    nominationRationale: values.nominationRationale ?? null,
    skills: { sync: values.skills ?? [] },
    additionalComments: values.additionalComments ?? null,
  };
};

interface RationaleProps {
  rationaleQuery: FragmentType<typeof NominateTalentRationale_Fragment>;
  skillsQuery?: FragmentType<typeof NominateTalentSkills_Fragment>[];
}

const Rationale = ({ rationaleQuery, skillsQuery }: RationaleProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const wordLimitMultiplier =
    locale === "fr" ? FRENCH_WORDS_PER_ENGLISH_WORD : 1;
  const { current } = useCurrentStep();
  const talentNomination = getFragment(
    NominateTalentRationale_Fragment,
    rationaleQuery,
  );
  const skills = getFragment(NominateTalentSkills_Fragment, skillsQuery);

  if (current !== TalentNominationStep.Rationale) {
    return null;
  }

  return (
    <UpdateForm<FormValues>
      submitDataTransformer={transformSubmitData}
      defaultValues={{
        nominationRationale: talentNomination?.nominationRationale ?? "",
        additionalComments: talentNomination?.additionalComments ?? "",
        skills: unpackMaybes(
          talentNomination?.skills?.flatMap((skill) => skill?.id),
        ),
      }}
    >
      <SubHeading level="h2" Icon={ChatBubbleBottomCenterTextIcon}>
        {intl.formatMessage(messages.rationale)}
      </SubHeading>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "The final step in the nomination process is to explain why this candidate is being nominated. If you've nominated an executive or equivalent level employee, please also provide the top 3 key leadership competencies demonstrated by the nominee.",
          id: "43Tiyp",
          description: "Subtitle for nomination rationale step",
        })}
      </p>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1)"
      >
        <TextArea
          id="nominationRationale"
          name="nominationRationale"
          wordLimit={1000 * wordLimitMultiplier}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          label={intl.formatMessage({
            defaultMessage: "Nomination rationale",
            id: "jokoVA",
            description: "Label for a nomination's rationale",
          })}
        />
        {talentNomination?.talentNominationEvent
          .includeLeadershipCompetencies && (
          <Combobox
            isMulti
            id="skills"
            name="skills"
            rules={{
              required: intl.formatMessage(errorMessages.required),
              max: {
                value: 3,
                message: intl.formatMessage(leadershipSkillsRangeError),
              },
              min: {
                value: 3,
                message: intl.formatMessage(leadershipSkillsRangeError),
              },
            }}
            label={intl.formatMessage({
              defaultMessage: "Top 3 key leadership competencies",
              id: "6M8rIa",
              description:
                "Label for a nominations leadership skill competencies",
            })}
            options={unpackMaybes(skills).map((skill) => ({
              value: skill.id,
              label: skill.name.localized,
            }))}
          />
        )}
        <TextArea
          id="additionalComments"
          name="additionalComments"
          wordLimit={500 * wordLimitMultiplier}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          label={intl.formatMessage({
            defaultMessage: "Additional comments",
            id: "IBLDnY",
            description:
              "Label for additional comments on a nomination's rationale",
          })}
        />
      </div>
    </UpdateForm>
  );
};

export default Rationale;
