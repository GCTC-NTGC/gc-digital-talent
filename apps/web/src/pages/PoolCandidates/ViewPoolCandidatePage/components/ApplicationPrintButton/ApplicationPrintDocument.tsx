import React from "react";
import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";

import { Heading } from "@gc-digital-talent/ui";
import { insertBetween, notEmpty } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getArmedForcesStatusesAdmin,
  getBilingualEvaluation,
  getCitizenshipStatusesAdmin,
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
  getIndigenousCommunity,
  getLanguage,
  getLanguageProficiency,
  getLocale,
  getOperationalRequirement,
  getProvinceOrTerritory,
  getSimpleGovEmployeeType,
  getWorkRegion,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import { enumToOptions, unpackMaybes } from "@gc-digital-talent/forms";
import {
  GovEmployeeType,
  OperationalRequirement,
  PositionDuration,
  User,
  BilingualEvaluation,
  IndigenousCommunity,
  PoolCandidate,
  Pool,
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";
import PrintExperienceByType from "~/components/UserProfile/PrintExperienceByType/PrintExperienceByType";
import { anyCriteriaSelected as anyCriteriaSelectedDiversityEquityInclusion } from "~/validators/profile/diversityEquityInclusion";
import { getEvaluatedLanguageLevels } from "~/utils/userUtils";

interface ApplicationPrintDocumentProps {
  user: User;
  pool: Pool;
}

const PageSection = ({ children }: { children: React.ReactNode }) => (
  <div
    data-h2-margin-bottom="base(2rem)"
    data-h2-display="base(block)"
    data-h2-break-inside="base(avoid) base:print(avoid)"
    data-h2-break-after="base(avoid) base:print(avoid)"
  >
    {children}
  </div>
);

// If a section is too big, use this instead of PageSection to allow it to break
const BreakingPageSection = ({ children }: { children: React.ReactNode }) => (
  <div data-h2-margin-bottom="base(2rem)" data-h2-display="base(block)">
    {children}
  </div>
);

const ApplicationPrintDocument = React.forwardRef<
  HTMLDivElement,
  ApplicationPrintDocumentProps
>(({ user, pool }, ref) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  console.log(user);
  console.log(pool);

  return (
    <div style={{ display: "none" }}>
      <div data-h2 ref={ref}>
        <div
          data-h2-font-family="base(sans) base:print(sans)"
          data-h2-padding-bottom="base(1rem)"
          data-h2-border-bottom="base(2px dashed black) base:print(2px dashed black)"
        >
          <div>
            <Heading level="h1" data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage: "Application snapshot",
                id: "ipsXat",
                description:
                  "Document title for printing a user's application snapshot.",
              })}
            </Heading>
            <Heading level="h2" data-h2-font-weight="base(700)">
              <>{getFullNameLabel(user.firstName, user.lastName, intl)}</>
            </Heading>
          </div>
        </div>
      </div>
    </div>
  );
});
export default ApplicationPrintDocument;
