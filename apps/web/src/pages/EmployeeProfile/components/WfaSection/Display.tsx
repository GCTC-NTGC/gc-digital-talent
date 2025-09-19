import { useIntl } from "react-intl";

import {
  EmployeeProfileWfaFragment,
  WfaInterest,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getWfaInterestFirstPerson,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Ul } from "@gc-digital-talent/ui";

import ToggleForm from "~/components/ToggleForm/ToggleForm";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import { formattedDate } from "~/utils/dateUtils";
import processMessages from "~/messages/processMessages";

import messages from "../../messages";

interface DisplayProps {
  user: EmployeeProfileWfaFragment;
}

const Display = ({ user }: DisplayProps) => {
  const intl = useIntl();
  const notProvided = intl.formatMessage(
    commonMessages.missingOptionalInformation,
  );
  const experiences = unpackMaybes(user.currentSubstantiveExperiences);
  const communities = unpackMaybes(user.employeeProfile?.communityInterests);

  return (
    <div className="flex flex-col gap-y-6">
      <ToggleForm.FieldDisplay
        label={intl.formatMessage(messages.wfaSituation)}
      >
        {user.employeeWFA?.wfaInterest?.value
          ? intl.formatMessage(
              getWfaInterestFirstPerson(user.employeeWFA.wfaInterest.value),
            )
          : notProvided}
      </ToggleForm.FieldDisplay>
      {user.employeeWFA?.wfaInterest?.value &&
        user.employeeWFA.wfaInterest.value !== WfaInterest.NotApplicable && (
          <>
            <ToggleForm.FieldDisplay
              label={intl.formatMessage(messages.currentSubstantivePosition)}
            >
              {experiences.length > 0 ? (
                <div className="mt-3 flex flex-col gap-y-3">
                  {experiences.map((exp) => (
                    <ExperienceCard
                      key={exp.id}
                      experienceQuery={exp}
                      showEdit={false}
                    />
                  ))}
                </div>
              ) : (
                notProvided
              )}
            </ToggleForm.FieldDisplay>
            <ToggleForm.FieldDisplay
              label={intl.formatMessage(messages.expectedEndDate)}
            >
              {user.employeeWFA.wfaDate
                ? formattedDate(user.employeeWFA.wfaDate, intl)
                : notProvided}
            </ToggleForm.FieldDisplay>
            <ToggleForm.FieldDisplay
              label={intl.formatMessage(messages.currentCommunity)}
            >
              {communities.length > 0 ? (
                <Ul space="sm">
                  {communities.map((interest) => (
                    <li key={interest.community.id}>
                      {interest?.community?.name?.localized ??
                        intl.formatMessage(commonMessages.notAvailable)}
                    </li>
                  ))}
                </Ul>
              ) : (
                notProvided
              )}
            </ToggleForm.FieldDisplay>
            <ToggleForm.FieldDisplay
              label={
                intl.formatMessage(processMessages.whatToExpect) +
                intl.formatMessage(commonMessages.dividingColon)
              }
            >
              <Ul space="sm">
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "The recruitment team of your functional community will contact you.",
                    id: "PUTcqK",
                    description:
                      "Expectation of recrtuitment team contact after wfa",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "There is no guarantee that this will lead to a new position.",
                    id: "3kRiqA",
                    description:
                      "Expectation of not guaranteed position after wfa",
                  })}
                </li>
              </Ul>
            </ToggleForm.FieldDisplay>
          </>
        )}
    </div>
  );
};

export default Display;
