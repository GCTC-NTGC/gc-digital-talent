import React from "react";
import { useIntl } from "react-intl";

import Pending from "@common/components/Pending";
import { commonMessages } from "@common/messages";
import type { UpdateUserAsUserInput, User } from "@common/api/generated";

import NotFound from "@common/components/NotFound";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";

import {
  useGetMyDiversityInfoQuery,
  useUpdateMyDiversityInfoMutation,
} from "../../api/generated";

import EquityOptions from "./EquityOptions";
import type { DiversityInclusionUpdateHandler, EquityKeys } from "./types";
import profileMessages from "../profile/profileMessages";

export interface DiversityEquityInclusionFormProps {
  user: User;
  isMutating: boolean;
  onUpdate: DiversityInclusionUpdateHandler;
}

export const DiversityEquityInclusionForm: React.FC<
  DiversityEquityInclusionFormProps
> = ({ user, onUpdate, isMutating }) => {
  const intl = useIntl();

  const handleUpdate = (key: EquityKeys, value: boolean) => {
    return onUpdate(user.id, {
      [key]: value,
    });
  };

  return (
    <ProfileFormWrapper
      description={intl.formatMessage({
        defaultMessage:
          "The Employment Equity Act of Canada (1995) identifies four groups who have experienced systemic employment barriers, and a number of obligations for the Government of Canada in addressing these barriers.",
        description:
          "Description text for Profile Form wrapper in DiversityEquityInclusionForm",
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
      cancelLink={{
        children: intl.formatMessage(commonMessages.backToProfile),
      }}
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "While the language around these categories is in need of updating, the Government of Canada will sometimes use these categories in hiring to make sure that it is meeting the aims of employment equity.",
          description:
            "Description of how the Government of Canada uses employment equity categories in hiring.",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            'These four groups are "women, Aboriginal peoples, persons with disabilities, and members of visible minorities."',
          description: "List of the employment equity categories",
        })}
      </p>
      <div
        data-h2-bg-color="b(lightgray)"
        data-h2-radius="b(s)"
        data-h2-padding="b(all, m)"
      >
        <p data-h2-margin="b(top, none)">
          {intl.formatMessage({
            defaultMessage:
              "<strong>This section is optional</strong>. If you a member of one or more of these employment equity groups, and you do not wish to self identify on this platform, there is no obligation to do so. <strong>Complete the form below if you meet both of these conditions</strong>:",
            description:
              "Explanation that employment equity information is optional.",
          })}
        </p>
        <ul>
          <li>
            {intl.formatMessage({
              defaultMessage:
                "You are a member of one or more of these employment equity groups.",
              description:
                "Instruction on when to fill out equity information, item one",
            })}
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage:
                "You would like to be considered for opportunities addressed to  underrepresented groups.",
              description:
                "Instruction on when to fill out equity information, item two",
            })}
          </li>
        </ul>
      </div>
      <h2>
        {intl.formatMessage({
          defaultMessage: "How will this data be used?",
          description:
            "Heading for how employment equity information will be used.",
        })}
      </h2>
      <ul>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "This information will be shared with hiring managers.",
            description:
              "Explanation on how employment equity information will be used, item one",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "The data here will be used to match you to prioritized jobs.",
            description:
              "Explanation on how employment equity information will be used, item two",
          })}
        </li>
        <li>
          {intl.formatMessage({
            defaultMessage:
              "This data will be use in an anonymous form for statistical purposes.",
            description:
              "Explanation on how employment equity information will be used, item three",
          })}
        </li>
      </ul>
      <EquityOptions
        isDisabled={isMutating}
        isIndigenous={user.isIndigenous}
        isVisibleMinority={user.isVisibleMinority}
        isWoman={user.isWoman}
        hasDisability={user.hasDisability}
        onAdd={(key: EquityKeys) => handleUpdate(key, true)}
        onRemove={(key: EquityKeys) => handleUpdate(key, false)}
      />
    </ProfileFormWrapper>
  );
};

const DiversityEquityInclusionFormApi: React.FC = () => {
  const intl = useIntl();

  const [{ data, fetching, error }] = useGetMyDiversityInfoQuery();
  const [{ fetching: mutationFetching }, executeMutation] =
    useUpdateMyDiversityInfoMutation();

  const handleUpdateUser = (id: string, values: UpdateUserAsUserInput) => {
    return executeMutation({ id, user: values }).then((res) => {
      if (res.data?.updateUserAsUser) {
        return res.data.updateUserAsUser;
      }

      return Promise.reject(res.error);
    });
  };

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <DiversityEquityInclusionForm
          user={data.me}
          onUpdate={handleUpdateUser}
          isMutating={mutationFetching}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>{intl.formatMessage(profileMessages.userNotFound)}</p>
        </NotFound>
      )}
    </Pending>
  );
};

export default DiversityEquityInclusionFormApi;
