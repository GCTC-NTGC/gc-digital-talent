import React from "react";
import { useIntl } from "react-intl";

import type { UpdateUserAsUserInput } from "@common/api/generated";
import { commonMessages } from "@common/messages";

import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import {
  useGetMyDiversityInfoQuery,
  useUpdateMyDiversityInfoMutation,
} from "../../api/generated";

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

const DiversityEquityInclusionFormApi: React.FC = () => {
  const intl = useIntl();

  const [{ data, fetching, error }] = useGetMyDiversityInfoQuery();
  const [, executeMutation] = useUpdateMyDiversityInfoMutation();

  const handleUpdateUser = (id: string, values: UpdateUserAsUserInput) => {
    return executeMutation({ id, user: values }).then((res) => {
      if (res.data?.updateUserAsUser) {
        return res.data.updateUserAsUser;
      }

      return Promise.reject(res.error);
    });
  };

  if (fetching) {
    return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  }

  if (error || !data) {
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)}
        {error?.message || ""}
      </p>
    );
  }

  return <DiversityEquityInclusionForm />;
};

export default DiversityEquityInclusionFormApi;
