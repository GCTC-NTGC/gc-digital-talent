import React from "react";
import { useIntl } from "react-intl";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";

export const DiversityEquityInclusionForm: React.FC = () => {
  const intl = useIntl();
  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "The Employment Equity Act of Canada (1995) identifies four groups who have experienced systemic employment barriers, and a number of obligations for the Government of Canada in addressing these barriers.",
        description:
          "Description text for Profile Form wrapper  in DiversityEquityInclusionForm",
      })}
      title={intl.formatMessage({
        defaultMessage: "Diversity, equity and inclusion",
        description:
          "Title for Profile Form wrapper  in DiversityEquityInclusionForm",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "Diversity, equity and inclusion",
            description:
              "Display Text for Diversity, equity and inclusion Page",
          }),
        },
      ]}
    >
      <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
        <p>Coming Soon!</p>
      </div>
    </ProfileFormWrapper>
  );
};

const DiversityEquityInclusionFormApi: React.FunctionComponent = () => {
  return <DiversityEquityInclusionForm />;
};

export default DiversityEquityInclusionFormApi;
